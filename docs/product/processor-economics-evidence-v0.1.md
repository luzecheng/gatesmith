# GateSmith M3.5 — Processor Economics Evidence V0.1

状态：`M3.5 STILL BLOCKED`

本文只记录 X Layer 上的只读证据，不提出最终的 GateSmith supply / price 参数，也没有发送交易。

## 1. Evidence boundary

| 项目 | 结论 | 证据等级 |
|---|---|---|
| Network | X Layer Mainnet，chain ID `196` | `VERIFIED`：`eth_chainId` |
| Factory | `0x1f09daefa827f02cbb40967cc91b259763760761` | `VERIFIED`：`eth_getCode`、`cpuCount()`、`cpuAt()` |
| Processor #0 | `0x839bdd6fa7a66416a609a735e11de5411b98574e` | `VERIFIED`：Factory state / historical creation tx |
| Processor #1 | `0x0565ea48ca41ae559d8d491dbb0a9ec945db551b` | `VERIFIED`：Factory state / historical creation tx |
| T0 transistor | `0xbe0eee424c49d44592e4d498740f5b031ef8e26d` | `VERIFIED`：`CPUCreated` event |
| T1 transistor | `0x3246190603a426ad4f3ca91da28c4ba4681e26be` | `VERIFIED`：`CPUCreated` event |

辅助资料：4byte selector 映射只用于产生候选函数名；关键数值来自 X Layer `eth_call`、历史 transaction calldata、receipt logs 和 implementation bytecode。

## 2. Exact `createCPU` parameter semantics

Factory selector `0x47f9b5fd` 对应的 ABI 形状为：

```text
createCPU(string name, string symbol, string story, uint256 arg4, uint256 arg5)
```

### Processor #0

Creation transaction：

`0x3146c84559a24acd638f17ff8a2680b854ad838f1852365446b43d74d6b3a58c`

Calldata 解码：

```text
name   = OnlyTestXLayer
symbol = OnlyTestXLayer
story  = OnlyTestXLayer
arg4   = 100000
arg5   = 0
```

随后创建的 T0 transistor read surface：

```text
supplyCap() = 100000
mintPrice() = 0
```

### Processor #1

Creation transaction：

`0xaf7318e6df4f47c3c18706bfaa7d400b01dfd6d693c73528d6057412948eb7b1`

Calldata 解码：

```text
name   = My4004
symbol = CPU
story  = 第一个 Xlayer链上零件
arg4   = 100000
arg5   = 660000000000000 wei
```

随后创建的 T1 transistor read surface：

```text
supplyCap() = 100000
mintPrice() = 660000000000000 wei
```

### 结论

- `arg4` 是 transistor `supplyCap`：`VERIFIED / two-Processor state cross-check`。
- `arg5` 是 transistor `mintPrice`：`VERIFIED / two-Processor state cross-check`。
- 这不是仅按参数位置猜测；两个历史 creation calldata 分别与两个新建 transistor 的实际只读 getter 精确对应。
- 尚未找到 verified Solidity source，因此函数参数的源码命名仍标记为 `INFERRED FROM ABI + STATE`；数值语义已足够强，可用于经济设计讨论，但仍不等同于官方源码证明。

## 3. Exact meaning/status of cap

真实 transistor implementation 的 dispatch 中包含：

```text
supplyCap() -> 0x8f770ad0
minted()    -> 0x4f02c420
mint(...)   -> 0x1b2ef1ca
```

两个真实实例都返回：

```text
supplyCap() = 100000
minted()    = 100000
```

因此当前最强结论是：

> `cap` 对应 Processor 所属 transistor 合约的 `supplyCap()`，是 mint supply ceiling，而不是已发现的 per-wallet cap 或 purchase cap。

证据等级：`VERIFIED for existence and value; SEMANTIC INTERPRETATION strong but implementation-source-unverified`。

没有发现独立的 Processor `cap()`、`maxSupply()` 或 per-wallet cap read method。也没有发现公开 setter 用来修改 `supplyCap`。

## 4. Processor/transistor read surface

T0/T1 的 delegate implementation `0x265bf10faB9ddEC0eE0A649C6B9DB845f1b9a06b` 暴露了以下可读状态：

| Selector | 候选函数 | T0 | T1 | 状态 |
|---|---|---:|---:|---|
| `0x02d05d3f` | `creator()` | `0x571d...af15` | `0x7f99...f726` | `VERIFIED by eth_call` |
| `0x06d6e63f` | `protocolWallet()` | `0x571d...af15` | `0x571d...af15` | `VERIFIED by eth_call` |
| `0x6817c76c` | `mintPrice()` | `0` | `660000000000000` | `VERIFIED by eth_call` |
| `0x8f770ad0` | `supplyCap()` | `100000` | `100000` | `VERIFIED by eth_call` |
| `0x4f02c420` | `minted()` | `100000` | `100000` | `VERIFIED by eth_call` |
| `0x3bcce6c9` | `NAND()` | `0` | `0` | `VERIFIED by eth_call` |
| `0x15f47f4f` | `LATCH()` | `1` | `1` | `VERIFIED by eth_call` |
| `0xb0e21e8a` | `protocolFee()` | `660000000000000` | `660000000000000` | `VERIFIED by eth_call` |
| `0x5f48772d` | `circuits()` | Processor address | Processor address | `VERIFIED by eth_call` |

