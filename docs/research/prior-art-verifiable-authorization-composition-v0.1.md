# GateSmith Research Track 02

## Prior-Art & Verifiable Authorization Composition Gate V0.1

Status: research only. This note does not modify production code, the Intent
Record, the Authorization Boundary model, or the experiment harness. No
Mainnet transaction or new experiment was performed.

Research date: 2026-09-27. Web sources were checked on 2026-09-27.

## 1. Executive research judgment

**Gate outcome: CONTINUE — SCOPE-EVOLUTION GAP REMAINS.**

The prior art substantially subsumes the broad thesis that an AI may act with
bounded authority under a human-defined policy. OAuth, RBAC/ABAC, OPA, Cedar,
capability systems, MCP OAuth scopes, agent-tool policy systems, human approval
flows, smart-account permissions, and on-chain delegation all already provide
important parts of that capability.

The remaining defensible research question is narrower:

> Can an evolving agent plan be reduced to concrete proposed actions and
> checked against a previously authorized, independently inspectable authority
> envelope, with a deterministic conformance result and separately identifiable
> execution evidence?

This is not a claim that GateSmith invented authorization, intent-aware
authorization, or delegated wallet permissions. IGAC is especially close in
concept: it proposes intent certificates, session narrowing, manifest
filtering, and intent/tool/payload consistency checks. Progent and AgentSpec
also directly address deterministic runtime restriction of agent actions.

ERC-8273 is a materially close primary prior art item. It standardizes an
on-chain attestation registry with transaction-scoped authorization,
capability/action-digest binding, optional evidence hashes, and atomic gated
execution. It therefore substantially narrows the remaining question: the
gap is not action binding or on-chain gating in general.

The evidence found no single mature primary system that simultaneously proves:

```text
natural-language intent
  -> semantically correct authority envelope
  -> evolving agent plan/action conformance
  -> independently verifiable policy execution
  -> separately evidenced external execution
```

That absence is not proof of novelty. It is a candidate composition gap that
must be tested against closer implementations and real workload utility.

## 2. Evidence boundary and labels

### GateSmith claims

- **IMPLEMENTED:** a narrow Boolean parser/evaluator, deterministic AST,
  NAND compiler, TapeOut-compatible netlist path, and local verification path.
- **EXPERIMENTALLY OBSERVED:** a Genesis `A AND B` circuit was created and
  live-verified on X Layer Mainnet; the project has also mechanically tested
  declared authorization-binding mutations in a research harness.
- **PROPOSED:** Intent Record fields and the Authorization Boundary research
  model; the candidate composition described in this note.
- **UNKNOWN:** faithful natural-language-to-authority translation, truthful
  input binding, general agent plan conformance, external action completion,
  economic usefulness, and any general security or novelty claim.

### Research labels

- **FACT:** directly supported by a cited specification, original paper,
  official documentation, repository, or the supplied GateSmith evidence.
- **INFERENCE:** a reasoned comparison that is not itself implemented or
  experimentally established.
- **HYPOTHESIS:** a proposition requiring an experiment, proof, or stronger
  evidence.
- **UNKNOWN:** not established by the reviewed evidence.

The existence of a policy decision, signature, circuit result, or blockchain
record is never by itself evidence that the human's intent, policy inputs, or
external action were truthful.

## 3. GateSmith current proven capability

### FACT

The supplied project evidence establishes this narrow pipeline:

```text
human-readable Boolean rule
  -> confirmed Boolean logic
  -> deterministic AST
  -> NAND-only compiler
  -> TapeOut netlist
  -> TapeOut Circuit
  -> X Layer Mainnet eval
```

It establishes deterministic processing of an already confirmed Boolean rule
and live evaluation of one Genesis circuit. It does not establish a general
authorization language, an agent runtime, a wallet, a tool gateway, an input
oracle, a human-approval UI, or a natural-language compiler.

### INFERENCE

GateSmith could act as a small deterministic policy-conformance backend if an
external system supplied a bounded Boolean predicate and properly bound inputs.
That would be composition with an authorization model, not replacement of the
model.

### UNKNOWN

Whether TapeOut/X Layer adds material value over an ordinary signed policy,
OPA/Cedar decision, or smart contract for a real agent workload is untested.

## 4. Prior-art landscape

### 4.1 OAuth and delegated authorization

