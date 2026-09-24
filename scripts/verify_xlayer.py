#!/usr/bin/env python3
"""Read-only real X Layer regression for the already-taped XOR Circuit."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from gatesmith_core import ast_evaluate, compile_expression, encode_netlist, evaluate_netlist, parse, truth_table
from gatesmith_xlayer import XLayerAdapter, XLayerConfig


DEFAULT_PROCESSOR = "0x839bdd6fa7a66416a609a735e11de5411b98574e"


def main() -> None:
    parser = argparse.ArgumentParser(description="Read-only GateSmith/X Layer XOR verification")
    parser.add_argument("--rpc-url", default="https://rpc.xlayer.tech")
    parser.add_argument("--processor", default=DEFAULT_PROCESSOR)
    parser.add_argument("--circuit-id", type=int, default=1)
    args = parser.parse_args()

    expression = parse("(A AND NOT B) OR (NOT A AND B)")
    netlist = compile_expression(expression)
    adapter = XLayerAdapter(XLayerConfig(rpc_url=args.rpc_url, processor_address=args.processor))
    comparisons = []
    for inputs, local_result in truth_table(expression):
        input_byte = bytes([(inputs[0] << 1) | inputs[1]])
        local_ast = ast_evaluate(expression, dict(zip(netlist.input_names, (bool(value) for value in inputs))))
        local_nand = evaluate_netlist(netlist, dict(zip(netlist.input_names, (bool(value) for value in inputs))))
        evidence = adapter.eval(args.circuit_id, input_byte)
        on_chain = evidence.output_boolean
        if not (local_ast == local_nand == bool(local_result) == on_chain):
            raise SystemExit(f"MISMATCH: {inputs}: local={local_nand}, chain={on_chain}")
        comparisons.append({"inputs": list(inputs), "local_output": int(local_nand), "on_chain_output": int(on_chain), "evidence": evidence.as_dict()})

    print(json.dumps({
        "network": "X Layer Mainnet",
        "chain_id": 196,
        "processor": args.processor,
        "circuit_id": args.circuit_id,
        "expression": "(A AND NOT B) OR (NOT A AND B)",
        "local_netlist_bytes": encode_netlist(netlist).hex(),
        "comparisons": comparisons,
        "all_four_match": len(comparisons) == 4,
        "write_methods_used": [],
    }, indent=2))


if __name__ == "__main__":
    main()
