# GateSmith

GateSmith turns a small human-readable Boolean rule into a deterministic,
inspectable NAND circuit and verifies a released circuit on X Layer.

## Product path

```text
Human-readable rule
  → optional AI proposal
  → human review and confirmation
  → deterministic Boolean compiler
  → truth table and NAND netlist
  → TapeOut on X Layer
  → live on-chain evaluation
```

AI interpretation is proposal-only. It may suggest an expression and input
meanings, but it is not authoritative and cannot create a truth table, NAND
topology, transaction, signature, or verified result. The authoritative path
is the deterministic compiler plus the deployed Circuit's on-chain `eval()`.

## Verified MVP

The frozen Genesis Circuit is:

```text
Rule:      Approve only when both Alice and Bob approve.
Boolean:   A AND B
Netlist:   0x0000000200000300000001000004
NAND count: 2
Live eval: 00→0, 01→0, 10→0, 11→1
```

It is deployed and verified on X Layer Mainnet (chain ID `196`):

| Evidence | Address / ID |
|---|---|
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` |
| GateSmith Processor | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| GateSmith Transistor | `0xe0f29a43d89e471f9eea723dcda9d731043f34d7` |
| CPU ID | `237` |
| Genesis Circuit | `1` |

The complete release evidence is in
[`docs/release/mvp-release-freeze-v0.1.md`](docs/release/mvp-release-freeze-v0.1.md)
and the read-only chain verification is in
[`docs/mainnet/post-tapeout-verification-v0.1.md`](docs/mainnet/post-tapeout-verification-v0.1.md).

## Public demo flow

The intended public demo is safe and read-only:

1. Enter a rule.
2. Review the Boolean expression and input meanings.
3. Inspect the complete truth table.
4. Confirm the rule locally.
5. Inspect the NAND count, encoded netlist, and hash.
6. Open the Genesis Mainnet evidence.
7. Verify the four live X Layer results.

The deployment, mint, and tapeout wallet panels are Product Owner/internal
operations. They require an explicit OKX Wallet confirmation and are not part
of the ordinary public-demo path.

## Scope and boundaries

V0.1 supports `NOT`, `AND`, and `OR`, variables `A`–`D`, parentheses, and the
current deterministic NAND compiler limits. It does not include LATCH, REF,
multiple outputs, arbitrary code, or a claim that a Circuit verifies any
real-world fact.

The AI provider is optional. Without it, the deterministic Boolean workflow
remains usable. Wallet code never handles private keys or seed phrases and
does not automatically sign or send transactions.

This project does not claim immutable contracts, permanent trustlessness,
financial returns, AI-verified truth, or verified real-world approvals.

## Run locally

Requires Python 3.11 or newer:

```bash
python3 -m unittest discover -s tests -v
python3 server.py 8765
```

Open `http://127.0.0.1:8765`. Provider credentials, if used for the optional
AI proposal path, stay server-side and are not written to the repository.

## Further evidence

- [MVP release freeze](docs/release/mvp-release-freeze-v0.1.md)
- [Hackathon requirement mapping](docs/release/hackathon-requirement-mapping-v0.1.md)
- [Post-create verification](docs/mainnet/post-create-verification-v0.1.md)
- [Post-mint verification](docs/mainnet/post-mint-verification-v0.1.md)
- [Post-tapeout verification](docs/mainnet/post-tapeout-verification-v0.1.md)
