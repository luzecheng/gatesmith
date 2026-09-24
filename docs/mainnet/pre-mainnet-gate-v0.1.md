# GateSmith M5 — Pre-Mainnet Gate V0.1

状态：`BLOCKED`（只读 planning gate）
日期：2026-09-24
范围：第一次真实 Processor deployment、transistor acquisition 和 Circuit tape-out 之前的事实冻结与 Product Owner 决策清单。

本文件不授权任何钱包连接、签名、`createCPU`、transistor mint、tape-out 或其他 X Layer state-changing transaction。

## Evidence boundary

本 gate 复用 M3/M3.5 的历史交易、receipt、bytecode、只读 getter 和 deterministic compiler evidence，并补做了最小只读复核：

- `eth_chainId` → `0xc4` = `196`；
- Factory `0x1f09daefa827f02cbb40967cc91b259763760761` 有 code；
- Processor #0 `0x839bdd6fa7a66416a609a735e11de5411b98574e` 有 code；
- T0 transistor `0xbe0eee424c49d44592e4d498740f5b031ef8e26d` 有 code；
- Processor beacon `0xf70d1ed4f62cf3780157b0b421b7e2f45bd0991c` 与 transistor beacon `0x1059ad62cabb6a6925bb65aa617300556c60a51b` 有 code；
- 两个 beacon 的 `owner()` 都返回 Factory；
- T0 当前只读值：`supplyCap() = 100000`、`mintPrice() = 0`、`minted() = 100000`、`protocolFee() = 660000000000000 wei`、`circuits() = Processor #0`。

只读 RPC 结果不改变历史证据的等级，也不关闭下文列出的语义 blocker。

## 1. Processor deployment

### FACT

