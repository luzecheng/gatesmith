# GateSmith Research Track 01

## Case 001 + Case 002 Human Evidence Synthesis Gate V0.1

Status: research note only. This note does not modify the Intent Record,
Authorization Boundary, production code, or experiment harness.

Research date: 2026-09-26.

## 1. Evidence boundary

Two observations were made with the same participant in one task family:
creating a WeChat Channels investment-mindset video. This is stronger evidence
about this participant's workflow than Case 001 alone, but it is not evidence
of general human behavior, product validation, or a universal architecture.

The observations include statements of preference, observed AI behavior, and
human adjudication. They do not include an actual video-publication event or
proof that an external account capability was available.

## 2. Case 001 findings

### FACT

- The initial request was underspecified: “给我生成一个视频生成agent”.
- The independent AI produced 8 `CONFIRMED` items, 19 `UNKNOWN` items, and 9
  clarification questions without an obvious major silent invention.
- Human adjudication narrowed “investment-related” to investment mindset,
  including DCA and long-termism.
- The intended boundary was that the Agent must not directly publish publicly;
  the final output is reviewed by the human.
- The participant said many unresolved creative or implementation details did
  not need clarification before candidate generation.
- The participant preferred a small number of important questions, a concrete
  result, review, feedback, and iteration.

### INFERENCE

For this participant and task, many unresolved details were safe to defer while
the AI produced a reviewable candidate. The initial semantic interpretation and
the publishing boundary still mattered and were not safely left implicit.

### UNKNOWN

It is unknown whether the participant would apply the same tolerance to factual,
privacy-sensitive, financial, reputational, or irreversible tasks.

## 3. Case 002 Round 1 findings

### FACT

- The participant supplied a substantive viewpoint and requested a WeChat
  Channels script, with video generation conditional on later approval.
- The AI wrote the script without first resolving many creative details.
- The script was satisfactory to the participant.
- The participant said voice, visual type, and aspect ratio did not need to be
  asked first if the AI could generate a usable video without them.
- The participant allowed the AI to choose those details autonomously.
- The participant nevertheless required a new explicit authorization before
  video generation: “我说可以生成视频他才能去执行。”
- That authorization would cover video generation only.

### INFERENCE

The participant distinguished the quality or adequacy of a candidate artifact
from permission to perform the next production action. AI discretion over
internal details was acceptable inside the authorized task boundary; starting
video generation was treated as a new action requiring authorization.

### UNKNOWN

It is unknown whether this boundary was driven by the participant's general
authority model, the perceived cost of video generation, a desire to inspect the
script first, or simple conversational habit.

## 4. Case 002 Round 2 findings

### FACT

- The participant later instructed the AI to publish the reviewed video under
  the WeChat Channels requirements.
- The AI did not publish: it lacked the reviewed artifact and account
  capability.
- The AI proposed title, description, and hashtags autonomously.
- The participant stated that, if the reviewed artifact and account capability
  existed, direct publication of that one video after the explicit instruction
  would be acceptable.
- The participant did not intend that authorization to persist to future videos.
- Future videos would require a new publication authorization.

### INFERENCE

For this participant, authorization was object- and action-scoped rather than a
standing grant. The participant did not require human preselection of every
publication detail, but did require authorization for the publication action
itself.

The non-publication outcome demonstrates a capability/precondition failure,
not a successful authorization check and not successful execution.

### UNKNOWN

It is unknown whether the participant would impose additional constraints on
audience, caption claims, account identity, timing, or public disclosure in a
real publication flow. It is also unknown whether the participant would accept
autonomous internal details when those details materially changed public meaning.

## 5. Combined classification

### FACT

Across the two observations, this participant accepted the following local
pattern:

```text
human authorizes a bounded action
  -> AI may choose many internal implementation details
  -> AI must not infer permission for a different action
  -> a later consequential action may require a new instruction
```

The participant accepted autonomous title, description, and hashtag selection
for the authorized publication scenario, while rejecting persistent authority
for future videos. The participant also distinguished script writing, video
generation, and publication as separate action boundaries.

### INFERENCE

The smallest explanation consistent with the evidence is not that all intent
must be fully specified before execution. It is that:

1. some semantic choices are still unknown;
2. some preferences are not yet formed and can be discovered through a
   candidate;
3. some implementation choices may be left to AI inside a bounded task; and
4. permission to perform one action does not automatically authorize another
   action, even when the AI can technically perform it.

The existing separation between semantic correctness and authorization
correctness already expresses most of this. The evidence mainly requires a
more precise operational interpretation of what may remain unresolved and what
counts as a new action boundary.

### HYPOTHESIS

For some workflows, acceptable autonomy is determined less by how many details
remain unspecified than by whether the current action is authorized, bounded,
reviewable, and reversible enough for the participant. This hypothesis may
generalize, but these observations do not establish that it does.

### UNKNOWN

The observations do not establish:

- that all creative details are non-semantic;
- that human review reliably catches every material semantic mismatch;
- that an explicit instruction is always sufficient for consequential action;
- that authorization scope should always be per object and per action;
- that reversibility, cost, risk, or capability availability determine the same
  boundary for other people or domains;
- that a distinct `DELEGATED` status or architectural layer is necessary.

## 6. Existing assumptions challenged

The evidence challenges these operational assumptions:

- every unresolved choice should become a clarification question before a
  candidate is produced;
- human intent is always a complete static pre-execution specification;
- candidate quality requires preselecting every implementation parameter;
- human review of an artifact and authorization to perform a later action are
  interchangeable.

