# GateSmith Research Track 05

## Semantic Confirmation Experimental Design Gate V0.1

Status: research design only. This note does not implement or execute an
experiment, modify GateSmith production, modify the Intent Record or
Authorization Boundary, modify a harness, use TapeOut or Mainnet, collect
participant data, commit, or push.

Design date: 2026-09-28.

## 1. Purpose and evidence boundary

The previous Semantic Round-Trip Prior-Art Gate was approved, committed, and
frozen with the outcome:

**CONTINUE — EMPIRICAL VALIDATION GAP REMAINS.**

That outcome did not establish GateSmith novelty. Prior art substantially covers
natural-language formalization, formal analysis, witnesses and counterexamples,
reverse translation, behavioral policy visualization, and human-facing policy
review.

This note designs one experiment for the narrower question:

> Does explicit human confirmation of machine-derived behavioral consequences
> materially improve detection of semantic mismatch between human intent and a
> formal machine meaning, compared with strong existing review and repair
> baselines?

The design remains valid if the answer is no, or if the treatment harms
performance. It is not a product specification and does not assume that a
GateSmith implementation should be used.

## 2. Hypotheses and estimands

### H1 — benefit hypothesis

For bounded formal-policy tasks, reviewing selected machine-derived behavioral
consequences plus making an explicit semantic-confirmation judgment improves
participants' ability to distinguish materially mismatched formalizations from
correct formalizations, relative to strong existing review baselines.

### H0 — null hypothesis

The treatment produces no practically meaningful improvement over strong
existing review baselines.

### H2 — harm hypothesis

The treatment reduces performance or calibration through cognitive burden,
anchoring, automation bias, false reassurance, misleading consequence
selection, or excess time.

### Primary estimand

The primary estimand is the between-condition difference in participant-level
mismatch-detection performance, reported as balanced accuracy and false-
acceptance rate for incorrect formalizations. A mismatch is detected only when
the participant rejects the incorrect formalization or identifies the material
semantic defect according to the prespecified scoring rule.

The primary analysis must report effect size and confidence interval, not only a
p-value. Greater confidence or preference is not evidence of correctness.

### Practical significance

The minimum practically meaningful improvement is **UNKNOWN** before pilot
data. It must be fixed before the confirmatory sample is recruited. A small
pilot may estimate variance, task difficulty, completion time, and a defensible
minimum effect. The pilot must not be used to select a favorable endpoint or
rewrite failure criteria.

## 3. What is being tested

The study separates five possible contributions:

1. ordinary review of natural-language intent and formal policy;
2. a natural-language paraphrase of the formal policy;
3. machine-derived behavioral consequences;
4. boundary cases, witnesses, or counterexamples;
5. an explicit question requiring the participant to judge whether the displayed
   machine meaning is what they intended.

“Semantic confirmation” means item 5 only. Seeing more examples is not itself
evidence that confirmation added value.

The cleanest design is a three-condition comparison:

| Condition | Information shown | Required response |
|---|---|---|
| A: policy review | Original intent, formal policy, ordinary syntax/schema/validation findings, and a neutral paraphrase | Accept or reject the formalization and explain any defect |
| B: consequence review | Everything in A, plus prespecified behavioral consequences, boundary cases, and relevant solver witnesses/counterexamples | Accept or reject and explain any defect, then complete a neutral attention-matched review prompt |
| C: consequence confirmation | Everything in B, plus an explicit structured judgment: “Do these consequences represent what you intend?” | Confirm/reject the displayed meaning, then accept/reject and explain any defect |

Condition A is the ordinary-review baseline. Condition B measures the value of
consequence information. Condition C measures the incremental value of an
explicit confirmation step after consequence information is already present.

If burden or power requirements make three conditions infeasible, the minimum
defensible design is A versus C, but that cannot separate consequence display
from explicit confirmation. That limitation must be declared before execution.

The conditions must be matched for domain facts, policy length, interface
quality, response time budget, and available explanatory information as far as
possible. Condition C must not receive privileged hints about which case is
defective.

The neutral prompt in B must be matched to C in screen position, response
format, approximate reading time, and required action. It may ask the participant
to select which displayed consequence was easiest to understand or to restate a
neutral factual detail. It must not ask whether the policy is correct, indicate
which case matters, or require a semantic judgment. This controls for the
possibility that C wins merely because participants are forced to think one
more time or perform one more review action. If pilot evidence shows that the
neutral prompt is itself semantic, it must be replaced before execution under a
preregistered rule.

