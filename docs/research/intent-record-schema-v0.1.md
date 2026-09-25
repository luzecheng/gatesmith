# Intent Record Schema V0.1

Status: experimental design only. This schema is not part of GateSmith
production, does not authorize compilation, and has not been benchmarked.

## 1. Purpose and boundary

The Intent Record is a proposed specification boundary between a human-owned
intent and a deterministic policy representation. It is intended to make
meaning, missing information, assumptions, provenance, and confirmation
visible before any deterministic execution step.

It is not a truth oracle. A valid record does not prove that the user's
unstated intent, an external fact, or an actor's authorization is true.

## 2. Evidence labels

Every semantic value MUST carry one of these statuses:

- `PROPOSED`: supplied by AI or another non-authoritative process and awaiting
  human/authorized confirmation. An AI generator may assign only `PROPOSED`
  or `UNKNOWN` to semantic values.
- `CONFIRMED`: created only by an independent human or authorized source
  confirmation event for this record version. It requires provenance binding
  the value to the confirmer, authority, time, and exact record/version.
- `UNKNOWN`: required information is missing, disputed, or not safely inferred.

`INFERRED` is deliberately not a fourth authority status. An inference is
either presented as a `PROPOSED` value with its derivation, or it remains
`UNKNOWN`.

There are two deliberately separate outcome layers.

### Proposal Assessment

This evaluates the AI proposal against the information available in its round;
it does not grant authority:

- `SEMANTICALLY_EQUIVALENT`: materially matches the applicable Gold semantics.
- `NEEDS_CLARIFICATION`: correctly preserves or identifies a blocking unknown.
- `MATERIAL_MISMATCH`: materially wrong, incomplete, or falsely certain.
- `REJECT`: unsupported, unsafe, or malformed proposal.

### Record Decision

This controls whether the record may proceed:

- `ACCEPT`: all required semantic fields are `CONFIRMED`, no blocking
  ambiguity remains, and the record is eligible for a separately defined
  deterministic lowering step.
- `NEEDS_CLARIFICATION`: a missing or disputed field might be supplied by the
  user or an authorized source; no execution artifact may be produced.
- `REJECT`: the request is outside the supported domain, contradictory, unsafe,
  unauthorized, or cannot be made well-defined under the experiment rules.

An AI proposal can receive `SEMANTICALLY_EQUIVALENT`, but it can never create
`CONFIRMED` values or make the Record Decision `ACCEPT`. `ACCEPT` is an
independent human/authorized confirmation result, not a proof of intent
correctness.

## 3. Minimal record shape

The following is a conceptual JSON shape. It is a research schema, not a
production API contract.

```json
{
  "schema_version": "intent-record-v0.1",
  "record_id": "local identifier",
  "canonical_representation": "canonical serialization of this record",
  "request": {
    "source_text": "human's original statement",
    "language": "en",
    "action": {"value": "allow", "status": "PROPOSED"},
    "desired_outcome": {"value": "access is allowed", "status": "PROPOSED"}
  },
  "actors": [],
  "predicates": [],
  "logic": {"value": "...", "status": "PROPOSED"},
  "quantifiers": [],
  "thresholds": [],
  "time": {},
  "external_facts": [],
  "defaults": [],
  "exceptions": [],
  "conflict_behavior": {},
  "assumptions": [],
  "ambiguities": [],
  "provenance": [],
  "authority": {},
  "proposal_assessment": "NEEDS_CLARIFICATION",
  "record_decision": "NEEDS_CLARIFICATION"
}
```

Fields not relevant to a case may be an explicit empty list/object. They must
not be omitted when their absence would hide an unresolved semantic question.

## 4. Field requirements

### 4.1 Identity and source

| Field | Requirement |
|---|---|
| `schema_version` | Exact schema version; `CONFIRMED` by the experiment harness |
| `record_id` | Stable local identifier; not a semantic claim |
| `request.source_text` | Immutable verbatim human input |
| `request.language` | Language used for interpretation |
| `canonical_representation` | Deterministic serialization after field ordering and normalization |
| `canonical_hash` | Hash of canonical representation, produced after freeze |

The source text and canonical record are different objects. The hash identifies
the record; it does not prove that the record matches the source text.

### 4.2 Actors and action

Each actor has:

```json
{
  "id": "alice",
  "display_name": "Alice",
  "role": "approver",
  "identity_source": "UNKNOWN",
  "status": "PROPOSED"
}
```

`action` describes what the rule does, and `desired_outcome` describes the
observable result. The experiment distinguishes “Alice approves” from “the
system has verified Alice's approval.” The latter requires an authority and
data source, not just a Boolean name.

### 4.3 Predicates and inputs

Each predicate has:

```json
{
  "id": "alice_approves",
  "kind": "boolean",
  "subject": "alice",
  "meaning": "Alice has approved this request",
  "domain": [false, true],
  "source": "UNKNOWN",
  "freshness": "UNKNOWN",
  "status": "PROPOSED"
}
```