It does not challenge the semantic statuses `PROPOSED`, `UNKNOWN`, and
`CONFIRMED`. It does not challenge the existing requirement that AI cannot
create confirmation or authority. It does not challenge the Authorization
Boundary distinction between semantic assessment, exact authorization scope,
and execution disposition.

## 7. Is the current model sufficient?

### Unknown versus blocking unknown

This distinction is necessary but not sufficient as a complete explanation.
It explains why some Case 001 and Round 1 details could remain unresolved while
the AI produced a candidate, while material positioning and action boundaries
needed attention. But it does not by itself distinguish an unresolved choice
that the human intentionally leaves to AI from a choice that the human has not
yet considered, nor does it express that a new action needs new authorization.

### Optional assumption plus independent authorization

This is the smallest plausible analytical account. Treat safe creative defaults
as non-blocking assumptions or proposals, keep authorization independent, and
bind authorization to the exact current action/object. It explains the observed
workflow without adding a new status.

Its limit is important: a preference not yet formed is not automatically an
optional semantic assumption. If the choice can materially change meaning,
safety, target, or scope, it may still block the relevant action even if a
candidate draft is allowed. Likewise, autonomous detail selection is not
authority to cross an action boundary.

Conclusion: the current model is substantively sufficient if this operational
interpretation is made explicit. The evidence does not require changing the
schema or Authorization Boundary model now.

## 8. Concept assessment

| Concept | Evidence status | Classification |
|---|---|---|
| Decision authority | Required to interpret the participant's separate permissions for script, video generation, and publication. | Useful analytical concept; already partly represented by the authorization boundary. No new layer required. |
| Action authorization | Required: the participant required explicit permission for video generation and publication. | Existing model concept; evidence supports preserving it. |
| Authorization scope | Required: the publication permission applied to one reviewed video, not future videos. | Existing exact-scope principle is supported; no new schema change justified. |
| Bounded AI discretion | Required to describe autonomous voice, visual, aspect-ratio, title, description, and hashtag choices inside an authorized task. | Analytical interpretation; premature as a new status or architectural layer. |
| Iterative preference formation | Directly observed as a preferred workflow in Case 001; script review preceded later video permission in Case 002. | Useful research concept; not yet a schema field. |
| Capability/precondition failure | Required to explain why Round 2 did not publish. | Execution evidence/state, not authorization or semantic status. No schema change justified. |

The distinctions must not be collapsed:

- semantic uncertainty is about meaning or missing information;
- an unformed preference is about what the human can only judge after seeing a
  candidate;
- AI discretion is permission to choose within a task;
- action authorization is permission to perform that task/action;
- capability is whether the system can perform it;
- execution evidence is proof that it actually happened.

The evidence supports keeping these analytically separate, but not promoting
each to an architectural layer.

## 9. Competing explanations

The strongest simpler alternative is that the participant is not expressing a
general theory of authority or intent at all. They may simply prefer a normal
staged creative workflow: inspect the script before paying the cost or waiting
for video generation, then explicitly instruct the assistant to continue, and
finally explicitly request publication. On this account, the apparent
“bounded delegation” is ordinary conversational confirmation, while the lack
of persistent authorization is a natural consequence of discussing one video
at a time.

This alternative makes a large new model unnecessary. It is fully compatible
with the existing semantic statuses and authorization boundary, and explains
why internal details were delegated without implying a universal principle.

Other plausible contributors are video-generation cost, the participant's
desire to inspect intermediate artifacts, account-security expectations, and
the AI's lack of actual capability. The current evidence cannot distinguish
these explanations.

## 10. What the evidence does not justify

It does not justify:

- a new `DELEGATED` semantic status;
- changing `UNKNOWN` to mean “AI may decide”;
- treating human acceptance as persistent authority;
- treating an explicit instruction as proof of capability or execution;
- assuming that a reviewed artifact authorizes publication of future artifacts;
- assuming that title, description, or hashtags are always harmless internal
  details;
- assuming result-based review protects intent for irreversible actions;
- adding Action Authorization, Capability, Reversibility, or Iterative
  Feedback as mandatory architectural layers;
- generalizing the participant's tolerance to other users or domains.

## 11. Falsification and next evidence

The emerging interpretation would be materially weakened if further real tasks
show that the participant or another participant:

- requires most creative details before any candidate can be useful;
- treats an unresolved material claim or target as safely reviewable only after
  public exposure;
- considers authorization for one artifact to persist to later artifacts;
- expects the AI to infer publication authority from artifact acceptance;
- permits autonomous publication despite missing target, account, audience, or
  claim-boundary information;
- cannot reliably distinguish AI discretion inside an action from permission to
  initiate the action.

The most valuable next evidence would be a real task outside this video family
with the same participant or a second participant, pairing a reversible draft
with a consequential action and recording: what must be decided before a
candidate, what may be chosen inside the action, what authorization binds, and
what capability/execution evidence exists. This is a recommendation for future
research, not an experiment run in this note.

## 12. Gate recommendation

**REVISE INTERPRETATION ONLY.**

Two observations from one participant are not enough to justify a schema or
Authorization Boundary model change. They do justify tightening the research
interpretation as follows:

- not every `UNKNOWN` is operationally blocking;
- non-blocking uncertainty, unformed preference, and bounded AI discretion are
  analytically distinct even if they remain represented by existing proposal
  and assumption mechanisms;
- authorization is action/object scoped and must not be inferred from artifact
  acceptance or technical capability;
- capability failure and actual execution are separate evidence questions;
- a consequential action may require a new authorization even when internal
  details remain delegated.

Preserve the current semantic statuses and Authorization Boundary model. Seek
additional observations before proposing any structural revision.
