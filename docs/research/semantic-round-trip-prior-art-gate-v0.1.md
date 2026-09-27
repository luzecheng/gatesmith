# GateSmith Research Track 04

## Semantic Round-Trip Prior-Art Gate V0.1

Status: research only. This note does not modify GateSmith production code, the
Intent Record, the Authorization Boundary, or any harness. No experiment,
TapeOut use, Mainnet use, commit, or push was performed.

Research date: 2026-09-28. Sources were checked on 2026-09-28.

## 1. Executive research judgment

**Gate outcome: CONTINUE — EMPIRICAL VALIDATION GAP REMAINS.**

The candidate loop is not an unoccupied idea:

```text
natural-language requirement or policy
  -> formal representation
  -> formal analysis / equivalence / counterexample
  -> human-readable behavioral consequence
  -> human review, correction, or confirmation
  -> frozen specification
```

Its components are established across requirements engineering, model
checking, autoformalization, counterexample-guided repair, access-control
visualization, and policy analysis.

The strongest attack is current prior art:

- **VERIMED** translates natural-language safety requirements to SMT,
  detects ambiguity through multiple formalizations and equivalence checks,
  produces solver witnesses, performs consistency/vacuity/violatability/
  redundancy audits, and uses clarification and repair loops.
- **Reflective Policy Assessment** shows users effective consequences of their
  access policies from another actor's viewpoint and includes a user study.
- **Faithful Autoformalization via Roundtrip Verification and Repair** explicitly
  formalizes, translates back to natural language, re-formalizes, checks formal
  equivalence, diagnoses translation stages, and repairs them.
- **AWS AgentCore NL-to-Cedar** converts natural language to Cedar, validates
  against a generated schema, and reports policy-analysis findings such as
  `ALLOW_ALL`, `ALLOW_NONE`, `DENY_ALL`, and `DENY_NONE`.
- Classical model checking and requirements validation already use witnesses
  and counterexamples to expose consequences of a formal specification.

No reviewed system establishes that the broad workflow is novel. The narrow
remaining question is whether a deliberately explicit human semantic
confirmation step—where a person inspects selected behavioral consequences and
confirms “this is what I mean”—materially improves detection of intent/formal
mismatch compared with strong existing alternatives. That is an empirical
validation question, not a claim that GateSmith invented semantic round-trip.

## 2. Evidence boundary and labels

### GateSmith labels

- **IMPLEMENTED:** the Boolean MVP can represent a confirmed Boolean rule,
  produce a deterministic truth table, compile the formal artifact, and expose
  observable outcomes for human review.
- **EXPERIMENTALLY OBSERVED:** Case 001 and Case 002 showed that one participant
  used concrete outputs and iteration to clarify preferences, but those cases
  were not a semantic-round-trip benchmark and did not test Boolean policy
  validation.
- **PROPOSED:** using formal consequences, boundary cases, or counterexamples
  to help a human confirm that a formalized meaning matches intent.
- **UNKNOWN:** whether GateSmith's truth-table presentation improves semantic
  mismatch detection over existing model-checking, policy-analysis, or review
  interfaces; whether it scales; and whether it has product value.

### Research labels

- **FACT:** supported by a primary paper, official specification,
  documentation, repository, or supplied GateSmith evidence.
- **INFERENCE:** a reasoned comparison, not itself implemented or validated.
- **HYPOTHESIS:** a proposition requiring a study or proof.
- **UNKNOWN:** not established by the reviewed evidence.

## 3. What “semantic round-trip” means here

The provisional term combines several distinct operations:

1. **Forward formalization:** natural language becomes a formal policy or
   specification.
2. **Formal analysis:** a solver, evaluator, simulator, or model checker
   computes properties, witnesses, counterexamples, or reachable outcomes.
3. **Reverse behavioral explanation:** the formal result is expressed as
   scenarios, effective permissions, examples, traces, a truth table, or
   natural-language consequences.
4. **Human semantic validation:** a human judges whether those consequences
   match the intended meaning and may correct the requirement or formal model.
5. **Freeze:** the reviewed formal meaning is versioned and used downstream.

These operations must not be collapsed:

- formal equivalence checks two machine representations, not human intent;
- a solver witness demonstrates a formal consequence, not that the consequence
  is undesirable or unintended;