## 4. Independent human-intent gold standard

The principal validity risk is circularity. The same AI must not invent the
intent, generate the formalization, inject the mismatch, select the suspicious
consequence, and adjudicate the participant's answer.

The gold-standard process is:

    human-authored task intent
      -> independent clarification before candidate exposure
      -> frozen intent record and operational semantic oracle
      -> separately generated correct and mutated formalizations
      -> independently derived displays
      -> participant judgment
      -> blinded adjudication against the frozen oracle

### 4.1 Intent authoring

Each task begins with a human-authored natural-language requirement. The author
answers a short clarification protocol before seeing any candidate policy.
Clarification may ask about actors, objects, thresholds, time, state, defaults,
exceptions, and examples necessary to make behavior scoreable.

The clarification transcript and answers are frozen before candidate
formalizations are generated. The author may not revise the original meaning
after seeing a formalization during gold-standard construction.

At least two independent adjudicators, who do not see candidate labels or
participant responses, translate the clarified intent into a machine-checkable
gold semantic specification. Disagreements are resolved by a third adjudicator
or a prespecified consensus procedure. The original language, clarification
record, gold specification, and disagreement record are retained.

### 4.2 Preference formation

Some preferences emerge only after seeing examples. That is a different
construct from detecting whether a pre-existing requirement was preserved. The
primary study therefore uses tasks whose relevant semantic choices are fixed
before candidate exposure.

Preference formation may be measured separately in an exploratory module:
participants may revise an intentionally underspecified requirement after
seeing consequences. Such revisions must not be scored as detection of a
pre-existing mismatch or enter the primary endpoint.

### 4.3 Information-flow boundary

Gold is available for item construction, validation, scoring, and adjudication,
but is blocked from runtime treatment generation. The separation is:

    GOLD ORACLE
      |-- item construction and mutation validation
      |-- blinded scoring and adjudication
      |
      X  no runtime access to candidate generation or consequence selection

    CANDIDATE GENERATOR
      inputs: original human-language request, frozen clarification context,
              task-domain schema, and its own formalization method
      outputs: a candidate formal policy and ordinary validation findings

    CONSEQUENCE SELECTOR
      inputs: candidate formal policy, original human-language request when the
              proposed workflow would have it, policy structure, thresholds,
              branches, state variables, generic boundary-analysis rules,
              and candidate-only solver/model-checker analysis
      outputs: a fixed-budget consequence display
      forbidden: gold policy, gold behavior, correctness labels, mutation
                 labels, participant responses, or post hoc adjudication

    PARTICIPANT
      sees: assigned condition's frozen request, candidate, diagnostics,
            paraphrase, and—only in B/C—the selector's display

    ADJUDICATOR
      sees: frozen gold oracle, candidate, raw participant response, and
              condition-independent scoring materials
      does not see: treatment-generation prompts or hidden condition labels
              until the scoring rule is applied

The candidate generator and consequence selector are run as separate blinded
stages. The selector receives an unlabeled candidate artifact and cannot query
the gold store. Correct and mutated candidates are processed by the same
procedure without correctness labels. Gold-versus-candidate comparison occurs
only in the offline scoring and validation path. Logs must record the inputs
available to each stage so leakage can be audited.

## 5. Task domain and mismatch construction

### 5.1 Smallest credible first domain

The first experiment should use bounded authorization and workflow rules over
small finite domains, not DeFi, blockchain, agents, or real-world execution.
Examples may involve a principal, resource, action, threshold, time window, and
state variable. Each task must be understandable without specialized security
or programming knowledge.

This domain is preferable because an independent semantic oracle can be
constructed, correct and incorrect policies can be checked exhaustively or
with a trusted finite evaluator, consequences can be derived deterministically,
and mismatches can be scored without an LLM judge.

### 5.2 Mismatch-family selection principles

Mismatch families are selected before participant responses are observed. Each
family must satisfy all of the following:

- the candidate formalization is syntactically valid;
- it is internally coherent under its own semantics;
- it could plausibly arise from natural-language ambiguity, omission, or
  formalization error;
- it changes at least one materially relevant behavior;
- the defect is not revealed by typography, labels, formatting, or an obvious
  “wrong” marker;
