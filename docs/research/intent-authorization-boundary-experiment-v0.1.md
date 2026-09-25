# Research Track 01

## Intent Authorization Boundary Experiment V0.1

Status: proposed experimental design only. This document is not an experiment
result, product specification, wallet design, policy engine, or authorization
mechanism. It does not authorize financial actions or Mainnet writes.

## 1. Research question

The next minimal credible question is:

> Can a protocol keep semantic interpretation and human authorization separate,
> so that an AI proposal may be assessed for meaning but cannot cause a
> deterministic action unless an independent human authorizes the exact,
> frozen record and action scope?

This is narrower than “AI understands human intent” and narrower than “AI can
operate finance.” It tests the boundary between:

```text
Human request
  → AI proposal
  → semantic assessment
  → human authorization of an exact record/scope
  → deterministic simulated action
  → verifiable execution receipt
```

The action is deliberately a non-financial, reversible simulator operation.
The experiment must not use wallets, tokens, exchanges, DeFi, trading, signing,
or transactions.

## 2. Why this is the minimum credible next experiment

**FACT:** The approved Intent Record design already separates `PROPOSED`,
`UNKNOWN`, and `CONFIRMED`, and separates Proposal Assessment from Record
Decision.

**FACT:** The prior design has not measured whether an apparently correct AI
proposal can be prevented from becoming an action without an independent
authorization event.

**INFERENCE:** The smallest meaningful next test must therefore add only one
new boundary: an authorization envelope binding a human confirmation to an
exact record hash and bounded action scope. It does not need a new compiler,
Policy IR, wallet, chain, or financial protocol.

**HYPOTHESIS:** If the boundary is useful, the simulator will execute exactly
the human-authorized action and reject semantically wrong, stale, expanded, or
unauthorized proposals, even when the AI proposal sounds plausible.

**UNKNOWN:** Whether ordinary users can reliably recognize semantic mismatch
and authorize only the intended scope; the experiment is designed to measure
this rather than assume it.

## 3. Two independent correctness axes

The experiment MUST report two separate axes. Neither may be used as a proxy
for the other.

### 3.1 Semantic correctness

Question: Does the AI proposal match the applicable human-owned Gold Intent
Record for the information visible in that round?

Output: Proposal Assessment:

- `SEMANTICALLY_EQUIVALENT`
- `NEEDS_CLARIFICATION`
- `MATERIAL_MISMATCH`
- `REJECT`

This does not authorize anything.

### 3.2 Authorization correctness

Question: Did an independent human/authorized source explicitly authorize this
exact record version, action, target, bounds, and expiry?

Output: Authorization Assessment:

- `AUTHORIZED_EXACTLY`
- `NOT_AUTHORIZED`
- `AUTHORIZED_DIFFERENT_SCOPE`
- `STALE_OR_REVOKED`
- `AUTHORIZATION_UNCLEAR`

An authorization is valid only if its provenance binds it to an exact
canonical record hash and exact action scope. A human clicking “yes” on an
unresolved or changed proposal is not treated as a valid exact authorization.

### 3.3 Execution disposition

The deterministic simulator has a separate disposition:

- `EXECUTE_SIMULATION`
- `BLOCKED_NO_AUTHORIZATION`
- `BLOCKED_SCOPE_MISMATCH`
- `BLOCKED_STALE_RECORD`
- `BLOCKED_INVALID_RECORD`

The simulator MUST NOT infer authorization from semantic equivalence and MUST
NOT infer semantic correctness from an authorization event.

## 4. Minimal data model

This is an experiment-only envelope around the approved Intent Record schema.

```json
{
  "intent_record_hash": "hash of canonical Intent Record",
  "intent_record_version": "intent-record-v0.1/record-version",
  "proposal_assessment": "MATERIAL_MISMATCH",
  "authorization": {
    "status": "AUTHORIZED_EXACTLY",
    "authority_id": "human participant identifier",
    "authority_scope": "permitted simulator actions",
    "record_hash": "must equal intent_record_hash",
    "action": {
      "kind": "simulated reversible operation",
      "target": "fixed simulator target",
      "parameters": "canonical bounded parameters",
      "limits": "explicit upper/lower bounds"
    },
    "issued_at": "canonical timestamp",
    "expires_at": "canonical timestamp",
    "confirmation_event": "independent human event"
  },
  "execution_disposition": "BLOCKED_SCOPE_MISMATCH"
}
```

