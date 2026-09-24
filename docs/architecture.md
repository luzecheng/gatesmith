# GateSmith Milestone 1 Architecture

## Scope

Milestone 1 是纯本地 deterministic core；Milestone 2 增加了一个不改变核心逻辑的本地 Web boundary：

```text
source string
  → lexer/parser
  → immutable AST
  → independent AST evaluator
  → canonical truth table
  → NAND compiler
  → TapeOut byte encoder
  → independent NAND evaluator

Milestone 2 的关系是：

```text
Browser UI
  → POST /api/build
  → Python server boundary
  → gatesmith_core authoritative implementation
  → JSON metadata for rendering

M3 增加独立的只读链路：

```text
Browser / development evidence view
  → POST /api/xlayer/eval
  → gatesmith_xlayer read-only adapter
  → eth_chainId
  → eth_getCode
  → eth_call
  → Processor.eval()
```

`gatesmith_xlayer` 不被 `gatesmith_core` 导入。它只构造 `eval(uint256,bytes)` calldata、读取合约和解码返回值，没有 wallet、private key、签名或 write method。RPC URL 和 Processor address 通过配置提供，不把网络错误伪装成 Circuit 失败。
```

浏览器没有重新实现 parser、compiler 或 evaluator。API 在返回结果前还会使用 NAND evaluator 对 truth table 做一次一致性检查。该 boundary 只在本地提供 HTTP，不连接 AI、wallet、RPC 或 X Layer。
```

M1 deterministic core 不依赖 React、AI provider、wallet、RPC 或 TapeOut frontend。M3 的 RPC 依赖只存在于独立 `gatesmith_xlayer` adapter。

## Grammar

```text
expression := or-expression
or-expression := and-expression (OR and-expression)*
and-expression := unary-expression (AND unary-expression)*
unary-expression := NOT unary-expression | primary
primary := variable | '(' expression ')'
variable := A | B | C | D
```

Precedence is fixed as:

```text
NOT > AND > OR
```

## Canonical AST

The AST uses immutable nodes: `Var`, `Not`, `And`, and `Or`. Canonical text uses forms such as:

```text
OR(AND(NOT(A),B),C)
```

The compiler traverses the same AST deterministically and memoizes repeated subexpressions.

## NAND representation

Observed X Layer combinational subset:

```text
signal 0 = ZERO
signal 1 = ONE
input signals begin at 2
each NAND appends one signal
```

Each gate is seven bytes:

```text
0x00 | left:uint24 big-endian | right:uint24 big-endian
```

The encoder rejects future references and references that do not fit in uint24. LATCH, REF, multiple outputs, and other opcodes are intentionally outside Milestone 1.

## XOR regression

The supported expression:

```text
(A AND NOT B) OR (NOT A AND B)
```

is compiled by the generic two-input truth-table optimizer, not by a string or byte special case. It reproduces the real fixture:

```text
00000002000003000000020000040000000300000400000005000006
```

## Complexity guards

- maximum variables: 4;
- maximum AST nodes: 31;
- maximum emitted NAND gates: 64;
- two-input truth-table synthesis search depth: 8 gates;
- invalid/future signal references are rejected by the encoder.

These are safety limits for V0.1, not claims about the maximum X Layer circuit size.

## Milestone 2 UI boundary

当前 UI 只覆盖 `Rule → Verify → Circuit`：输入 expression、调用本地 Python core、展示 normalized rule、完整 truth table、Circuit summary、bytes/hash technical evidence，以及本地 `Confirm Rule` 状态。修改输入会使此前确认失效。

本阶段没有 AI interpretation、钱包、Processor、tape-out 或 `eval()`；UI 中的确认只是对当前本地 compiled artifact 的人工确认，不是链上签名。

M3 的 adapter 已经实现 `eval()` read-only 调用，但当前 UI 仍然不使用它；真实链上集成通过独立脚本和 integration test 执行。

## Milestone 4 AI boundary

M4 adds an optional proposal path:

```text
Browser
  → POST /api/interpret
  → gatesmith_ai provider adapter
  → untrusted structured proposal
  → deterministic parser validation
  → Browser review/edit
  → POST /api/build
  → gatesmith_core authoritative truth table/compiler/evaluator
```

The AI adapter never creates a truth table, NAND topology, encoded bytes, hash,
transaction, signature, or wallet action. It rejects proposals that try to
provide those authoritative fields. `verified: false` and
`authority: ai_proposal_only` are added by the local boundary, not supplied by
the provider.

Provider configuration is server-side only through `GATESMITH_AI_API_KEY` and
optional `GATESMITH_AI_MODEL`. The adapter defaults to and only permits the
official OpenRouter Chat Completions endpoint
`https://openrouter.ai/api/v1/chat/completions`; a different
`GATESMITH_AI_ENDPOINT` is rejected before any request, so the key cannot be
sent to an arbitrary host. No credentials are read by the browser or written
to logs/repository. With no key, the interpretation endpoint returns
`ai_unavailable`, while `/api/build` remains fully usable.

The browser displays AI output as `NOT VERIFIED`. The user may edit meanings,
reject the proposal, or copy its expression into the existing Boolean input.
Only the explicit Build Circuit action sends the expression to the
authoritative deterministic core. Any change to the expression or proposed
meanings invalidates the current local confirmation.
