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
```

浏览器没有重新实现 parser、compiler 或 evaluator。API 在返回结果前还会使用 NAND evaluator 对 truth table 做一次一致性检查。该 boundary 只在本地提供 HTTP，不连接 AI、wallet、RPC 或 X Layer。
```

代码不依赖 React、AI provider、wallet、RPC 或 TapeOut frontend。

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
