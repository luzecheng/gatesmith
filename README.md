# GateSmith Core

GateSmith 把受支持的 Boolean expression 确定性地编译成 NAND-only netlist，并编码为与已观察 X Layer TapeOut 格式兼容的 bytes。

当前阶段是 Milestone 1：只有本地 parser、AST evaluator、truth table、NAND compiler、TapeOut encoder 和 NAND evaluator。

当前不包含：Web UI、AI、钱包、RPC、网络访问、TapeOut frontend 或交易发送。

## 运行测试

需要 Python 3.11 或更高版本：

```bash
python3 -m unittest discover -s tests -v
```

启动本地 UI：

```bash
python3 server.py 8765
```

然后打开 `http://127.0.0.1:8765`。M2 UI 只调用 Python authoritative core；当前没有 AI、钱包、RPC、Processor、tape-out 或 `eval()`。

支持的语法：

```text
NOT > AND > OR
```

支持变量 `A`、`B`、`C`、`D`，最多使用四个变量；支持括号和 `AND`、`OR`、`NOT`。
