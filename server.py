#!/usr/bin/env python3
"""Minimal local web boundary for the authoritative Python core."""

from __future__ import annotations

import hashlib
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
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


ROOT = Path(__file__).resolve().parent
WEB_ROOT = ROOT / "web"


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
        if self.path != "/api/build":
            self._json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            source = payload.get("expression")
            if not isinstance(source, str):
                raise ParseError("expression must be a string")
            result = build_circuit(source)
        except ParseError as exc:
            self._json(HTTPStatus.BAD_REQUEST, {"error": "syntax_error", "message": str(exc)})
            return
        except (TypeError, ValueError, json.JSONDecodeError) as exc:
            self._json(HTTPStatus.BAD_REQUEST, {"error": "compiler_error", "message": str(exc)})
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
