import unittest

from gatesmith_core import (
    And,
    Not,
    Or,
    ParseError,
    Var,
    ast_evaluate,
    canonical_ast,
    compile_expression,
    encode_netlist,
    enumerate_inputs,
    evaluate_netlist,
    parse,
    truth_table,
)


REAL_XOR_BYTES = bytes.fromhex(
    "00000002000003000000020000040000000300000400000005000006"
)


class ParserTests(unittest.TestCase):
    def test_precedence_not_and_or(self):
        self.assertEqual(canonical_ast(parse("NOT A AND B OR C")), "OR(AND(NOT(A),B),C)")
        self.assertEqual(canonical_ast(parse("A OR B AND C")), "OR(A,AND(B,C))")

    def test_parentheses_change_precedence(self):
        self.assertEqual(canonical_ast(parse("(A OR B) AND C")), "AND(OR(A,B),C)")

    def test_invalid_syntax_and_variables(self):
        for source in ("", "A XOR B", "A && B", "A B", "(A OR B", "E", "A OR"):
            with self.subTest(source=source):
                with self.assertRaises(ParseError):
                    parse(source)

    def test_more_than_four_variables_rejected(self):
        with self.assertRaises(ParseError):
            parse("A OR B OR C OR D OR E")


class CompilerTests(unittest.TestCase):
    def test_xor_regression_matches_real_chain_fixture(self):
        # XOR is expressed only with supported operators; no XOR token exists.
        expression = parse("(A AND NOT B) OR (NOT A AND B)")
        self.assertEqual(encode_netlist(compile_expression(expression)), REAL_XOR_BYTES)

    def test_supported_operators_compile_to_nand_only(self):
        for source in ("NOT A", "A AND B", "A OR B", "(A AND B) OR C"):
            netlist = compile_expression(parse(source))
            self.assertTrue(all(gate.left >= 0 and gate.right >= 0 for gate in netlist.gates))
            self.assertTrue(all(len(encode_netlist(netlist)) == 7 * len(netlist.gates) for _ in [0]))

    def test_same_expression_is_deterministic_100_times(self):
        expression = parse("NOT ((A OR B) AND (NOT C OR D))")
        canonical = canonical_ast(expression)
        results = [(canonical_ast(expression), compile_expression(expression)) for _ in range(100)]
        self.assertTrue(all(item[0] == canonical for item in results))
        self.assertTrue(all(item[1] == results[0][1] for item in results))
        encoded = [encode_netlist(item[1]) for item in results]
        self.assertTrue(all(item == encoded[0] for item in encoded))


class DifferentialTests(unittest.TestCase):
    def test_ast_and_nand_evaluators_match_for_expression_corpus(self):
        corpus = [
            "A", "NOT A", "NOT NOT A", "A AND B", "A OR B",
            "(A OR B) AND (NOT C)", "NOT ((A AND B) OR C)",
            "A AND A", "A OR A", "(A AND B) OR (A AND B)",
            "NOT (A OR NOT (B AND C))", "((A OR B) AND C) OR NOT D",
            "NOT (A AND (B OR (C AND NOT D)))",
        ]
        cases = 0
        for source in corpus:
            expression = parse(source)
            netlist = compile_expression(expression)
            names = compile_expression(expression).input_names
            for inputs in enumerate_inputs(names):
                self.assertEqual(
                    ast_evaluate(expression, inputs),
                    evaluate_netlist(netlist, inputs),
                    (source, inputs),
                )
                cases += 1
        self.assertGreaterEqual(cases, 60)

    def test_generated_expression_corpus_differential(self):
        sources = []
        variables = "ABCD"
        for index in range(256):
            a = variables[index % 4]
            b = variables[(index * 3 + 1) % 4]
            c = variables[(index * 5 + 2) % 4]
            d = variables[(index * 7 + 3) % 4]
            forms = (
                f"{a}",
                f"NOT NOT {a}",
                f"({a} AND {b}) OR NOT {c}",
                f"NOT (({a} OR {b}) AND ({c} OR NOT {d}))",
                f"(({a} AND {b}) OR ({c} AND NOT {d})) AND ({a} OR {c})",
            )
            sources.append(forms[index % len(forms)])

        cases = 0
        for source in sources:
            expression = parse(source)
            netlist = compile_expression(expression)
            for inputs in enumerate_inputs(netlist.input_names):
                self.assertEqual(
                    ast_evaluate(expression, inputs),
                    evaluate_netlist(netlist, inputs),
                    (source, inputs),
                )
                cases += 1
        self.assertEqual(len(sources), 256)
        self.assertGreaterEqual(cases, 1000)

    def test_logically_equivalent_syntax_has_same_truth_table(self):
        equivalent = (
            ("A AND B", "B AND A"),
            ("A OR (B AND C)", "(B AND C) OR A"),
            ("NOT NOT A", "A"),
        )
        for left, right in equivalent:
            self.assertEqual(truth_table(parse(left)), truth_table(parse(right)))

    def test_generated_four_variable_expression(self):
        expression = parse("(A AND B) OR (C AND NOT D)")
        netlist = compile_expression(expression)
        for inputs in enumerate_inputs(("A", "B", "C", "D")):
            self.assertEqual(ast_evaluate(expression, inputs), evaluate_netlist(netlist, inputs))


class GuardTests(unittest.TestCase):
    def test_invalid_node_reference_is_rejected(self):
        from gatesmith_core.core import Gate, Netlist

        with self.assertRaises(ValueError):
            encode_netlist(Netlist(("A",), (Gate(4, 2),), 3))

    def test_missing_input_is_rejected(self):
        expression = parse("A AND B")
        with self.assertRaises(ValueError):
            ast_evaluate(expression, {"A": True})


if __name__ == "__main__":
    unittest.main()
