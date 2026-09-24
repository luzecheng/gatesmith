# GateSmith Post-Mint Verification V0.1

Read-only verification of the Genesis Circuit transistor mint. No tapeout,
second mint, signing, or other state-changing transaction was performed.

## FACT — transaction and receipt

| Field | Verified value |
|---|---|
| Network | X Layer Mainnet |
| Chain ID | `196` (`0xc4`) |
| Transaction | `0xf91118e00295d7732f459010acd02c2a5c5bfd78d80880f89a452bc1ecf9699e` |
| Block | `0x442f490` = `71496848` |
| `from` | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| `to` | `0xe0f29a43d89e471f9eea723dcda9d731043f34d7` |
| Receipt status | `0x1` — success |
| Transaction value | `760000000000000 wei` = `0.00076 OKB` |
| Gas used | `0x2679f` = `157599` |
| Effective gas price | `0x1312d01` = `20000001 wei` |
| Actual gas cost | `3151980157599 wei` |
| Total transaction cost | `763151980157599 wei` |

## FACT — actual calldata

The transaction input is:

```text
selector: 0x1b2ef1ca
primitiveId: 0
amount: 2
```

The exact calldata is:

```text
0x1b2ef1ca0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002
```

The actual transaction value is exactly `760000000000000 wei`.

## FACT — ERC-1155 mint event

The receipt contains a standard `TransferSingle` event emitted by the exact
GateSmith Transistor:

```text
emitter:  0xe0f29a43d89e471f9eea723dcda9d731043f34d7
operator: 0x254e144269c1b42acd3fba92a7fa980b9fd4828b
from:     0x0000000000000000000000000000000000000000
to:       0x254e144269c1b42acd3fba92a7fa980b9fd4828b
id:       0
amount:   2
```

This proves mint creation and recipient inventory from receipt data; success is
not inferred from calldata alone.

## FACT — post-mint state

Read-only state after the transaction:

| Getter / query | Result |
|---|---:|
| `supplyCap()` | `10000000000` |
| `mintPrice()` | `50000000000000 wei` |
| `protocolFee()` | `660000000000000 wei` |
| `minted()` | `2` |
| `balanceOf(owner, 0)` | `2` |
| `circuits()` | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |

The relevant primitive remains ID `0`, verified earlier as `NAND()`.

## FACT — balance reconciliation

The known pre-mint balance from the read-only pre-mint gate was:

```text
60194384192574729 wei
```

The post-mint balance is:

```text
59431232212417130 wei
= 0.05943123221241713 OKB
```

The exact difference is:

```text
60194384192574729
-59431232212417130
= 763151980157599 wei
= msg.value 760000000000000
 + gas cost 3151980157599
```

The balance change is fully explained by the transaction value and actual gas.

## INFERENCE

- GateSmith now owns exactly two token ID `0` NAND transistors through the
  deployment wallet's ERC-1155 balance.
- The Genesis Circuit's required transistor inventory is therefore prepared for
  the next tapeout boundary.

## UNVERIFIED / NOT EXECUTED

- No tapeout was attempted.
- No Circuit ID exists yet for the Genesis Circuit.
- No tapeout fee, burn, or Circuit mint was verified in this gate.

`POST-MINT STATUS: VERIFIED`

`TAPEOUT PRE-SIGN GATE: READY TO BEGIN`