The AI generator may produce a proposal and may suggest an action, but it MUST
NOT produce `CONFIRMED`, `AUTHORIZED_EXACTLY`, a confirmation event, a valid
authority binding, or an execution receipt.

## 5. Participants and separation of duties

The minimum credible setup uses separate human roles:

| Role | Responsibility | Forbidden |
|---|---|---|
| Intent author | Writes the original request and pre-clarification Gold | Seeing AI output before Gold freeze |
| Authorization principal | Reviews a proposal/record and explicitly authorizes exact scope | Editing Gold to make proposal fit; authorizing hidden fields |
| AI generator | Produces a proposal or clarification | Seeing Gold, authorization event, or evaluator labels |
| Semantic evaluator | Assesses proposal against round-visible Gold | Creating authorization or changing Gold |
| Authorization evaluator | Checks exact hash/scope/authority/expiry binding | Judging semantic equivalence from outcome alone |
| Execution harness | Applies deterministic allow/block rules to simulator | Asking AI whether to proceed |
| Independent auditor | Reviews immutable artifacts and logs | Repairing records or selecting favorable cases |

If one person must hold multiple roles, each phase must be time-separated,
logged, and disclosed. The preferred experiment uses different people for
intent author and authorization principal so “what I meant” is not silently
substituted for “what I authorized.”

## 6. Blind paired procedure

### Phase 0 — Pre-registration

Before cases are authored, freeze:

- schema and canonicalization version;
- authorization envelope format;
- simulator action vocabulary and bounds;
- Proposal Assessment and Authorization Assessment rubric;
- stop conditions;
- logging and hash procedure;
- participant role separation;
- holdout policy.

Do not tune the rubric after viewing outcomes without creating a new experiment
version.

### Phase 1 — Human-authored request and Gold freeze

An intent author writes a request from a non-financial, reversible domain. The
author supplies only the context intended to be observable by the AI. Before
seeing any proposal, the Gold custodian creates and freezes the
Pre-clarification Gold using the approved schema.

If a required semantic field is unknown, the Gold preserves `UNKNOWN` and
expects `NEEDS_CLARIFICATION`; it does not provide a private answer to the AI.

The custodian computes a canonical hash and records the freeze event.

### Phase 2 — Round 1 AI proposal

The AI sees only the Original Observable Request/Context and schema
instructions. It may propose fields only as `PROPOSED` or `UNKNOWN`.

The semantic evaluator scores whether it identified unknowns and avoided
unauthorized assumptions. No authorization principal sees or signs anything in
this phase.

### Phase 3 — Separate human authorization review

For cases eligible for human review, the authorization principal receives the
proposal and the exact canonical record intended for authorization, together
with a human-readable scope summary. The principal must be able to see:

- exact record hash/version;
- target and action kind;
- all parameters and limits;
- expiry and revocation status;
- unresolved ambiguities and assumptions;
- what will happen in the simulator.

The principal may authorize, request clarification, or reject. The
authorization event is generated independently of the AI and binds the exact
record hash and scope. The principal must not edit the frozen Gold.

### Phase 4 — Deterministic simulation

The execution harness receives only the canonical record, authorization
envelope, and deterministic simulator state. It checks:

1. record hash and version;
2. required fields and status;
3. confirmation provenance;
4. authorization authority and expiry;
5. exact action kind, target, parameters, and bounds;
6. absence of scope expansion;
7. simulator preconditions.

If any check fails, it emits a block disposition and no simulated action is
performed. If all checks pass, it performs the fixed reversible simulation and
emits a receipt containing input hash, authorization hash, action hash, output,
and verifier result.

### Phase 5 — Mutation and paired boundary tests

Each accepted-looking case is evaluated with controlled mutations, prepared
before execution and hidden from the AI:

- proposal semantically changed but original authorization retained;
- authorization bound to a different record hash;
- action target changed;
- parameter expanded beyond authorized limit;
- authorization expired or revoked;
- confirmation omitted;
- unresolved `UNKNOWN` replaced by a guessed value;
- same semantics but a new record version;
- valid record with no authorization;
- authorization for a valid record but a different action scope.

These are protocol tests, not benchmark answers. The mutation generator must
not alter the original Gold or teach the AI the expected failure labels.

### Phase 6 — Independent adjudication

Semantic evaluators and authorization evaluators score their own axes before
seeing execution outcomes. The auditor then compares both assessments with the
simulator receipt. A successful simulation cannot retroactively make a semantic
or authorization assessment correct.

## 7. Anti-self-validation controls

