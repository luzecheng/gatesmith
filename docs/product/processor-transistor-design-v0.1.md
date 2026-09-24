# GateSmith Processor & Transistor Design V0.1

状态：M3.5 设计审查稿；等待 Product Owner 决定。  
日期：2026-09-24  
范围：产品与经济设计研究；没有部署、mint、tape-out 或发送交易。

## What the GateSmith Processor means

GateSmith Processor 不是一个为了满足比赛表格而创建的空壳合约。

它应代表：

> GateSmith 发布的一套可复核 Boolean rule manufacturing identity。

一个规则从自然语言经过人工确认、确定性编译，最终在这个 Processor 上变成 Circuit。Processor 地址因此成为规则产品的共同来源标识：陌生用户可以知道某个 Circuit 是 GateSmith 生成体系中的产物，而不是页面临时运行的 JavaScript。

拥有自己的 Processor 的真实产品价值：

1. **规则 provenance**：GateSmith 产生的 Circuit 有共同的 Processor 身份和公开来源。
2. **一致的规则生产资源**：所有 GateSmith MVP Circuit 使用同一套 transistor supply / price 约束。
3. **可独立复核**：第三方可以从 Processor、Circuit ID、netlist 和 `eval()` 结果复核规则。
4. **产品边界清晰**：GateSmith Processor 只服务于小型 Boolean rule，不需要借用其他项目的经济叙事。
5. **用户不需要拥有 Processor**：用户只需要使用 GateSmith 生成和确认规则；Processor 是公共基础设施身份。