| Item | Frozen fact | Evidence |
|---|---|---|
| Network | X Layer Mainnet, chain ID `196` | `eth_chainId` |
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` | code + M3.5 historical state |
| Factory method | `createCPU(string,string,string,uint256,uint256)` | selector `0x47f9b5fd`, historical calldata |
| `arg1` | historical Processor name string | calldata / receipt cross-check |
| `arg2` | historical Processor symbol string | calldata / receipt cross-check |
| `arg3` | historical Processor story/description string | calldata / receipt cross-check |
| `arg4` | transistor `supplyCap` value | two historical creations match transistor `supplyCap()` |
| `arg5` | transistor `mintPrice` value | two historical creations match transistor `mintPrice()` |
| Historical Processor #0 | `0x839bdd6fa7a66416a609a735e11de5411b98574e` | creation tx + Factory state |
| Historical T0 transistor | `0xbe0eee424c49d44592e4d498740f5b031ef8e26d` | `CPUCreated` event |

The ABI shape and value semantics are strong cross-checks, not verified-source names. `name`, `symbol`, and `story` are the observed ABI positions; the protocol's official metadata semantics remain `UNVERIFIED` beyond those observed strings.

### INFERENCE

- The new GateSmith Processor will receive three metadata strings plus two economic integers through the same Factory method.
- `arg4` is a total transistor mint ceiling for the Processor's transistor contract in the observed implementation.
- `arg5` is the transistor contract's stored unit-price field in the observed implementation.

### PRODUCT DECISION

The Product Owner must freeze all of the following before any signing request:

| Parameter | Current state |
|---|---|
| `name` | `UNSELECTED` |
| `symbol` / identifier | `UNSELECTED`; whether the protocol exposes a durable symbol is not separately closed |
| `description` / `story` | `UNSELECTED` |
| `supplyCap` (`arg4`) | `UNSELECTED`; historical `100000` is evidence, not a recommendation |
| `mintPrice` (`arg5`) | `UNSELECTED`; historical `0` and `660000000000000` are observed values, not a decision |

The product meaning should remain “public Boolean-rule manufacturing identity”; transistor must not be presented as an investment, governance, or yield asset.

### UNVERIFIED / BLOCKER

- No final supply or price may be copied from an early design candidate.
- Processor owner/admin, seal/freeze behavior, and Processor upgrade authority are not fully closed.
- Beacon ownership proves an upgrade trust boundary, not the full future implementation behavior.
- `msg.value` required by Factory `createCPU` is not frozen by the current evidence and must be established before signing by a read-only simulation/estimate and historical transaction comparison.

## 2. Transistor economics closure

### FACT

- The observed transistor implementation exposes `mint(uint256,uint256)` at selector `0x1b2ef1ca` and a payable path.
- Historical T0 acquisition called `mint(0,4)` with `660000000000000 wei` and succeeded.
- That receipt minted four token-id `0` ERC-1155 units to the caller.
- T0 read surface: `mintPrice() = 0`, `protocolFee() = 660000000000000 wei`.
- T1 read surface: `mintPrice() = 660000000000000 wei`, `protocolFee() = 660000000000000 wei`; no successful T1 mint receipt was found to establish its total-price formula.
- `supplyCap() = 100000` and `minted() = 100000` are observed on both historical instances.
- `NAND()` returns token id `0` and `LATCH()` returns token id `1` in the observed implementation, but the complete primitive taxonomy is not needed for the first NAND-only candidate.

### INFERENCE

- `mint(0, amount)` acquires amount units of the observed NAND primitive.
- `protocolFee()` participates in the payable mint path because T0 paid it while `mintPrice()` was zero.
- The exact formula could be `protocolFee + amount * mintPrice`, a fixed fee with conditional unit pricing, or another implementation-specific rule. The formula is not proven.
- `minted()` appears to be a supply-accounting counter, but whether it means cumulative minted, current circulating amount, or another global accounting value is `UNVERIFIED`.
- `supplyCap()` is strongly evidenced as a total mint ceiling for the transistor contract, not a per-wallet or per-purchase cap. Universal semantics remain source-unverified.
- The observed XOR proves `4 NAND → burn 4 token-id-0 units`; it does not prove a universal `1 NAND = 1 transistor` rule for every future Processor version or primitive.

### PRODUCT DECISION

The Product Owner must approve:

- a supply cap after accepting the observed global-ceiling interpretation;
- a mint-price policy only after the exact payable formula is simulated against the new Processor;
- a hard maximum NAND count for the first demo;
- a policy that treats protocol fee, transistor price, tape-out payment, and gas as four separate cost lines.

### UNVERIFIED / BLOCKER

Before signing transistor acquisition, obtain from the exact new transistor address:

1. `mintPrice()`, `protocolFee()`, `supplyCap()`, `minted()`;
2. an `eth_call` simulation of the exact `mint(0, N)` from the deployment wallet;
3. `eth_estimateGas` for the same transaction;
4. the exact required `msg.value` from the simulation/implementation behavior.

If simulation and expected payment disagree, stop. Do not use `N × mintPrice` as a substitute.

## 3. Tape-out economics closure

### FACT

The observed Processor exposes `tapeout(bytes,uint32,uint32)` at selector `0x7bd3ac1d`.

Historical XOR tape-out:

- target: Processor #0;
- netlist length: `28` bytes;
- input count: `2`;
- output count: `1`;
- `tx.value`: `1300000000000000 wei`;
- receipt burned four token-id `0` transistor units;
- receipt created Circuit NFT #1 and emitted `TapedOut` with primitive quantity `4`.

### INFERENCE

- Tape-out requires sufficient NAND primitive balance before the call.
- The observed `tx.value` is a separate native payment from transistor acquisition and gas.
- The current sample is consistent with a tape-out protocol payment, but does not prove whether it is fixed, Processor-specific, recipient-split, or composed of multiple fees.

### PRODUCT DECISION

The Product Owner must approve the first circuit and a maximum total spend only after the exact new Processor simulation reports:

```text
transistor payment + tape-out msg.value + gas estimate + safety buffer
```

### UNVERIFIED / BLOCKER

The exact tape-out fee and recipient path are not closed. Before signing, run a read-only `eth_call` simulation and `eth_estimateGas` for the exact `tapeout(bytes,uint32,uint32)` calldata, `from`, and candidate `msg.value`. If no value can be established reliably, do not sign.

## 4. First GateSmith circuit candidates

All bytes and hashes below were generated by `gatesmith_core`'s deterministic parser/compiler/encoder. They were not generated by AI.

### Candidate A — NOT gate

- Human rule: “Allow when the request is not blocked.”
- Expression: `NOT A`
- Truth table: `A=0 → 1`; `A=1 → 0`
- NAND count: `1`
- Observed transistor requirement: `1` (subject to the universal 1:1 rule blocker)
- Encoded netlist: `0x00000002000002`
- SHA-256: `fca1c950857eb0450afdd8dd326cdef5646d4f5b8c0e8a1ad3a2a1df4dd9a7bf`
- Demo value: smallest possible visible rule and easiest end-to-end verification.

### Candidate B — Two-party approval

- Human rule: “Approve only when both reviewers approve.”
- Expression: `A AND B`
- Truth table: `00 → 0`, `01 → 0`, `10 → 0`, `11 → 1`
- NAND count: `2`
- Observed transistor requirement: `2` (subject to the universal 1:1 rule blocker)
- Encoded netlist: `0x0000000200000300000001000004`
- SHA-256: `8d6caeafdb7825cc5c790a214acd0c8b22cb827eb669cc67735a0d31a2f86c99`
- Demo value: directly communicates deterministic human approval and remains very small.

### Candidate C — Two-input parity

- Human rule: “Allow when exactly one of two independent checks is true.”
- Expression: `(A AND NOT B) OR (NOT A AND B)`
- Truth table: `00 → 0`, `01 → 1`, `10 → 1`, `11 → 0`
- NAND count: `4`
- Observed transistor requirement: `4` (subject to the universal 1:1 rule blocker)
- Encoded netlist: `0x00000002000003000000020000040000000300000400000005000006`
- SHA-256: `d3f8f3a8316a49023a82436e92607f77a51e7f1b96b614b3d71417372f3f6a9f`
- Demo value: matches the existing verified on-chain XOR pattern and gives the clearest local/on-chain truth-table comparison.

The Product Owner must choose exactly one first circuit. This document does not choose it.

## 5. Exact mainnet transaction plan

Every step is manual and sequential. A failed verification is a hard stop; no later transaction may be prepared automatically.

### Step 0 — Freeze the signing packet

- Target: none.
- Method: none; local deterministic compilation and read-only RPC only.
- Arguments: Product Owner-selected metadata/economics and one candidate netlist.
- `msg.value`: none.
- Expected state change: none.
- Verify: record chain `196`, Factory address/code, compiler version, expression, bytes, hash, input/output counts, and all simulation results.
- STOP: any missing decision, changed byte/hash, unknown payment, wrong chain, or unresolved upgrade acceptance.

### Step 1 — Factory `createCPU`

- Target: `0x1f09daefa827f02cbb40967cc91b259763760761`.
- Method: `createCPU(string name, string symbol, string story, uint256 supplyCap, uint256 mintPrice)`.
- Arguments: exactly the frozen Product Owner packet; no placeholders at signing.
- `msg.value`: `UNVERIFIED` until read-only simulation/estimate closes it.
- Expected state change: new Processor, new transistor contract, and `CPUCreated` event.
- Verify: receipt status, `CPUCreated` fields, nonzero Processor/transistor code, Processor getters, transistor getters, and expected metadata.
- STOP: wrong chain/Factory, reverted receipt, missing event, unexpected addresses/code, or any getter mismatch.

### Step 2 — Verify Processor and transistor

- Target: newly emitted Processor and transistor addresses.
- Methods: read-only `eth_getCode`, `eth_call` getters, event/log decoding.
- Arguments: `supplyCap`, `mintPrice`, `protocolFee`, `minted`, `circuits`, and discovered metadata getters where present.
- `msg.value`: none.
- Expected state change: none.
- Verify: implementation/proxy and beacon owner/admin evidence; record unknowns explicitly.
- STOP: any unexpected implementation, upgrade authority, fee, cap, or circuit registry behavior.

### Step 3 — Acquire exact NAND inventory

- Target: newly emitted transistor contract.
- Method: `mint(uint256,uint256)`.
- Arguments: token id `0`, exact required quantity `N` from frozen netlist.
- `msg.value`: exact value obtained from the step-2 simulation; never derived by multiplying an unverified unit price.
- Expected state change: caller receives `N` token-id `0` units.
- Verify: receipt status, mint event, `balanceOf(deploymentWallet, 0)`, and post-state values.
- STOP: value mismatch, unexpected token id, insufficient balance, unexpected minted/cap accounting, or event mismatch.

### Step 4 — Tape out frozen circuit

- Target: newly created Processor.
- Method: `tapeout(bytes,uint32,uint32)`.
- Arguments: exact frozen encoded netlist, input count, output count.
- `msg.value`: exact value obtained by read-only simulation/estimate; historical `1300000000000000 wei` is evidence, not a guaranteed current fee.
- Expected state change: burn required transistor units and mint one Circuit NFT.
- Verify: receipt status, ERC-1155 burn, `TapedOut` event, Circuit ownership, Circuit ID, and expected quantity.
- STOP: revert, payment mismatch, wrong burn amount, missing event/Circuit, or unexpected Circuit ID semantics.

### Step 5 — Verify every truth-table input

- Target: newly created Processor.
- Method: read-only `eval(uint256,bytes)` via existing adapter (`eth_chainId`, `eth_getCode`, `eth_call`).
- Arguments: returned Circuit ID and every encoded truth-table input.
- `msg.value`: none.
- Expected state change: none.
- Verify: on-chain Boolean output equals local AST and NAND evaluator output for every row.
- STOP: wrong chain, no code, revert, malformed output, missing row, or any mismatch.

## 6. Wallet and cost readiness

### FACT

- GateSmith's existing adapter has no wallet, signer, private-key, or write method.
- Historical protocol payments are `660000000000000 wei` for the observed T0 transistor mint and `1300000000000000 wei` for the observed XOR tape-out.
- Gas is separate and must be computed from receipt `gasUsed × effectiveGasPrice` after execution, or estimated before signing.

### INFERENCE

The first circuit's required native balance can be represented as:

```text
required OKB = createCPU value
             + exact transistor mint value
             + exact tapeout value
             + gas estimate × effective gas price
             + safety buffer