**FACT:** [RFC 6749](https://datatracker.ietf.org/doc/rfc6749/) defines OAuth
as a framework in which a resource owner can grant a client delegated access
to protected resources without exposing credentials. The authorization unit is
normally a token representing granted access to a resource server; scopes and
token lifetime are implementation/profile concerns. OAuth authenticates and
delegates access but does not decide whether a particular LLM plan is faithful
to a natural-language goal.

**FACT:** [RFC 9449 DPoP](https://www.rfc-editor.org/rfc/rfc9449/) binds tokens
to a proof-of-possession key and binds a proof to an HTTP request. It improves
sender/conveyance binding, but explicitly does not itself provide authentication
or access control.

**INFERENCE:** OAuth is strong prior art for standing or time/session-scoped
delegation and provenance of the credential. It does not solve semantic intent,
plan evolution, or execution completion.

### 4.2 RBAC, ABAC, OPA, and Cedar

**FACT:** NIST [SP 800-162](https://doi.org/10.6028/NIST.SP.800-162) defines
ABAC as evaluating subject, object, operation, and environmental attributes
against policy. RBAC is a constrained role/permission model within the broader
access-control family. These models can express action, target, identity,
context, and conditions, but assume the policy and attributes are supplied by
an authority or trusted system.

**FACT:** [OPA](https://www.openpolicyagent.org/docs) decouples policy decision
from enforcement. Rego evaluates structured input and can be used for API,
microservice, Kubernetes, CI/CD, and other decisions. The enforcement point
must provide the input and must actually honor the decision.

**FACT:** [Cedar](https://docs.cedarpolicy.com/) evaluates a request consisting
of principal, action, resource, and context against policies and entity data.
It supports RBAC/ABAC-style policies, schemas, validation, analysis, and
deterministic allow/deny evaluation. Cedar's own description says the
application invokes the authorizer before performing the operation.

**INFERENCE:** OPA/Cedar are already materially equivalent to the proposed
“deterministic predicate decides whether this concrete action is allowed” layer.
Their gaps are not Boolean expressiveness; they are policy authoring, trusted
input derivation, enforcement integration, action decomposition, and semantic
faithfulness.

### 4.3 Capability security and contextual delegation

**FACT:** Capability security grants authority through possession of an
unforgeable reference or token to an object/resource, rather than relying only
on ambient identity and global policy. [Macaroons](https://research.google.com/pubs/archive/41892.pdf)
add contextual caveats that attenuate where and how a bearer can be used.
Object-capability work provides long-standing patterns for least authority,
attenuation, delegation, and confinement.

**INFERENCE:** Capability systems are strong prior art for bounded AI
discretion: give the agent only the references or tokens needed for the task,
and attenuate them with caveats. They do not inherently prove that a human
understood the natural-language goal or that an agent's new plan remains
inside the goal's intended meaning.

### 4.4 MCP authorization and tool scopes

**FACT:** The [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
uses OAuth-style protected-resource discovery, authorization-server metadata,
bearer-token validation, and scopes. MCP can protect an entire server or
specific tools. Scope challenges and step-up authorization can request more
scope for a call.

**FACT:** MCP's authorization boundary is primarily protocol/resource/tool
authorization. Tool arguments may require additional server-side validation;
an OAuth scope alone does not establish that the payload is justified by the
user's current request. The MCP ecosystem itself has ongoing work on tool-scope
definition and argument-sensitive authorization.

**INFERENCE:** MCP solves credential and tool-access plumbing, not the full
intent-to-authority problem. It is a likely enforcement substrate for any
future GateSmith composition, not a competitor that GateSmith should replace.

### 4.5 Progent and AgentSpec

**FACT:** [Progent](https://arxiv.org/abs/2504.11703) proposes a DSL for
fine-grained privilege-control policies over LLM tool calls, including
argument constraints and fallbacks. Its policies are enforced during execution;
the paper also studies LLM-assisted policy generation and dynamic updates.
The [official repository](https://github.com/Agentic-AI-Risk-Mitigation/progent)
describes interception of tool calls and JSON-policy validation.

**FACT:** [AgentSpec](https://arxiv.org/abs/2503.18666) proposes a DSL for
runtime constraints with triggers, predicates, and enforcement mechanisms over
LLM agents, including code execution and embodied-agent settings. The paper
reports experiments on generated rules and runtime enforcement.

**INFERENCE:** These systems directly weaken any claim that “AI proposes a
tool call and a deterministic guard decides whether it is allowed” is a new
research direction. Their remaining questions include policy-generation
correctness, coverage, adversarial robustness, authority provenance, and
independent verification of the enforcement result.

### 4.6 Intent-aware authorization and agent identity

**FACT:** [IGAC](https://arxiv.org/abs/2606.22916) proposes a server-side
Intent-Governed Access Control layer that treats expressed user intent as an
auditable, monotone policy attribute. It describes intent certificates,
session-scoped narrowing, intent-aware manifest filtering, and
intent/tool/payload consistency checks. Its central constraint is that intent
may narrow static integration authority but may not expand it.

**FACT:** [Agentic JWT](https://arxiv.org/abs/2509.13597) proposes agent
identity, chained delegation assertions, proof-of-possession keys, and an
intent-token concept. This is a research proposal, not evidence of a mature
standard or deployment.

**INFERENCE:** IGAC is the closest conceptual prior found for
“natural-language request constrains an agent's existing authority.” It makes
the intent-to-authority and intent-to-payload boundary an explicit research
problem. GateSmith cannot claim that problem as unoccupied; at most it can test
a different deterministic/verifiable composition.

### 4.7 Human approval systems

**FACT:** Human-in-the-loop approval is already a standard agent pattern. For
example, the [OpenAI Agents SDK approval guide](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/)
pauses a run on a tool approval request and resumes or rejects it from run
state. The approval can be conditional or programmatic. Similar patterns exist
in [Microsoft's agent framework](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval)
and [AWS guidance](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentsec04-bp02.html).

**INFERENCE:** “Put a human approval step before consequential tools” is not a
GateSmith-specific contribution. The harder question is what exact action,
payload, target, policy version, and evidence the human approved, and whether
the executor rejects drift after approval.

## 5. Comparison matrix

| System/family | Authorization unit and source | Scope / payload / evolution | Deterministic enforcement and evidence | Explicit non-solution |
|---|---|---|---|---|
| OAuth / DPoP | Token from authorization server; DPoP adds client-key proof | Resource/scope/token lifetime; request binding with DPoP; not agent-plan semantics | Resource server validates token/proof; logs are application-dependent | Human intent, policy meaning, execution completion |
| RBAC / ABAC | Roles or subject/object/action/context attributes under administered policy | Fine-grained attributes and conditions; payload use is policy/application-specific | PDP/PEP evaluation can be deterministic | Correct natural-language interpretation and trusted attributes |
| OPA | Rego policy plus structured input from caller | Arbitrary structured input; dynamic policy/data; no built-in authority provenance | Deterministic policy decision; PEP must enforce; decision logs optional | Who made the policy, truthful input, agent semantics |
| Cedar | Principal/action/resource/context plus policy/entity data | Explicit PARC request, attributes, schemas, policy analysis | Deterministic authorizer; app must enforce result | Natural-language intent and external execution |
| Capabilities/Macaroons | Possession of delegated object reference/token; caveats from delegator | Attenuation, contextual caveats, delegation chains | Reference/token checks; audit varies by system | Semantic goal extraction and plan reasoning |
| MCP OAuth/scopes | User-authorized OAuth client/resource/tool access | Server/tool scopes, step-up; payload checks remain server policy | Protocol token enforcement at resource boundary | Intent fidelity and complete argument semantics |
| Progent | Declarative privilege policy over tool calls | Tool arguments and fallback rules; dynamic policy generation studied | Runtime interception and allow/block | Cryptographic/on-chain independent verification |
| AgentSpec | Runtime predicates/triggers over agent actions | Domain-specific constraints and enforcement; generated rules evaluated | Runtime enforcement with reported benchmark results | Human intent truth and broad authorization provenance |
| IGAC | Expressed intent as narrowing policy attribute plus static integration policy | Intent certificates, session narrowing, manifest/payload consistency | Proposed server-side checks and audit | Full proof that natural language was interpreted correctly |
| HITL approval | Human decision at a tool/action checkpoint | Depends on UI and implementation; can be per-call or conditional | Pause/resume/reject; audit depends on system | Approval quality, payload drift, capability, execution evidence |
| ERC-4337 / smart accounts | Account validation logic and signed `UserOperation` | `to`, calldata, nonce, signature, gas/paymaster fields; custom wallet rules | EntryPoint and account validate/execute on-chain | Natural-language intent and truthful off-chain inputs |
| ERC-7715 / MetaMask delegation | Wallet-granted execution permission and delegation manager | Permission context plus execution calldata; caveats can restrict use | Smart contracts enforce delegation; redemption and hooks produce chain evidence | Human semantic intent and off-chain agent plan correctness |
| ERC-8273 | Authorized Attestor plus `capability` and `actionDigest`; off-chain evaluation determines attestation semantics | Transaction-scoped, atomic authorization; action digest can bind target, selector, arguments, and nonce; optional `evidenceHash` | Registry writes an audit record, opens transient authorization, and target DApp gates execution in the same transaction | Attestor trust, evaluation semantics, truthful inputs, and natural-language intent |
| Safe modules/guards | Safe owners and module/guard contract logic | Transaction/module-specific rules; spending limits and guards | Smart contract can block/allow before execution | General NL intent, off-chain target truth, external completion |

The matrix supports a negative result for the broad thesis and a narrower
research question for scope evolution and independently inspectable conformance.

## 6. On-chain and cryptographically verifiable authorization prior art

### 6.1 Smart accounts and signed user operations

**FACT:** [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) defines a
`UserOperation` containing sender, nonce, call data, fees, paymaster data, and
signature. An `EntryPoint` validates and executes operations through smart
account logic. The standard supports custom account validation, but does not
define what a natural-language user goal means.

**INFERENCE:** ERC-4337 already provides a programmable on-chain enforcement
point for exact calls and wallet-specific policy. A GateSmith Boolean circuit
would need to offer a materially different assurance than smart-account
validation to justify additional machinery.

### 6.2 Delegated permissions and caveats

**FACT:** [ERC-7715](https://eips.ethereum.org/EIPS/eip-7715) defines a wallet
RPC method for requesting execution permissions and returning delegation
context used to redeem execution permissions. It is directly relevant to
agent-like delegated execution.

**FACT:** The [MetaMask Delegation Toolkit](https://docs.gator.metamask.io/)
uses signed delegation chains and caveat enforcers for granular permissions,
including spending limits and time-based restrictions. Its [caveat documentation](https://github.com/MetaMask/delegation-framework/blob/main/documents/CaveatEnforcers.md)
states that caveats can verify state before/after execution, while also
warning that a caveat's approval does not guarantee that the action executes.

**INFERENCE:** This is materially equivalent to much of the proposed
“authority envelope plus bounded agent discretion” for wallet actions. It also
demonstrates the important distinction between authorization/conformance and
actual execution. GateSmith cannot claim scoped on-chain delegation as novel.

### 6.3 Policy-controlled accounts and guards

**FACT:** Safe supports modules, guards, and spending-limit patterns. A
[module guard](https://docs.safe.global/reference-smart-account/guards/setModuleGuard)
can check module-initiated transactions before execution; Safe warns that a
broken guard can block all Safe executions. A [spending-limit module](https://help.safe.global/articles/3961440620-set-up-use-spending-limits)
can permit a beneficiary to initiate bounded token transfers without being a
Safe signer.

**INFERENCE:** Smart-contract-wallet controls already cover many concrete
authorization and enforcement cases that a Boolean circuit could encode. They
are stronger than a mere off-chain log because the wallet can refuse execution,
but they still depend on trusted owners, policy code, call data, token/account
state, and correct target interpretation.

### 6.4 ERC-8273: Attestation-Gated Agentic Actions

**FACT:** [ERC-8273](https://eips.ethereum.org/EIPS/eip-8273) is a draft
standard for an on-chain Agent Attestation Registry. An authorized Attestor
calls `attestAndCall`; the registry records an attestation, places active
authorization in EIP-1153 transient storage, and executes the action through a
specified wallet or ERC-4337 execution profile. The active authorization is
cleared at the end of the transaction, so the standard does not create a
long-lived session grant.

**FACT:** ERC-8273 separates a coarse `capability` from a fine-grained
`actionDigest`. In action-bound mode, the digest is required to include the
target contract, function selector, arguments, and a nonce or other replay
protection. The gated DApp recomputes the same digest and reverts if the active
attestation does not match. This directly addresses action substitution and
scope expansion within the concrete on-chain call.

**FACT:** ERC-8273 deliberately leaves the Attestor's off-chain evaluation,
trust source, evidence semantics, and upper-layer architecture unspecified.
`evidenceHash` may anchor an audit report, Merkle root, TEE quote, ZK proof
commitment, or other evidence, but the registry does not establish the truth of
that evidence. The ERC also states that an attestation is an on-chain recorded
statement and is not necessarily a cryptographic proof.

**FACT:** ERC-8273 supports atomic gated execution and persistent audit
records, but it does not itself prove that a natural-language human goal was
correctly interpreted, that an evolving AI plan stayed within that goal, that
the Attestor's off-chain policy evaluation was correct, or that an external
off-chain action completed. Its strongest guarantees are transaction atomicity,
action/capability binding, replay resistance when correctly encoded, and an
on-chain execution gate.

**INFERENCE:** ERC-8273 substantially subsumes the claim that GateSmith could
add novelty merely by introducing per-action authorization, action hashes,
auditable evidence, or on-chain gated execution. A GateSmith circuit used as
the Attestor's evaluator would duplicate the ERC's surrounding registry and
execution gate unless it supplied an independent verifier or trust boundary.

**INFERENCE:** The only potentially distinct composition is narrower: replace
or supplement the Attestor's trusted off-chain decision with a deterministic,
independently inspectable evaluation of a bounded conformance predicate. Even
then, the Attestor role, human authorization binding, input truth, and external
execution remain outside the circuit.

### 6.5 ZK policy and authorization proofs

**FACT:** Research such as [Extending Expressive Access Policies with Privacy
Features](https://arxiv.org/abs/2212.02454) and blockchain/ZK access-control
systems demonstrates that policy satisfaction can be represented in a circuit
and proven without exposing all attributes. The proof establishes a relation
over committed inputs; it does not make those inputs true by itself.

**INFERENCE:** Cryptographic authorization proofs are established adjacent
prior art. GateSmith's possible contribution would have to be the specific
composition of a small, independently inspectable policy artifact with an
agent-action authority boundary—not the general idea of putting access policy
in a circuit.

## 7. Authorization semantics versus verifiable execution

The following layers must remain separate:

| Layer | Question | What GateSmith/TapeOut could plausibly strengthen | What remains outside the circuit |
|---|---|---|---|
| Authorization semantics | Is this action allowed by the policy? | Deterministic evaluation of a bounded predicate | Whether the policy expresses the human's meaning |
| Authority provenance | Who authorized the policy/action, and is the binding valid? | Check hashes/signatures/identifiers if supplied as circuit inputs or verified by a trusted wrapper | Human identity, signer intent, key custody, revocation source unless bound |
| Input/evidence binding | Why believe artifact, target, time, account, or state inputs? | Compare committed values, hashes, signatures, or oracle attestations | Truth of claims, honest oracle, artifact provenance, account ownership |
| Policy compilation | Did lowering preserve policy meaning? | Exhaustive equivalence for a bounded Boolean subset; deterministic artifact hash | Semantic correctness of the original policy; richer-language compiler correctness |
| Policy execution | Was the predicate evaluated correctly? | X Layer/TapeOut evaluation and independent result comparison | Correctness of supplied inputs and surrounding enforcement |
| External execution | Did the real action happen as authorized? | A later signed/chain receipt could be consumed as evidence | Off-chain side effects, failed/time-out/ambiguous tools, publication systems |

### FACT

On-chain or circuit execution proves at most the evaluated relation over the
inputs and the integrity of the execution mechanism. A circuit does not turn an
unsigned string into a human authorization, an artifact hash into a truthful
artifact description, or a proposed external action into completed execution.

### INFERENCE

Putting an ordinary authorization predicate on-chain is meaningful only when
independent parties need a common enforcement point, a portable artifact, a
replayable result, censorship resistance, or a proof that the same predicate
was used. Otherwise it may reproduce an off-chain PDP at greater cost.

## 8. Scope Expansion Detection

The hard operational problem is not merely “is this tool call allowed?” It is
the mapping from an evolving plan to a sequence of concrete authority checks:

```text
goal/request
  -> candidate plan
  -> proposed action + normalized arguments + target + context
  -> policy/authority decision
  -> execute or request new authorization
  -> execution receipt/reconciliation
```

### What existing systems solve

- OAuth scopes and capabilities constrain access to resources or operations.
- OPA/Cedar can evaluate action payloads and context if the caller supplies
  those inputs.
- Progent and AgentSpec can intercept and block tool calls using declared
  predicates and argument constraints.
- IGAC explicitly proposes intent-aware narrowing and payload consistency.
- Delegation frameworks can attenuate permissions and enforce caveats on-chain.
- ERC-8273 can bind an Attestor's authorization to a concrete action digest and
  gate that action atomically in the same transaction.
- HITL systems can pause a call and ask for approval.

### What remains difficult

**FACT:** These mechanisms generally require a policy, scope, caveat, predicate,
or approval rule already expressed in an operational form. Some research uses
an LLM to generate or update that policy, but the resulting semantic
correctness remains a model/evaluator question.

**FACT:** ERC-8273 specifically resolves the final concrete on-chain binding:
`capability` identifies the authorization class, `actionDigest` identifies the
concrete call, and transient storage prevents reuse outside the issuing
transaction. It leaves the decision that an AI-proposed action satisfies the
human/policy boundary to the off-chain Attestor.

**INFERENCE:** A plan step is inside authority only if the system can identify
the relevant authorized action class, target/resource bounds, argument limits,
time/state conditions, and whether the step is merely an implementation detail
or a new externally consequential action. “Deploy GateSmith” does not by itself
authorize DNS changes, production-code edits, database migrations, or external
transfers unless the policy defines those relations.

**HYPOTHESIS:** A small, canonical action envelope plus deterministic
conformance predicate could make the Attestor's off-chain decision independently
checkable rather than trusted as a single evaluator. This is not yet evidence
of superiority to ERC-8273's Attestor model, OPA/Cedar, Progent, IGAC, or
smart-account caveats.

## 9. Can established authorization compose with GateSmith/TapeOut?

Yes, conceptually, for a bounded subset:

```text
external human/policy system
  -> canonical authorization record
  -> concrete action/evidence fields
  -> Boolean conformance predicate
  -> GateSmith AST
  -> NAND/netlist/TapeOut circuit
  -> deterministic allow/deny result
```

No new general-purpose Policy IR is required to test the narrow composition.
An OPA/Cedar/capability/delegation system could remain the policy source, while
GateSmith evaluates a small exported predicate.

### Input binding requirements

| Input class | Example predicate | Minimum binding needed |
|---|---|---|
| Artifact | `hash(candidate) == authorized_hash` | Canonical serialization, trusted hashing, and a provenance statement for the artifact |
| Action | `action_type == publish` | Canonical action vocabulary and a tool/executor that cannot relabel the call |
| Target | `target == account_123` | Authenticated account/resource identifier from the real authority domain |
| Arguments | `amount <= 1000`, exact caption or calldata | Canonical argument encoding and payload binding before execution |
| Authority | `signature_valid && signer == human` | Verified signature/key identity, authorization version, expiry, and revocation semantics |
| Time/state | `now < expiry`, `nonce unused` | Trusted clock/state source, freshness, replay protection, and explicit ordering |
| Execution evidence | `receipt.action_hash == authorized_hash` | Independent receipt source and reconciliation for failure/timeout/partial execution |

### FACT

The circuit can compare or evaluate these values if they are supplied in a
representation the circuit accepts. It cannot independently discover that the
values are truthful without a trusted source, cryptographic binding, or oracle.

### INFERENCE

The meaningful test is not whether a Boolean predicate can be compiled. That is
already demonstrated. The test is whether the composition improves an actual
multi-party or adversarial workflow by making policy/action binding and
conformance independently checkable without duplicating a stronger existing
enforcement mechanism.

## 10. GateSmith thesis attack

### Attack 1 — “GateSmith is merely OPA/Cedar with a blockchain backend.”

**Supporting evidence:** OPA and Cedar already evaluate structured,
argument/context-sensitive authorization decisions deterministically and
separate policy from application enforcement.

**Counterargument:** A portable, independently evaluated circuit artifact may
be useful where parties do not share a PDP or want a common verifiable result.

**Status: WEAKENED.** The broad authorization thesis does not survive. A
portable verifiable artifact is a narrower possible contribution, not yet shown.

### Attack 2 — “GateSmith is merely capability security with expensive verification.”

**Supporting evidence:** Capabilities and caveats already provide attenuated,
delegated, least-authority execution.

**Counterargument:** GateSmith could evaluate a policy relation over a
capability/action/evidence tuple for parties that cannot share capability
runtime assumptions.

**Status: WEAKENED.** No new authorization theory is established.

### Attack 3 — “GateSmith is merely HITL approval with hashes.”

**Supporting evidence:** Agent SDKs already pause on tool calls and resume after
approval; exact action binding is a known design requirement.

**Counterargument:** A deterministic conformance artifact could make approval
scope and post-approval drift auditable across independent executors.

**Status: SURVIVES as a warning, not as a falsification.** Hashes and a pause
are insufficient unless the executor binds the exact action and rejects drift.

### Attack 4 — “GateSmith is merely an agent-wallet/session-key policy system.”

**Supporting evidence:** ERC-4337, ERC-7715, MetaMask delegations, Safe guards,
spending limits, nonces, and caveats already enforce bounded wallet actions.

**Counterargument:** These systems are domain-specific to wallet/account state;
an external conformance artifact could cover non-wallet tools and mixed
workflows.

**Status: WEAKENED.** Any claim must be outside wallet authorization or explain
why a wallet policy cannot serve as the enforcement substrate.

### Attack 5 — “Intent-aware authorization already solves the meaningful problem.”

**Supporting evidence:** IGAC explicitly proposes intent certificates,
session narrowing, manifest filtering, and payload consistency.

**Counterargument:** Intent-aware policy still needs reliable semantic
translation, deterministic enforcement, and independent evidence binding.

**Status: UNKNOWN.** The reviewed work is close enough that GateSmith cannot
claim an unoccupied intent-aware authorization problem. Comparative experiments
or formal differences are required.

### Attack 6 — “On-chain verification adds no useful trust property.”

**Supporting evidence:** If all inputs and the policy are already trusted by
one service, an ordinary signed decision and reproducible local evaluation may
be cheaper and sufficient.

**Counterargument:** ERC-8273 already gives multiple parties a shared
on-chain action-bound attestation and atomic execution gate. A GateSmith circuit
could only add value if it independently evaluates the conformance predicate,
rather than merely recording or repeating the Attestor's result.

**Status: WEAKENED.** ERC-8273 removes much of the claimed on-chain value. The
remaining independent-evaluator value is workload- and adversary-dependent and
has not been demonstrated by GateSmith.

### Attack 7 — “A deterministic circuit is unnecessary.”

**Supporting evidence:** OPA/Cedar, smart contracts, and signed decision logs
can provide deterministic or reproducible evaluation without TapeOut overhead.

**Counterargument:** A circuit may provide a constrained, portable artifact and
an independent verifier with a different trust boundary.

**Status: UNKNOWN.** The proposed trust-boundary advantage has not been measured.

### Attack 8 — “The system is useful only in adversarial/multi-party settings.”

**Supporting evidence:** A single user with one trusted agent can often use
ordinary tool approvals, OAuth, and local policy evaluation.

**Counterargument:** Multi-party workflows, delegated operators, and mutually
untrusted infrastructure are precisely where independent conformance evidence
could matter.

**Status: SURVIVES.** This is a plausible narrowing of the product/research
domain, not a defect that ordinary single-user convenience can erase.

### Attack 9 — “TapeOut adds no material advantage over an ordinary smart contract.”

**Supporting evidence:** Smart accounts, guards, ordinary contracts, and
ERC-8273 already execute authorization predicates or Attestor-gated actions
on-chain and can emit receipts.

**Counterargument:** TapeOut may provide a distinct artifact format, execution
model, or verification workflow for bounded Boolean machines, and could be used
as an independent evaluator before an ERC-8273-style gate.

**Status: UNKNOWN.** The project has demonstrated execution, not comparative
advantage.

### Attack 10 — “The composition is technically possible but economically/product-wise pointless.”

**Supporting evidence:** Every additional serialization, circuit execution,
oracle binding, approval, and reconciliation step adds cost and complexity;
existing policy engines are mature and operationally integrated.

**Counterargument:** High-consequence multi-party actions may justify an
independent conformance artifact where ordinary policy logs are not trusted.

**Status: UNKNOWN.** No target user, threat model, cost model, or failure-cost
comparison has been established.

## 11. Smallest defensible remaining gap

The smallest defensible gap is narrower than previously stated:
**independent evaluation of scope-evolution conformance**, not generic
authorization, action binding, on-chain gating, or natural-language
understanding:

> Given a human-authorized bounded authority envelope, can each evolving agent
> action be normalized, checked against that envelope, and accompanied by a
> separately verifiable result that distinguishes authorization, capability,
> and actual external execution?

ERC-8273 already supplies the final action-bound, transaction-scoped gate. The
remaining question is whether its off-chain Attestor/evaluator can be replaced
or cross-checked by a deterministic, independently inspectable predicate over
the human-authorized envelope and the evolving concrete action.

This gap is therefore only partially open. Progent, AgentSpec, IGAC, MCP,
ERC-8273, and delegation systems already address portions. The defensible claim
is therefore:

- existing systems provide many policy and enforcement primitives;
- intent-to-authority remains semantically difficult and probabilistic;
- scope evolution across multi-step plans remains an integration and evidence
  problem, but ERC-8273 already binds the final concrete on-chain action;
- GateSmith may contribute a bounded independently inspectable evaluator for
  the Attestor's predicate, but this is unproven and may be replaceable by an
  ordinary policy engine, smart contract, or cryptographic proof.

## 12. Falsification conditions

The remaining thesis should be abandoned or narrowed further if research shows
any of the following:

- ERC-8273 plus an existing policy engine, proof system, or Attestor already
  provides the same action-envelope, plan-evolution, evidence-binding, and
  independent-verifier composition for a target workload;
- ordinary signed policy decisions plus reproducible local evaluation provide
  the same assurance for the intended threat model at materially lower cost;
- a circuit result cannot bind the relevant artifact, action, target, time, and
  execution evidence without trusting the same off-chain components as the
  ordinary policy engine;
- users or operators cannot reliably define the authority boundary, making the
  natural-language semantic problem dominant and unaffected by GateSmith;
- a GateSmith circuit can only reproduce an allow/deny bit while adding no
  useful portability, independence, auditability, or enforcement property;
- plan evolution can be handled adequately by existing tool scopes and approval
  checkpoints in the selected real workflow.

## 13. Minimal next experiment, only if justified

The next experiment should be a comparison, not a new architecture:

1. Choose one non-financial, multi-step task with a real participant and a
   consequential final action, such as deploying a fixed service artifact to a
   named test environment. Do not use Mainnet, wallets, funds, or production.
2. Freeze a small, human-confirmed authority envelope: allowed artifact hash,
   allowed action classes, target, bounded parameters, expiry, and prohibited
   actions.
3. Have an AI produce an evolving sequence of proposed actions, including at
   least one reasonable in-scope step, one scope expansion, and one capability
   failure.
4. Compare an ERC-8273-style Attestor gate and an established policy decision
   path (OPA or Cedar, with exact action-payload input) against the existing
   GateSmith Boolean/NAND/TapeOut path for the same normalized predicate.
5. Require both paths to report separately: semantic input record, authority
   binding, conformance decision, capability/precondition result, and execution
   evidence. Do not treat a circuit result as evidence that input claims are
   true.
6. Measure whether an independent reviewer can detect the same mutations and
   whether the GateSmith artifact provides a trust property the ordinary path
   does not. Record latency, cost, integration effort, false allows, false
   blocks, and action drift.

This is a design for future review, not an experiment authorization. It does
not justify a new Policy IR, wallet integration, financial execution, or new
Mainnet write.

## 14. Gate recommendation

**CONTINUE — SCOPE-EVOLUTION GAP REMAINS.**

Continue only with a sharply narrowed claim: GateSmith may investigate whether
a deterministic, independently inspectable artifact can independently evaluate
or cross-check the off-chain conformance decision that an ERC-8273-style
Attestor would otherwise be trusted to make, for evolving agent actions.

Do not claim:

- that GateSmith invented delegated authorization;
- that blockchain makes intent truthful;
- that a circuit proves authority provenance or input truth without bindings;
- that a successful policy evaluation proves external execution;
- that natural-language intent has been compiled correctly merely because a
  Boolean circuit ran;
- that current GateSmith is an agent authorization product.

The next gate should be allowed to terminate the thesis if ERC-8273 combined
with an established OPA/Cedar/capability/policy-proof evaluator supplies the
same trust property more simply. The research survives only as a falsifiable
independent-evaluator composition question, not as a claim of broad
authorization novelty.

## 15. Primary sources and evidence dates

Sources below were accessed or checked on 2026-09-27.

- [OAuth 2.0 Authorization Framework, RFC 6749](https://datatracker.ietf.org/doc/rfc6749/) — 2012.
- [OAuth 2.0 DPoP, RFC 9449](https://www.rfc-editor.org/rfc/rfc9449/) — 2023.
- [NIST SP 800-162 ABAC](https://doi.org/10.6028/NIST.SP.800-162) — 2019.
- [Open Policy Agent documentation](https://www.openpolicyagent.org/docs) — living documentation.
- [Cedar Policy Language documentation](https://docs.cedarpolicy.com/) — living documentation; version 4.5 documentation observed.
- [MCP Authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) — 2025-11-25 specification.
- [Macaroons: Cookies with Contextual Caveats](https://research.google.com/pubs/archive/41892.pdf) — original research paper.
- [Progent: Programmable Privilege Control for LLM Agents](https://arxiv.org/abs/2504.11703) — 2025.
- [AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents](https://arxiv.org/abs/2503.18666) — 2025.
- [Intent-Governed Tool Authorization for AI Agents](https://arxiv.org/abs/2606.22916) — 2026.
- [Agentic JWT](https://arxiv.org/abs/2509.13597) — 2025.
- [OpenAI Agents SDK human approval guide](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/) — living documentation.
- [ERC-4337 Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337) — Ethereum Improvement Proposal.
- [ERC-7715 Request Permissions from Wallets](https://eips.ethereum.org/EIPS/eip-7715) — Ethereum Improvement Proposal.
- [ERC-8273 Attestation-Gated Agentic Actions](https://eips.ethereum.org/EIPS/eip-8273) — draft Ethereum Improvement Proposal, created 2025-05-26.
- [MetaMask Delegation Toolkit](https://docs.gator.metamask.io/) — official documentation.
- [MetaMask Delegation Caveat Enforcers](https://github.com/MetaMask/delegation-framework/blob/main/documents/CaveatEnforcers.md) — official repository documentation.
- [Safe module guard](https://docs.safe.global/reference-smart-account/guards/setModuleGuard) — official documentation.
- [Safe spending limits](https://help.safe.global/articles/3961440620-set-up-use-spending-limits) — official documentation.
- [Extending Expressive Access Policies with Privacy Features](https://arxiv.org/abs/2212.02454) — 2022.
