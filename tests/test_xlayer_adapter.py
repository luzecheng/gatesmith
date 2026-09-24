import unittest

from gatesmith_xlayer import (
    AdapterError,
    DecodeError,
    EvalReverted,
    XLayerAdapter,
    XLayerConfig,
    WrongChain,
    decode_boolean_output,
    decode_dynamic_bytes,
    encode_eval_call,
)


PROCESSOR = "0x839bdd6fa7a66416a609a735e11de5411b98574e"
RAW_ONE = "0x" + ("00" * 31) + "20" + ("00" * 31) + "01" + "01" + ("00" * 31)


class FakeTransport:
    def __init__(self, chain="0xc4", code="0x6000", eval_result=RAW_ONE, error=None):
        self.chain = chain
        self.code = code
        self.eval_result = eval_result
        self.error = error
        self.calls = []

    def call(self, method, params):
        self.calls.append((method, params))
        if method == "eth_chainId":
            return self.chain
        if method == "eth_getCode":
            return self.code
        if method == "eth_call":
            if self.error:
                raise AdapterError(self.error)
            return self.eval_result
        raise AssertionError(method)


class EncodingTests(unittest.TestCase):
    def test_eval_encoding_matches_standard_dynamic_bytes_abi(self):
        call = encode_eval_call(1, b"\x01")
        self.assertEqual(call[:10], "0x934d06ea")
        self.assertEqual(len(bytes.fromhex(call[2:])), 132)
        self.assertEqual(call[10 + 64 : 10 + 128], "0" * 62 + "40")
        self.assertEqual(call[10 + 128 : 10 + 192], "0" * 63 + "1")
        self.assertTrue(call.endswith("01" + "00" * 31))

    def test_dynamic_output_and_boolean_decode(self):
        output = decode_dynamic_bytes(RAW_ONE)
        self.assertEqual(output, b"\x01")
        self.assertTrue(decode_boolean_output(output))
        self.assertFalse(decode_boolean_output(b"\x00"))

    def test_malformed_output_is_rejected(self):
        for value in ("0x", "0x01", "not-hex"):
            with self.subTest(value=value):
                with self.assertRaises(DecodeError):
                    decode_dynamic_bytes(value)
        with self.assertRaises(DecodeError):
            decode_boolean_output(b"")
        with self.assertRaises(DecodeError):
            decode_boolean_output(b"\x00\x01")


class AdapterTests(unittest.TestCase):
    def config(self, **kwargs):
        values = {"processor_address": PROCESSOR}
        values.update(kwargs)
        return XLayerConfig(**values)

    def test_eval_returns_evidence_and_calls_only_read_methods(self):
        transport = FakeTransport()
        evidence = XLayerAdapter(self.config(), transport).eval(1, b"\x01")
        self.assertEqual(evidence.chain_id, 196)
        self.assertEqual(evidence.output_bytes, "0x01")
        self.assertTrue(evidence.output_boolean)
        self.assertEqual([call[0] for call in transport.calls], ["eth_chainId", "eth_getCode", "eth_call"])

    def test_wrong_chain_is_distinct(self):
        with self.assertRaises(WrongChain):
            XLayerAdapter(self.config(), FakeTransport(chain="0x1")).eval(1, b"\x00")

    def test_revert_is_distinct_from_decode_failure(self):
        with self.assertRaises(EvalReverted):
            XLayerAdapter(self.config(), FakeTransport(error="execution reverted")).eval(1, b"\x00")

    def test_empty_contract_is_distinct(self):
        from gatesmith_xlayer import ContractUnavailable

        with self.assertRaises(ContractUnavailable):
            XLayerAdapter(self.config(), FakeTransport(code="0x")).eval(1, b"\x00")


if __name__ == "__main__":
    unittest.main()