- an LLM repair changes a representation, not necessarily the user's meaning;
- human review may be semantic validation, but a click on “approve” is not
  necessarily informed confirmation;
- authorization freezes what was approved, not what the human meant but never
  saw.

## 4. VERIMED attack

### 4.1 What VERIMED provides

**FACT:** [Neurosymbolic Auditing of Natural-Language Software Requirements](https://arxiv.org/abs/2605.13817)
by Hall and Eiers presents VeriMed for medical-device requirements. The paper
formalizes natural-language requirements into SMT over a typed schema and runs
four requirement-level audits:

- global consistency;
- vacuity of conditional triggers;
- violatability, returning a concrete violating assignment;
- redundancy, using unsat cores and subsumption checks.

It also tests scenario-based safety questions by checking entailment. A
satisfiable query returns a counterexample state and the paper describes a
response builder that translates results into natural-language explanation.

**FACT:** VERIMED samples multiple independent formalizations of an ambiguous
requirement, performs bidirectional SMT equivalence checks, and surfaces
concrete distinguishing witnesses. It prompts the LLM to rewrite or clarify
the requirement until sampled encodings converge. It reports counterexample-
guided repair and ambiguity reduction in its benchmarks.

**FACT:** VERIMED includes a reverse direction in a technical sense. Its
generated SMT model is translated into structured natural-language requirements
and re-formalized; the reconstructed and original formulas are checked for SMT
equivalence. The paper reports this as a round-trip equivalence check.

**FACT:** The paper says that, after solver-guided clarification, the final
requirement is surfaced to the user for manual edits. Its experiments also use
scenario questions that were manually reviewed to map to requirements and
solver-verifiable answers.

### 4.2 What VERIMED does not establish

**FACT:** VERIMED's SMT equivalence proves equivalence between formalizations
under the chosen schema and domain constraints. It does not prove that a human
endorses every generated consequence, that the original informal requirement
was complete, or that the formal domain constraints are true.

**FACT:** The paper does not establish a separate protocol in which a human is
shown a selected consequence and must explicitly answer “yes, this is what I
mean” before a frozen authorized formal artifact is created. It has clarification,
manual edits, scenario questions, and solver feedback; those are closely
related, but the paper's primary evaluated signal is formal analysis and
repair, not a measured human semantic-confirmation gate.

**INFERENCE:** VERIMED already implements most of the candidate loop at the
neurosymbolic pipeline level. The exact remaining distinction is not
“formalization plus counterexamples”; it is whether an explicit human
consequence-confirmation interaction adds measurable value beyond VERIMED's
clarification and manual-edit workflow.

## 5. Reflective Policy Assessment and policy visualization

### 5.1 Reflective Policy Assessment

**FACT:** [A Visualization Tool for Evaluating Access Control Policies in
Facebook-style Social Network Systems](https://cspages.ucalgary.ca/~pwlfong/Pub/sac2012.pdf)
by Anwar and Fong develops a prototype for Reflective Policy Assessment (RPA).
The user examines her profile from the viewpoint of another user in an
extended social-graph neighborhood. The tool shows what the selected accessor
can see and supports what-if analysis of access policies.

**FACT:** The paper reports a within-subject user study of the tool's utility
and usability. A related paper, [Visualizing Privacy Implications of Access
Control Policies](https://cspages.ucalgary.ca/~pwlfong/Pub/dpm2009.pdf),
addresses the scale problem by grouping equivalent access scenarios and
selecting representative cases in large neighborhoods.

**INFERENCE:** RPA is strong prior art for the human-facing half of the
candidate loop. It does not show policy syntax; it presents effective
consequences from an accessor's perspective so users can discover unexpected
permissions and revise policy choices.

### 5.2 Boundary of the analogy

**UNKNOWN:** The reviewed RPA work is not an LLM natural-language-to-formal
policy pipeline, and it is not evidence that users explicitly confirm a formal
semantic artifact before machine execution. Its domain is social-network
privacy, not general requirements or Boolean authorization.

**INFERENCE:** The absence of the term “semantic round-trip” is irrelevant.
RPA already demonstrates the core design principle that effective behavioral
consequences can be more usable for semantic validation than policy syntax.

## 6. Counterexample-guided requirements validation

### FACT

Classical model checking verifies a formal model against a formal property and
returns a counterexample trace or witness when the property fails. The usual
workflow is:

```text
formal model + formal requirement
  -> model checker
  -> proof or counterexample trace
  -> engineer/stakeholder diagnosis
  -> model/requirement revision
```

The counterexample is a consequence of the formal model and property. It is
not, by itself, a statement that the human requirement was wrong.

**FACT:** A [systematic review of counterexample explanation](https://www.sciencedirect.com/science/article/pii/S0950584921002378)
reports that counterexamples are useful debugging information but are often
cryptic, lengthy, irrelevant in parts, and difficult for humans to interpret.
Explanation and abstraction of counterexamples are established research
problems.

**FACT:** [Early validation of system requirements and design through
correctness-by-construction](https://doi.org/10.1016/j.jss.2018.07.053)
describes structured requirement specification, formal property derivation,
and early validation before late testing. This is requirements validation,
not simply implementation verification.

**FACT:** [COVER: Counterexample-Guided Repair for Natural-Language Constraint
Modelling](https://doi.org/10.3233/FAIA260737) describes a current
LLM-to-typed-IR-to-solver pipeline in which solver witnesses are translated
into constraint-level diagnoses and localized patches are applied to the IR.
It reports both oracle-mode and test-driven-mode evaluation.

**INFERENCE:** GateSmith's “formal consequence → human review → revision” loop
is a bounded instance of established counterexample-guided validation and
repair. The unresolved question is how to select and present consequences that
help a human judge intent, not whether formal systems can produce witnesses.

## 7. Recent round-trip autoformalization

**FACT:** [Faithful Autoformalization via Roundtrip Verification and Repair](https://arxiv.org/abs/2604.25031)
explicitly defines a three-stage round trip:

```text
natural language -> formal expression -> natural language -> formal expression
```

It checks equivalence between the first and final formal expressions with an
SMT solver, diagnoses which translation stage diverged, and applies targeted
repair. The paper evaluates statutory rules and reports that diagnosis-guided
repair improves formal-equivalence rates when the diagnosis is reliable.

**FACT:** This work is even closer in terminology and structure than the
GateSmith candidate. Its authors describe roundtrip equivalence as evidence of
faithful formalization, not as proof of human intent. The paper's human
evaluation concerns faithfulness and diagnosis; the formal equivalence process
itself is not a human confirmation that every displayed behavioral consequence
matches a person's intended meaning.

**INFERENCE:** A claim that “natural language → formal policy → reverse natural
language → formal equivalence” is novel is falsified. A narrower claim about
human consequence selection and explicit confirmation remains an empirical
question.

## 8. AWS AgentCore NL-to-Cedar attack

### FACT

Official [Amazon Bedrock AgentCore policy-generation documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-generation-validation.html)
states that:

1. natural language is converted to Cedar;
2. each generated policy is validated against the gateway schema;
3. analysis runs per policy;
4. findings are returned with generated assets.

The documented findings include `VALID`, `INVALID`, `NOT_TRANSLATABLE`,
`ALLOW_ALL`, `ALLOW_NONE`, `DENY_ALL`, and `DENY_NONE`. The examples include a
natural-language refund limit becoming a Cedar condition and a warning that a
policy allows every request for a principal/action/resource combination.

Official [AgentCore core-concepts documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-core-concepts.html)
states that Cedar policies are checked against an automatically generated
schema and that automated reasoning detects policies that always allow or
always deny. AgentCore evaluates applicable policies for every tool invocation.

### Boundary of the documented feature

**FACT:** The official documentation establishes generation, schema validation,
static policy analysis, and runtime policy evaluation. It does not establish a
general scenario browser, exhaustive effective-permission visualization,
human-generated truth-table review, or a required human confirmation that
behavioral consequences match intent before deployment.

**FACT:** `ALLOW_ALL` and `DENY_ALL` findings are useful consequence-like
diagnostics, but they are not the same as systematically showing representative
allowed and denied scenarios to a human and recording semantic confirmation.

**INFERENCE:** AgentCore substantially covers forward translation and machine
analysis. On the evidence reviewed, it does not by itself establish the full
human consequence-confirmation loop. That remaining distinction is narrow and
must be tested empirically against its actual interface and workflows before it
can support a GateSmith claim.

## 9. Cedar, OPA, and policy-tooling consequences

### FACT

[Cedar](https://docs.cedarpolicy.com/) provides a human-readable policy
language, schemas, validation, authorization evaluation, and policy analysis.
Its authorization request is a structured principal/action/resource/context
query. Cedar's analysis and validation expose invalid references, schema
problems, and policy behavior such as overly broad or ineffective rules.

[OPA](https://www.openpolicyagent.org/docs) separates policy decision from
enforcement and evaluates Rego policies against structured input. OPA supports
playground-style experimentation, policy tests, structured decision output,
and integrations where callers can inspect or log the decision. The exact
human-facing explanation and scenario coverage depend on the surrounding tool.

**FACT:** Policy tooling commonly supports:

- policy syntax and schema validation;
- unit tests and example inputs;
- allow/deny queries;
- traces or decision logs in some runtimes;
- policy diffs and static analysis in surrounding tools;
- what-if queries when a caller supplies alternate inputs.

**INFERENCE:** Existing tooling can be composed with an NL-to-policy generator
to produce a practical version of the candidate loop. The main missing piece is
usually not the ability to evaluate a policy, but choosing a representative,
human-comprehensible set of consequences and proving that review of those
consequences catches semantic mismatch.

## 10. Human confirmation boundary

The following are not equivalent:

| Activity | What it establishes | What it does not establish |
|---|---|---|
| Human reviews formal syntax | Person saw or edited the representation | They understood all behavior |
| Human corrects an LLM draft | A correction event occurred | The corrected policy is complete or safe |
| Human approves deployment | A deployment decision occurred | The human validated every consequence |
| Human reviews a scenario | A particular consequence was considered | Unseen cases match intent |
| Human confirms a set of consequences | The human endorses the displayed cases | The formal policy is globally correct |
| Human authorizes a frozen artifact | Authority is bound to that version | The artifact matches unstated intent |

### FACT

Requirements engineering has long treated validation as checking whether the
right system is being specified, while verification checks whether a formal
artifact or implementation satisfies its specification. Human stakeholder
review is part of validation, but the form and quality of that review vary.

### INFERENCE

“Human Semantic Confirmation” is a useful analytical name for an informed
review event in which the human inspects behavioral consequences rather than
syntax. It is not a new assurance theorem. Its value depends on consequence
selection, presentation, reviewer comprehension, and coverage.

### UNKNOWN

The reviewed evidence does not establish whether a confirmation event should be
one explicit yes/no decision, a set of approvals over examples, a correction
conversation, or a signed freeze with exceptions. It also does not establish
how many examples are enough for a given policy class.

## 11. Forward translation versus reverse translation

### Forward translation

```text
human text -> formal policy
```

This is addressed by autoformalization, NL2Cedar, VERIMED, recent round-trip
work, and many requirements-engineering systems. The persistent problem is
semantic faithfulness: syntactic validity and internal consistency do not prove
that the human meaning was preserved.

### Reverse translation

There are at least three different reverse operations:

1. **Paraphrase:** restate the formal policy in natural language.
2. **Formal round trip:** re-formalize that paraphrase and check equivalence.
3. **Behavioral projection:** derive cases, traces, permissions, witnesses,
   boundaries, or outcomes that may not have appeared explicitly in the source.

**FACT:** VERIMED and Faithful Autoformalization provide the first two in
formal or semi-automated form. Reflective Policy Assessment provides the third
for effective access consequences. Model checking provides witnesses and
traces for properties over formal models.

**INFERENCE:** The interesting GateSmith question is the third operation. A
paraphrase can preserve words while hiding a materially different permission
set. A behavioral projection can expose an unexpected consequence, but it is
only useful if the selected projection is relevant and understandable.

## 12. Consequence-generation mechanisms

| Mechanism | Determinism | Coverage | Human-readable output | Can expose unexpected behavior? | Human semantic confirmation in reviewed prior art |
|---|---|---|---|---|---|
| Boolean truth table | Deterministic | Exhaustive for tiny finite state | Direct and simple | Yes, within the finite domain | Often possible; GateSmith has not measured it |
| SMT model/witness | Deterministic conditional on model/solver | Targeted or property-specific | Raw model may need explanation | Yes | VERIMED uses witnesses for clarification; explicit confirmation is not its primary measured gate |
| Model-checker counterexample | Deterministic conditional on model | Property/path-specific | Trace often needs abstraction | Yes | Human diagnosis/revision is standard; comprehension is a known difficulty |
| Symbolic execution/reachability | Deterministic within tool limits | Path/state constrained; may explode | Trace/state explanation needed | Yes | Human review varies by tool |
| Policy simulation / what-if | Deterministic for fixed inputs | Sampled by chosen queries | Usually understandable | Yes, for queried cases | RPA and policy tools support forms of this |
| Effective-permission visualization | Deterministic for computed graph/state | Representative or grouped scenarios | Strong human-facing output | Yes | RPA has user-study evidence |
| Boundary-value generation | Deterministic or heuristic | Selected thresholds/edges | Usually understandable | Yes, especially off-by-one errors | VERIMED uses witnesses for ambiguous boundaries |
| Adversarial scenario generation | Often probabilistic | Sampled | Human-readable if well designed | Potentially | Human review commonly remains necessary |
| Reverse paraphrase + re-formalization | LLM-dependent translation; formal check deterministic | Depends on sampled representations | Natural-language output | Translation drift | Recent round-trip work uses equivalence, not proof of human intent |

### INFERENCE

GateSmith's truth table is valuable as a simple display for a tiny Boolean
domain, but the mechanism is a standard finite-state consequence enumeration.
Its research value, if any, would have to come from the human interaction and
measured semantic-mismatch detection, not from enumeration itself.

## 13. Scalability attack

### FACT

Exhaustive truth tables scale poorly with variables and become inappropriate for
continuous values, time, state, external facts, action sequences, exceptions,
and nested delegation. Existing formal methods respond with abstraction,
symbolic reasoning, bounded model checking, property-directed queries,
counterexamples, unsat cores, equivalence classes, representative scenarios,
and domain-specific test generation.

RPA work explicitly groups equivalent access scenarios to avoid asking users to
inspect every node. VERIMED uses targeted solver queries rather than enumerating
all device states. Model checking returns a witness for a queried property,
not a complete human-readable description of every behavior.

### INFERENCE

The general problem is not “generate the complete truth table.” It is:

> Select a sufficiently informative, low-burden set of consequences that has a
> high chance of exposing a material mismatch between human intent and formal
> semantics.

This is a consequence-selection and human-factors problem. Prior art has
partial solutions, but no reviewed source establishes a general solution for
arbitrary natural-language policies.

### UNKNOWN

There is no evidence that GateSmith's current Boolean presentation provides a
useful selection strategy beyond exhaustive enumeration in a tiny domain. There
is also no evidence that a truth table remains the best representation once the
policy leaves that domain.

## 14. Confirmation is not correctness

### FACT

Human inspection of consequences cannot prove:

- the original intent was rational or safe;
- the formalization is complete;
- unseen consequences do not exist;
- external facts and inputs are truthful;
- the policy is fair or legally sufficient;
- future states and adversarial behavior are covered;
- the implementation will execute the frozen artifact correctly.

Formal equivalence can prove equivalence under a chosen formal semantics. It
cannot prove that the semantics capture the human's unstated meaning.

### INFERENCE

Semantic round-trip can provide evidence of informed agreement with displayed
consequences. It can reduce silent mismatch and make ambiguity inspectable. It
cannot turn subjective human understanding into a machine-checkable theorem.

## 15. Comparison matrix

| System / tradition | Human NL input | Formalization | Ambiguity / formal verification | Consequences / counterexamples | Reverse explanation | Human review or correction | Explicit semantic confirmation | Freeze / execution binding |
|---|---|---|---|---|---|---|---|---|
| VERIMED | Yes, medical-device requirements | LLM to typed SMT model | Multiple formalizations, SMT equivalence, consistency, vacuity, violatability, redundancy | SMT witnesses, unsat cores, scenario entailment | Response builder and structured clarification | Manual edits, LLM clarification/repair | Not established as a distinct measured yes-this-means-what-I-intend gate | Not a production authorization/freeze system |
| Reflective Policy Assessment | User-authored privacy settings, not necessarily NL | Access-control policy and social graph | Policy analysis and effective-access computation | Effective permissions from another actor's viewpoint, what-if analysis, grouped scenarios | Visualization of what an accessor sees | User changes policy based on view; usability study | Behavioral inspection is central, but no NL formalization freeze | Domain execution is the social-network policy system |
| Classical model checking / requirements validation | Usually human-written requirements | Formal model and property | Model checking, proof, counterexample, unsat/core methods | Counterexample traces, witnesses, reachability | Explanation varies; counterexample explanation is active research | Engineer/stakeholder diagnosis and revision | Human validation is recognized, but not a universal protocol | Depends on engineering process |
| Faithful Autoformalization | Natural-language legal/traffic rules | Many-sorted formal logic | Roundtrip re-formalization and SMT equivalence; stage diagnosis | Formal divergence and repair signal | Natural-language reconstruction | LLM repair and evaluation | No evidence of human confirmation of every consequence | No execution authorization binding |
| COVER | Natural-language constraint descriptions | Typed IR and executable solver model | Solver-based mismatch search and localized repair | Symbolic witnesses and constraint diagnoses | Symbolic describer | Patch-based IR repair | Simulated test-driven checks; not a general human confirmation protocol | Solver artifact, not authorization |
| AWS AgentCore NL2Cedar | Natural-language authorization requirements | Cedar policy grounded in gateway schema | Syntax/schema validation and automated allow/deny analysis | `ALLOW_ALL`, `ALLOW_NONE`, `DENY_ALL`, `DENY_NONE`, validation findings | Findings and Cedar statement | User reviews/regenerates according to documented workflow | Official docs do not establish explicit consequence confirmation | Runtime gateway policy enforcement |
| Cedar / OPA tooling | Usually policy text and structured test inputs | Cedar/Rego | Schema validation, tests, analysis, traces depending on tooling | Query results, decisions, what-if inputs | Human-readable policy and tool output | Policy authors edit/tests iterate | Not a universal explicit semantic-confirmation gate | Runtime PDP/PEP integration |
| GateSmith Boolean MVP | Human-readable Boolean rule | Boolean AST and expression | Deterministic evaluation and truth table | Exhaustive truth table for tiny domain | Truth-table outcomes | Human reviews and confirms meaning in the project workflow | **PROPOSED/partly implemented workflow; no comparative study** | Confirmed formal artifact, then deterministic compile/execution |

## 16. GateSmith thesis attack

### Attack 1 — “Human Intent → Formal Policy is already mature prior art.”

**Supporting evidence:** Requirements formalization, autoformalization, VERIMED,
NL2Cedar, and recent round-trip systems already translate natural language to
formal artifacts and identify some semantic drift.

**Counterargument:** General human intent remains underspecified, and existing
systems differ in domain, formalism, and review workflow.

**Status: SURVIVES as a warning, not as GateSmith novelty.** The translation
problem is established and difficult; GateSmith does not own it.

### Attack 2 — “Formal Policy → consequences is mature formal-methods practice.”

**Supporting evidence:** Model-checker traces, SMT witnesses, symbolic
execution, reachability, truth tables, policy simulation, and effective
permission computation all derive consequences.

**Counterargument:** Selecting consequences that humans can use for intent
validation remains difficult.

**Status: FALSIFIED as a broad novelty claim.** The remaining question is
consequence selection and human usefulness.

### Attack 3 — “Showing consequences to humans is mature policy visualization.”

**Supporting evidence:** RPA shows effective permissions from another actor's
viewpoint and reports a user study. Access-control visualization systems show
effective access rather than only policy syntax.

**Counterargument:** Those systems may not combine LLM formalization, solver
witnesses, and a frozen formal artifact.

**Status: WEAKENED.** The human-facing principle is established; a new
combination would need comparative evidence, not a new label.

### Attack 4 — “Counterexamples already help humans validate meaning.”

**Supporting evidence:** Counterexample-guided model checking and VERIMED use
witnesses to diagnose, clarify, and repair requirements; counterexample
explanation is a mature research area.

**Counterargument:** Raw counterexamples can be cryptic, and their usefulness
depends on translation and reviewer comprehension.

**Status: SURVIVES as a usability problem.** It is not a GateSmith-specific
mechanism gap.

### Attack 5 — “Semantic round-trip is merely a new name for requirements validation.”

**Supporting evidence:** Requirements validation explicitly asks whether the
specified behavior is what stakeholders need; formal analysis and stakeholder
review are established practice.

**Counterargument:** The explicit composition of NL formalization, consequence
projection, and recorded semantic confirmation may still be under-specified in
existing engineering processes.

**Status: WEAKENED.** The term is not a novelty claim; only a precise empirical
protocol could justify further research.

### Attack 6 — “VERIMED already substantially implements the complete loop.”

**Supporting evidence:** It has NL requirements, multiple formalizations, SMT
equivalence, ambiguity witnesses, audits, counterexample-guided repair,
clarification, reverse natural-language reconstruction, and user-facing manual
edits.

**Counterargument:** The reviewed paper does not establish a separately
measured human confirmation event over selected behavioral consequences before
freezing an authorized meaning.

**Status: WEAKENED.** The mechanism is substantially covered; the remaining
distinction is narrow and empirical.

### Attack 7 — “NL2Cedar + Cedar tooling already implements the loop in practice.”

**Supporting evidence:** AgentCore provides NL-to-Cedar generation, schema
grounding, validation, analysis, findings, and runtime enforcement. Cedar/OPA
tooling supplies tests and what-if decisions.

**Counterargument:** Official documentation does not establish a systematic
scenario browser or explicit human semantic-confirmation/freeze protocol.

**Status: UNKNOWN.** The practical composition may exist in deployments, but
the reviewed primary documentation does not prove or disprove it.

### Attack 8 — “Human confirmation adds no assurance beyond existing review.”

**Supporting evidence:** Humans can misunderstand truth tables, examples, and
counterexamples; formal systems already provide stronger machine checks.

**Counterargument:** Consequence review can catch errors that syntax, internal
consistency, and model equivalence cannot catch because the human's intended
semantics are not formalized elsewhere.

**Status: UNKNOWN.** This is the central empirical question.

### Attack 9 — “GateSmith's truth-table UX is only a trivial special case of model checking.”

**Supporting evidence:** A complete Boolean truth table is exhaustive finite
state consequence enumeration; model checking and policy simulation generalize
the same idea.

**Counterargument:** Its small size may make it unusually understandable and
therefore useful for direct human semantic confirmation.

**Status: SURVIVES as a usability hypothesis only.** No measured advantage is
established.

### Attack 10 — “No distinct GateSmith research problem remains.”

**Supporting evidence:** Every major component exists in prior art, including
recent work explicitly using round-trip formal equivalence and repair.

**Counterargument:** No reviewed source establishes the same controlled human
study comparing explicit consequence confirmation against formal-only or
LLM-only alternatives.

**Status: UNKNOWN.** The mechanism-level thesis is nearly subsumed; only the
empirical human-validation question remains plausible.

## 17. Smallest surviving gap

The smallest defensible gap is:

> Does explicit human confirmation of machine-derived behavioral consequences
> materially improve detection of semantic mismatch between natural-language
> intent and a formal policy, compared with strong existing review and repair
> workflows?

This is an **empirical validation gap**, not a claim that GateSmith needs a new
schema, formal method, policy language, or architecture.

The gap is intentionally narrow:

- not natural-language formalization in general;
- not formal equivalence;
- not counterexample generation;
- not policy visualization in general;
- not authorization or execution;
- not exhaustive truth tables at scale.

### HYPOTHESIS

For small, bounded formal domains, showing selected behavioral consequences and
requiring an explicit semantic-confirmation response may help humans detect
material formalization errors that are missed by syntax validation, internal
consistency checks, solver equivalence, or LLM self-review.

### UNKNOWN

It is unknown whether the additional confirmation step improves accuracy enough
to justify its time, cognitive burden, false confidence, and scaling cost.

## 18. What this gate does not justify

This research does not justify:

- a new “semantic round-trip” schema status;
- changing `PROPOSED / UNKNOWN / CONFIRMED`;
- a new Intent Record or Authorization Boundary layer;
- a claim that human confirmation proves intent correctness;
- a claim that truth tables scale to general policies;
- a claim that GateSmith is novel because it combines known components;
- a claim that TapeOut or blockchain is relevant to this question;
- a production semantic-confirmation UI;
- product-market fit or demand for the workflow.

## 19. Minimal next experiment, only if justified

The smallest falsifiable experiment would compare human mismatch detection in a
small formal domain against the strongest existing review baseline:

1. Use real human-authored rules with intentionally ambiguous or subtly
   mutated formalizations. Do not use GateSmith production, TapeOut, Mainnet,
   or authorization actions.
2. Randomize participants across at least two review conditions:
   - formal/policy text plus ordinary validation findings;
   - the same material plus selected behavioral consequences, boundary cases,
     and an explicit “does this mean what you intend?” confirmation step.
3. Include a solver-backed baseline resembling VERIMED: ambiguity detection,
   equivalence checks, and counterexample-guided repair.
4. Measure detection of planted semantic mismatches, false acceptance of wrong
   formalizations, correction quality, time, confidence, and reviewer burden.
5. Treat the human's confirmation as an observed judgment, not proof. Preserve
   the formal artifact, displayed consequences, participant response, and
   subsequent adjudication separately.

The experiment is only a design. It is not approved or executed by this note.
It should be abandoned if the comparison cannot separate the value of explicit
confirmation from the value of simply showing better examples or counterexamples.

## 20. Final recommendation

The Semantic Round-Trip candidate is largely a recombination of mature
requirements-validation, formal-analysis, policy-visualization, and
autoformalization techniques. VERIMED and recent round-trip formalization make
the closest part of the mechanism explicit. Reflective Policy Assessment shows
that consequence-facing policy review with human users is older prior art.
AgentCore NL2Cedar shows that natural-language policy generation and automated
policy analysis are already productized.

The only defensible continuation is a tightly scoped empirical study of whether
explicit human semantic confirmation over selected consequences adds measurable
value beyond those systems. That study is not evidence of GateSmith novelty
until it succeeds against the strongest baselines.

**CONTINUE — EMPIRICAL VALIDATION GAP REMAINS**

## 21. Primary sources and evidence dates

Sources were accessed or checked on 2026-09-28.

- [Neurosymbolic Auditing of Natural-Language Software Requirements / VERIMED](https://arxiv.org/abs/2605.13817) — Hall and Eiers, 2026-05-13.
- [VERIMED HTML full text](https://arxiv.org/html/2605.13817) — methodology and experiments.
- [A Visualization Tool for Evaluating Access Control Policies in Facebook-style Social Network Systems](https://cspages.ucalgary.ca/~pwlfong/Pub/sac2012.pdf) — Anwar and Fong, SAC 2012.
- [Visualizing Privacy Implications of Access Control Policies in Social Network Systems](https://cspages.ucalgary.ca/~pwlfong/Pub/dpm2009.pdf) — reflective policy assessment and scenario grouping.
- [Faithful Autoformalization via Roundtrip Verification and Repair](https://arxiv.org/abs/2604.25031) — Amrollahi, Lopez, and Barrett, version checked 2026-09-21.
- [Faithful Autoformalization HTML full text](https://arxiv.org/html/2604.25031) — round-trip formal equivalence and repair methodology.
- [COVER: Counterexample-Guided Repair for Natural-Language Constraint Modelling](https://doi.org/10.3233/FAIA260737) — Wu et al., 2026.
- [Systematic review of counterexample explanation](https://www.sciencedirect.com/science/article/pii/S0950584921002378) — formal-methods counterexample explanation review.
- [Early validation of system requirements and design through correctness-by-construction](https://doi.org/10.1016/j.jss.2018.07.053) — requirements validation research, 2018.
- [Amazon Bedrock AgentCore policy generation and validation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-generation-validation.html) — official AWS documentation.
- [Amazon Bedrock AgentCore policy core concepts](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-core-concepts.html) — official AWS documentation.
- [Cedar Policy Language documentation](https://docs.cedarpolicy.com/) — official policy language documentation.
- [Open Policy Agent documentation](https://www.openpolicyagent.org/docs) — official policy engine documentation.
