"""Research-only authorization boundary harness.

This module is deliberately independent from GateSmith production code. It
validates record-hash binding, authorization scope, expiry, and deterministic
simulator blocking. It does not call an AI provider, wallet, chain, or network.
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
import hashlib
import json
from typing import Any, Mapping

AUTHORIZED_AUTHORITIES = frozenset({"participant-authorizer"})


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_json(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def record_hash(record: Mapping[str, Any]) -> str:
    return sha256_json(record)


def authorization_hash(authorization: Mapping[str, Any]) -> str:
    return sha256_json(authorization)


def validate_ai_proposal(proposal: Mapping[str, Any]) -> tuple[bool, tuple[str, ...]]:
    """Reject authority escalation in an observable proposal payload."""
    violations: list[str] = []
    if "authorization" in proposal or "execution_receipt" in proposal:
        violations.append("proposal_contains_authoritative_execution_field")
    if proposal.get("record_decision") == "ACCEPT":
        violations.append("proposal_contains_record_accept")

    def visit(value: Any, path: str) -> None:
        if isinstance(value, Mapping):
            if value.get("status") == "CONFIRMED":
                violations.append(f"ai_confirmed_semantic_value:{path}")
            for key, child in value.items():
                visit(child, f"{path}.{key}")
        elif isinstance(value, list):
            for index, child in enumerate(value):
                visit(child, f"{path}[{index}]")

    visit(proposal, "proposal")
    return not violations, tuple(violations)


@dataclass(frozen=True)
class SimulationResult:
    disposition: str
    reasons: tuple[str, ...]
    receipt: dict[str, Any] | None = None


def _required_fields_confirmed(record: Mapping[str, Any]) -> bool:
    required = record.get("required_semantic_fields")
    values = record.get("semantic_values")
    if not isinstance(required, list) or not isinstance(values, Mapping):
        return False
    return all(
        isinstance(values.get(field), Mapping)
        and values[field].get("status") == "CONFIRMED"
        for field in required
    )


def _simulate_action(action: Mapping[str, Any]) -> dict[str, Any]:
    if action.get("kind") != "set_simulated_flag":
        raise ValueError("unsupported simulator action")
    parameters = action.get("parameters")
    if not isinstance(parameters, Mapping) or parameters.get("value") not in (0, 1):
        raise ValueError("invalid simulator parameters")
    return {
        "status": "applied",
        "target": action.get("target"),
        "value": parameters["value"],
    }


def evaluate_execution(
    record: Mapping[str, Any],
    authorization: Mapping[str, Any] | None,
    *,
    now: int,
) -> SimulationResult:
    reasons: list[str] = []
    if record.get("record_decision") != "ACCEPT":
        reasons.append("record_decision_not_accept")
    if not _required_fields_confirmed(record):
        reasons.append("required_semantic_field_not_confirmed")
    confirmation = record.get("confirmation_event")
    if not isinstance(confirmation, Mapping) or not confirmation.get("event_id"):
        reasons.append("missing_confirmation_event")
    if not isinstance(authorization, Mapping):
        reasons.append("missing_authorization")
    else:
        if authorization.get("status") != "AUTHORIZED_EXACTLY":
            reasons.append("authorization_not_exact")
        if authorization.get("record_hash") != record_hash(record):
            reasons.append("record_hash_mismatch")
        if not authorization.get("authority_id"):
            reasons.append("missing_authority")
        elif authorization.get("authority_id") not in AUTHORIZED_AUTHORITIES:
            reasons.append("authority_not_authorized")
        if not authorization.get("confirmation_event"):
            reasons.append("missing_authorization_event")
        issued = authorization.get("issued_at")
        expires = authorization.get("expires_at")
        if not isinstance(issued, int) or not isinstance(expires, int) or not (issued <= now < expires):
            reasons.append("authorization_expired_or_invalid_time")
        if authorization.get("action") != record.get("action"):
            reasons.append("action_scope_mismatch")

    if reasons:
        if "record_hash_mismatch" in reasons or "action_scope_mismatch" in reasons:
            disposition = "BLOCKED_SCOPE_MISMATCH"
        elif "authorization_expired_or_invalid_time" in reasons:
            disposition = "BLOCKED_STALE_RECORD"
        elif any(reason in reasons for reason in (
            "record_decision_not_accept",
            "required_semantic_field_not_confirmed",
            "missing_confirmation_event",
        )):
            disposition = "BLOCKED_INVALID_RECORD"
        else:
            disposition = "BLOCKED_NO_AUTHORIZATION"
        return SimulationResult(disposition, tuple(reasons))

    output = _simulate_action(record["action"])
    receipt_body = {
        "record_hash": record_hash(record),
        "authorization_hash": authorization_hash(authorization),
        "action_hash": sha256_json(record["action"]),
        "output": output,
    }
    receipt = {**receipt_body, "receipt_hash": sha256_json(receipt_body)}
    return SimulationResult("EXECUTE_SIMULATION", (), receipt)


def base_record() -> dict[str, Any]:
    return {
        "schema_version": "intent-record-v0.1",
        "record_version": "case-001-v1",
        "source_text": "Set the sandbox flag to 1 for the demo target.",
        "proposal_assessment": "SEMANTICALLY_EQUIVALENT",
        "record_decision": "ACCEPT",
        "required_semantic_fields": ["action", "target", "value"],
        "semantic_values": {
            "action": {"value": "set_simulated_flag", "status": "CONFIRMED"},
            "target": {"value": "sandbox.flag", "status": "CONFIRMED"},
            "value": {"value": 1, "status": "CONFIRMED"},
        },
        "action": {
            "kind": "set_simulated_flag",
            "target": "sandbox.flag",
            "parameters": {"value": 1},
            "limits": {"max_value": 1},
        },
        "confirmation_event": {
            "event_id": "human-confirmation-001",
            "authority_id": "participant-authorizer",
            "record_version": "case-001-v1",
        },
    }


def base_authorization(record: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "status": "AUTHORIZED_EXACTLY",
        "authority_id": "participant-authorizer",
        "authority_scope": "sandbox.flag only",
        "record_hash": record_hash(record),
        "action": deepcopy(record["action"]),
        "issued_at": 100,
        "expires_at": 200,
        "confirmation_event": "authorization-001",
    }


def boundary_vectors() -> list[tuple[str, dict[str, Any], dict[str, Any] | None, str]]:
    record = base_record()
    authorization = base_authorization(record)
    vectors: list[tuple[str, dict[str, Any], dict[str, Any] | None, str]] = [
        ("exact_authorized", record, authorization, "EXECUTE_SIMULATION"),
        ("no_authorization", record, None, "BLOCKED_NO_AUTHORIZATION"),
    ]

    changed_record = deepcopy(record)
    changed_record["action"]["parameters"]["value"] = 0
    vectors.append(("changed_record_old_auth", changed_record, authorization, "BLOCKED_SCOPE_MISMATCH"))

    expanded_scope = deepcopy(authorization)
    expanded_scope["action"]["limits"]["max_value"] = 2
    vectors.append(("expanded_scope", record, expanded_scope, "BLOCKED_SCOPE_MISMATCH"))

    expired = deepcopy(authorization)
    expired["expires_at"] = 100
    vectors.append(("expired_authorization", record, expired, "BLOCKED_STALE_RECORD"))

    unresolved = deepcopy(record)
    unresolved["record_decision"] = "NEEDS_CLARIFICATION"
    unresolved["semantic_values"]["value"]["status"] = "UNKNOWN"
    vectors.append(("unresolved_required_field", unresolved, base_authorization(unresolved), "BLOCKED_INVALID_RECORD"))

    different_action = deepcopy(authorization)
    different_action["action"]["target"] = "sandbox.other_flag"
    vectors.append(("different_target", record, different_action, "BLOCKED_SCOPE_MISMATCH"))

    missing_event = deepcopy(record)
    missing_event.pop("confirmation_event")
    vectors.append(("missing_record_confirmation", missing_event, base_authorization(missing_event), "BLOCKED_INVALID_RECORD"))

    wrong_authority = deepcopy(authorization)
    wrong_authority["authority_id"] = "unregistered-agent"
    vectors.append(("wrong_authority_identity", record, wrong_authority, "BLOCKED_NO_AUTHORIZATION"))
    return vectors


def run_boundary_vectors() -> list[dict[str, Any]]:
    results = []
    for name, record, authorization, expected in boundary_vectors():
        result = evaluate_execution(record, authorization, now=150)
        results.append({
            "name": name,
            "expected": expected,
            "actual": result.disposition,
            "pass": result.disposition == expected,
            "reasons": list(result.reasons),
            "receipt_hash": result.receipt["receipt_hash"] if result.receipt else None,
        })
    return results


if __name__ == "__main__":
    print(json.dumps({"vectors": run_boundary_vectors()}, indent=2, sort_keys=True))
