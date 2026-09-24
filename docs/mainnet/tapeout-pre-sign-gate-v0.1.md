# GateSmith Genesis Circuit — Tapeout Pre-Sign Gate V0.1

Read-only pre-sign packet for the frozen Genesis Circuit. No tapeout, mint,
signature, or other mainnet write was performed.

## FACT — authoritative instance and inventory

| Item | Current verified value |
|---|---|
| Network | X Layer Mainnet, chain ID `196` |
| Owner | `0x254e144269c1b42acd3fba92a7fa980b9fd4828b` |
| Processor | `0x40dd85697dfbba97887c6dd058d2396edd83e826` |
| Transistor | `0xe0f29a43d89e471f9eea723dcda9d731043f34d7` |
| CPU ID | `237` |
| `balanceOf(owner, 0)` | `2` |
| `minted()` | `2` |
| `supplyCap()` | `10000000000` |
| `mintPrice()` | `50000000000000 wei` |
| `protocolFee()` | `660000000000000 wei` |
| Owner OKB balance | `59431232212417130 wei` = `0.05943123221241713 OKB` |

Inventory is sufficient for the frozen two-NAND Genesis Circuit.

## FACT — tapeout ABI and calldata

Current Processor accepts the observed selector:

```text
tapeout(bytes,uint32,uint32)
selector: 0x7bd3ac1d
```

The frozen arguments are:

```text
bytes:        0x0000000200000300000001000004
input count:  2
output count: 1
```

Exact ABI calldata (164 bytes):

```text
0x7bd3ac1d000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000e0000000200000300000001000004000000000000000000000000000000000000
```

Calldata SHA-256:

```text
b22cd0fdd965c312fe38fbd8950945c4f4606b718d58870d52e6c52f600e74da
```

## FACT — exact msg.value boundary

For this exact Processor and exact Genesis calldata:

| Simulation value | `eth_call` | `eth_estimateGas` |
|---:|---|---|
| `1299999999999999 wei` | Revert: `tapeout fee` | Revert: `tapeout fee` |
| `1300000000000000 wei` | PASS; return `1` | PASS; `252832` gas |
| `1300000000000001 wei` | Revert: `tapeout fee` | Revert: `tapeout fee` |

The current tapeout payment is therefore a strict exact value:

```text
msg.value = 1300000000000000 wei = 0.0013 OKB
```

This is current instance evidence, not an assumption copied from the
historical XOR transaction.

## FACT — gas and balance readiness

```text
gas price:                    20000001 wei
estimated gas:                252832
estimated gas cost:           5056640252832 wei
tapeout protocol payment:     1300000000000000 wei
estimated total transaction:  1305056640252832 wei
current owner balance:        59431232212417130 wei
estimated post-tx balance:    58126175572164298 wei
safety buffer:                58126175572164298 wei
```

The owner balance is sufficient for the exact payment and estimated gas.

## INFERENCE — simulation result and expected state changes

- The successful `eth_call` returned `1`. This is the likely next Circuit ID
  for the simulated tapeout.
- A real tapeout should burn two token ID `0` NAND units from the owner.
- A real tapeout should create one Circuit NFT/record associated with the
  Processor and the frozen netlist.
- The simulation result is not an on-chain Circuit ID or deployment result.

No reliable Processor circuit-count getter was found on the current exposed
interface; no universal count claim is made before the receipt is available.

## UNVERIFIED until a real tapeout receipt

- actual Circuit ID and ownership;
- actual burn event and post-tapeout `balanceOf(owner, 0)`;
- actual Circuit mint event/token identity;
- event-level netlist/provenance relationship;
- actual on-chain `eval()` results for every truth-table row.

## Post-tapeout verification plan

After Product Owner manually confirms the transaction, perform read-only checks:

1. Fetch transaction and receipt; require chain `196`, correct `from`/`to`,
   exact calldata/hash, exact value, and successful receipt.
2. Decode burn evidence: token ID `0`, amount `2`, owner as the burned holder,
   and the exact Transistor emitter.
3. Decode the Circuit NFT/creation event and obtain the actual Circuit ID and
   owner.
4. Verify the Processor, Circuit identity, and any available netlist/provenance
   relationship.
5. Call `eval(actualCircuitId, input)` for all four inputs and compare with the
   deterministic local truth table:

   ```text
   00 → 0
   01 → 0
   10 → 0
   11 → 1
   ```

6. Stop on any receipt, event, ownership, burn amount, Circuit ID, provenance,
   or evaluation mismatch.

`TAPEOUT PRE-SIGN STATUS: READY FOR PRODUCT OWNER CONFIRMATION`
