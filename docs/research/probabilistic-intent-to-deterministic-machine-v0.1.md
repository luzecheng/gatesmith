# GateSmith Research Track 01

## Probabilistic Intent → Deterministic Machine — Research Gate V0.1

Status: research only. This document does not authorize product changes,
Mainnet writes, new circuits, or a claim that GateSmith is a general-purpose
machine-verification system.

Research date: 2026-09-25.

## Evidence basis and terminology

This review uses the frozen GateSmith repository evidence, the official
TapeKit repository/specification, official RISC-V and LLVM specifications,
CompCert's published semantic-preservation description, and the official
EIP-8141/EIP-8288 drafts.

Sources:

- [GateSmith MVP release freeze](../release/mvp-release-freeze-v0.1.md)
- [GateSmith architecture](../architecture.md)
- [GateSmith post-tapeout verification](../mainnet/post-tapeout-verification-v0.1.md)
- [TapeKit repository](https://github.com/TapeOutProtocol/TapeKit)
- [TapeKit on-chain website specification](https://github.com/TapeOutProtocol/TapeKit/blob/main/SPEC.md)
- [RISC-V ratified ISA specifications](https://docs.riscv.org/reference/isa/v20240411/unpriv/unpriv-index.html)
- [LLVM Language Reference](https://llvm.org/docs/LangRef.html)
- [CompCert semantic preservation](https://compcert.org/man/manual001.html)
- [EIP-8141: Frame Transaction](https://eips.ethereum.org/EIPS/eip-8141)
- [EIP-8288: In-mempool signature and proof aggregation](https://eips.ethereum.org/EIPS/eip-8288)
- [RISC Zero zkVM repository](https://github.com/risc0/risc0)

Labels used below:

- **FACT** — directly supported by repository or cited first-party material.
- **INFERENCE** — a conclusion that follows from facts, but is not itself an
  implemented feature.
- **HYPOTHESIS** — a proposed research direction requiring an experiment or
  proof.
- **UNKNOWN** — not established by the available evidence.

## 1. Executive conclusion

**FACT:** GateSmith V0.1 crosses a narrow, concrete boundary: an optional
probabilistic proposal may be accepted only as an untrusted structured
proposal; a human reviews it; the deterministic Boolean core parses, evaluates,
compiles, encodes, and checks the artifact; and the resulting Genesis Circuit
is evaluated locally and on X Layer with 4/4 matching results.

**FACT:** This is not yet Human Intent → Verifiable Machine in the general
case. The current system starts authoritative execution only after a user has
provided or confirmed a supported Boolean expression. It does not formally
prove that an English sentence has only one intended meaning, that a real-world
fact is true, or that a social/organizational policy was faithfully captured.

**INFERENCE:** The realistic path is staged. First define a typed, explicit
intent/specification record with uncertainty and provenance. Then prove or
test the translation from that record into a deterministic policy IR. Only
after that should a compiler target Boolean/NAND or a richer machine target be
considered. A zkVM/STARK can prove execution of a specified program, but it
does not by itself prove that the specification matches the human's intent.

**Research judgment: CONTINUE RESEARCH.** The V0.1 boundary is a credible
seed, but the missing intent-to-specification bridge is the central unsolved
problem. Do not claim a general verifiable machine until that bridge and the
compiler/execution proofs are separately closed.

## 2. Current Reality

### 2.1 What GateSmith V0.1 actually implements

**FACT:** The repository implements this path:

```text
Human rule / Boolean expression
  → deterministic parser and immutable AST
  → canonical AST text
  → complete truth table
  → deterministic NAND compilation
  → TapeOut-compatible encoded bytes and SHA-256
  → local independent NAND evaluation
  → read-only X Layer Processor.eval()
  → local versus live result comparison
```

**FACT:** The supported deterministic grammar is `NOT`, `AND`, `OR`,
parentheses, and variables `A`–`D`, with explicit AST, variable, node, gate,
and synthesis limits. The browser delegates parsing, compilation, and
evaluation to `server.py` and `gatesmith_core`; it does not reimplement the
core.

**FACT:** The AI adapter accepts only a structured proposal containing inputs,
meanings, expression, explanation, ambiguity, and warnings. It rejects
authoritative fields such as truth tables, netlist bytes, hashes, transactions,
and signatures. It adds `verified = false` and `authority = ai_proposal_only`.

**FACT:** The frozen Genesis artifact is `A AND B`, compiled to two NAND gates
and the 14-byte netlist
`0x0000000200000300000001000004`. Circuit #1 on X Layer was evaluated for all
four inputs and matched the local result 4/4.

### 2.2 Layers already crossed

| Layer | Current status | Classification |
|---|---|---|
| Natural-language proposal | Optional OpenRouter structured response | FACT |
| Proposal schema boundary | Strict JSON shape plus forbidden-field rejection | FACT |
| Human review boundary | User reviews meanings/expression before Build/Confirm | FACT |
| Formal Boolean syntax | Parser creates typed AST for a bounded grammar | FACT |
| Executable semantics | AST evaluator creates a truth table | FACT |
| Deterministic compilation | AST/truth table to NAND structure and bytes | FACT |
| Artifact identity | Encoded bytes and SHA-256 are reproducible | FACT |
| Local execution check | Independent NAND evaluation checks the artifact | FACT |
| On-chain execution check | Read-only `Processor.eval()` comparison | FACT |
| Intent correctness | English-to-Boolean faithfulness | UNKNOWN / not proven |
| Compiler correctness theorem | Machine-checked semantic-preservation proof | UNKNOWN / not present |
| General machine execution | RISC-V, REF, container, or zkVM target | UNKNOWN / not implemented |

The important distinction is that V0.1 proves a bounded artifact workflow, not
the semantic truth of the original human sentence.

## 3. Human Intent → Formal Specification

### 3.1 The actual difficulty

**FACT:** Natural language is underspecified in ways that are operationally
important: actors, predicates, time, thresholds, quantifiers, missing values,
exceptions, authority, conflict resolution, and the difference between a fact
and a request. GateSmith's own ambiguity case demonstrated that a phrase such
as “enough people” cannot safely become a threshold without additional input.

**INFERENCE:** The hard problem is not merely parsing English syntax. It is
choosing a formal model whose missing assumptions are visible and whose
meaning can be confirmed by the right human. A Boolean expression can be
perfectly compiled and still be the wrong formalization of the sentence.

**HYPOTHESIS:** A safe intent record should make unknowns first-class rather
than forcing every natural-language phrase into a Boolean value. At minimum it
needs:

- named actors and input meanings;
- predicates and their data sources;
- time window and freshness rules;
- thresholds and units;
- default, exception, and conflict behavior;
- provenance for each supplied fact or assumption;
- explicit unresolved ambiguity;
- an approval record binding a human to the exact normalized specification.

### 3.2 What AI may and may not do

**FACT:** In V0.1 AI is a proposal-only adapter and is not allowed to create
authoritative truth tables, netlists, hashes, transactions, or signatures.

**INFERENCE:** AI is appropriate for candidate extraction, paraphrase,
variable naming, ambiguity detection, counterexample generation, and asking
clarifying questions. These outputs must remain inspectable proposals.

**INFERENCE:** AI must not become authority for the final semantics, external
facts, identity/authorization, numeric thresholds, time interpretation,
compiler output, circuit identity, transaction parameters, or verification
status. A model can recommend a threshold; only an explicit user or trusted
data source can supply it.

**HYPOTHESIS:** The strongest boundary is a typed proposal protocol where
every model-supplied field is marked `proposed`, every user-supplied field is
marked `confirmed`, and missing required fields prevent compilation. This is a
research design, not a V0.1 capability.

## 4. Formal Specification and IR candidates

### 4.1 Candidate hierarchy

| Candidate | What it provides | Fit | Status |
|---|---|---|---|
| Typed Intent Record | Actors, predicates, units, thresholds, time, provenance, unknowns | Best first bridge from English | HYPOTHESIS |
| Policy IR / guarded Boolean | Explicit predicates plus conditions, defaults, exceptions, and bounded data types | Natural extension of GateSmith | HYPOTHESIS |
| LLVM-like typed SSA IR | Typed low-level transformations and analysis; LLVM documents it as an IR and bitcode representation | Useful for general software, too low-level for human intent | FACT about LLVM; INFERENCE for GateSmith |
| RISC-V program | Standard execution target and software-visible ISA | Possible machine target, but does not define intent semantics | FACT about RISC-V; UNKNOWN for GateSmith |
| Circuit/constraint IR | Explicit gates, wires, constraints, public/private inputs | Strong for proof systems and bounded execution | HYPOTHESIS |
| Cairo/RISC-V zkVM guest | General execution with a proof/receipt layer | Powerful execution proof target, not an intent language | FACT about cited systems; HYPOTHESIS for GateSmith |

**Recommendation for research, not product adoption:** define a small
versioned Intent Record and a separate Policy IR before selecting LLVM, RISC-V,
or a zkVM. The Policy IR should be closed under deterministic interpretation,
have a reference evaluator, and reject unresolved ambiguity. It should be
possible to lower the Boolean subset to the existing GateSmith core without
changing the frozen core.

### 4.2 Why not jump directly to RISC-V or zkVM

**FACT:** RISC-V specifies a software-visible instruction-set interface. LLVM
IR is a compiler representation. RISC Zero describes a RISC-V guest whose
execution produces a receipt that can be verified.

**INFERENCE:** These technologies can prove or reproduce the execution of a
formal program, but they do not answer whether “approve when enough people
agree” meant 51%, a quorum, a named set, or something else. They move the
compiler/execution boundary; they do not close the intent boundary.

## 5. Three correctness questions

### 5.1 Intent Correctness

Question: Does the formal specification faithfully represent the user's
intended rule and supplied facts?

**FACT:** GateSmith V0.1 does not prove this. It exposes meanings and requires
human review, which is a safety boundary rather than a theorem.

Possible mechanisms:

- explicit typed fields and required human confirmation;
- ambiguity and missing-value rejection;
- counterexample and scenario review;
- independent paraphrase/dual-interpretation comparison;
- signed versioned intent record;
- domain-specific review for high-impact rules.

**UNKNOWN:** No general automated test can establish that an arbitrary English
sentence matches a person's unstated intent.

### 5.2 Compilation Correctness

Question: Does the compiler preserve the formal specification's semantics?

**FACT:** V0.1 performs bounded runtime consistency checks: truth table,
NAND evaluator, encoded artifact, and regression tests. It does not contain a
machine-checked semantic-preservation theorem.

The relevant established pattern is semantic preservation: CompCert states a
theorem relating source programs and generated code, with a proved relation
between their observable behaviors. GateSmith could eventually state a much
smaller theorem for its Boolean AST, truth-table semantics, NAND semantics,
and byte encoding.

Possible mechanisms:

- executable reference semantics;
- exhaustive equivalence for bounded Boolean inputs;
- property-based and mutation testing;
- proof of compiler pass preservation in a proof assistant;
- independent decoder/evaluator and artifact round-trip checks.

**INFERENCE:** GateSmith is unusually well positioned for a small formal
proof because its current Boolean domain is finite and bounded. That would
prove the compiler layer, not the natural-language layer.

### 5.3 Execution Correctness

Question: Does the deployed machine execute the frozen artifact as specified?

**FACT:** The Genesis evidence establishes this for one X Layer Processor and
Circuit #1 by comparing all four live evaluations with the local evaluator.

Possible mechanisms:

- receipt/event and code verification;
- deterministic input/output vectors;
- on-chain read-only evaluation;
- a proof-carrying execution receipt or zkVM/STARK proof;
- replay at a pinned block and independent RPC comparison.

**UNKNOWN:** The existing evidence does not prove universal behavior for every
future Processor, Circuit, input width, opcode, or upgraded implementation.

## 6. Verification mechanisms by layer

| Layer | Minimum useful check | Stronger future check | Current GateSmith |
|---|---|---|---|
| Intent | Human review, required fields, ambiguity preservation | Formal domain model and signed approval | Partial, FACT |
| Spec/IR | Schema, type/unit checking, no unresolved values | Mechanized IR semantics | Not implemented |
| Compiler | Reference evaluator, exhaustive bounded equivalence | Semantic-preservation proof | Runtime bounded checks |
| Encoding | Canonical serialization and hash | Verified encoder/decoder theorem | Deterministic encoder + hash |
| Machine execution | Live vectors and state/receipt checks | On-chain proof verifier or execution receipt | Genesis live eval |
| Provenance | Hash-linked records and addresses | Attested build/proof chain | Manual evidence documents |

## 7. TapeOut fit

### 7.1 What the official TapeKit material actually says

**FACT:** TapeKit's current `SPEC.md` is draft v0.2 and explicitly defines
the on-chain website path on BNB Smart Chain mainnet, chain ID 56. It describes
the Processor as a circuit NFT contract, a Container as the ERC-6551 account
bound to a circuit, `SiteRegistry` as file storage keyed by container/path,
`DomainBinding` as payment/activation, and the Kernel/Shell as read/resolve/
verify/display components.

**FACT:** The spec defines file length and SHA-256 verification, multi-node
agreement, pinned blocks, pinned store implementations, Service Worker
isolation, and browser shells. It does not define GateSmith's X Layer
Boolean-to-NAND semantics.

**FACT:** TapeKit's repository contains a browser kernel, Service Worker
gateway, extension, viewer, and tests. Its quick start and mainnet constants
are BNB-specific. The spec's official website storage is not the same thing as
the X Layer Processor's `tapeout(bytes,uint32,uint32)` execution path used by
GateSmith.

### 7.2 What is and is not established for GateSmith

**FACT:** GateSmith's verified Processor and Circuit are on X Layer chain ID
196. TapeKit's documented site-store contracts and resolution rules are for BNB
chain ID 56.

**INFERENCE:** GateSmith Circuit #1 cannot be treated as a TapeKit website
Container under the current TapeKit specification merely because both systems
use the words Processor, Circuit, and TapeOut. A separate BNB-compatible
Processor/Circuit/container path would be required unless TapeKit officially
adds X Layer support and the relevant contracts.

**UNKNOWN:** Whether the TapeOut protocol has an unpublished or future bridge
that maps an X Layer Circuit to a BNB TapeKit Container. No such bridge is
established by the cited specification or the GateSmith repository.

**FACT:** TapeKit is therefore relevant as a possible future storage/viewer
layer, not as evidence that GateSmith's current X Layer Circuit is a website
container.

### 7.3 Current GateSmith architecture fit

**FACT:** Current production architecture is Browser → Python `server.py` →
`gatesmith_core` and, for live checks, `gatesmith_xlayer` → X Layer RPC. The
browser does not contain the parser/compiler/evaluator, and AI is server-side.

**INFERENCE:** The current app is not a pure static TapeKit site. The Python
process is required for deterministic Build and the existing X Layer read-only
endpoint. AI additionally requires a server-side secret and cannot be moved
to public on-chain files.

**HYPOTHESIS:** A future static adaptation could move a carefully audited,
semantics-equivalent core to browser JavaScript/WASM and call X Layer RPC from
the browser, but it would need byte-for-byte conformance tests against the
Python core, an explicit browser trust model, and a CORS/security check. It
must not be described as implemented today.

## 8. RISC-V, REF, Container, and STARK status

| Term | Current GateSmith status | Evidence classification |
|---|---|---|
| RISC-V | Not used by repository or Genesis artifact | UNKNOWN as a GateSmith capability |
| REF | No implementation or specification identified in current repo evidence | UNKNOWN; roadmap concept only if later defined |
| TapeKit Container | TapeKit-specific ERC-6551 website container on BNB | FACT for TapeKit; not GateSmith/X Layer |
| STARK/zkVM | No prover, verifier, receipt, or proof contract in GateSmith | UNKNOWN / research direction |
| TapeKit Kernel | External browser read/verify implementation | FACT for TapeKit; not integrated |
| X Layer Circuit eval | Existing read-only live execution path | FACT |

No current evidence supports saying that GateSmith already has a RISC-V
machine, REF runtime, TapeKit Container, or STARK-backed execution proof.

## 9. EIP-8141 and EIP-8288 relevance

**FACT:** EIP-8141 is a draft Ethereum core proposal for Frame Transactions,
decomposing validation, gas approval, and execution into frames. Its subject is
transaction validation/execution and fee payment, not natural-language intent
formalization or compiler correctness.

**FACT:** EIP-8288 is a draft that extends EIP-8141 with dependency frames and
recursive STARK aggregation for signatures and STARK proofs. It addresses
proof/signature aggregation in transaction and block processing.

**INFERENCE:** These EIPs may become relevant to a future GateSmith system
that submits proof-carrying actions, uses alternative validation, or aggregates
execution proofs. They do not currently provide a solution for translating
human intent into a formal rule, and they do not prove that an AI proposal is
semantically correct.

**UNKNOWN:** No evidence shows that X Layer Mainnet supports these draft EIPs,
that GateSmith integrates them, or that the TapeOut contracts use them. They
must not be used as current GateSmith capability claims.

## 10. Candidate architecture

This is a research architecture, not a production change:

```text
Human statement
  → AI candidate extraction and clarification
  → Typed Intent Record
  → human confirmation of meanings, facts, thresholds, and time
  → Policy IR with explicit unknown/error semantics
  → reference evaluator + counterexamples
  → deterministic compiler
  → execution artifact (Boolean/NAND first; richer target later)
  → machine/on-chain execution
  → independent result or proof verification
```

The authority boundary should be:

```text
AI proposes
Human confirms the formal specification
Deterministic compiler produces the artifact
Machine executes the artifact
Verifier checks execution against the artifact
```

For a future proof-carrying variant:

```text
intent_hash
spec_hash
compiler_version_hash
artifact_hash
execution_input_hash
execution_output_hash
proof/receipt
```

Each hash would identify a statement, not prove the truth of an external fact.
The exact record schema, signature model, and proof system remain UNKNOWN.

## 11. Hardest unsolved problems

1. **Intent underspecification:** detecting and resolving hidden thresholds,
   quantifiers, time, exceptions, and authority without silently inventing
   assumptions.
2. **Grounding:** determining which real-world facts are inputs, who can attest
   them, and how freshness/revocation/conflicts are represented.
3. **Specification stability:** versioning a formal policy so that a human can
   confirm exactly what will be executed.
4. **Compiler proof:** proving semantic preservation from the chosen Policy IR
   to NAND or a richer target, rather than only testing examples.
5. **Target semantics:** proving that the TapeOut opcode/Processor semantics
   match the assumed IR semantics across versions and implementations.
6. **Execution/proof economics:** making proofs, on-chain verification, and
   data availability practical without weakening the authority boundary.
7. **Governance and updates:** handling compiler upgrades, Processor upgrades,
   facts changing, and old artifacts remaining verifiable.

## 12. Minimal next research experiment

No production code or Mainnet write is required.

**Experiment: bounded Intent Record conformance study.**

1. Select 10–20 small rules in three classes: unambiguous Boolean rules,
   threshold/quantifier rules, and rules with time or external facts.
2. For each, write a human-owned gold Intent Record before viewing any model
   proposal. Include variables, meanings, thresholds, unknowns, and an explicit
   rejection condition.
3. Ask an AI to propose the record and clarification questions using a strict
   schema. Do not allow it to produce a truth table, netlist, transaction, or
   verification claim.
4. Measure: invented assumptions, omitted constraints, variable/meaning
   mismatch, ambiguity preservation, and human correction count.
5. For records that are fully confirmed and Boolean-compatible, feed only the
   confirmed expression into the existing deterministic core and compare the
   resulting AST, truth table, NAND artifact, and hash with the current core.
6. Record whether the experiment supports a stable Intent Record → Policy IR
   boundary. If it does not, stop before adding a richer machine target.

**Success criterion:** zero silently invented required parameters in the
confirmed subset, deterministic artifact equality for accepted Boolean rules,
and explicit rejection or unresolved status for the rest. This is a research
criterion, not a claim about model quality in general.

## 13. Final gate assessment

### 1. Current Reality

GateSmith has a real, bounded probabilistic-proposal-to-deterministic-circuit
demonstration. Its strongest verified boundary is after human-confirmed
Boolean semantics, not before it.

### 2. Missing Bridges

Typed intent/specification, external-fact provenance, formal Policy IR,
semantic-preservation proof, broader target semantics, and proof-carrying
execution are missing.

### 3. Candidate Architecture

Intent Record → confirmed Policy IR → reference semantics → deterministic
compiler → artifact → execution/proof verifier. Keep the current Boolean/NAND
path as the first target.

### 4. Hardest Unsolved Problems

Intent correctness and grounding are harder than compilation. A zkVM/STARK can
strengthen execution correctness but cannot solve either problem alone.

### 5. TapeOut Fit

Current X Layer TapeOut proves a useful bounded execution target for GateSmith.
TapeKit is a separate BNB website-storage/resolution/viewer system; no current
evidence establishes direct X Layer Container compatibility.

### 6. GateSmith Fit

GateSmith is a strong testbed for the deterministic half of the research and a
small, concrete place to measure the intent boundary. It is not yet a general
Human Intent → Verifiable Machine platform.

### 7. Minimal next step

Run the offline bounded Intent Record conformance study above, without changing
the product or writing to Mainnet.

### 8. Research judgment

**CONTINUE RESEARCH.**

Do not stop: the V0.1 result is a credible foundation. Do not claim GO to a
general verifiable-machine architecture: intent correctness, formal IR, and
compiler/target proofs remain open.

## 14. Explicit non-claims

This research does not claim that:

- AI can determine a user's unstated intent;
- a hash proves a real-world fact;
- X Layer Circuit #1 proves universal TapeOut semantics;
- GateSmith currently runs RISC-V, REF, a zkVM, or STARK proofs;
- EIP-8141 or EIP-8288 is supported by X Layer or GateSmith;
- TapeKit makes the current X Layer Circuit a website Container;
- a formally correct compiler makes an informal specification correct;
- the system is immutable, audited, permanently trustless, or production-safe
  for arbitrary machine control.