- the task has a separately established gold interpretation;
- a correct-formalization counterpart is included where feasible.

Candidate families for review, not a final task list, include:

- conjunction versus disjunction;
- inclusive versus exclusive threshold;
- < versus <=;
- current balance versus initial balance;
- per-action limit versus cumulative limit;
- actor or resource scope confusion;
- omitted exception;
- temporal boundary or expiry interpretation;
- default allow versus default deny;
- nested-condition precedence;
- state-dependent behavior.

The final set should include multiple families and matched correct cases. It
must not consist only of Boolean mistakes that make exhaustive truth tables
unusually powerful. At least some tasks should require interpreting state,
thresholds, or exceptions so that reasonable examples can look correct while
an undisplayed case remains wrong.

### 5.3 Mismatch severity

Each mutation is classified before execution as material or non-material
against the gold oracle. A material mismatch changes a predefined consequential
decision, such as allowing an unauthorized actor, exceeding a limit, allowing
an expired action, or denying a required permitted action. Non-material changes
are excluded from the primary endpoint but may be used for calibration.

Mutations are generated independently of the treatment display. The person or
system creating a mutation must not choose consequences after inspecting the
gold answer or predicted participant difficulty.

## 6. Consequence-selection protocol

Consequence selection is a major source of treatment bias. The display protocol
must be frozen before participant responses and must not be hand-tuned per item
after seeing the intended answer.

### 6.1 Prespecified selection rules

For each formalization, an independent selector computes a candidate pool from
the candidate itself and the information available in a realistic review
workflow. The selector may use:

- the original human-language request, if the proposed workflow has it;
- the candidate formal policy and its syntax/schema;
- policy structure, branches, thresholds, state variables, and declared
  domains;
- generic boundary-analysis and representative-case rules frozen in advance;
- solver/model-checker analysis of the candidate alone;
- prior-art scenario-selection methods that do not require a reference oracle.

The selector must not use the gold semantic specification, gold behavior,
candidate-versus-gold comparison, correctness or mutation labels, participant
responses, or post hoc adjudication. It does not know whether its input is the
correct or mutated candidate.

The same frozen procedure is applied to correct and incorrect candidates:

1. derive candidate-only witnesses, counterexamples, or representative cases
   from the formal policy and its declared domain;
2. apply generic threshold and temporal boundary rules to candidate-visible
   thresholds and branches;
3. include at least one candidate-derived permitted and one candidate-derived
   denied case when the domain supports both;
4. include a short candidate-derived state transition or sequence when the
   policy is stateful;
5. remove duplicate or semantically equivalent cases using candidate-only
   information;
6. cap the display at a fixed number chosen before execution;
7. order cases by a fixed rule or randomized order independent of correctness.

The same budget and selection algorithm applies to correct and incorrect
formalizations. A witness that happens to expose a mismatch is allowed only
because the candidate-only procedure found it; the selector is not told that it
is distinguishing relative to gold. The study records whether each displayed
case was generated from the candidate, the request, or a generic rule.

### 6.2 Existing mechanisms over a GateSmith heuristic

The study should use a trusted finite evaluator, model-checker, solver, or
prior-art scenario-selection method operating on the candidate alone where
available. It should not invent a GateSmith-specific heuristic merely to
improve treatment performance. If a method normally compares a candidate with
a specification, it is not eligible for runtime treatment generation unless
that specification is part of the information a real workflow would provide
and is not the hidden gold oracle.

The display generator is an experimental instrument, not a product claim. Its
selection configuration must be frozen before data collection and independently
checked against the protocol.

### 6.3 False-reassurance cases

Some adversarial items must have displays that are compatible with the gold
intent while an undisplayed material mismatch remains. Item designers may use
the gold oracle offline to validate that this property holds before freezing
the item, but the runtime selector must not use the gold oracle to create or
choose the display. This tests whether participants infer unjustified global
correctness from a small sample.

The analysis separately reports detection of displayed mismatches, detection of
undisplayed mismatches, false acceptance after reassuring cases, and confidence
conditional on a wrong acceptance.

## 7. Participants and assignment

### 7.1 Initial population

The narrowest useful first population is technically literate adults who can
read simple conditional rules but are not required to be security or formal
methods specialists. A later study may examine policy authors or security
professionals separately. Results from one population must not be generalized
to others.