```

The formula is a planning equation, not a currently known amount.

### PRODUCT DECISION

The Product Owner must choose the safety-buffer policy. A percentage or fixed OKB buffer must be explicitly recorded in the signing packet; it is not a protocol fact.

The Product Owner performs every final wallet confirmation. GateSmith must never request, read, store, or expose a seed phrase or private key.

### UNVERIFIED / BLOCKER

Exact required OKB cannot be frozen until the new Processor/transistor addresses exist and the exact calldata/value can be simulated. No pre-signing amount should be represented as final.

## 7. Failure and irreversibility analysis

| Failure | Consequence | Required response |
|---|---|---|
| Wrong chain | Transaction could target an unintended network | Stop before signing; require chain ID `196` and wallet-network confirmation |
| Wrong Factory | Processor may be created by an unrelated or incompatible contract | Stop; verify exact address, code, and Factory behavior |
| Wrong `createCPU` parameters | Irreversible metadata/economics may be frozen in a new Processor | Stop before signing; human review of all five arguments |
| Processor created, later step fails | Partial deployment remains; funds/state may be consumed | Stop; preserve address and receipt, do not auto-retry or duplicate |
| Transistor mint succeeds, tape-out fails | Inventory remains and may be unusable under changed semantics | Stop; verify balance and economics; no automatic tape-out retry |
| Tape-out reverts | Payment may not be consumed, but preconditions/fee may be wrong | Stop; inspect receipt/revert evidence; do not guess a new value |
| Circuit created, eval mismatch | Published artifact is unsafe to present as verified | Stop publication; preserve Circuit ID, bytes, hash, and mismatch evidence |
| Accidental duplicate deployment | Multiple Processor identities and economic inventories exist | Stop all further writes; Product Owner selects one identity and documents the other |
| Upgradeability/admin risk | Factory/beacon owner may change future behavior | Product Owner must explicitly accept or block deployment; do not claim immutability |

No step should be bundled into an automatic write pipeline. The deployment wallet, Processor, transistor, and Circuit IDs must be recorded only after each successful verification gate.

## 8. FACT / INFERENCE / PRODUCT DECISION / UNVERIFIED summary

### FACT

- X Layer Mainnet chain ID is `196`.
- Factory address and historical Processor/transistor/tape-out addresses are documented above.
- `createCPU` ABI shape and the observed `arg4`/`arg5` value correlations are established.
- Historical T0 mint and XOR tape-out values, burn amount, Circuit creation, and `eval()` behavior are established.
- The deterministic compiler generated all three candidate netlists and hashes.
- Existing GateSmith read-only integration performs chain/code/eval checks and has no write path.

### INFERENCE

- `arg4` is a global transistor mint ceiling in the observed implementation.
- `mint(0,N)` acquires NAND primitive units.
- The observed XOR supports, but does not universally prove, one transistor per NAND.
- Historical tape-out value is likely a protocol payment, but its exact composition is not proven.

### PRODUCT DECISION

The Product Owner must personally decide:

1. Processor name;
2. symbol/identifier;
3. description/story;
4. supply cap;
5. mint price;
6. acceptance of beacon/Factory upgrade authority;
7. first circuit candidate (A, B, or C);
8. maximum NAND count and duplicate-use policy;
9. safety-buffer policy and maximum total OKB spend;
10. whether deployment proceeds only after exact fee simulation closes.

### UNVERIFIED / BLOCKER

- Exact Factory creation payment.
- Exact new-Processor `mint()` payment formula and `protocolFee()` settlement path.
- Exact tape-out fee, recipient, and payment composition.
- `minted()` accounting semantics.
- Universal 1 NAND = 1 transistor rule.
- Processor owner/admin/seal/freeze behavior and long-term upgrade implications.
- Final Product Owner parameter selection.

Until these blockers and decisions are closed, M5 cannot authorize a mainnet write transaction.

## M5 status

`M5 STATUS: BLOCKED`
