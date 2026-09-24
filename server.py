#!/usr/bin/env python3
"""Minimal local web boundary for the authoritative Python core."""

from __future__ import annotations

import hashlib
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import sys

from gatesmith_core import (
    ParseError,
    canonical_ast,
    compile_expression,
    encode_netlist,
    evaluate_netlist,
    enumerate_inputs,
    parse,
    truth_table,
)
from gatesmith_xlayer import (
    AdapterError,
    ContractUnavailable,
    DecodeError,
    EvalReverted,
    MalformedRpcResponse,
    RpcUnavailable,
    XLayerAdapter,
    XLayerConfig,
    WrongChain,
)
from gatesmith_ai import AIInterpretationError, ProviderUnavailable, interpret_rule


ROOT = Path(__file__).resolve().parent
WEB_ROOT = ROOT / "web"
AI_PROVIDER = None


def build_circuit(expression_source: str) -> dict:
    expression = parse(expression_source)
    netlist = compile_expression(expression)
    encoded = encode_netlist(netlist)
    table = []
    for inputs, result in truth_table(expression):
        input_map = dict(zip(netlist.input_names, (bool(value) for value in inputs)))
        # Keep the boundary honest: the API also checks the generated netlist.
        if evaluate_netlist(netlist, input_map) != bool(result):
            raise ValueError("AST and NAND evaluator mismatch")
        table.append({"inputs": input_map, "result": bool(result)})

    return {
        "source": expression_source,
        "normalized": canonical_ast(expression),
        "inputs": list(netlist.input_names),
        "truth_table": table,
        "nand_count": len(netlist.gates),
        "output_count": 1,
        "byte_length": len(encoded),
        "netlist_bytes": encoded.hex(),
        "netlist_sha256": hashlib.sha256(encoded).hexdigest(),
    }


def read_only_eval(payload: dict) -> dict:
    """Minimal development evidence endpoint; it can only perform eth_call."""
    processor = payload.get("processor") or os.environ.get("GATESMITH_XLAYER_PROCESSOR", "")
    rpc_url = os.environ.get("GATESMITH_XLAYER_RPC_URL", "https://rpc.xlayer.tech")
    circuit_id = payload.get("circuit_id")
    input_hex = payload.get("input", "")
    if not isinstance(circuit_id, int) or circuit_id < 0:
        raise ValueError("circuit_id must be a non-negative integer")
    if not isinstance(input_hex, str) or not input_hex.startswith("0x") or len(input_hex[2:]) % 2:
        raise ValueError("input must be an even-length 0x hex string")
    try:
        input_bytes = bytes.fromhex(input_hex[2:])
    except ValueError as exc:
        raise ValueError("input is not valid hex") from exc
    evidence = XLayerAdapter(XLayerConfig(rpc_url=rpc_url, processor_address=processor)).eval(circuit_id, input_bytes)
    return evidence.as_dict()


def propose_interpretation(rule_text: str) -> dict:
    """Return an untrusted proposal; deterministic build remains separate."""
    return interpret_rule(rule_text, provider=AI_PROVIDER)


class Handler(BaseHTTPRequestHandler):
    server_version = "GateSmithLocal/0.1"

    def log_message(self, format: str, *args: object) -> None:
        # Keep local development output quiet and deterministic.
        return

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _file(self, path: Path, content_type: str) -> None:
        if not path.is_file() or WEB_ROOT not in path.parents:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        body = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/api/health":
            self._json(HTTPStatus.OK, {"ok": True, "service": "gatesmith-local-core"})
            return
        if self.path in ("/", "/index.html"):
            self._file(WEB_ROOT / "index.html", "text/html; charset=utf-8")
            return
        if self.path == "/app.js":
            self._file(WEB_ROOT / "app.js", "text/javascript; charset=utf-8")
            return
        if self.path == "/styles.css":
            self._file(WEB_ROOT / "styles.css", "text/css; charset=utf-8")
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        if self.path not in ("/api/build", "/api/interpret", "/api/xlayer/eval"):
            self._json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            if self.path == "/api/xlayer/eval":
                self._json(HTTPStatus.OK, {"ok": True, "evidence": read_only_eval(payload)})
                return
            if self.path == "/api/interpret":
                description = payload.get("description")
                if not isinstance(description, str):
                    raise AIInterpretationError("description must be a string")
                self._json(HTTPStatus.OK, {"ok": True, "proposal": propose_interpretation(description)})
                return
            source = payload.get("expression")
            if not isinstance(source, str):
                raise ParseError("expression must be a string")
            result = build_circuit(source)
        except ParseError as exc:
            self._json(HTTPStatus.BAD_REQUEST, {"error": "syntax_error", "message": str(exc)})
            return
        except ProviderUnavailable as exc:
            self._json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "ai_unavailable", "message": str(exc)})
            return
        except AIInterpretationError as exc:
            self._json(HTTPStatus.BAD_REQUEST, {"error": "ai_invalid_proposal", "message": str(exc)})
            return
        except WrongChain as exc:
            self._json(HTTPStatus.BAD_GATEWAY, {"error": "wrong_chain", "message": str(exc)})
            return
        except RpcUnavailable as exc:
            self._json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "rpc_unavailable", "message": str(exc)})
            return
        except ContractUnavailable as exc:
            self._json(HTTPStatus.BAD_GATEWAY, {"error": "contract_unavailable", "message": str(exc)})
            return
        except EvalReverted as exc:
            self._json(HTTPStatus.BAD_GATEWAY, {"error": "contract_revert", "message": str(exc)})
            return
        except (DecodeError, MalformedRpcResponse, AdapterError) as exc:
            self._json(HTTPStatus.BAD_GATEWAY, {"error": "decode_failure", "message": str(exc)})
            return
        except (TypeError, ValueError, json.JSONDecodeError) as exc:
            error = "malformed_eval_input" if self.path == "/api/xlayer/eval" else "compiler_error"
            self._json(HTTPStatus.BAD_REQUEST, {"error": error, "message": str(exc)})
            return
        self._json(HTTPStatus.OK, {"ok": True, "result": result})


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"GateSmith local UI: http://127.0.0.1:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