Inclusion criteria should include language comprehension, basic ability to read
examples and inequalities, and informed consent. Record prior exposure to
authorization policy, formal logic, model checking, and LLM tools as covariates,
not as automatic exclusion criteria.

### 7.2 Design choice

A mixed design is preferred:

- between-subject assignment to interface condition to reduce contamination and
  demand effects;
- multiple tasks per participant to improve precision;
- task order and mismatch family balanced across participants;
- independent randomization of task variants and condition assignment.

If a within-subject design is required, use Latin-square or counterbalanced
order, distinct difficulty-matched task sets, and a script that does not imply
that every item contains an error. The analysis must model participant and item
effects.

### 7.3 Sample size

No fixed sample size is justified by current evidence because effect size,
within-participant correlation, item difficulty, and variance are unknown. A
pilot may estimate these quantities and test comprehension and completion time.
The confirmatory sample size must then be determined by a preregistered power
or precision analysis for the primary endpoint, accounting for participant and
item clustering.

The pilot must not be merged into the confirmatory test merely because it gives
the desired direction.

## 8. Blinding and experimenter leakage

Full blinding is impossible because participants can see whether consequences
and a confirmation prompt are present. Partial blinding is practical:

- use neutral labels such as Interface A, B, and C;
- do not mention GateSmith, the hypothesis, or the expected winning condition;
- tell participants that both correct and incorrect formalizations occur;
- keep layout, typography, response time, and explanation affordances matched;
- do not highlight a candidate clause or consequence as suspicious;
- randomize the order of displayed cases;
- have adjudicators score responses without condition, mutation, or participant
  identifiers;
- have the analyst receive encoded condition labels until the primary analysis
  script is frozen.

The facilitator uses a scripted explanation and may clarify interface operation
but not policy meaning. Deviations are logged.

## 9. Procedure

For each item:

1. show the frozen natural-language intent and task context;
2. show the assigned interface's formalization and permitted diagnostics;
3. allow a fixed review period or record time until decision under a rule fixed
   before execution;
4. collect accept/reject, defect category, free-text rationale, confidence,
   and optional clarification request;
5. in condition B, collect the neutral attention-matched review response;
6. in condition C, collect the explicit consequence-confirmation judgment
   before the final accept/reject decision;
7. optionally ask participants to repair the formalization separately;
8. administer a short comprehension check on selected displayed consequences;
9. collect workload and usability measures only as secondary outcomes.

The primary response is the participant's judgment at the prespecified
decision point. Post-decision explanations may help adjudication and mechanism
analysis but must not retroactively change the primary response.

## 10. Outcome definitions

### 10.1 Primary outcomes

- **Mismatch detection:** rejection of an incorrect formalization with a defect
  sufficiently mapped to the gold mismatch category.
- **False acceptance:** acceptance of an incorrect formalization as matching the
  intent.
- **Balanced detection accuracy:** the average of sensitivity to material
  mismatches and specificity for correct formalizations.

The primary outcome is analyzed at item level with participant and item effects,
or with a prespecified clustered alternative if the sample cannot support a
mixed model.

### 10.2 Secondary outcomes

- false rejection of a correct formalization;
- correction quality against the gold semantic oracle;
- detection of displayed versus undisplayed mismatches;
- time to decision;
- confidence and confidence calibration;
- comprehension of displayed consequences;
- number and quality of clarification requests;
- perceived workload and interface burden.

Stated preference and “I liked the interface” are not correctness outcomes.

### 10.3 Scoring free-text responses

Two blinded adjudicators independently code rationales and repairs against a
prespecified rubric:

- correct rejection with correct defect;
- correct rejection for an unrelated reason;
- correct acceptance;
- false acceptance;
- false rejection;
- uncertainty or request for more information.

Disagreements are retained, reported, and resolved by a third adjudicator only
under the frozen rule. Raw responses are preserved. An LLM may assist coding
only as a non-authoritative aid and must not be the sole judge of correctness.

## 11. Statistical and decision plan

The preregistration specifies:

- primary endpoint and analysis population;
- condition contrasts, with C versus B as the incremental confirmation test;
- A versus B as the consequence-display test;
- participant and item random effects or the selected clustered alternative;
- covariates selected before analysis;
- handling of incomplete items and withdrawals;
- exclusion rules based only on predeclared comprehension or data-integrity
  criteria;