The `meaning` is semantic text, while `id` is only a stable symbol. A symbol
must not be treated as evidence that the described event occurred.

### 4.4 Logic and quantifiers

`logic` contains the proposed normalized relation among predicate IDs, such as
`AND(alice_approves,bob_approves)`. It may be lowered to GateSmith's Boolean
grammar only if all referenced predicates are confirmed and the relation is
within the supported subset.

Quantifiers are explicit objects:

```json
{
  "scope": "team_members",
  "quantifier": "at_least",
  "count": {"value": 3, "unit": "people", "status": "UNKNOWN"},
  "universe_source": "UNKNOWN",
  "status": "PROPOSED"
}
```

Words such as “enough”, “most”, “normally”, or “authorized” MUST NOT be
converted into a numeric or identity rule without a confirmed value/source.

### 4.5 Thresholds and units

Thresholds require value, comparison, unit, rounding, and boundary semantics:

```json
{
  "quantity": "approval_count",
  "operator": ">=",
  "value": {"value": 3, "status": "PROPOSED"},
  "unit": {"value": "people", "status": "PROPOSED"},
  "rounding": {"value": "none", "status": "UNKNOWN"},
  "boundary_inclusive": {"value": true, "status": "PROPOSED"}
}
```

Any required threshold component with `UNKNOWN` status blocks `ACCEPT`.

### 4.6 Time semantics

Time must distinguish event time, observation time, effective time, expiry,
ordering, timezone, and clock/source:

```json
{
  "window": {"value": "24 hours", "status": "PROPOSED"},
  "anchor": {"value": "request_received", "status": "PROPOSED"},
  "timezone": {"value": "UTC", "status": "UNKNOWN"},
  "freshness": {"value": "within window", "status": "PROPOSED"},
  "ordering": {"value": "latest observation wins", "status": "UNKNOWN"}
}
```

“Current”, “recent”, and “before” remain `UNKNOWN` until their semantics are
confirmed.

### 4.7 External facts and data sources

An external fact records the claim and the source that is allowed to attest it:

```json
{
  "fact_id": "account_status",
  "claim": "account is active",
  "source": {"value": "issuer API", "status": "PROPOSED"},
  "attestation_method": {"value": "signed response", "status": "UNKNOWN"},
  "freshness": {"value": "5 minutes", "status": "UNKNOWN"},
  "status": "PROPOSED"
}
```

The record can specify what would be checked; it cannot turn an unchecked
claim into a confirmed fact.

### 4.8 Defaults, exceptions, conflicts, and assumptions

These are separate because “not mentioned” is not equivalent to “false.”

- `defaults`: behavior when an input is absent.
- `exceptions`: conditions that override the ordinary rule.
- `conflict_behavior`: precedence, rejection, or required human resolution.
- `assumptions`: explicit statements used to interpret the request.

Every assumption has a text, source, impact, and status. A required assumption
that remains `UNKNOWN` blocks acceptance. An optional assumption may be recorded
without blocking only when the evaluator confirms it cannot affect the output.

### 4.9 Ambiguity, provenance, and authority

Each ambiguity has:

```json
{
  "location": "quantifiers[0].count",
  "question": "How many people is enough?",
  "possible_values": ["..."],
  "blocking": true,
  "status": "UNKNOWN"
}
```

Each provenance entry records who or what supplied a value, when, and whether
it is a proposal, human confirmation, or external attestation. Provenance is
not itself a truth proof.

`authority` identifies the confirmation principal and confirmation event. A
valid confirmation event binds the confirmer/authorized source, authority
scope, timestamp, exact record version/hash, and provenance to each confirmed
semantic value. The AI cannot self-confirm its own proposal and cannot emit a
`CONFIRMED` semantic value.

## 5. Canonicalization and acceptance rules

Canonicalization must define field order, Unicode normalization, whitespace,
number format, time format, identifier format, and representation of empty
values. The experiment harness computes the hash only after these rules are
fixed.

The Record Decision may be `ACCEPT` only if:

1. every required semantic field is `CONFIRMED`;
2. no blocking ambiguity is `UNKNOWN`;
3. predicates, actors, units, thresholds, and time references are internally
   consistent;
4. all external fact sources are identified, or the rule explicitly treats the
   fact as an input rather than asserting it is true;
5. an independent human/authorized confirmation event names the exact record
   hash/version and binds every confirmed semantic value;
6. the target compiler declares the record's constructs supported.

Otherwise the result is `NEEDS_CLARIFICATION` or `REJECT`; it is never silently
coerced into a deterministic rule.

## 6. What this schema does not establish

**FACT:** This is an experimental schema and has no production implementation.

**HYPOTHESIS:** A typed record with explicit unknowns may reduce silent
assumptions and make later verification boundaries measurable.

**UNKNOWN:** Whether ordinary users can complete such records reliably, whether
the schema is sufficiently expressive, and whether it improves agreement over
less structured review.
