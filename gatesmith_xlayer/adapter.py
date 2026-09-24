"""Read-only TapeOut X Layer adapter.

This module intentionally contains no transaction signing or write method.
It is separate from gatesmith_core so deterministic compilation never needs
RPC availability.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
import re
from typing import Any, Protocol
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen


EVAL_SELECTOR = bytes.fromhex("934d06ea")
EXPECTED_CHAIN_ID = 196
DEFAULT_RPC_URL = "https://rpc.xlayer.tech"
ADDRESS_RE = re.compile(r"^0x[0-9a-fA-F]{40}$")


class AdapterError(RuntimeError):
    pass


class RpcUnavailable(AdapterError):
    pass


class WrongChain(AdapterError):
    pass


class ContractUnavailable(AdapterError):
    pass


class EvalReverted(AdapterError):
    pass


class MalformedRpcResponse(AdapterError):
    pass


class DecodeError(AdapterError):
    pass


class Transport(Protocol):
    def call(self, method: str, params: list[Any]) -> Any:
        ...


class JsonRpcTransport:
    def __init__(self, rpc_url: str, timeout: float = 15.0):
        self.rpc_url = rpc_url
        self.timeout = timeout
        self.request_id = 0

    def call(self, method: str, params: list[Any]) -> Any:
        self.request_id += 1
        body = json.dumps({"jsonrpc": "2.0", "id": self.request_id, "method": method, "params": params}).encode()
        request = Request(self.rpc_url, data=body, headers={"Content-Type": "application/json"})
        try:
            with urlopen(request, timeout=self.timeout) as response:
                payload = json.loads(response.read())
        except (URLError, HTTPError, TimeoutError, OSError, json.JSONDecodeError) as exc:
            raise RpcUnavailable(f"RPC unavailable: {exc}") from exc
        if not isinstance(payload, dict):
            raise MalformedRpcResponse("RPC response is not an object")
        if "error" in payload:
            error = payload["error"]
            message = error.get("message", "RPC error") if isinstance(error, dict) else str(error)
            raise AdapterError(message)
        if "result" not in payload:
            raise MalformedRpcResponse("RPC response has no result")
        return payload["result"]


@dataclass(frozen=True)
class XLayerConfig:
    rpc_url: str = DEFAULT_RPC_URL
    processor_address: str = ""
    expected_chain_id: int = EXPECTED_CHAIN_ID
    timeout: float = 15.0


@dataclass(frozen=True)
class CircuitEvidence:
    network: str
    chain_id: int
    processor: str
    circuit_id: int
    eval_input: str
    raw_output: str
    output_bytes: str
    output_boolean: bool
    rpc_verified: bool

    def as_dict(self) -> dict[str, Any]:
        return {
            "network": self.network,
            "chain_id": self.chain_id,
            "processor": self.processor,
            "circuit_id": self.circuit_id,
            "eval_input": self.eval_input,
            "raw_output": self.raw_output,
            "output_bytes": self.output_bytes,
            "output_boolean": self.output_boolean,
            "rpc_verified": self.rpc_verified,
        }


def _word(value: int) -> bytes:
    if value < 0 or value >= 1 << 256:
        raise ValueError("integer does not fit ABI uint256")
    return value.to_bytes(32, "big")


def _hex_bytes(value: bytes) -> str:
    return "0x" + value.hex()


def _require_address(address: str) -> None:
    if not isinstance(address, str) or not ADDRESS_RE.fullmatch(address):
        raise ValueError("processor must be a 20-byte 0x address")


def encode_eval_call(circuit_id: int, input_bytes: bytes) -> str:
    """Encode eval(uint256,bytes), observed on Processor #0."""
    if not isinstance(input_bytes, bytes):
        raise ValueError("input_bytes must be bytes")
    payload = EVAL_SELECTOR + _word(circuit_id) + _word(64) + _word(len(input_bytes))
    padding = (-len(input_bytes)) % 32
    return _hex_bytes(payload + input_bytes + b"\x00" * padding)


def decode_dynamic_bytes(raw_result: str) -> bytes:
    """Decode standard ABI return bytes from eth_call."""
    if not isinstance(raw_result, str) or not raw_result.startswith("0x"):
        raise DecodeError("eth_call result is not a hex string")
    try:
        raw = bytes.fromhex(raw_result[2:])
    except ValueError as exc:
        raise DecodeError("eth_call result is not valid hex") from exc
    if len(raw) < 64:
        raise DecodeError("dynamic bytes result is shorter than ABI header")
    offset = int.from_bytes(raw[:32], "big")
    if offset % 32 or offset + 32 > len(raw):
        raise DecodeError("invalid dynamic bytes offset")
    length = int.from_bytes(raw[offset : offset + 32], "big")
    start = offset + 32
    end = start + length
    if end > len(raw):
        raise DecodeError("dynamic bytes length exceeds response")
    return raw[start:end]


def decode_boolean_output(output: bytes) -> bool:
    """Decode the currently verified Circuit #1 one-byte output."""
    if len(output) != 1 or output[0] not in (0, 1):
        raise DecodeError("verified Boolean scope requires exactly one byte: 0x00 or 0x01")
    return bool(output[0])


class XLayerAdapter:
    def __init__(self, config: XLayerConfig, transport: Transport | None = None):
        _require_address(config.processor_address)
        self.config = config
        self.transport = transport or JsonRpcTransport(config.rpc_url, config.timeout)

    def chain_id(self) -> int:
        value = self.transport.call("eth_chainId", [])
        if not isinstance(value, str) or not value.startswith("0x"):
            raise MalformedRpcResponse("eth_chainId is not hex")
        try:
            return int(value, 16)
        except ValueError as exc:
            raise MalformedRpcResponse("eth_chainId is invalid hex") from exc

    def verify_chain(self) -> int:
        chain_id = self.chain_id()
        if chain_id != self.config.expected_chain_id:
            raise WrongChain(f"expected chain {self.config.expected_chain_id}, got {chain_id}")
        return chain_id

    def contract_code(self) -> str:
        code = self.transport.call("eth_getCode", [self.config.processor_address, "latest"])
        if not isinstance(code, str) or not code.startswith("0x"):
            raise MalformedRpcResponse("eth_getCode is not hex")
        if code in ("0x", "0x0"):
            raise ContractUnavailable(f"no code at {self.config.processor_address}")
        return code

    def eval(self, circuit_id: int, input_bytes: bytes) -> CircuitEvidence:
        if circuit_id < 0:
            raise ValueError("circuit_id must be non-negative")
        call_data = encode_eval_call(circuit_id, input_bytes)
        chain_id = self.verify_chain()
        self.contract_code()
        try:
            raw = self.transport.call(
                "eth_call",
                [{"to": self.config.processor_address, "data": call_data}, "latest"],
            )
        except AdapterError as exc:
            raise EvalReverted(f"eval eth_call failed: {exc}") from exc
        if not isinstance(raw, str):
            raise MalformedRpcResponse("eth_call result is not a string")
        output = decode_dynamic_bytes(raw)
        return CircuitEvidence(
            network="X Layer Mainnet",
            chain_id=chain_id,
            processor=self.config.processor_address,
            circuit_id=circuit_id,
            eval_input=_hex_bytes(input_bytes),
            raw_output=raw,
            output_bytes=_hex_bytes(output),
            output_boolean=decode_boolean_output(output),
            rpc_verified=True,
        )
