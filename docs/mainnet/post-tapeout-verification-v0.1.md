# GateSmith Genesis Circuit — Post-Tapeout Verification V0.1

Read-only verification of the Genesis Circuit tapeout and live evaluation. No
new mainnet write, mint, tapeout, signature, production-code change, or commit
was performed.

## FACT — transaction and receipt

| Field | Verified value |
|---|---|
| Network | X Layer Mainnet |
| Chain ID | `196` (`0xc4`) |
| Transaction | `0x4317e6503fb7dbedf467872f28bb53f587d4b2b9373c6873d340d169e527915a` |
| Block | `0x442fbca` = `71498698` |
| `from` | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| `to` | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| Receipt status | `0x1` — success |
| Transaction value | `1300000000000000 wei` |
| Gas used | `0x3b076` = `241782` |
| Effective gas price | `0x1312d01` = `20000001 wei` |
| Actual gas cost | `4835640241782 wei` |
| Total actual transaction cost | `1304835640241782 wei` |

## FACT — actual tapeout calldata

The transaction uses `tapeout(bytes,uint32,uint32)` with selector
`0x7bd3ac1d`.

```text
netlist: 0x0000000200000300000001000004
inputs: 2
outputs: 1
msg.value: 1300000000000000 wei
```

Exact transaction calldata:

```text
0x7bd3ac1d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000e0000000200000300000001000004000000000000000000000000000000000000
```

The calldata is 164 bytes and its SHA-256 is:

```text
b22cd0fdd965c312fe38fbd8950945c4f4606b718d58870d52e6c52f600e74da
```

It matches the frozen tapeout packet exactly.

## FACT — transistor consumption

Receipt log `TransferSingle` emitted by the GateSmith Transistor records:

```text
operator: 0x40dd85697dfbba97887c6dd058d2396edd83e826
from:     0x254e144269c1b42acd3fba92a7fa980b9fd4828b
to:       0x0000000000000000000000000000000000000000
id:       0
amount:   2
```

Post-tapeout state:

| Query | Result |
|---|---:|
| `balanceOf(owner, 0)` | `0` |
| `minted()` | `2` |

Before tapeout, the verified state was `balanceOf(owner, 0) = 2` and
`minted() = 2`. After tapeout, the owner inventory is `0` and `minted()`
remains `2`.

## INFERENCE — `minted()` accounting

The observed state is consistent with `minted()` being cumulative mint
accounting rather than current circulating inventory: minting raised it from 0
to 2, while tapeout burned the owner's balance without reducing it. This is an
instance-level inference from the verified before/after state, not a universal
source-level claim.

## FACT — Circuit creation and ownership

The Processor receipt contains:

1. An ERC-721 `Transfer` emitted by the Processor:

   ```text
   from: 0x0000000000000000000000000000000000000000
   to:   0x254e144269c1b42acd3fba92a7fa980b9fd4828b
   id:   1
   ```

   This proves Circuit ID `1` was minted to the deployment wallet.

2. A Processor event with topic
   `0xc11215e417669c143c8a07aeb778034c0a0a85ebdf305d64a629b19a7a9ce031`,
   indexed Circuit ID `1` and owner, with data words `2` and `0`.

The ERC-721 Transfer is the authoritative Circuit ID and ownership evidence.
The Processor is the emitting contract and therefore establishes the Circuit's
Processor relationship.

## FACT — live on-chain evaluation

The verified Circuit ID is `1`. Inputs use the existing adapter encoding:
`0x00`, `0x01`, `0x02`, and `0x03` for `(A,B) = (00),(01),(10),(11)`.

| A | B | Exact input bytes | Raw result | ABI decoded bytes | Boolean | Expected | Result |
|---:|---:|---|---|---|---:|---:|---|
| 0 | 0 | `0x00` | `0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000` | `0x00` | 0 | 0 | MATCH |
| 0 | 1 | `0x01` | `0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000` | `0x00` | 0 | 0 | MATCH |
| 1 | 0 | `0x02` | `0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000` | `0x00` | 0 | 0 | MATCH |
| 1 | 1 | `0x03` | `0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000000000000000000000000` | `0x01` | 1 | 1 | MATCH |

The raw results were standard ABI dynamic-bytes returns with offset `0x20`,
length `0x01`, and output byte `0x00`, `0x00`, `0x00`, and `0x01` respectively.

## FACT — independent local comparison

The existing deterministic core compiled the frozen `A AND B` artifact as:

```text
normalized: AND(A,B)
netlist: 0x0000000200000300000001000004
NAND count: 2
local outputs: 0, 0, 0, 1
```

Comparison with live X Layer eval: **4 / 4 MATCH**.

## Provenance chain

```text
Human rule:
Approve only when both Alice and Bob approve.
→ Boolean expression: A AND B
→ deterministic AST: AND(A,B)
→ NAND-only compiler: 2 NAND gates
→ frozen netlist: 0x0000000200000300000001000004
→ GateSmith Processor: 0x40dd85697dfbba97887c6dd058d2396edd83e826
→ transistor burn: token ID 0, amount 2
→ Circuit ID: 1, owned by deployment wallet
→ live X Layer eval: 00→0, 01→0, 10→0, 11→1
```

## UNVERIFIED / CLAIMS NOT MADE

- No claim of immutability or permanent trustlessness.
- No claim that AI verified the circuit or the real-world approvals.
- No claim that the Boolean rule represents real-world truth beyond the encoded
  circuit behavior.

`POST-TAPEOUT STATUS: VERIFIED`

`GENESIS CIRCUIT STATUS: LIVE AND VERIFIED`

`GATESMITH MVP ON-CHAIN LOOP: COMPLETE`