`NAND()` / `LATCH()` 的返回值看起来是 primitive token IDs，但其完整经济语义不作为本 gate 的必要结论；标记为 `UNVERIFIED beyond observed IDs`。

## 5. Transistor acquisition and unit-price semantics

implementation bytecode 将 `mint(uint256,uint256)` 分派到 payable 路径：该路径读取两个 calldata word，并执行 `CALLVALUE` 与存储值比较；因此 transistor 获取不是免费只读操作，而是一个需要 native value 的 mint transaction。

真实 T0 mint transaction：

`0x89ed16fc7d838f1db50f296f841fa43962bffca89b4ce32b3d64430bc1c143be`

```text
to     = 0xbe0eee424c49d44592e4d498740f5b031ef8e26d
input  = mint(0, 4)  // selector + two uint256 words
value  = 660000000000000 wei
status = 1
```

Receipt 产生：

```text
ERC-1155 TransferSingle:
  operator = transistor contract
  from     = 0x000...000
  to       = 0x571d...af15
  id       = 0 (NAND)
  amount   = 4
```

同一 receipt 还有 custom event，其 data 为 `4` 和 `660000000000000` 两个数值；事件的完整 Solidity 名称尚未从 verified source 获得。

可确认：

- `mint(0,4)` 产生 4 个 token-id-0 transistor；`VERIFIED`。
- 该 mint 支付了 `660000000000000 wei`；`VERIFIED`。
- T0 的 `mintPrice()` 为 0，而 `protocolFee()` 为 `660000000000000 wei`；`VERIFIED`。
- 因此这笔历史交易支持“总支付至少包含 protocol fee；不能把 value 简化成 4 × mintPrice”的结论。
- T1 的 `mintPrice()` 与 `protocolFee()` 都为 `660000000000000 wei`，但本轮没有找到一笔成功的 T1 mint 交易来确认总价公式；该公式仍为 `UNVERIFIED`。

不能把 Factory creation tx 的 `tx.value`、transistor mint value 和 X Layer gas 混为一谈。

## 6. Tape-out payment and burn path

真实 XOR tape-out transaction：

`0x407402bee88c4663f64ea2c4c3184277c381f32546c4bceaabc8a31776b49210`

```text
to       = Processor #0
selector = 0x7bd3ac1d = tapeout(bytes,uint32,uint32)
netlist  = 28 bytes
inputs   = 2
outputs  = 1
tx.value = 1300000000000000 wei
```

Receipt 证据：

1. T0 transistor ERC-1155 `TransferSingle`：`from = creator`，`to = zero address`，`id = 0`，`amount = 4`。
2. Circuit NFT #1 被创建并归属于 tape-out caller。
3. Processor `TapedOut` event 报告 circuit `1` 和 primitive quantity `4`。

因此：

- 4-NAND XOR 确实 burn 4 个 token-id-0 transistor；`VERIFIED`。
- 在当前观测样本中，NAND gate count 与 token-id-0 burn amount 为 1:1；`VERIFIED for this circuit / INFERENCE for universal rule`。
- tape-out caller 必须在调用前拥有足够 token-id-0 transistor；该交易的 `from` 与 burn 的 `from` 一致；`VERIFIED for this transaction`。
- `tapeout` transaction 带有 1.3e15 wei native value；`VERIFIED`。
- native value 的确切用途、收款方和是否为固定 tape-out fee，本轮尚未通过 verified source 或 balance-flow 完整证明；记为 `UNVERIFIED`。
- X Layer gas 是独立成本；它由 receipt 的 `gasUsed × effectiveGasPrice` 表示，不能并入 transistor price。

当前可以安全写出的 cost equation 只有：

```text
observed transistor units burned = observed NAND quantity for the tape-out
```

不能安全写成：

```text
total OKB cost = NAND count × unit price
```

因为 T0 的历史样本显示 `mintPrice = 0`，但 mint 仍支付了 `protocolFee`，而 tape-out 还带有独立的 native value。

## 7. Mutability and admin powers

### Transistor / Processor proxies

T0/T1 transistor 是 beacon proxy；beacon：

`0x1059ad62cabb6a6925bb65aa617300556c60a51b`

其当前 implementation：

`0x265bf10faB9ddEC0eE0A649C6B9DB845f1b9a06b`

beacon `owner()` 返回 Factory `0x1f09...0761`，并且 beacon bytecode 暴露 `upgradeTo(address)` selector `0x3659cfe6`。因此：