`FACT`：Hackathon 要求 Processor 必须通过 TapeOut factory 部署在 X Layer，并公开 supply、unit price 和 cap（如有）。[IGNIX 官方规则](https://ignix.bot/x_campaign)  
`PRODUCT DECISION`：GateSmith Processor 的主要价值是规则身份和可复核生产环境，而不是交易资产。  
`ASSUMPTION`：X Layer 当前 Processor 的 metadata、transistor 经济参数和 Circuit provenance 能够稳定被公开读取。

## What a GateSmith transistor means

推荐把它解释为：

> 一个可消耗的 Boolean circuit-building resource，代表一个可用于 NAND netlist 的制造单位。

它不是：

- 投资份额；
- 治理权；
- 用户会员资格；
- Circuit 的所有权本身；
- 价格上涨承诺；
- 自动获得规则结果的 access pass。

它和用户体验的自然关系是：

```text
Human Rule
  → Boolean expression
  → NAND compiler
  → N NAND gates
  → N transistor units consumed
  → Circuit exists
```

### 可能的模型比较

| 模型 | 产品含义 | 优点 | 风险 |
|---|---|---|---|
| Manufacturing resource | 每个 transistor 是 tape-out 的制造消耗品 | 最贴合已验证 burn 机制 | 容易被误解成可交易资产 |
| Capacity unit | supply 表示 GateSmith 能发布多少电路容量 | 便于解释“为什么有限” | 可能把容量说得过于精确 |
| Access primitive | 持有 transistor 才能使用生产能力 | 有访问门槛概念 | 与 GateSmith 普通用户体验不一致，容易金融化 |
| Public infrastructure unit | 用于公共规则生产的基础单位 | 与“规则基础设施”一致 | 需要明确不代表治理或收益 |

`PRODUCT DECISION`：MVP 应采用 **manufacturing resource + public infrastructure unit** 的解释。不要采用 access token 或投资资产叙事。

## Verified X Layer mechanics

### 已经有链上证据的部分

真实 Processor：

```text
0x839bdd6fa7a66416a609a735e11de5411b98574e
```

真实历史 Processor 创建交易：

```text
0x3146c84559a24acd638f17ff8a2680b854ad838f1852365446b43d74d6b3a58c
```

已验证：

- Factory 创建函数 selector：`0x47f9b5fd`；
- 函数：`createCPU(string,string,string,uint256,uint256)`；
- 历史参数中包含 `supply = 100000`、`price = 0`；
- receipt 的 `CPUCreated` 事件包含 Processor、transistor contract、creator、supply、price；
- Processor 的 transistor contract：`0xbe0eee424c49d44592e4d498740f5b031ef8e26d`；
- tape-out 调用目标是 Processor 的 `tapeout(bytes,uint32,uint32)`；
- 真实 tape-out receipt 发出 ERC-1155 `TransferSingle`，从 creator 到零地址，token id `0`、数量 `4`；
- 同一 receipt 铸造 Circuit NFT #1，并发出 `TapedOut` 事件。

### 不能直接扩大解释的部分

- token id `0` 作为 NAND primitive 的语义来自事件数值、netlist 和 `TapedOut` 数量的组合推断；
- unit price 的完整计价、付款路径和可修改性没有完整公开 ABI 证据；
- 真实历史 Processor 当前对 token id `0` 的 creator balance 只读查询返回 `99990`，但这不是总 supply、cap 或完整流通量证明；
- 当前合约 upgrade/seal 状态没有闭合，不能宣传为永久 immutable 经济系统。

## Unknown mechanics

### Cap semantics

本轮没有确认 cap 的 exact semantics。

证据：

1. 已反解的 Factory 函数是：

   ```text
   createCPU(string,string,string,uint256,uint256)
   ```

2. 历史 calldata 的两个 `uint256` 已解码为 supply 和 price；没有第三个 cap 数值参数。
3. Processor 上用标准候选名称尝试读取 `cap()`、`maxSupply()`、`supply()`、`price()`、`totalTransistors()` 等，没有得到可确认的正常返回语义。
4. Hackathon 页面要求公开“supply, unit price and any cap”，但没有定义 cap 在 X Layer 合约中的具体字段含义。[IGNIX 规则](https://ignix.bot/x_campaign)

结论：

`cap = UNVERIFIED`

可能的含义包括额外的购买上限、用户上限、交易上限、或在某个版本中根本不存在独立字段；本轮不猜。没有完成 cap ABI/状态语义核验前，不建议填写主网 cap 参数。

## Lifecycle

```text
Processor deployment
  ↓
transistor availability
  ↓
user builds a Boolean rule
  ↓
compiler counts NAND gates
  ↓
tapeout(netlist, inputCount, outputCount)
  ↓
transistor units consumed/burned
  ↓
Circuit NFT / Circuit ID exists
  ↓
Circuit.eval(input)
```

状态标签：

- `VERIFIED`：Factory 创建 Processor；Processor 接收 tape-out；历史 receipt 有 ERC-1155 burn、Circuit NFT mint 和 TapedOut event；已有 Circuit 可 `eval()`。
- `INFERENCE`：消耗数量与 NAND gate 数量对应；每个 NAND 是一个制造单位；transistor supply 代表可生产的 gate capacity。
- `UNVERIFIED`：cap exact semantics、完整经济付款路径、seal/upgrade permanence、未来 Processor 版本的全部 token 行为。

## Supply design

### 产品估算

MVP 典型规则的 NAND 数量不是固定值：

- 简单 NOT：约 1 gate；
- 两输入 AND：约 2 gates；
- 两输入 OR：约 3 gates；
- 两输入 XOR：4 gates；
- `(A AND B) OR C`：5 gates；
- 带 3–4 个变量和嵌套 NOT 的规则：大致可预留 8–20 gates；
- 复杂但仍在 V0.1 AST 限制内的规则可能更高。

这些是当前 compiler 的产品估算，不是 X Layer gas 或协议上限。

### 数量级分析

如果初始 supply 为 `100000`：

- 按 5 gates/Circuit，理论上约 20,000 个 Circuit；
- 按 10 gates/Circuit，理论上约 10,000 个 Circuit；
- 按 20 gates/Circuit，理论上约 5,000 个 Circuit。

实际可用数量还会受到其他用户、无效尝试、协议费用和版本经济规则影响。

`FACT`：历史 X Layer Processor 创建交易使用 `supply = 100000`。  
`PRODUCT DECISION`：100,000 是一个有历史参照、又足够支撑 Hackathon Demo 的数量级，不代表协议推荐值。  
`ASSUMPTION`：每个 NAND 的 transistor 消耗在 GateSmith 未来 Processor 上保持当前观察到的关系。

不建议无限 supply，因为 GateSmith 需要有清晰的公共生产容量边界；也不建议极端稀缺，因为它会让一个简单规则的 tape-out 变成抢额度或资产投机问题。

## Unit price design

当前 OKB 参考价约为 **$118/OKB**，查询时间为 2026-09-24；OKX 页面约为 $117.98，CoinGecko 页面约为 $118.35。价格波动，只用于粗略换算，不是投资建议。[OKX OKB price](https://www.okx.com/en-us/price/okb-okb)、[CoinGecko OKB](https://www.coingecko.com/en/coins/okb)

换算示例：

| Unit price | 约 USD/transistor | 5-gate Circuit | 20-gate Circuit |
|---:|---:|---:|---:|
| `0 OKB` | `$0` | `0 OKB` | `0 OKB` |
| `0.00001 OKB` | `$0.00118` | `0.00005 OKB` / `$0.0059` | `0.0002 OKB` / `$0.0236` |
| `0.00005 OKB` | `$0.0059` | `0.00025 OKB` / `$0.0295` | `0.001 OKB` / `$0.118` |
| `0.0001 OKB` | `$0.0118` | `0.0005 OKB` / `$0.059` | `0.002 OKB` / `$0.236` |

另外分开考虑：

- Processor deployment gas；
- transistor mint/payment 机制的实际费用；
- tape-out transaction gas；
- RPC 或钱包本身不应被当成 transistor price。

当前无法从公开完整 ABI 中确认所有费用路径，因此表格只是产品层敏感性分析。

## Candidate economic models

以下模型不排名，也不是最终参数建议。所有 cap 字段都受 `UNVERIFIED` 限制。

### Model A — Public Rule Fabric

| 参数 | 设计 |
|---|---|
| supply | `100000` transistor |
| unit price | `0.00001 OKB`，约 `$0.00118`/unit，以 2026-09-24 约 `$118/OKB` 粗算 |
| cap | `UNVERIFIED`；不在语义确认前填写额外 cap |
| intended usage | 公开规则创建、Hackathon 评审、低门槛 Circuit 体验 |
| expected capacity | 约 5,000–20,000 个 5–20 gate Circuit，理论估算 |

优点：用户成本低，能让规则产品真正被试用，不依赖资产升值。  
取舍：低价可能带来 spam，需要前端限制和清晰的规则规模 guard；不能用高价阻止 spam。

### Model B — Moderated Infrastructure

| 参数 | 设计 |
|---|---|
| supply | `100000` transistor |
| unit price | `0.00005 OKB`，约 `$0.0059`/unit |
| cap | `UNVERIFIED`；不建议假设含义 |
| intended usage | 面向真实活动方和长期规则发布者 |
| expected capacity | 理论仍约 5,000–20,000 个简单 Circuit |

优点：每次 tape-out 有轻微成本，能降低无意义重复生产。  
取舍：5-gate Circuit 约 `$0.03`，20-gate Circuit 约 `$0.12`，对 Hackathon Demo 仍低，但已经不是完全免费体验。

### Model C — Small Reserved Batch

| 参数 | 设计 |
|---|---|
| supply | `10000` transistor |
| unit price | `0.0001 OKB`，约 `$0.0118`/unit |
| cap | `UNVERIFIED`；不能通过 cap 语义来补偿 supply 设计 |
| intended usage | 明确只做小规模实验和精选公开规则 |
| expected capacity | 理论约 500–2,000 个 5–20 gate Circuit |

优点：资源边界容易解释，经济实验规模小。  
取舍：如果出现重复测试或其他用户使用，容易过早耗尽；不适合需要陌生用户自由体验的 Demo。

## Recommended parameter boundary

这不是最终选择，只是风险边界。

### Technically safe range

- supply：`50000–200000`，前提是 cap 语义不要求额外字段；
- unit price：`0–0.00005 OKB`/transistor；
- 典型 5–20 gate Circuit 的 transistor cost 应保持在微小、可解释的金额；
- cap：在 exact semantics 确认前保持 `UNVERIFIED`，不填写猜测值。

### Product-consistent range

- supply 接近历史 `100000` 数量级；
- unit price 以免费或低于 `0.00005 OKB` 为主；
- 不把 transistor 命名、页面或价格包装成投资产品；
- 明确显示“每个 Circuit 消耗多少 gate capacity”。

### Dangerous / unjustified range

- supply 小于 `10000`，却希望陌生用户自由试用；
- unit price 高于 `0.001 OKB`/transistor，却没有真实成本依据；
- 任何未理解语义的 cap 数值；
- 声称价格会升值、用户可获利或 transistor 是收益资产；
- 把 supply 限制误称为 Circuit quality 或用户权限；
- 在 upgrade/seal 未确认前声称经济参数永久不可变。

## Abuse / Economic Risks

### Transistor exhaustion

如果用户重复 tape-out、生成超大规则或 spam，supply 会减少。需要在产品层限制 AST、gate count、重复提交和明显无效操作；不需要复杂 tokenomics。

### Accidental underpricing

低价可能导致 spam 或无意义 Circuit 消耗，但有利于 Hackathon 体验。应该先控制 gate count 和流程，而不是简单把价格提高。

### Accidental overpricing

过高价格会让普通用户无法完成第一条规则，也会把产品重心从“规则验证”推向资产交易。

### Spam

MVP 可用的简单措施：

- 最大 4 inputs；
- 最大 AST nodes；
- 最大 NAND count；
- tape-out 前明确展示 gate cost；
- 不提供自动重复 tape-out。

### Unusable supply

太小的 supply 会让公开 Demo 和陌生评审无法使用；太大的 supply 又会让数字失去产品解释力。`100000` 是有历史参照的起点，不是稀缺性营销。

### Irreversible parameter mistakes

历史 Processor 创建参数至少包含 supply 和 price；当前不能假设后续可以修改。创建前必须人工复核 name、supply、price 和 cap disclosure。

### Owner/admin powers

当前 X Layer 合约的完整 owner、upgrade authority、seal 和参数修改权限尚未闭合。不能把 Processor 作为 fully immutable infrastructure 宣传。

### Upgrade/seal uncertainty

如果合约仍可升级，Circuit 规则的长期信任边界就不同于已封存系统。Demo 可以展示当前链上证据，但不能提前承诺永久不变。

## Hackathon alignment

官方页面明确要求：


- Processor 通过 TapeOut factory 部署在 X Layer；
- supply、unit price 和任何 cap 在部署时设置并公开披露；
- 至少一个 Circuit 在 Processor 上 tape-out；
- clear use case；
- 提交 Processor contract、deployment wallet、product demo 和 project description；
- 评审包含 asset issuance design、X Layer integration、contract security/economic model；
- Mainnet launch required。[IGNIX 官方规则](https://ignix.bot/x_campaign)

GateSmith 设计对应关系：

- Processor：GateSmith rule manufacturing identity；
- transistor：Circuit 的可消耗 NAND manufacturing resource；
- supply/price：公开、低门槛的规则生产容量；
- Circuit：真实产品规则 artifact；
- `eval()`：公开可调用的执行证据。

这里没有对获奖概率做判断，也不把交易量或资产价格当作目标。官方规则也明确说明评审不以 trading volume 或 asset price alone 为依据。

## Decisions required from Product Owner

Product Owner 需要决定：

1. 是否接受 Processor 作为 GateSmith 的规则生产身份，而不是单纯比赛资产；
2. transistor 是否采用“manufacturing resource + public infrastructure unit”解释；
3. 选择公共低价、moderated infrastructure 或小批量模型中的一个方向；
4. supply 是否接受 `100000` 数量级；
5. unit price 是否采用 `0`、`0.00001` 或 `0.00005 OKB` 的可用性取向；
6. 在 cap semantics 没有闭合前，是否暂停主网参数决策；
7. 是否接受当前 upgrade/seal 未知项作为主网前 blocker；
8. 第一次真实规则应控制在多少 NAND gates 以内。

## Boundary

本文件不授权：

- 创建 Processor；
- mint transistor；
- tape-out Circuit；
- 发送或确认主网交易；
- 决定最终 supply、price 或 cap。