- confidence intervals and effect-size estimates;
- multiplicity handling for secondary outcomes;
- no endpoint switching after results are visible.

The interpretation is estimation-first. A positive result requires a confidence
interval compatible with a practically meaningful benefit on the primary
endpoint, not merely nominal significance. A harm analysis examines false
acceptance, false confidence, time, and workload.

Stopping rules are fixed before execution. Unless safety or data-integrity
issues require termination, do not stop for a favorable interim trend.

## 12. Failure criteria and interpretation

The following categories are fixed before results are seen:

### SUPPORTED

The prespecified C versus B contrast shows a practically meaningful improvement
in primary mismatch detection, with no unacceptable increase in false
acceptance, false confidence, burden, or time. The result survives prespecified
sensitivity analyses and is not explained solely by an information imbalance.

This establishes only that the tested procedure improved the tested bounded
task performance relative to the tested baselines. It does not establish
general human behavior, GateSmith novelty, safety, product value, or
scalability.

### WEAKENED

The treatment produces a small, inconsistent, domain-specific, or imprecise
effect; the effect is explained mainly by consequence display rather than
confirmation; or it appears only on trivial Boolean items.

### NOT SUPPORTED

There is no practically meaningful improvement over the strongest baseline, or
the confidence interval excludes the prespecified meaningful benefit. Equal or
better performance by B shows that consequences may matter while explicit
confirmation adds no incremental value.

### HARMFUL

The treatment materially increases false acceptance, false confidence, or
unacceptable burden/time, or produces lower primary performance than the best
baseline. A benefit on displayed mismatches does not offset harm on undisplayed
mismatches or overall calibration.

The experiment must not rescue a failed hypothesis by redefining confirmation,
removing hard items, changing the primary endpoint, or claiming that any
positive secondary result proves the mechanism.

## 13. Alternative explanations and controls

| Alternative explanation | Control or analysis |
|---|---|
| Examples alone help | Compare B with A; C versus B isolates confirmation |
| Counterexamples alone help | Include the same solver-derived witnesses in B and C |
| More information helps | Match display budget, record content, and information categories |
| More review time helps | Fix time limits or model time explicitly |
| Natural-language paraphrase is better | Include the same neutral paraphrase in all conditions |
| Boundary cases are useful | Treat them as part of B and C, not unique confirmation content |
| Better UX causes the effect | Match layout and run comprehension/workload checks |
| Participants infer every item is wrong | Include matched correct cases and tell all conditions both types occur |
| Confirmation creates demand characteristics | Use neutral wording and compare B versus C |
| Treatment display is cherry-picked | Freeze a common selection algorithm and audit it |
| AI-generated items are biased | Independently author and adjudicate items; apply a frozen contamination rule |
| More review effort causes the effect | Record time and burden; do not give C unstructured extra time |

If information quantity or time cannot be controlled adequately, the study must
report that causal limitation rather than attribute C versus A to confirmation.

## 14. Preregistration freeze

The following artifacts must be frozen before participant exposure:

- hypotheses, estimands, and practical-effect threshold;
- participant population, recruitment criteria, and assignment;
- task text and independent clarification records;
- gold semantic specifications and adjudicator disagreements;
- correct formalizations and mismatch mutations;
- matched correct cases and false-reassurance cases;
- condition interfaces and neutral labels;
- consequence-generation and selection rules;
- display budget, ordering, and time limits;
- response fields and scoring rubric;
- primary and secondary endpoints;
- exclusion and missing-data rules;
- statistical model, multiplicity plan, and stopping rules;
- failure criteria and interpretation categories;
- facilitator script and blinding protocol.

The frozen package should be content-addressed or otherwise versioned. Any
post-freeze change requires a dated amendment distinguishing planned analysis
from exploratory analysis.

## 15. Independent adjudication and data custody

The formal gold oracle must be established before candidate exposure by people
independent of the candidate generator. Deterministic finite-domain comparison
should score action outcomes wherever possible. Semantic disputes that cannot be
reduced to deterministic comparison require independent human adjudication with
preserved disagreement.

The candidate-generating model must not be the sole source of the gold
interpretation, mismatch label, consequence-selection decision, participant
score, or final conclusion.