- transistor implementation 可被 Factory 控制的 beacon 升级；`VERIFIED from bytecode + eth_call`。
- 即使 supply/price 没有公开 setter，implementation upgrade 仍是重要 admin trust boundary；`VERIFIED`。
- T0/T1 implementation dispatch 中没有发现 `setSupplyCap`、`setMintPrice` 等公开 setter；`VERIFIED for current implementation selector surface`。
- “部署后数值永远不可改变”不能宣称，因为 beacon upgrade 可以改变代码和未来语义；`UNVERIFIED / false to assume immutable`。

### Owner / creator distinction

`creator()`、`protocolWallet()` 和 beacon `owner()` 是不同层次的地址。不能把 creator 自动等同于 upgrade admin，也不能把 protocol wallet 自动等同于 tape-out 收款方。

### Processor

Processor #0 是 beacon proxy，beacon：

`0xf70d1ed4f62cf3780157b0b421b7e2f45bd0991c`

当前 implementation：

`0x977f217887e085d298cb3819cdad5a0ee35f29b2`

该 beacon `owner()` 也返回 Factory。Processor 本身的 owner/admin、seal/freeze 和参数 setter 未被本轮证据完整关闭；标记为 `UNVERIFIED`。

## 8. Answers required by the gate

### Exact createCPU parameter semantics

`arg4 = supplyCap`，`arg5 = mintPrice`。证据为两个独立 Processor 的 creation calldata 与随后 transistor `supplyCap()`/`mintPrice()` 精确对应。源码命名未验证，但数值语义达到 `VERIFIED / strong cross-check`。

### Exact cap status

存在独立 `supplyCap()`，当前两个实例都是 `100000`。未发现 per-wallet cap 或 purchase cap。cap 的 mint ceiling 语义是强证据，但尚缺 verified source。

### Transistor acquisition mechanism

通过 transistor 合约的 payable `mint(uint256,uint256)` 获取；T0 历史交易已证明 token id 0、数量 4、value 660000000000000 wei 的完整路径。

### Unit-price semantics

`mintPrice()` 是实际存储字段，并与 createCPU 的第二个 uint 对应。T0 样本还存在固定 `protocolFee()`，所以 mint 总支付不能只按 unit price 计算。T1 的完整总价公式仍未验证。

### NAND → transistor relationship

真实 XOR：4 NAND → burn 4 token-id-0 transistor。只能把 1:1 作为当前 observed relation；对所有未来电路的普遍性仍需更多 tape-out/implementation evidence。

### Tape-out payment path

真实 tape-out 携带 1.3e15 wei，并同时 burn 4 transistor、mint Circuit #1。value 的确切收款/费用语义仍未关闭。

### Parameter mutability / owner powers

当前实现没有公开 supply/price setter，但 Processor/transistor 使用 beacon proxy；Factory 是 beacon owner，并可调用 `upgradeTo(address)`。因此不可宣称经济参数或实现永久不可变。

## 9. Remaining unknowns

以下问题仍会影响 GateSmith 最终参数，故本 gate 不能 READY：

1. `mint()` 的精确参数命名及 T1 的完整总价公式：是 `amount × mintPrice + protocolFee`，还是存在其他条件。
2. `protocolFee()` 的收款地址、分配路径和是否固定。
3. tape-out 的 1.3e15 wei 具体是固定 fee、protocol fee、Processor fee，还是组合支付；收款方尚未完整重建。
4. Processor 的 seal/freeze/admin surface，以及 Processor beacon 升级后的权限边界。
5. `minted()` 的精确计数口径，以及 supplyCap 是否按所有 primitive 总量还是按 token id 分别计算。
6. 1 NAND = 1 transistor 是否是协议普遍规则，还是当前编译器/样本的结果。

## 10. Implication for GateSmith parameter choice

本轮不选择最终 supply/price。只给出边界：

- 不应把 transistor 当作投资资产或承诺升值。
- 任何价格说明都必须把 `mintPrice`、`protocolFee`、tape-out native value 和 gas 分开。
- 在 T1 总价公式和 tape-out fee 未关闭前，不应发布“每个 Circuit 的确定 OKB 成本”。
- 如果继续做主网参数决策，必须先确认升级权、收款路径和 cap 计数口径。

## Sources and verification paths

- Factory / Processor / transistor：X Layer Mainnet RPC `https://rpc.xlayer.tech`
- Factory：`0x1f09daefa827f02cbb40967cc91b259763760761`
- Processor #0 creation tx：`0x3146c84559a24acd638f17ff8a2680b854ad838f1852365446b43d74d6b3a58c`
- Processor #1 creation tx：`0xaf7318e6df4f47c3c18706bfaa7d400b01dfd6d693c73528d6057412948eb7b1`
- T0 mint tx：`0x89ed16fc7d838f1db50f296f841fa43962bffca89b4ce32b3d64430bc1c143be`
- XOR tape-out tx：`0x407402bee88c4663f64ea2c4c3184277c381f32546c4bceaabc8a31776b49210`
- TapeOut × X Layer hackathon requirements：<https://ignix.bot/x_campaign>

