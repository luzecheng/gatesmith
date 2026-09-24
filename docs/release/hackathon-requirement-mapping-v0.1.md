# GateSmith Hackathon Requirement Mapping V0.1

This mapping uses only the requirements saved in the repository's
`docs/product/processor-transistor-design-v0.1.md` section `Hackathon
alignment`. It does not independently re-research or assume external rules.

| Saved requirement | GateSmith evidence | Verification method | Status |
|---|---|---|---|
| Processor deployed through the TapeOut factory on X Layer | Factory, Processor, CPU ID 237, and `createCPU` transaction | Receipt, code/getter checks, post-create verification | VERIFIED |
| Supply, unit price, and any cap publicly disclosed | Frozen deployment parameters and post-create getters: `supplyCap = 10000000000`, `mintPrice = 50000000000000 wei` | Parameter-freeze and post-create evidence | VERIFIED for disclosure; exact universal cap semantics are not claimed |
| At least one Circuit taped out on the Processor | Genesis Circuit #1 and tapeout transaction | Receipt logs, Circuit ownership, post-tapeout verification | VERIFIED |
| Clear use case | “Approve only when both Alice and Bob approve.” → `A AND B` | Public rule, truth table, deterministic artifact, live eval | VERIFIED for the demonstrated use case |
| Submission includes Processor contract, deployment wallet, product demo, and project description | Public addresses, release docs, local UI, README, product/design docs | Repository inspection | UNVERIFIED for completion of any external submission package |
| Judging considers asset issuance design | Processor/transistor economic design and frozen parameters | Product economics evidence plus disclosed non-investment boundary | PARTIAL: evidence exists; no independent protocol audit claim |
| Judging considers X Layer integration | Mainnet deployment, mint, tapeout, and live `eval()` | Transaction receipts and 4/4 live comparison | VERIFIED |
| Judging considers contract security/economic model | Trust-boundary documents, payment/supply research, explicit limitations | Release and mainnet evidence docs | PARTIAL: implementation evidence is not a full security audit |
| Mainnet launch is required | X Layer Mainnet chain ID 196 and successful Genesis loop | On-chain receipts and live verification | VERIFIED |
| Evaluation is not based on trading volume or asset price alone | Product docs define transistor as a manufacturing/public-infrastructure resource, not an investment asset | Product boundary review | VERIFIED as GateSmith product position; not a claim about judging outcome |

## Coverage summary

The core deployment, X Layer integration, Circuit creation, use-case demo,
and Mainnet launch evidence are verified. External submission completion and
full protocol/security-audit coverage remain unverified or partial and should
be disclosed as such.
