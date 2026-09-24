# GateSmith MVP Release Freeze V0.1

Status: **frozen for Product Owner and reviewer review**. This document
freezes the already-verified MVP evidence; it does not authorize new mainnet
writes or protocol expansion.

## 1. MVP scope

```text
Human rule
  → optional AI proposal
  → human review
  → deterministic Boolean parser/compiler
  → truth table and NAND netlist
  → manually confirmed X Layer deployment/tapeout
  → live read-only verification
```

The release demonstrates one small Boolean rule end to end. The normal public
demo should use local compilation and read-only Mainnet evidence. Processor
deployment, transistor mint, and tapeout remain explicit Product Owner/internal
operations.

## 2. Verified Genesis artifact

| Item | Verified value |
|---|---|
| Human rule | `Approve only when both Alice and Bob approve.` |
| Boolean expression | `A AND B` |
| Inputs | `A = Alice approves`, `B = Bob approves` |
| NAND count | `2` |
| Netlist | `0x0000000200000300000001000004` |
| Netlist SHA-256 | `8d6caeafdb7825cc5c790a214acd0c8b22cb827eb669cc67735a0d31a2f86c99` |
| Network | X Layer Mainnet, chain ID `196` |
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` |
| Processor | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| Transistor | `0xe0f29a43d89e471f9eea723dcda9d731043f34d7` |
| CPU ID | `237` |
| Circuit ID | `1` |
| Deployment wallet | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |

## 3. Mainnet transaction evidence

| Operation | Transaction |
|---|---|
| `createCPU` | `0xb3edbbeed00b44276a38781cfbd4b7d6108fda6dffa3202cfa8721f87da00229` |
| NAND mint | `0xf91118e00295d7732f459010acd02c2a5c5bfd78d80880f89a452bc1ecf9699e` |
| Genesis tapeout | `0x4317e6503fb7dbedf467872f28bb53f587d4b2b9373c6873d340d169e527915a` |

Read-only verification records:

- [`post-create-verification-v0.1.md`](../mainnet/post-create-verification-v0.1.md)
- [`post-mint-verification-v0.1.md`](../mainnet/post-mint-verification-v0.1.md)
- [`post-tapeout-verification-v0.1.md`](../mainnet/post-tapeout-verification-v0.1.md)

## 4. Live evaluation evidence

Circuit `1` was evaluated on X Layer with the existing adapter encoding:

| A | B | Expected | Live result |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 |

Result: **4/4 match** between the local deterministic evaluator and live
`Processor.eval()`.

## 5. Authoritative path and trust boundaries

### FACT

- The deterministic core produces the normalized expression, truth table,
  NAND netlist, encoded bytes, and hash.
- The Processor receipt, transistor burn evidence, Circuit ownership, and live
  `eval()` calls are recorded in the post-tapeout verification document.
- Mainnet writes were manually confirmed through a browser wallet. No private
  key or seed phrase is part of the repository or browser application.

### BOUNDARY

- AI output is a structured proposal only. The local boundary keeps
  `verified = false` and `authority = ai_proposal_only`.
- AI does not define authoritative truth tables, netlists, hashes, artifacts,
  transactions, or signatures.
- Human confirmation is required before a local artifact is treated as the
  selected demo artifact.
- The on-chain Circuit verifies encoded circuit behavior, not the truth of
  Alice's, Bob's, or any other real-world approval.

## 6. Known limitations

- V0.1 is limited to the supported `NOT`, `AND`, `OR` grammar, variables
  `A`–`D`, and the deterministic core's safety limits.
- LATCH, REF, multiple outputs, arbitrary code, and broader protocol features
  are explicitly outside this freeze.
- The current wallet panels are safe manual-operation tools, not a public
  permissionless mint/tapeout product.
- Factory/Processor/transistor upgrade and administration boundaries are not
  an independent protocol audit; the system must not be advertised as
  immutable.
- The AI interpretation path can be unavailable or ambiguous. The local
  deterministic workflow remains the fallback.
- The current evidence proves the Genesis instance and its behavior. It does
  not prove universal semantics for every future Processor or Circuit.

## 7. Explicit non-claims

GateSmith does not claim:

- immutable contracts or permanent trustlessness;
- AI-verified Boolean meaning;
- verification of real-world facts or human approvals;
- financial returns, investment value, governance rights, or price support;
- that one successful Genesis Circuit proves all future protocol behavior;
- that a demo user should perform a Mainnet write.

## 8. Public demo information architecture

```text
Enter Rule
  → Review Boolean and meanings
  → Inspect Truth Table
  → Confirm locally
  → Inspect NAND Circuit and hash
  → Open Mainnet Evidence
  → Verify Genesis Circuit live
```

The Evidence panel should expose copyable explorer links for the Processor,
Circuit ID, and the three transaction hashes, plus the frozen netlist, hash,
truth table, and 4/4 live result. Write controls belong behind an Advanced /
Product Owner boundary.

## 9. Freeze rule

The Genesis netlist, hash, Circuit ID, Processor, Transistor, and recorded
transaction evidence are frozen for this release. No new mainnet write,
additional Circuit, protocol feature, or deterministic-core redesign is part
of V0.1.
