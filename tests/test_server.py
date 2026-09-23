import hashlib
import json
from pathlib import Path
import threading
import unittest
from http.client import HTTPConnection

from server import Handler, ThreadingHTTPServer, build_circuit


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def request(self, expression):
        connection = HTTPConnection("127.0.0.1", self.port)
        body = json.dumps({"expression": expression})
        connection.request("POST", "/api/build", body, {"Content-Type": "application/json"})
        response = connection.getresponse()
        payload = json.loads(response.read())
        connection.close()
        return response.status, payload

    def test_api_happy_path_and_metadata(self):
        status, payload = self.request("(A AND B) OR C")
        self.assertEqual(status, 200)
        result = payload["result"]
        self.assertEqual(result["normalized"], "OR(AND(A,B),C)")
        self.assertEqual(result["inputs"], ["A", "B", "C"])
        self.assertEqual(result["output_count"], 1)
        self.assertEqual(len(result["truth_table"]), 8)
        self.assertEqual(result["byte_length"], result["nand_count"] * 7)
        self.assertEqual(result["netlist_sha256"], hashlib.sha256(bytes.fromhex(result["netlist_bytes"])).hexdigest())

    def test_api_rejects_malformed_and_unsupported_input(self):
        for expression in ("A XOR B", "A OR", "E", "A && B"):
            with self.subTest(expression=expression):
                status, payload = self.request(expression)
                self.assertEqual(status, 400)
                self.assertIn(payload["error"], ("syntax_error", "compiler_error"))

    def test_api_rejects_more_than_four_variables(self):
        status, payload = self.request("A OR B OR C OR D OR E")
        self.assertEqual(status, 400)
        self.assertEqual(payload["error"], "syntax_error")

    def test_build_circuit_runs_independent_evaluator_check(self):
        result = build_circuit("NOT (A OR B)")
        self.assertEqual([row["result"] for row in result["truth_table"]], [True, False, False, False])

    def test_frontend_wires_confirmation_invalidation(self):
        source = (Path(__file__).parents[1] / "web" / "app.js").read_text()
        self.assertIn("confirmedHash = null", source)
        self.assertIn("expressionInput.addEventListener('input'", source)
        self.assertIn("invalidateConfirmation()", source)
        self.assertIn("confirmButton.disabled = !currentResult", source)


if __name__ == "__main__":
    unittest.main()
