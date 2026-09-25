# GateSmith Hackathon Submission Evidence Freeze V0.1

Status: **frozen for Product Owner review**. This document is a submission
evidence source, not authorization for a new deployment or Mainnet write.

## 1. Official requirement basis

The official campaign requires a Processor deployed on X Layer through the
TapeOut factory, public disclosure of transistor supply and unit price, at
least one taped-out Circuit, a clear use case, and submission of the Processor
address, deployment wallet, product demo, and project description.

Sources:

- [IGNIX × X Layer campaign](https://ignix.bot/x_campaign)
- [Official submission form](https://docs.google.com/forms/d/e/1FAIpQLSd7USjG6LUNNRxwFWY4YEuSY0V0xv8VZNCl6z_-lGSl96vWZA/viewform)

The form also contains a required GitHub Repository field. It does not show
separate fields for Processor address, deployment wallet, or product demo;
those are form gaps and should be placed in the Project Description unless
the Product Owner receives different instructions from the organizer.

## 2. Requirement mapping

| Requirement | Evidence | GateSmith status | Submission value |
|---|---|---|---|
| Project Name | Frozen release and public repository | VERIFIED | GateSmith |
| Project Description | This document, README, public demo | READY | Use the full description in §7 |
| X Layer Processor | Post-create verification and receipt | VERIFIED | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| Deployment Wallet | Post-create, post-mint, and post-tapeout evidence | VERIFIED | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| Processor supply | Frozen parameters and post-create getter | VERIFIED | `10000000000` |
| Mint price | Frozen parameters and post-create getter | VERIFIED | `50000000000000 wei` (`0.00005 OKB`) |
| Mainnet Circuit tapeout | Post-tapeout receipt and Circuit ownership | VERIFIED | Circuit `1` |
| Product Demo | Live Render URL and prior browser acceptance | VERIFIED | `https://gatesmith.onrender.com` |
| GitHub Repository | Public repository | VERIFIED | `https://github.com/luzecheng/gatesmith` |
| Clear use case | Genesis rule and public demo | VERIFIED | Alice and Bob approval gate |
| Mainnet launch | X Layer Mainnet receipts and live eval | VERIFIED | Chain ID `196` |

## 3. Frozen on-chain evidence

| Item | Authoritative value | Repository source |
|---|---|---|
| Network | X Layer Mainnet, chain ID `196` | `docs/mainnet/post-create-verification-v0.1.md` |
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` | post-create verification |
| Processor | `0x40dd85697dfbba97887c6dd058d2396edd83e826` | post-create verification |
| Transistor | `0xe0f29a43d89e471f9eea723dcda9d731043f34d7` | post-create verification |
| CPU ID | `237` | post-create verification |
| Circuit ID | `1` | post-tapeout verification |
| Deployment wallet | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` | post-create verification |
| Supply cap | `10000000000` | parameter freeze and getter |
| Mint price | `50000000000000 wei` (`0.00005 OKB`) | parameter freeze and getter |
| `createCPU` | `0xb3edbbeed00b44276a38781cfbd4b7d6108fda6dffa3202cfa8721f87da00229` | post-create verification |
| NAND mint | `0xf91118e00295d7732f459010acd02c2a5c5bfd78d80880f89a452bc1ecf9699e` | post-mint verification |
| Genesis tapeout | `0x4317e6503fb7dbedf467872f28bb53f587d4b2b9373c6873d340d169e527915a` | post-tapeout verification |

## 4. Genesis Circuit evidence

| Item | Frozen value |
|---|---|
| Human meaning | Approve only when both Alice and Bob approve. |
| Boolean rule | `A AND B` |
| Normalized representation | `AND(A,B)` |
| Inputs | `2` — `A = Alice approves`, `B = Bob approves` |
| Outputs | `1` |
| NAND count | `2` |
| Encoded netlist | `0x0000000200000300000001000004` |
| Netlist length | `14 bytes` |
| Netlist SHA-256 | `8d6caeafdb7825cc5c790a214acd0c8b22cb827eb669cc67735a0d31a2f86c99` |

Truth table and live X Layer result:

| A | B | Local deterministic result | X Layer Circuit #1 | Result |
|---:|---:|---:|---:|---|
| 0 | 0 | 0 | 0 | MATCH |
| 0 | 1 | 0 | 0 | MATCH |
| 1 | 0 | 0 | 0 | MATCH |
| 1 | 1 | 1 | 1 | MATCH |

Result: **4 / 4 MATCH**.

## 5. Public product evidence

| Item | Evidence | Status |
|---|---|---|
| Public Demo | `https://gatesmith.onrender.com` | VERIFIED; `/api/health` returned `ok: true` |
| GitHub | `https://github.com/luzecheng/gatesmith` | VERIFIED; public `master` is available |
| English default | Product Owner browser acceptance and bilingual UI | VERIFIED |
| 中文切换 | Product Owner browser acceptance and bilingual UI | VERIFIED |
| Deterministic Build | Existing `/api/build` path and full test suite | VERIFIED |
| Genesis evidence | Public Genesis panel | VERIFIED |
| Live verification | Read-only X Layer `eval()` path | VERIFIED; 4 / 4 MATCH |
| AI Interpretation | Optional only | VERIFIED boundary |

The public deployment currently has no AI provider key. AI availability is not
a requirement for the core demo; deterministic Build and read-only X Layer
verification remain the product path.

## 6. Product explanation

### A. One sentence

GateSmith turns human-readable Boolean rules into deterministic NAND circuits that are inspected locally and verified live on X Layer.

### B. Short description

GateSmith turns a human-readable Boolean rule into an inspectable Boolean
expression, complete truth table, and deterministic NAND netlist. A human
reviews and confirms the meaning before a confirmed artifact can be prepared
for tape-out on X Layer. GateSmith's frozen Genesis artifact has already been
taped out as Circuit #1 and can be checked through live, read-only `eval()`
calls. AI interpretation is optional and proposal-only; it does not verify
facts, create authoritative artifacts, or replace the deterministic compiler.

### C. Full submission description

GateSmith is a verifiable rule-to-circuit workflow. A user starts with a
human-readable rule, such as “Approve only when both Alice and Bob approve.”
The application presents the Boolean meaning for human inspection and uses a
deterministic Boolean core to produce the normalized representation, complete
truth table, NAND-only netlist, encoded bytes, and SHA-256 hash. Human
confirmation remains part of the selection boundary.

For the Genesis demonstration, the rule becomes `A AND B`, compiles to two
NAND gates, and produces the frozen 14-byte netlist. That artifact was taped
out as Circuit #1 on the GateSmith Processor on X Layer Mainnet. The public
demo then performs four read-only calls to the live Circuit and compares the
results with the local deterministic evaluator: `00 → 0`, `01 → 0`, `10 → 0`,
and `11 → 1`, producing 4 / 4 MATCH.

AI interpretation is optional. When used, it is an untrusted structured
proposal that remains `verified = false` and `authority = ai_proposal_only`.
The deterministic compiler and the on-chain Circuit are the reproducible
execution path. GateSmith does not claim that AI verifies Boolean meaning,
that the Circuit verifies real-world approvals, or that the contracts are
immutable, audited, or permanently trustless.

## 7. Sixty-second judge flow

1. Open `https://gatesmith.onrender.com`.
2. Confirm the default rule and `A AND B` expression.
3. Click **Build Boolean Rule**.
4. Inspect the four-row truth table.
5. Inspect `2` NAND gates, the netlist bytes, and hash.
6. Open **GateSmith Genesis Circuit**, Circuit `#1`, on X Layer Mainnet.
7. Click **Verify on X Layer**.
8. Confirm the live table shows `00 → 0`, `01 → 0`, `10 → 0`, `11 → 1` and
   **4 / 4 MATCH**.

Steps 2–5 are **LOCAL DETERMINISTIC**. Step 7 is **LIVE X LAYER READ-ONLY**;
it sends no transaction and does not connect a wallet.

## 8. Submission architecture

```text
Human Rule
  → Optional AI Proposal
  → Human Review
  → Deterministic Boolean Core
  → NAND Netlist
  → TapeOut Circuit
  → X Layer eval()
```

AI proposes. Humans confirm. Deterministic code compiles. X Layer executes.
AI is not the authority for truth tables, netlists, hashes, transactions, or
verification state.

## 9. Known limitations

- V0.1 supports combinational `NOT`, `AND`, and `OR` rules with variables
  `A`–`D`, plus the deterministic core's complexity guards.
- AI interpretation is optional, can be unavailable or ambiguous, and is not
  authoritative.
- Live verification depends on availability of the public X Layer RPC.
- The Render free web-service tier may sleep after inactivity, so the first
  public request can have a cold-start delay.
- No independent security audit is claimed.

## 10. Submission field mapping

| Form field | Exact proposed value | Evidence source | Confidence |
|---|---|---|---|
| Project Name | `GateSmith` | release freeze / parameter freeze | HIGH |
| Project Description | Use §6.C | this freeze plus release evidence | HIGH |
| X Account | **PRODUCT OWNER INPUT REQUIRED** | official form field | UNVERIFIED |
| Telegram | **PRODUCT OWNER INPUT REQUIRED** | official form required field | UNVERIFIED |
| Contact Email | **PRODUCT OWNER INPUT REQUIRED** | official form required field | UNVERIFIED |
| GitHub Repository | `https://github.com/luzecheng/gatesmith` | public GitHub repository | HIGH |
| X Post Link | **PRODUCT OWNER INPUT REQUIRED** if submitting a post; form field is optional | official form | UNVERIFIED |

The official campaign additionally requires Processor address, deployment
wallet, product demo, and project description. The safest placement for the
first three fields, because the visible form has no dedicated inputs for them,
is the beginning of Project Description:

```text
Processor: 0x40dd85697dfbba97887c6dd058d2396edd83e826
Deployment wallet: 0x254e144269c1b42acd3fba92a7fa980b9fd4828b
Product demo: https://gatesmith.onrender.com
```

This placement is a recommendation, not an assertion about hidden form
behavior. Product Owner should confirm with the organizer if the form exposes
another submission path.

## 11. Evidence consistency audit

Checked against `README.md`, `docs/mainnet/*`, `docs/release/*`, the public
Render response, and the public GitHub branch:

| Check | Result |
|---|---|
| Processor address | PASS |
| Transistor address | PASS |
| CPU ID `237` | PASS |
| Circuit ID `1` | PASS |
| Three transaction hashes | PASS |
| Supply cap | PASS |
| Mint price | PASS |
| Genesis netlist | PASS |
| Genesis SHA-256 | PASS |
| Product claim boundary | PASS |
| Public demo / GitHub accessibility | PASS |

No address mismatch, Circuit ID mismatch, CPU ID mismatch, transaction hash
mismatch, supply or mint-price mismatch, Genesis artifact drift, or product
claim drift was found.

## 12. Freeze result

The authoritative submission facts are frozen above. Product Owner input is
still required for personal contact fields and any X post link. This document
does not submit the form and does not authorize further product or Mainnet
work.