Raw participant responses, timestamps, condition assignment, displayed
consequences, formal artifacts, gold artifacts, adjudicator records, and
analysis inputs must be preserved separately. The analysis dataset should use
stable anonymous identifiers and a clear chain from item version to displayed
content.

## 16. Threats to validity

### Construct validity

Mismatch detection may measure rule-reading skill rather than semantic
confirmation. Use comprehension checks, multiple mismatch families, and matched
correct cases. A post hoc preference is not pre-existing intent.

### Internal validity

Information imbalance, learning, item difficulty, demand characteristics,
experimenter leakage, and condition contamination can create spurious effects.
Use randomization, counterbalancing where needed, neutral labels, fixed scripts,
matched content, and blinded adjudication.

### External validity

Simple finite rules do not represent all natural-language requirements,
stateful workflows, or professional authorization tasks. Results apply only to
the tested population and domain.

### Ecological validity

Short items may not reproduce the time pressure, ambiguity, stakes, and
iterative review of real policy authoring. A positive result justifies a
follow-up field-like study; it does not prove deployment value.

### Automation bias and false confidence

Participants may trust polished displays or assume the system selected the
right cases. False-reassurance items, confidence calibration, and undisplayed
mismatch scoring are mandatory.

### Selection and recruitment bias

Volunteers interested in AI or formal methods may be unusually receptive to the
treatment. Record recruitment source and prior knowledge and do not generalize
beyond the sample.

### AI-generated-item bias and contamination

LLM-generated tasks may contain unnatural errors or leak labels through wording.
Use independent human review, adversarial quality checks, matched correct cases,
and exclude contaminated items only under a preregistered rule.

### Consequence-selection bias

Selecting witnesses after seeing the desired conclusion can make the treatment
look stronger than a real system. Freeze the selection algorithm, apply it to
all conditions as specified, and audit every displayed case before execution.

## 17. Relationship to GateSmith

GateSmith is only the source of the research question. The experiment remains
meaningful if the name “GateSmith” is removed.

The study must not require Boolean-to-NAND compilation, TapeOut or blockchain,
wallets, authorization actions, financial assets, production code, or the
existing harness. If a later implementation uses GateSmith artifacts, that is
a separate instrumentation decision and must not change the preregistered task
or independent scoring process.

## 18. Smallest credible first experiment

The recommended first study is a bounded, preregistered, three-condition human
review experiment over finite authorization/workflow rules, with independently
authored intents, independently frozen gold semantics, matched correct and
mutated formalizations, and deterministic consequence derivation.

It is preferable to a larger agent, DeFi, blockchain, or production study
because those settings add execution, financial, authorization, and product
confounds without improving the central causal test. The smallest study that
can falsify the hypothesis must still distinguish policy review from
consequence display, consequence display from explicit confirmation, displayed
defects from false reassurance about undisplayed defects, and pre-existing
intent from preference formed during review.

If those distinctions cannot be maintained with the available sample or task
set, the study is not credible and should not be executed.

The design can still falsify H1. If B outperforms A but C does not outperform B,
the data support consequence review without an incremental confirmation effect.
If C performs no better than the strongest baseline, H1 is not supported. If C
increases false acceptance, false confidence, or burden enough to offset any
detection benefit, H2 is supported or the treatment is harmful. Because the
runtime selector never sees gold, any observed effect cannot be attributed to a
hidden gold-guided witness generator; it remains a comparison of realistic
candidate-only consequence generation plus the confirmation interaction.

## 19. What a positive result would and would not establish

### It could establish

For the tested bounded domain, population, interfaces, and consequence-selection
protocol, explicit semantic-confirmation judgments may improve or impair human
detection of formalization mismatches relative to the measured baselines. It
could also identify whether any benefit comes from consequences, confirmation,
or their interaction.

### It would not establish

- that human intent is complete or rational;
- that every important consequence was displayed;
- that a formal policy is globally correct or safe;
- that external facts are truthful;
- that execution or authorization is correct;
- that the mechanism is novel;
- that GateSmith has product-market fit;
- that truth tables scale beyond bounded domains;
- that any schema or architecture should change.

## 20. Decision gate for this design

This note is a design artifact only. It does not approve execution. Independent
review should return it if the final protocol lacks an independent gold intent,
uses a weak baseline, confounds consequences with confirmation, permits
post-hoc consequence selection, or cannot produce a falsifiable outcome.

**APPROVE EXPERIMENTAL DESIGN**
