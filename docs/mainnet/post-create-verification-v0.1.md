# GateSmith Post-Create Verification V0.1

Read-only verification of the Product Owner's first mainnet `createCPU`
transaction. No mint, tapeout, second transaction, signing, or production-code
change was performed.

## Transaction and receipt

| Field | Verified value |
|---|---|
| Network | X Layer Mainnet |
| Chain ID | `196` (`0xc4`) |
| Transaction | `0xb3edbbeed00b44276a38781cfbd4b7d6108fda6dffa3202cfa8721f87da00229` |
| Block | `0x442e7e7` |
| `from` | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| `to` | `0x1f09daefa827f02cbb40967cc91b259763760761` |
| `status` | `0x1` — success |
| `value` | `6600000000000000 wei` |
| `gasUsed` | `0xb9a44` = `760388` |
| `effectiveGasPrice` | `0x1312d01` = `20000001 wei` |

## Actual calldata verification

The transaction input has selector `0x47f9b5fd`, is 420 bytes, and has SHA-256:

```text
f38c298535fa89e2ae8b5b78f97c28aef5d56d4c3623f64df3dadff10edaeac5
```

Decoded arguments:

```text
name      = "GateSmith"
symbol    = "GATE"
story     = "Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits."
supplyCap = 10000000000
mintPrice = 50000000000000 wei
```

All five values exactly match the Product Owner frozen parameters.

## CPUCreated and deployed addresses

The Factory `CPUCreated` log is present in the successful receipt. Its indexed
arguments identify:

```text
Processor:  0x40dd85697dfbba97887c6dd058d2396edd83e826
Transistor: 0xe0f29a43d89e471f9eea723dcda9d731043f34d7
Creator:    0x254e144269c1b42acd3fba92a7fa980b9fd4828b
```

The Factory reports `cpuCount() = 238`, and `cpuAt(237)` returns the Processor
address above. The applicable zero-based CPU ID is therefore `237`.

Both addresses contain code:

- Processor code present: 295 bytes.
- Transistor code present: 295 bytes.

The proxy bytecode/beacon identities also match the observed protocol shape:
the Processor proxy points at beacon `0xf70d1ed4f62cf3780157b0b421b7e2f45bd0991c`,
and the transistor proxy points at beacon
`0x1059ad62cabb6a6925bb65aa617300556c60a51b`.

## New Processor state

Read-only calls on the Processor returned:

| Getter | Result |
|---|---|
| `name()` | `GateSmith` |
| `symbol()` | `GATE` |

The attempted `story()` getter reverted on this implementation. This is an
interface-surface limitation, not a mismatch: the story is verified from the
actual createCPU calldata.

## New transistor state

Read-only calls on the new transistor returned:

| Getter | Result |
|---|---:|
| `supplyCap()` | `10000000000` |
| `mintPrice()` | `50000000000000 wei` |
| `minted()` | `0` |
| `protocolFee()` | `660000000000000 wei` |
| `circuits()` | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| `creator()` | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| `protocolWallet()` | `0x571d447f4f24688ec35ccf07f1d6993655f6af15` |

The required `supplyCap` and `mintPrice` values exactly match the frozen
parameters. `minted() = 0` confirms that no transistor mint has occurred in
this verification step.

## Simulation comparison

The earlier simulation produced two raw returned addresses. The current
receipt/event and proxy beacon identities establish their roles unambiguously:

- raw simulation return word for the transistor: `0xe0f29a43d89e471f9eea723dcda9d731043f34d7`;
- raw simulation return word for the Processor: `0x40dd85697dfbba97887c6dd058d2396edd83e826`.

These are the actual deployed addresses. The older stale simulation pair
`0x05c68f5ce3116099be6e431ecf521a690aa67266` / `0x4495630e6211d9d3bf8797787a7aef059262d6ed`
was superseded by later Factory state and is not authoritative.

## Gate result

All post-create checks required for the next boundary passed. No mint or tapeout
was attempted.

`POST-CREATE STATUS: VERIFIED`

`PRE-MINT GATE: READY TO BEGIN`
