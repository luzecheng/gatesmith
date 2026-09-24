# X Layer Read-only Integration

状态：Milestone 3；只读验证，不包含 wallet、签名或交易。

## Adapter boundary

```text
Browser / development evidence view
  → POST /api/xlayer/eval
  → gatesmith_xlayer
  → eth_chainId
  → eth_getCode
  → eth_call
  → Processor.eval()
```

`gatesmith_core` 不导入 RPC 或 adapter。`gatesmith_xlayer` 只负责配置、JSON-RPC read calls、ABI 编解码和错误分类。

配置项：

- `rpc_url`：可配置；默认 `https://rpc.xlayer.tech`；
- `processor_address`：可配置；真实回归默认使用 `0x839bdd6fa7a66416a609a735e11de5411b98574e`；
- expected chain id：`196`。

## Verified eval encoding

已验证函数 selector：

```text
eval(uint256,bytes) = 0x934d06ea
```

对于 Circuit id `1`、输入 `0x01`，adapter 生成标准 ABI dynamic bytes calldata：

```text
selector
  + uint256 circuitId
  + uint256 offset = 0x40
  + uint256 input length
  + input bytes
  + 32-byte ABI padding
```

原始 X Layer `eth_call` 返回值是标准 ABI dynamic bytes：

```text
offset = 0x20
length = 0x01
data = 0x01
```

因此当前已验证的 Boolean output 范围是：解码后的 bytes 必须恰好为一个 byte，且为 `0x00` 或 `0x01`。

## Verified Circuit #1 scope

目标 Processor：

```text
0x839bdd6fa7a66416a609a735e11de5411b98574e
```

Circuit：`1`

XOR 输入编码（只对当前 Circuit #1 声明）：

```text
A=0, B=0 → input 0x00 → output 0x00
A=0, B=1 → input 0x01 → output 0x01
A=1, B=0 → input 0x02 → output 0x01
A=1, B=1 → input 0x03 → output 0x00
```

这不代表已验证 arbitrary input width、multiple outputs、LATCH 或 REF。

## Evidence endpoint

本地开发 endpoint：

```text
POST /api/xlayer/eval
```

请求示例：

```json
{
  "processor": "0x839bdd6fa7a66416a609a735e11de5411b98574e",
  "circuit_id": 1,
  "input": "0x01"
}
```

返回 evidence 字段：

- network；
- chain id；
- Processor；
- Circuit ID；
- eval input；
- raw output；
- decoded output bytes；
- decoded Boolean output；
- `rpc_verified`。

该 endpoint 只能执行 `eth_chainId`、`eth_getCode` 和 `eth_call`。没有 write method。

## Failure separation

- `rpc_unavailable`：RPC 无法访问；
- `wrong_chain`：返回的 Chain ID 不是 196；
- `contract_unavailable`：Processor 地址没有 code；
- `malformed_eval_input`：请求输入不是合法 ABI 输入 hex；
- `contract_revert`：`eth_call` revert；
- `decode_failure`：RPC 返回格式或 ABI output 无法解码；
- `local/on-chain mismatch`：由 integration script 报告，不标记 verified。

任何这些错误都不会返回 `rpc_verified: true` 的成功 evidence。
