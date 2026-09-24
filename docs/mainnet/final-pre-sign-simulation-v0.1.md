# GateSmith Final Pre-Sign Simulation V0.1

Read-only simulation record. No transaction or signature was produced.

## Packet

```text
Network: X Layer Mainnet
Chain ID: 196
From: 0x254e144269c1b42acd3fba92a7fa980b9fd4828b
To: 0x1f09daefa827f02cbb40967cc91b259763760761
Factory implementation: 0x74956236ab64ed143933040b4137e8a352e4d17b
Method: createCPU(string,string,string,uint256,uint256)
Selector: 0x47f9b5fd

name: GateSmith
symbol: GATE
story: Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits.
supplyCap: 10000000000
mintPrice: 50000000000000 wei (0.00005 OKB)

deploy fee / msg.value: 6600000000000000 wei (0.0066 OKB)
wallet balance: 4175599497083444 wei (0.004175599497083444 OKB)
gas price: 20000001 wei
estimated gas: 774794 (0xbd28a)
estimated gas cost: 15495880774794 wei
total estimated cost: 6615495880774794 wei
remaining balance / safety buffer: -2439896383691350 wei

calldata SHA-256: f38c298535fa89e2ae8b5b78f97c28aef5d56d4c3623f64df3dadff10edaeac5
```

Exact calldata (420 bytes; the canonical value was generated programmatically
in the same read-only simulation run):

```text
0x47f9b5fd00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000002d79883d2000000000000000000000000000000000000000000000000000000000000000000947617465536d69746800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004474154450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000535475726e2068756d616e2d7265616461626c6520426f6f6c65616e2072756c657320696e746f2064657465726d696e69737469632c2076657269666961626c65206f6e2d636861696e2063697263756974732e00000000000000000000000000
```

## Read-only results

- `eth_chainId`: `0xc4` (`196`).
- Factory code is present; implementation remains
  `0x74956236ab64ed143933040b4137e8a352e4d17b`.
- Factory slot 3 remains `6600000000000000 wei`.
- Calldata was generated deterministically from the frozen arguments and has
  the required SHA-256.
- `eth_call`: PASS. Return data decodes to simulation-only predicted addresses:
  - Processor: `0x05c68f5ce3116099be6e431ecf521a690aa67266`
  - transistor: `0x4495630e6211d9d3bf8797787a7aef059262d6ed`
- `eth_estimateGas`: PASS, `774794` gas.

The predicted addresses are simulation results, not deployed addresses.

## Cost gate

Protocol payment plus estimated gas is `6615495880774794 wei`, while the
wallet contains `4175599497083444 wei`. The shortfall is
`2439896383691350 wei`; therefore the wallet does not yet have a positive gas
buffer or enough balance for the protocol payment itself.

## Expected state changes

- Factory creates one Processor.
- Factory creates one transistor contract.
- Factory emits `CPUCreated`.

## Post-transaction verification checklist

- receipt status is successful;
- `CPUCreated` is present and addresses match the receipt;
- Processor and transistor addresses contain code;
- Processor getters match all frozen parameters;
- no subsequent mint or tapeout is started until these checks pass.

## Hard stops

- any chain, Factory, implementation, calldata, argument, value, or wallet
  mismatch;
- wallet balance is below protocol payment plus gas buffer;
- wallet UI shows different transaction details;
- failed receipt, missing event, missing code, or getter mismatch.

`PRE-SIGN STATUS: BLOCKED`
