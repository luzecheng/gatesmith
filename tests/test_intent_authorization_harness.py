import unittest

from scripts.intent_authorization_harness import (
    base_authorization,
    base_record,
    evaluate_execution,
    run_boundary_vectors,
    validate_ai_proposal,
)


class IntentAuthorizationHarnessTests(unittest.TestCase):
    def test_boundary_vectors_all_match_expected_dispositions(self):
        results = run_boundary_vectors()
        self.assertEqual(len(results), 9)
        self.assertTrue(all(result["pass"] for result in results), results)

    def test_exact_authorization_produces_verifiable_receipt(self):
        record = base_record()
        result = evaluate_execution(record, base_authorization(record), now=150)
        self.assertEqual(result.disposition, "EXECUTE_SIMULATION")
        self.assertIsNotNone(result.receipt)
        self.assertEqual(result.receipt["output"]["status"], "applied")

    def test_record_hash_binds_authorization(self):
        record = base_record()
        authorization = base_authorization(record)
        record["action"]["parameters"]["value"] = 0
        result = evaluate_execution(record, authorization, now=150)
        self.assertEqual(result.disposition, "BLOCKED_SCOPE_MISMATCH")
        self.assertIn("record_hash_mismatch", result.reasons)

    def test_unknown_required_field_cannot_execute(self):
        record = base_record()
        record["record_decision"] = "NEEDS_CLARIFICATION"
        record["semantic_values"]["value"]["status"] = "UNKNOWN"
        result = evaluate_execution(record, base_authorization(record), now=150)
        self.assertEqual(result.disposition, "BLOCKED_INVALID_RECORD")

    def test_ai_cannot_emit_confirmation_or_authorization(self):
        valid, reasons = validate_ai_proposal({
            "semantic_values": {"value": {"value": 1, "status": "CONFIRMED"}},
            "authorization": {"status": "AUTHORIZED_EXACTLY"},
        })
        self.assertFalse(valid)
        self.assertIn("ai_confirmed_semantic_value:proposal.semantic_values.value", reasons)
        self.assertIn("proposal_contains_authoritative_execution_field", reasons)


if __name__ == "__main__":
    unittest.main()