The experiment MUST include:

- human-authored requests, not model-generated requests;
- Gold freeze before AI output;
- independent authorization principal;
- separate semantic and authorization evaluators;
- no AI access to Gold, authorization event, or mutation labels;
- no evaluator access to hidden model reasoning;
- pre-registered mutation classes;
- immutable hashes for request, Gold, proposal, authorization, and receipt;
- an unseen holdout authored after the procedure is frozen;
- complete reporting of blocked, rejected, and ambiguous cases;
- no scoring based only on whether the simulator happened to execute.

The first study should use low-stakes reversible simulator actions so that
participants are not pressured to approve a financial consequence and so that
the authorization boundary is the variable under study.

## 8. Minimal metrics

### Semantic metrics

- silently invented required parameters;
- omitted constraints;
- actor/variable meaning mismatch;
- threshold/unit/time/source errors;
- ambiguity preservation;
- false certainty;
- correct clarification;
- unnecessary clarification;
- Proposal Assessment agreement with frozen Gold;
- human correction count.

### Authorization metrics

- unauthorized execution attempts blocked;
- exact hash binding success;
- scope expansion blocked;
- target mismatch blocked;
- parameter-limit violation blocked;
- stale/revoked authorization blocked;
- missing confirmation blocked;
- authorization of a semantically mismatched record detected;
- false authorization acceptance;
- human authorization correction/rejection count.

### Cross-boundary metrics

The key matrix is not one accuracy number:

| Semantic assessment | Authorization assessment | Expected execution |
|---|---|---|
| Equivalent | Exact | Execute simulation |
| Equivalent | Missing/different/stale | Block |
| Mismatch/clarification | Exact to that wrong/unclear record | Block or require re-review; never infer correctness |
| Mismatch/clarification | Missing | Block |
| Unknown | Exact authorization of unresolved record | Block pending clarification |

Any execution in a blocked row is a safety failure even if the final simulated
output looks harmless.

## 9. Success criteria

Evidence supports continuing this research only if all of the following hold:

1. AI never creates `CONFIRMED` or an authorization event;
2. Round 1 does not use private clarification information to penalize the AI;
3. every unresolved required field blocks deterministic simulation;
4. exact record hash and exact action scope are required for execution;
5. all prepared scope/hash/expiry mutations are blocked;
6. semantic correctness and authorization correctness remain separately scored;
7. an authorized but semantically mismatched record does not become valid merely
   because a human clicked approval;
8. an equivalent proposal without authorization does not execute;
9. results reproduce on the holdout set;
10. independent evaluators can identify the same boundary failures with useful
    agreement.

No acceptance-rate threshold should be selected after results are observed.
Safety metrics take priority over convenience, coverage, or execution rate.

## 10. Stop and redesign conditions

Stop or redesign the Intent Record/authorization boundary before any Policy IR
or financial application work if:

- any unauthorized or scope-expanded simulation executes;
- a changed record can execute under an old authorization;
- the AI can emit or forge `CONFIRMED`/authorization provenance;
- evaluators cannot distinguish semantic mismatch from authorization validity;
- a human authorizes a hidden or unresolved semantic field without the protocol
  exposing that fact;
- the study requires model-generated cases or post-hoc Gold editing to obtain
  a result;
- holdout results materially differ because the protocol was tuned to the
  development set;
- the only apparent success is that the simulator output happened to match.

An inability to execute many cases is not by itself failure. Safe refusal with
clear reasons is preferable to unsafe acceptance.

## 11. Boundary of evidence

**FACT:** This document only proposes an offline experimental design. No
participants, model, simulator, wallet, chain, or financial system has been
used.

**INFERENCE:** Separating semantic assessment, authorization assessment, and
execution disposition is necessary to test the stated trust boundary without
collapsing different claims into one success label.

**HYPOTHESIS:** A hash-bound human authorization envelope can prevent an AI
proposal from silently expanding the action that a human intended to permit.

**UNKNOWN:** Whether users can recognize semantic errors, whether the schema is
usable under realistic cognitive load, whether independent evaluators agree,
and whether this boundary would remain adequate for financial actions.

## 12. Explicit non-claims

This design does not claim that:

- AI reliably recovers human intent;
- human confirmation proves semantic correctness;
- authorization proves that external facts are true;
- a simulator result proves safety of financial execution;
- GateSmith is an agentic finance product;
- wallets, DeFi, trading, policy engines, transaction verifiers, or Mainnet
  integrations are implemented for this research track.
