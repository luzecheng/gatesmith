# GateSmith Processor Parameter Freeze V0.1

Date: 2026-09-24

Scope: read-only preparation for the first `Factory.createCPU` transaction.
No transaction, wallet signing, mint, tapeout, or production-code change was
performed.

## Frozen Product Owner parameters

| Parameter | Frozen value | Product meaning |
|---|---:|---|
| `name` | `GateSmith` | Human-facing Processor name. |
| `symbol` | `GATE` | Processor identifier exposed by the protocol, if supported by the created Processor. |
| `story` | `Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits.` | Processor description/metadata. |
| `supplyCap` | `10000000000` | GateSmith's long-term production capacity upper bound; not an investment-asset issuance amount. |
| `mintPrice` | `50000000000000 wei` = `0.00005 OKB` | Marginal usage cost for the finite public production resource, primarily increasing the economic cost of large-scale supply exhaustion; not a yield, investment, or price-appreciation design. |

These values are frozen by the Product Owner for this signing packet.

## Current read-only X Layer Mainnet state

| Item | Observed value |
|---|---|
| Chain ID | `196` (`0xc4`) |
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` |
| Factory bytecode | Present; `130` bytes |
| Factory implementation | `0x74956236ab64ed143933040b4137e8a352e4d17b` |
| Factory slot 3 raw | `0x000000000000000000000000000000000000000000000000001772aa3f848000` |
| Current deploy fee | `6600000000000000 wei` = `0.0066 OKB` |
| Comparison with M5.1 | No key state change observed |

The checks above used only read-only RPC methods (`eth_chainId`,
`eth_getCode`, and `eth_getStorageAt`).

## Exact createCPU calldata

Method:

```text
createCPU(string,string,string,uint256,uint256)
```

Function selector: `0x47f9b5fd`

Decoded arguments:

```text
name      = "GateSmith"
symbol    = "GATE"
story     = "Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits."
supplyCap = 10000000000
mintPrice = 50000000000000
```

Superseded copied calldata representation (do not use):

```text
0x47f9b5fd00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000002d79883d2000000000000000000000000000000000000000000000000000000000000000000947617465536d69746800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004474154450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000535475726e2068756d616e2d7265616461626c6520426f6f6c65616e2072756c657320696e746f2064657465726d696e69737469632c2076657269666961626c65206f6e2d636861696e2063697263756974732e00000000000000000000000000
```

SHA-256 of the calldata bytes:

```text
f38c298535fa89e2ae8b5b78f97c28aef5d56d4c3623f64df3dadff10edaeac5
```

Canonical exact ABI-encoded calldata (420 bytes; used for the final simulation):

```text
0x47f9b5fd00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000002d79883d2000000000000000000000000000000000000000000000000000000000000000000947617465536d69746800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004474154450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000535475726e2068756d616e2d7265616461626c6520426f6f6c65616e2072756c657320696e746f2064657465726d696e69737469632c2076657269666961626c65206f6e2d636861696e2063697263756974732e00000000000000000000000000
```

## Final pre-sign packet

```text
Network: X Layer Mainnet
Chain ID: 196
From: 0x254e144269c1b42acd3fba92a7fa980b9fd4828b
To: 0x1f09daefa827f02cbb40967cc91b259763760761
Method: createCPU(string,string,string,uint256,uint256)

name: GateSmith
symbol: GATE
story: Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits.
supplyCap: 10000000000
mintPrice: 50000000000000 wei (0.00005 OKB)

msg.value: 6600000000000000 wei (0.0066 OKB)
wallet balance: 4175599497083444 wei (0.004175599497083444 OKB)
gas price observed: 20000001 wei
estimated gas: BLOCKED — execution reverted with empty revert data
estimated gas cost: NOT AVAILABLE because estimation was rejected

calldata: see exact calldata above
calldata hash: f38c298535fa89e2ae8b5b78f97c28aef5d56d4c3623f64df3dadff10edaeac5
```

The required simulations were attempted with exactly the same deployment
wallet, Factory target, calldata, and `msg.value`:

```text
eth_call: ERROR code 3, execution reverted, empty revert data (0x)
eth_estimateGas: ERROR code 3, execution reverted, empty revert data (0x)
```

The wallet balance is below the frozen protocol payment by
2424400502916556 wei and cannot cover gas in addition. No state override,
historical creator address, or invented address was used. The simulations do
not establish a predicted Processor or transistor address.

## Expected state changes and verification

If the Product Owner later confirms the public deployment wallet and both
simulations pass, the expected transaction effects are:

- a new Processor;
- a new transistor contract;
- a `CPUCreated` event.

After a successful receipt, verify receipt success, `CPUCreated`, Processor
address and bytecode, transistor address and bytecode, and getters matching all
frozen parameters. Any mismatch stops the flow before transistor acquisition.

## Hard-stop conditions

- chain ID is not `196`;
- Factory address, bytecode, implementation, or deploy fee differs from this
  packet without a new review;
- `from` is unavailable or is not the wallet intended for deployment;
- calldata, decoded arguments, or `msg.value` differs from this packet;
- `eth_call` reverts or `eth_estimateGas` fails;
- wallet UI shows any different network, target, value, or calldata;
- receipt is unsuccessful, `CPUCreated` is absent, or post-transaction getters
  and bytecode do not match the frozen parameters.

## Status

`PRE-SIGN STATUS: BLOCKED`

The blocker to completing the first-write simulation is that the deployment
wallet balance remains below the frozen deploy fee and both exact simulations
reverted. The wallet must be funded sufficiently for the frozen deploy fee and
gas before repeating the same read-only simulations. No
private key, seed phrase, keystore, or password is required or requested.
