# Intent Authorization Boundary Harness Results V0.1

Status: **research harness validation complete; human/AI conformance study not
yet executed**.

This document records the result of the smallest faithful implementation of
the approved boundary design. It is not a product feature, financial
authorization system, wallet integration, or evidence that AI recovers human
intent.

## 1. Scope actually executed

Implemented and tested:

- canonical JSON serialization and SHA-256 record identity;
- exact authorization binding to record hash and action scope;
- independent authority allowlist check;
- required semantic field confirmation check;
- authorization expiry check;
- deterministic reversible simulator action;
- block dispositions for missing, stale, changed, expanded, or invalid
  authorization;
- rejection of AI proposal payloads that contain `CONFIRMED`, authorization,
  or execution-receipt fields.

Not executed:

- independent human Intent Author participation;
- independent human Authorization Principal participation;
- actual AI provider proposals;
- blind Gold creation with human clarification interviews;
- holdout-set conformance measurement;
- any wallet, financial action, transaction, or Mainnet operation.

## 2. Implementation boundary

The implementation is isolated from GateSmith production:

- `scripts/intent_authorization_harness.py`
- `tests/test_intent_authorization_harness.py`

The harness imports no GateSmith production module, makes no network request,
does not read credentials, and has no wallet or chain method.

## 3. Boundary vectors

The deterministic harness ran nine predeclared mutation vectors:

| Vector | Expected disposition | Actual disposition | Result |
|---|---|---|---|
| Exact authorized record | `EXECUTE_SIMULATION` | `EXECUTE_SIMULATION` | PASS |
| No authorization | `BLOCKED_NO_AUTHORIZATION` | `BLOCKED_NO_AUTHORIZATION` | PASS |
| Changed record with old authorization | `BLOCKED_SCOPE_MISMATCH` | `BLOCKED_SCOPE_MISMATCH` | PASS |
| Expanded authorization scope | `BLOCKED_SCOPE_MISMATCH` | `BLOCKED_SCOPE_MISMATCH` | PASS |
| Expired authorization | `BLOCKED_STALE_RECORD` | `BLOCKED_STALE_RECORD` | PASS |
| Required field remains `UNKNOWN` | `BLOCKED_INVALID_RECORD` | `BLOCKED_INVALID_RECORD` | PASS |
| Different target | `BLOCKED_SCOPE_MISMATCH` | `BLOCKED_SCOPE_MISMATCH` | PASS |
| Missing record confirmation event | `BLOCKED_INVALID_RECORD` | `BLOCKED_INVALID_RECORD` | PASS |
| Unauthorized authority identity | `BLOCKED_NO_AUTHORIZATION` | `BLOCKED_NO_AUTHORIZATION` | PASS |

Result: **9/9 boundary vectors passed**.

The exact-authorized vector produced a deterministic receipt with record hash,
authorization hash, action hash, simulator output, and receipt hash. The
receipt is evidence of harness behavior only.

## 4. Authority-boundary evidence

The harness rejects an AI proposal containing:

- a semantic value marked `CONFIRMED`;
- an authorization object;
- an execution receipt;
- a Record Decision of `ACCEPT` supplied as proposal content.

This validates the implementation rule that AI output cannot create authority.
It does not test whether a human correctly recognizes a bad proposal.

## 5. Test evidence

The full existing test suite passed after the research-only addition:

```text
Ran 36 tests
OK
```

Additional checks:

- harness unit tests: PASS;
- Python syntax compilation: PASS;
- `git diff --check`: PASS;
- no network/provider calls: PASS by implementation inspection;
- no wallet or chain operations: PASS by implementation inspection.

## 6. Evidence classification

### FACT

- The research-only harness executes the nine listed deterministic vectors.
- All nine expected dispositions matched.
- Exact record hash binding, scope comparison, expiry, required confirmation,
  authority allowlisting, and AI authority-field rejection are covered by
  executable tests.
- Existing GateSmith production behavior was not imported or changed.

### INFERENCE

- The harness is sufficient to validate the mechanical separation between
  authorization checks and simulator execution for these declared mutations.
- Record hash binding is a necessary control for preventing stale or altered
  records from using an old authorization.

### HYPOTHESIS

- Independent human authorization of an exact record and action scope can
  prevent a proposal from silently expanding the permitted action.
- The same separation may remain useful in higher-risk domains.

### UNKNOWN

- Whether AI correctly preserves ambiguity on human-authored requests.
- Whether a human can recognize semantic mismatch before authorization.
- Whether human authorization events are consistently scoped under realistic
  cognitive load.
- Inter-rater agreement between independent semantic and authorization
  evaluators.
- Holdout generalization.
- Any safety or suitability of this boundary for finance.

## 7. Why this is not yet the full conformance result

The approved experiment requires observable human-authored requests, a Gold
Intent Record frozen before AI output, independent human authorization, actual
AI proposals, blind comparison, and an unseen holdout. Those participants and
artifacts are not present in the repository or execution environment.

Using hand-written proposals or self-authored Gold labels here would create the
synthetic self-validation and information contamination that the approved
design explicitly forbids. Therefore this run is reported as **harness
validation**, not as semantic or authorization conformance evidence.

## 8. Required next evidence before calling the experiment complete

An independent reviewer must provide or approve:

1. human-authored request set and role separation;
2. frozen Pre-clarification Gold records and hashes;
3. authorized clarification packets, if Round 2 is used;
4. observable AI proposal captures;
5. independent human authorization events;
6. blind evaluator comparisons;
7. holdout results and pre-registered metric thresholds.

No product code or Mainnet operation is required for that next evidence.
