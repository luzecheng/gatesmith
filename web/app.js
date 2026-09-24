const I18N = {
  en: {
    publicDemo: 'PUBLIC DEMO · V0.1', heroEyebrow: 'RULE → VERIFY → CIRCUIT', heroTitle: 'Make a rule', heroTitleEm: 'you can inspect.', heroCopy: 'Turn a human rule into a Boolean circuit you can inspect locally and verify live on X Layer.',
    trustAiTitle: 'AI proposes.', trustAiCopy: 'Interpretation is optional and not verified.', trustHumanTitle: 'Humans confirm.', trustHumanCopy: 'You review the Boolean meaning and truth table.', trustCodeTitle: 'Deterministic code compiles.', trustCodeCopy: 'The local core produces the NAND artifact.', trustChainTitle: 'X Layer executes.', trustChainCopy: 'Live `eval()` results are read-only evidence.',
    advancedTitle: 'Advanced / Product Owner Controls', advancedCopy: 'Mainnet write operations · not part of the normal public demo flow', deployTitle: 'Deploy GateSmith Processor', walletManual: 'OKX Wallet · manual confirmation only', deployCopy: 'This is a review-only transaction request for the frozen X Layer deployment. GateSmith never receives keys and never signs or sends automatically.', connectWallet: 'Connect OKX Wallet', reviewDeployment: 'Review Deployment', readyToReview: 'READY TO REVIEW', hardStopPassed: 'HARD-STOP CHECKS PASSED', mintTitle: 'Genesis Circuit · Mint Transistors', mintCopy: 'Mint only the frozen NAND inventory for the Genesis Circuit. Review is read-only; the wallet request is created only by the final mint button.', reviewMint: 'Review Mint', tapeoutTitle: 'Genesis Circuit · Tape Out', walletExact: 'OKX Wallet · exact value only', tapeoutCopy: 'Create the frozen A AND B Circuit only after reviewing the exact netlist, inventory, calldata, and tapeout value.', reviewTapeout: 'Review Tapeout',
    ruleTitle: 'Enter a human rule', ruleHint: 'AI optional · deterministic core required', plainRule: 'Plain-language rule', optional: 'optional', defaultRule: 'Approve only when both Alice and Bob approve.', askAi: 'Ask AI', aiProposal: 'AI PROPOSED INTERPRETATION', notVerified: 'NOT VERIFIED', proposedBoolean: 'PROPOSED BOOLEAN RULE', useExpression: 'Use this expression', reject: 'Reject', booleanExpression: 'Boolean expression', buildRule: 'Build Boolean Rule', tryExamples: 'Try:', reviewBoolean: 'Review Boolean rule', localResult: 'DETERMINISTIC LOCAL RESULT', normalizedRule: 'NORMALIZED RULE', nandCircuit: 'Deterministic NAND circuit', inputs: 'inputs', nandGates: 'NAND gates', output: 'output', bytes: 'bytes', confirmArtifact: 'Confirm artifact', confirmCopy: 'Confirm that the normalized rule, truth table, and compiled circuit match your intent.', confirmRule: 'Confirm Rule', circuitEvidence: 'Circuit evidence', viewDetails: 'View details +', encodedNetlist: 'ENCODED NETLIST', deterministicHash: 'DETERMINISTIC SHA-256',
    genesisMeaning: 'Approve only when both Alice and Bob approve.', circuitOne: 'CIRCUIT #1', xLayerMainnet: 'X LAYER MAINNET', genesisIntro: 'Try any rule locally above. Below is GateSmith’s deployed Genesis example: A AND B, taped out as Circuit #1 on X Layer Mainnet.', twoNand: '2 NAND gates', localEqualsLive: 'Local deterministic result = X Layer Circuit #1', network: 'Network', cpuId: 'CPU ID', processor: 'Processor', transistor: 'Transistor', circuitId: 'Circuit ID', rule: 'Rule', meaning: 'Meaning', nand: 'NAND', netlist: 'Netlist', sha256: 'Netlist SHA-256', copy: 'Copy', liveVerification: 'LIVE X LAYER VERIFICATION', liveCopy: 'Runs four read-only `eth_call` evaluations against Circuit #1. A failure is shown as failure; it is never reported as verified.', input: 'INPUT', local: 'LOCAL', xLayer: 'X LAYER', result: 'RESULT', verifyXLayer: 'Verify on X Layer', mainnetEvidence: 'Public Mainnet transaction evidence', copyHashes: 'Copy transaction hashes +', processorCreation: 'PROCESSOR CREATION', transistorMint: 'TRANSISTOR MINT', genesisTapeout: 'GENESIS TAPEOUT', explorerNote: 'Explorer deep links unavailable; verification uses direct X Layer RPC.', footerLeft: 'GateSmith MVP · proposal, deterministic compile, live evidence', footerRight: 'Public demo is read-only by default',
    notConfirmed: 'Not confirmed', awaitingBuild: 'Awaiting build', thinking: 'Thinking…', compiling: 'Compiling', buildCircuit: 'Build Circuit', confirmed: 'Confirmed', verificationNotRun: 'Not run', verificationRunning: 'Running 4 read-only calls…', verificationMatch: '4 / 4 MATCH', verificationFailed: 'Verification failed', liveFailure: 'Live X Layer verification failed', mismatch: 'rows matched; live result is not verified.', noExplanation: 'No explanation provided.', aiUnavailable: 'AI interpretation is unavailable. You can use the Boolean workflow below.', interpretationFailed: 'Interpretation failed.', deterministicAvailable: 'The deterministic Boolean workflow remains available.', compilerRejected: 'The compiler rejected this expression.', buildFailed: 'Build failed.', walletNotConnected: 'Wallet not connected', connectFirst: 'Connect OKX Wallet first.', identityPassedDeploy: 'Identity and network checks passed. Review every field before deploying.', identityPassedMint: 'Identity and network checks passed. Review every mint field before continuing.', identityPassedTapeout: 'Identity, inventory, calldata, and exact-value checks passed. Review every field before continuing.', waitingWallet: 'Waiting for your OKX Wallet confirmation…', connectionRejected: 'Connection rejected by the user.', transactionRejected: 'Transaction rejected by the user. No action was confirmed.', copied: 'Copied', copyUnavailable: 'Copy unavailable'
  },
  zh: {
    publicDemo: '公开演示 · V0.1', heroEyebrow: '规则 → 验证 → 电路', heroTitle: '创建一条规则', heroTitleEm: '并让它可检查。', heroCopy: '将人类规则转换为 Boolean 电路，在本地检查，并在 X Layer 上实时验证。',
    trustAiTitle: 'AI 提议。', trustAiCopy: '解释是可选的，且不具备 verified authority。', trustHumanTitle: '人类确认。', trustHumanCopy: '你检查 Boolean 含义和 truth table。', trustCodeTitle: '确定性代码编译。', trustCodeCopy: '本地 core 生成 NAND artifact。', trustChainTitle: 'X Layer 执行。', trustChainCopy: '实时 `eval()` 结果是只读证据。',
    advancedTitle: 'Advanced / Product Owner Controls', advancedCopy: '主网写操作 · 不属于普通公开演示流程', deployTitle: '部署 GateSmith Processor', walletManual: 'OKX Wallet · 仅手动确认', deployCopy: '这是冻结 X Layer 部署的只读审查交易请求。GateSmith 不接收密钥，也不会自动签名或发送。', connectWallet: '连接 OKX Wallet', reviewDeployment: '审查部署', readyToReview: '准备审查', hardStopPassed: '硬停止检查通过', mintTitle: 'Genesis Circuit · 铸造 Transistor', mintCopy: '仅为 Genesis Circuit 铸造冻结的 NAND 库存。审查是只读的，只有最终按钮会创建钱包请求。', reviewMint: '审查 Mint', tapeoutTitle: 'Genesis Circuit · Tape Out', walletExact: 'OKX Wallet · 仅使用精确金额', tapeoutCopy: '只有在审查精确 netlist、库存、calldata 和 tapeout 金额后，才创建冻结的 A AND B Circuit。', reviewTapeout: '审查 Tapeout',
    ruleTitle: '输入一条人类规则', ruleHint: 'AI 可选 · 必须使用确定性 core', plainRule: '自然语言规则', optional: '可选', defaultRule: '只有 Alice 和 Bob 都同意时才通过。', askAi: '询问 AI', aiProposal: 'AI 提议的解释', notVerified: '未验证', proposedBoolean: '提议的 Boolean 规则', useExpression: '使用此表达式', reject: '拒绝', booleanExpression: 'Boolean 表达式', buildRule: '构建 Boolean 规则', tryExamples: '试试：', reviewBoolean: '审查 Boolean 规则', localResult: '确定性本地结果', normalizedRule: '规范化规则', nandCircuit: '确定性 NAND 电路', inputs: '输入', nandGates: 'NAND 门', output: '输出', bytes: '字节', confirmArtifact: '确认 artifact', confirmCopy: '确认规范化规则、truth table 和编译后的电路符合你的意图。', confirmRule: '确认规则', circuitEvidence: '电路证据', viewDetails: '查看详情 +', encodedNetlist: '编码后的 NETLIST', deterministicHash: '确定性 SHA-256',
    genesisMeaning: '只有 Alice 和 Bob 都同意时才通过。', circuitOne: 'CIRCUIT #1', xLayerMainnet: 'X LAYER 主网', genesisIntro: '你可以在上方本地尝试任意规则。下方是 GateSmith 已部署的 Genesis 示例：A AND B，作为 Circuit #1 在 X Layer 主网上完成 tapeout。', twoNand: '2 个 NAND 门', localEqualsLive: '本地确定性结果 = X Layer Circuit #1', network: '网络', cpuId: 'CPU ID', processor: 'Processor', transistor: 'Transistor', circuitId: 'Circuit ID', rule: '规则', meaning: '含义', nand: 'NAND', netlist: 'Netlist', sha256: 'Netlist SHA-256', copy: '复制', liveVerification: 'X LAYER 实时验证', liveCopy: '对 Circuit #1 执行四次只读 `eth_call`。失败会显示为失败，不会被显示为已验证。', input: '输入', local: '本地', xLayer: 'X LAYER', result: '结果', verifyXLayer: '在 X Layer 上验证', mainnetEvidence: '公开主网交易证据', copyHashes: '复制交易 hash +', processorCreation: 'PROCESSOR 创建', transistorMint: 'TRANSISTOR Mint', genesisTapeout: 'GENESIS TAPEOUT', explorerNote: 'Explorer 深链接不可用；验证使用直接 X Layer RPC。', footerLeft: 'GateSmith MVP · 提议、确定性编译、实时证据', footerRight: '公开演示默认是只读的',
    notConfirmed: '未确认', awaitingBuild: '等待构建', thinking: '思考中…', compiling: '编译中', buildCircuit: '构建电路', confirmed: '已确认', verificationNotRun: '尚未运行', verificationRunning: '正在运行 4 次只读调用…', verificationMatch: '4 / 4 MATCH', verificationFailed: '验证失败', liveFailure: 'X Layer 实时验证失败', mismatch: '行匹配；实时结果未验证。', noExplanation: '未提供解释。', aiUnavailable: 'AI 解释不可用。你仍可使用下方 Boolean 流程。', interpretationFailed: '解释失败。', deterministicAvailable: '确定性 Boolean 流程仍可用。', compilerRejected: '编译器拒绝了此表达式。', buildFailed: '构建失败。', walletNotConnected: 'Wallet 未连接', connectFirst: '请先连接 OKX Wallet。', identityPassedDeploy: '身份和网络检查通过。请在部署前审查所有字段。', identityPassedMint: '身份和网络检查通过。请在继续前审查所有 Mint 字段。', identityPassedTapeout: '身份、库存、calldata 和精确金额检查通过。请在继续前审查所有字段。', waitingWallet: '等待 OKX Wallet 确认…', connectionRejected: '用户拒绝了连接。', transactionRejected: '用户拒绝了交易。未确认任何操作。', copied: '已复制', copyUnavailable: '无法复制'
  }
};
Object.assign(I18N.en, { mintButton: 'Mint 2 NAND Transistors', tapeoutButton: 'Tape Out Genesis Circuit', networkLabel: 'Network', walletLabel: 'Connected wallet', factoryLabel: 'Factory', methodLabel: 'Method', nameLabel: 'name', symbolLabel: 'symbol', storyLabel: 'story', supplyCapLabel: 'supplyCap', mintPriceLabel: 'mintPrice', valueLabel: 'msg.value', calldataHashLabel: 'calldata SHA-256', genesisCircuitLabel: 'Genesis Circuit', requiredNandLabel: 'Required NAND', primitiveLabel: 'primitiveId', amountLabel: 'amount', protocolFeeLabel: 'protocolFee', humanRuleLabel: 'Human rule', truthTableLabel: 'Truth table', currentInventoryLabel: 'Current NAND inventory', inputsOutputsLabel: 'Inputs / outputs', exactCalldataLabel: 'Exact calldata SHA-256', tapeoutValueLabel: 'Tapeout value', deployWarning: 'Deploy opens an OKX Wallet confirmation request only after you click the button. Review target, value, network, and calldata in OKX Wallet before confirming.', mintWarning: 'Mint opens an OKX Wallet confirmation request only after you click the button. Confirm target, amount, value, and network in OKX Wallet.', tapeoutWarning: 'Tape Out opens an OKX Wallet confirmation request only after you click the final button. The tapeout value must be exactly 0.0013 OKB; no buffer is added.' });
Object.assign(I18N.zh, { mintButton: '铸造 2 个 NAND Transistor', tapeoutButton: 'Tape Out Genesis Circuit', networkLabel: '网络', walletLabel: '已连接钱包', factoryLabel: 'Factory', methodLabel: '方法', nameLabel: 'name', symbolLabel: 'symbol', storyLabel: 'story', supplyCapLabel: 'supplyCap', mintPriceLabel: 'mintPrice', valueLabel: 'msg.value', calldataHashLabel: 'calldata SHA-256', genesisCircuitLabel: 'Genesis Circuit', requiredNandLabel: '所需 NAND', primitiveLabel: 'primitiveId', amountLabel: '数量', protocolFeeLabel: 'protocolFee', humanRuleLabel: '自然语言规则', truthTableLabel: 'Truth table', currentInventoryLabel: '当前 NAND 库存', inputsOutputsLabel: '输入 / 输出', exactCalldataLabel: '精确 calldata SHA-256', tapeoutValueLabel: 'Tapeout 金额', deployWarning: '只有点击按钮后才会创建 OKX Wallet 确认请求。请在 OKX Wallet 中确认目标、金额、网络和 calldata。', mintWarning: '只有点击按钮后才会创建 OKX Wallet 确认请求。请在 OKX Wallet 中确认目标、数量、金额和网络。', tapeoutWarning: '只有点击最终按钮后才会创建 OKX Wallet 确认请求。Tapeout 金额必须精确为 0.0013 OKB；不会添加缓冲。' });
let language = window.localStorage?.getItem?.('gatesmith-language') === 'zh' ? 'zh' : 'en';
function t(key) { return I18N[language][key] ?? I18N.en[key] ?? key; }
function applyLanguage() {
  if (document.documentElement) document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const textNode = [...element.childNodes].find((node) => node.nodeType === 3);
    if (textNode) textNode.nodeValue = t(element.dataset.i18n);
    else element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  const englishButton = document.querySelector('#language-en');
  const chineseButton = document.querySelector('#language-zh');
  englishButton?.classList?.toggle?.('active', language === 'en');
  chineseButton?.classList?.toggle?.('active', language === 'zh');
  if (typeof renderTruthTable === 'function' && currentResult) renderTruthTable(currentResult);
  if (typeof renderLiveRows === 'function') renderLiveRows();
  if (liveStatus?.classList?.contains?.('running')) liveStatus.textContent = t('verificationRunning');
  if (liveStatus?.classList?.contains?.('verified')) liveStatus.textContent = t('verificationMatch');
  if (liveStatus?.classList?.contains?.('failed')) liveStatus.textContent = t('verificationFailed');
  if (confirmState && !confirmedHash) confirmState.textContent = currentResult ? t('notConfirmed') : t('awaitingBuild');
}
function setLanguage(nextLanguage) {
  if (nextLanguage !== 'en' && nextLanguage !== 'zh') return;
  language = nextLanguage;
  window.localStorage?.setItem?.('gatesmith-language', language);
  applyLanguage();
}

const expressionInput = document.querySelector('#expression');
const descriptionInput = document.querySelector('#description');
const interpretButton = document.querySelector('#interpret');
const proposalBox = document.querySelector('#proposal');
const proposalInputs = document.querySelector('#proposal-inputs');
const proposalExpression = document.querySelector('#proposal-expression');
const proposalExplanation = document.querySelector('#proposal-explanation');
const proposalWarning = document.querySelector('#proposal-warning');
const useProposalButton = document.querySelector('#use-proposal');
const rejectProposalButton = document.querySelector('#reject-proposal');
const buildButton = document.querySelector('#build');
const resultSection = document.querySelector('#result');
const errorBox = document.querySelector('#error');
const confirmButton = document.querySelector('#confirm');
const confirmState = document.querySelector('#confirm-state');
let currentResult = null;
let confirmedHash = null;
let currentProposal = null;

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = '';
}

function invalidateConfirmation() {
  confirmedHash = null;
  confirmButton.disabled = !currentResult;
  confirmState.textContent = currentResult ? t('notConfirmed') : t('awaitingBuild');
  confirmState.className = 'confirm-state';
}

function hideProposal() {
  currentProposal = null;
  proposalBox.hidden = true;
  proposalInputs.replaceChildren();
}

function renderProposal(proposal) {
  currentProposal = proposal;
  proposalInputs.replaceChildren();
  proposalExpression.textContent = proposal.expression;
  proposalExplanation.textContent = proposal.explanation || t('noExplanation');
  const warnings = [...(proposal.ambiguity ? [proposal.ambiguity] : []), ...(proposal.warnings || [])];
  proposalWarning.textContent = warnings.join(' ');
  proposalWarning.hidden = warnings.length === 0;
  proposal.inputs.forEach((item) => {
    const row = document.createElement('label');
    row.className = 'proposal-input';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const meaning = document.createElement('input');
    meaning.value = item.meaning;
    meaning.dataset.variable = item.name;
    meaning.addEventListener('input', () => {
      item.meaning = meaning.value;
      invalidateConfirmation();
    });
    row.append(name, meaning);
    proposalInputs.append(row);
  });
  proposalBox.hidden = false;
}

async function interpretRule() {
  clearError();
  interpretButton.disabled = true;
  interpretButton.textContent = t('thinking');
  try {
    const response = await fetch('/api/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: descriptionInput.value }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || t('aiUnavailable'));
    renderProposal(payload.proposal);
  } catch (error) {
    showError(`${error.message || t('interpretationFailed')} ${t('deterministicAvailable')}`);
  } finally {
    interpretButton.disabled = false;
    interpretButton.innerHTML = `${t('askAi')} <span>↗</span>`;
  }
}

function renderTruthTable(result) {
  const head = document.querySelector('#table-head');
  const body = document.querySelector('#table-body');
  head.innerHTML = `<tr>${result.inputs.map((name) => `<th>${name}</th>`).join('')}<th>${t('result')}</th></tr>`;
  body.innerHTML = result.truth_table.map((row) => `<tr>${result.inputs.map((name) => `<td><span class="bit bit-${row.inputs[name] ? 'on' : 'off'}">${row.inputs[name] ? '1' : '0'}</span></td>`).join('')}<td><strong class="result-bit">${row.result ? '1' : '0'}</strong></td></tr>`).join('');
}

function renderResult(result) {
  currentResult = result;
  document.querySelector('#normalized').textContent = result.normalized;
  document.querySelector('#input-count').textContent = result.inputs.length;
  document.querySelector('#gate-count').textContent = result.nand_count;
  document.querySelector('#output-count').textContent = result.output_count;
  document.querySelector('#byte-length').textContent = result.byte_length;
  document.querySelector('#netlist-bytes').textContent = `0x${result.netlist_bytes}`;
  document.querySelector('#netlist-hash').textContent = result.netlist_sha256;
  renderTruthTable(result);
  resultSection.hidden = false;
  invalidateConfirmation();
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function buildCircuit() {
  clearError();
  buildButton.disabled = true;
  buildButton.innerHTML = `${t('compiling')} <span class="spinner">◌</span>`;
  try {
    const response = await fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expression: expressionInput.value }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || t('compilerRejected'));
    renderResult(payload.result);
  } catch (error) {
    currentResult = null;
    resultSection.hidden = true;
    invalidateConfirmation();
    showError(error.message || t('buildFailed'));
  } finally {
    buildButton.disabled = false;
    buildButton.innerHTML = `${t('buildRule')} <span>↗</span>`;
  }
}

buildButton.addEventListener('click', buildCircuit);
interpretButton.addEventListener('click', interpretRule);
useProposalButton.addEventListener('click', () => {
  if (!currentProposal) return;
  expressionInput.value = currentProposal.expression;
  invalidateConfirmation();
  expressionInput.focus();
});
rejectProposalButton.addEventListener('click', hideProposal);
expressionInput.addEventListener('input', () => { if (currentResult) invalidateConfirmation(); });
expressionInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') buildCircuit(); });
document.querySelectorAll('.example').forEach((button) => button.addEventListener('click', () => { expressionInput.value = button.dataset.expression; buildCircuit(); }));
confirmButton.addEventListener('click', () => {
  if (!currentResult) return;
  confirmedHash = currentResult.netlist_sha256;
  confirmState.textContent = `${t('confirmed')} · ${confirmedHash.slice(0, 12)}…`;
  confirmState.className = 'confirm-state confirmed';
  confirmButton.disabled = true;
});

document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
buildCircuit();

const GENESIS_LIVE = Object.freeze({
  processor: '0x40dd85697dfbba97887c6dd058d2396edd83e826',
  circuitId: 1,
  rows: [
    { label: '00', input: '0x00', local: false },
    { label: '01', input: '0x01', local: false },
    { label: '10', input: '0x02', local: false },
    { label: '11', input: '0x03', local: true },
  ],
});

const liveResults = document.querySelector('#live-results');
const liveStatus = document.querySelector('#live-status');
const verifyGenesisButton = document.querySelector('#verify-genesis');
const liveError = document.querySelector('#live-error');

function renderLiveRows(rows = GENESIS_LIVE.rows.map((row) => ({ ...row, live: null, result: '—' }))) {
  liveResults.innerHTML = rows.map((row) => `<tr><td>${row.label}</td><td>${row.local ? 1 : 0}</td><td>${row.live === null ? '—' : (row.live ? 1 : 0)}</td><td class="${row.result === 'MATCH' ? 'match' : row.result === 'MISMATCH' ? 'mismatch' : ''}">${row.result === 'MISMATCH' ? t('mismatch') : row.result}</td></tr>`).join('');
}

async function verifyGenesisLive() {
  verifyGenesisButton.disabled = true;
  liveError.hidden = true;
  liveError.textContent = '';
  liveStatus.textContent = t('verificationRunning');
  liveStatus.className = 'live-status running';
  renderLiveRows();
  try {
    const verifiedRows = [];
    for (const row of GENESIS_LIVE.rows) {
      const response = await fetch('/api/xlayer/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processor: GENESIS_LIVE.processor, circuit_id: GENESIS_LIVE.circuitId, input: row.input }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || payload.error || 'X Layer verification failed.');
      const live = Boolean(payload.evidence?.output_boolean);
      verifiedRows.push({ ...row, live, result: live === row.local ? 'MATCH' : 'MISMATCH' });
      renderLiveRows([...verifiedRows, ...GENESIS_LIVE.rows.slice(verifiedRows.length).map((pending) => ({ ...pending, live: null, result: '—' }))]);
    }
    const matches = verifiedRows.filter((row) => row.result === 'MATCH').length;
    if (matches !== GENESIS_LIVE.rows.length) throw new Error(`${matches} / ${GENESIS_LIVE.rows.length} ${t('mismatch')}`);
    liveStatus.textContent = t('verificationMatch');
    liveStatus.className = 'live-status verified';
  } catch (error) {
    liveStatus.textContent = t('verificationFailed');
    liveStatus.className = 'live-status failed';
    liveError.textContent = `${t('liveFailure')}: ${error.message || 'unknown read-only error'}`;
    liveError.hidden = false;
  } finally {
    verifyGenesisButton.disabled = false;
  }
}

renderLiveRows();
applyLanguage();
verifyGenesisButton.addEventListener('click', verifyGenesisLive);
document.querySelectorAll('.copy-button').forEach((button) => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    const original = button.textContent;
    button.textContent = t('copied');
    setTimeout(() => { button.textContent = original; }, 1200);
  } catch {
    button.textContent = t('copyUnavailable');
  }
}));

// Mainnet deployment is deliberately limited to an explicit OKX Wallet
// EIP-1193 request. No private key, signing code, automatic send, mint, or
// tapeout path exists in this UI.
const DEPLOYMENT = Object.freeze({
  chainId: 196,
  chainIdHex: '0xc4',
  wallet: '0x254e144269c1b42acd3fba92a7fa980b9fd4828b',
  factory: '0x1f09daefa827f02cbb40967cc91b259763760761',
  name: 'GateSmith',
  symbol: 'GATE',
  story: 'Turn human-readable Boolean rules into deterministic, verifiable on-chain circuits.',
  supplyCap: 10000000000n,
  mintPrice: 50000000000000n,
  value: 6600000000000000n,
});

const GENESIS_MINT = Object.freeze({
  transistor: '0xe0f29a43d89e471f9eea723dcda9d731043f34d7',
  primitiveId: 0n,
  amount: 2n,
  protocolFee: 660000000000000n,
  mintPrice: 50000000000000n,
  value: 760000000000000n,
  netlistSha256: '8d6caeafdb7825cc5c790a214acd0c8b22cb827eb669cc67735a0d31a2f86c99',
});

const GENESIS_TAPEOUT = Object.freeze({
  processor: '0x40dd85697dfbba97887c6dd058d2396edd83e826',
  netlist: '0000000200000300000001000004',
  inputCount: 2n,
  outputCount: 1n,
  value: 1300000000000000n,
  netlistSha256: '8d6caeafdb7825cc5c790a214acd0c8b22cb827eb669cc67735a0d31a2f86c99',
  calldataSha256: 'b22cd0fdd965c312fe38fbd8950945c4f4606b718d58870d52e6c52f600e74da',
  requiredInventory: 2n,
});

const connectWalletButton = document.querySelector('#connect-wallet');
const reviewDeploymentButton = document.querySelector('#review-deployment');
const deployProcessorButton = document.querySelector('#deploy-processor');
const walletError = document.querySelector('#wallet-error');
const walletState = document.querySelector('#wallet-state');
const deploymentReview = document.querySelector('#deployment-review');
const reviewWallet = document.querySelector('#review-wallet');
const deploymentResult = document.querySelector('#deployment-result');
const reviewMintButton = document.querySelector('#review-mint');
const mintError = document.querySelector('#mint-error');
const mintReview = document.querySelector('#mint-review');
const mintButton = document.querySelector('#mint-transistors');
const mintResult = document.querySelector('#mint-result');
const reviewTapeoutButton = document.querySelector('#review-tapeout');
const tapeoutError = document.querySelector('#tapeout-error');
const tapeoutReview = document.querySelector('#tapeout-review');
const tapeoutInventory = document.querySelector('#tapeout-inventory');
const tapeoutButton = document.querySelector('#tapeout-circuit');
const tapeoutResult = document.querySelector('#tapeout-result');
let okxProvider = null;
let connectedWallet = null;
let mintRequestInFlight = false;
let mintRequestAccepted = false;
let tapeoutRequestInFlight = false;
let tapeoutRequestAccepted = false;

function getOkxProvider() {
  // Prefer the explicitly branded OKX injection. Never silently fall back to
  // window.ethereum, which could be another browser wallet.
  const candidates = [window.okxwallet?.ethereum, window.okxwallet, window.OKXWallet?.ethereum];
  return candidates.find((candidate) => candidate && typeof candidate.request === 'function') || null;
}

function showWalletError(message) {
  walletError.textContent = message;
  walletError.hidden = false;
}

function clearWalletError() {
  walletError.textContent = '';
  walletError.hidden = true;
}

function resetDeployment(reason = 'Wallet not connected') {
  connectedWallet = null;
  deploymentReview.hidden = true;
  reviewDeploymentButton.disabled = true;
  deployProcessorButton.disabled = true;
  reviewWallet.textContent = '';
  walletState.textContent = reason === 'Wallet not connected' ? t('walletNotConnected') : reason;
  deploymentResult.textContent = '';
  mintReview.hidden = true;
  reviewMintButton.disabled = true;
  mintButton.disabled = true;
  mintResult.textContent = '';
  mintError.textContent = '';
  mintError.hidden = true;
  mintRequestInFlight = false;
  mintRequestAccepted = false;
  tapeoutReview.hidden = true;
  reviewTapeoutButton.disabled = true;
  tapeoutButton.disabled = true;
  tapeoutInventory.textContent = '—';
  tapeoutResult.textContent = '';
  tapeoutError.textContent = '';
  tapeoutError.hidden = true;
  tapeoutRequestInFlight = false;
  tapeoutRequestAccepted = false;
}

function normalizeAddress(value) {
  return typeof value === 'string' ? value.toLowerCase() : '';
}

function word(value) {
  return value.toString(16).padStart(64, '0');
}

function encodedString(value) {
  const bytes = new TextEncoder().encode(value);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return word(bytes.length) + hex.padEnd(Math.ceil(hex.length / 64) * 64, '0');
}

function buildCreateCpuCalldata() {
  const name = encodedString(DEPLOYMENT.name);
  const symbol = encodedString(DEPLOYMENT.symbol);
  const story = encodedString(DEPLOYMENT.story);
  const headLength = 5 * 32;
  const nameOffset = headLength;
  const symbolOffset = nameOffset + name.length / 2;
  const storyOffset = symbolOffset + symbol.length / 2;
  return `0x47f9b5fd${word(nameOffset)}${word(symbolOffset)}${word(storyOffset)}${word(DEPLOYMENT.supplyCap)}${word(DEPLOYMENT.mintPrice)}${name}${symbol}${story}`;
}

function assertDeploymentIdentity(chainId, accounts) {
  const normalizedChain = typeof chainId === 'string' && chainId.startsWith('0x') ? Number.parseInt(chainId, 16) : Number(chainId);
  const account = accounts?.[0];
  if (normalizedChain !== DEPLOYMENT.chainId) throw new Error(language === 'zh' ? '硬停止：请将 OKX Wallet 切换到 X Layer 主网（chain ID 196）。' : 'Hard stop: switch OKX Wallet to X Layer Mainnet (chain ID 196).');
  if (normalizeAddress(account) !== DEPLOYMENT.wallet) throw new Error(language === 'zh' ? '硬停止：已连接钱包与冻结的部署钱包不一致。' : 'Hard stop: connected wallet does not match the frozen deployment wallet.');
  return account;
}

async function readDeploymentIdentity() {
  if (!okxProvider) throw new Error(t('connectFirst'));
  const [chainId, accounts] = await Promise.all([
    okxProvider.request({ method: 'eth_chainId' }),
    okxProvider.request({ method: 'eth_accounts' }),
  ]);
  return assertDeploymentIdentity(chainId, accounts);
}

async function connectOkxWallet() {
  clearWalletError();
  deploymentResult.textContent = '';
  okxProvider = getOkxProvider();
  if (!okxProvider) {
    resetDeployment(language === 'zh' ? '未检测到 OKX Wallet。请在安装 OKX Wallet 的浏览器中打开此页面。' : 'OKX Wallet provider not found. Open this page in a browser with OKX Wallet installed.');
    showWalletError(language === 'zh' ? '未检测到 OKX Wallet。不会使用其他浏览器钱包 provider。' : 'OKX Wallet was not detected. No other browser wallet provider will be used.');
    return;
  }
  connectWalletButton.disabled = true;
  try {
    const accounts = await okxProvider.request({ method: 'eth_requestAccounts' });
    const chainId = await okxProvider.request({ method: 'eth_chainId' });
    connectedWallet = assertDeploymentIdentity(chainId, accounts);
    walletState.textContent = language === 'zh' ? `已连接 OKX Wallet · ${connectedWallet} · X Layer 主网 (196)` : `Connected OKX Wallet · ${connectedWallet} · X Layer Mainnet (196)`;
    reviewDeploymentButton.disabled = false;
    reviewMintButton.disabled = false;
    reviewTapeoutButton.disabled = false;
    okxProvider.on?.('accountsChanged', () => resetDeployment(language === 'zh' ? 'Wallet 账户已变化。请重新连接并检查冻结地址。' : 'Wallet account changed. Reconnect and re-check the frozen address.'));
    okxProvider.on?.('chainChanged', () => resetDeployment(language === 'zh' ? 'Wallet 网络已变化。请重新连接并检查 X Layer 主网。' : 'Wallet network changed. Reconnect and re-check X Layer Mainnet.'));
  } catch (error) {
    resetDeployment(error?.code === 4001 ? (language === 'zh' ? '用户拒绝了 OKX Wallet 连接。' : 'OKX Wallet connection was rejected.') : (error.message || (language === 'zh' ? 'OKX Wallet 连接失败。' : 'OKX Wallet connection failed.')));
    showWalletError(error?.code === 4001 ? t('connectionRejected') : (error.message || (language === 'zh' ? '无法连接 OKX Wallet。' : 'Could not connect OKX Wallet.')));
  } finally {
    connectWalletButton.disabled = false;
  }
}

async function reviewDeployment() {
  clearWalletError();
  try {
    connectedWallet = await readDeploymentIdentity();
    reviewWallet.textContent = connectedWallet;
    deploymentReview.hidden = false;
    deployProcessorButton.disabled = false;
    walletState.textContent = t('identityPassedDeploy');
  } catch (error) {
    resetDeployment(error.message || 'Deployment review failed.');
    showWalletError(error.message || 'Deployment review failed.');
  }
}

async function requestCreateCpu() {
  clearWalletError();
  deployProcessorButton.disabled = true;
  deploymentResult.textContent = '';
  try {
    const account = await readDeploymentIdentity();
    if (normalizeAddress(account) !== normalizeAddress(connectedWallet)) throw new Error('Hard stop: wallet account changed after review.');
    const data = buildCreateCpuCalldata();
    deploymentResult.textContent = t('waitingWallet');
    const transactionHash = await okxProvider.request({
      method: 'eth_sendTransaction',
      params: [{ from: account, to: DEPLOYMENT.factory, data, value: `0x${DEPLOYMENT.value.toString(16)}` }],
    });
    deploymentResult.textContent = `Wallet request accepted · ${transactionHash}`;
  } catch (error) {
    deploymentResult.textContent = '';
    showWalletError(error?.code === 4001 ? t('transactionRejected') : (error.message || (language === 'zh' ? '交易请求失败。' : 'Transaction request failed.')));
  } finally {
    deployProcessorButton.disabled = false;
  }
}

function clearMintError() {
  mintError.textContent = '';
  mintError.hidden = true;
}

function buildMintCalldata() {
  return `0x1b2ef1ca${word(GENESIS_MINT.primitiveId)}${word(GENESIS_MINT.amount)}`;
}

async function reviewGenesisMint() {
  clearMintError();
  try {
    await readDeploymentIdentity();
    mintReview.hidden = false;
    mintButton.disabled = false;
    mintResult.textContent = t('identityPassedMint');
  } catch (error) {
    resetDeployment(error.message || 'Mint review failed.');
    mintError.textContent = error.message || 'Mint review failed.';
    mintError.hidden = false;
  }
}

async function requestGenesisMint() {
  if (mintRequestInFlight || mintRequestAccepted) return;
  clearMintError();
  mintRequestInFlight = true;
  mintButton.disabled = true;
  try {
    const account = await readDeploymentIdentity();
    if (normalizeAddress(account) !== normalizeAddress(connectedWallet)) throw new Error('Hard stop: wallet account changed after mint review.');
    const data = buildMintCalldata();
    const request = {
      method: 'eth_sendTransaction',
      params: [{
        from: account,
        to: GENESIS_MINT.transistor,
        data,
        value: `0x${GENESIS_MINT.value.toString(16)}`,
      }],
    };
    mintResult.textContent = t('waitingWallet');
    const transactionHash = await okxProvider.request(request);
    mintRequestAccepted = true;
    mintResult.textContent = `Wallet request accepted · ${transactionHash}`;
  } catch (error) {
    mintResult.textContent = '';
    mintError.textContent = error?.code === 4001 ? t('transactionRejected') : (error.message || (language === 'zh' ? 'Mint 请求失败。' : 'Mint request failed.'));
    mintError.hidden = false;
    mintButton.disabled = false;
  } finally {
    mintRequestInFlight = false;
  }
}

function buildTapeoutCalldata() {
  const bytesLength = GENESIS_TAPEOUT.netlist.length / 2;
  return `0x7bd3ac1d${word(96)}${word(GENESIS_TAPEOUT.inputCount)}${word(GENESIS_TAPEOUT.outputCount)}${word(bytesLength)}${GENESIS_TAPEOUT.netlist.padEnd(Math.ceil(GENESIS_TAPEOUT.netlist.length / 64) * 64, '0')}`;
}

async function sha256Hex(hex) {
  const bytes = new Uint8Array(hex.match(/.{2}/g).map((pair) => Number.parseInt(pair, 16)));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readNandInventory() {
  const data = `0x00fdd58e${word(BigInt(`0x${DEPLOYMENT.wallet.slice(2)}`))}${word(0n)}`;
  const result = await okxProvider.request({ method: 'eth_call', params: [{ to: GENESIS_MINT.transistor, data }, 'latest'] });
  return BigInt(result);
}

async function validateTapeoutPacket() {
  const account = await readDeploymentIdentity();
  const inventory = await readNandInventory();
  if (inventory < GENESIS_TAPEOUT.requiredInventory) throw new Error(`Hard stop: current NAND inventory is ${inventory}; required 2.`);
  const data = buildTapeoutCalldata();
  const dataHash = await sha256Hex(data.slice(2));
  const netlistHash = await sha256Hex(GENESIS_TAPEOUT.netlist);
  if (GENESIS_TAPEOUT.processor !== '0x40dd85697dfbba97887c6dd058d2396edd83e826') throw new Error('Hard stop: tapeout target mismatch.');
  if (netlistHash !== GENESIS_TAPEOUT.netlistSha256) throw new Error('Hard stop: frozen netlist hash mismatch.');
  if (dataHash !== GENESIS_TAPEOUT.calldataSha256) throw new Error('Hard stop: tapeout calldata hash mismatch.');
  if (GENESIS_TAPEOUT.value !== 1300000000000000n) throw new Error('Hard stop: tapeout value mismatch.');
  return { account, inventory, data, dataHash };
}

async function reviewGenesisTapeout() {
  tapeoutError.textContent = '';
  tapeoutError.hidden = true;
  try {
    const packet = await validateTapeoutPacket();
    tapeoutInventory.textContent = packet.inventory.toString();
    tapeoutReview.hidden = false;
    tapeoutButton.disabled = false;
    tapeoutResult.textContent = t('identityPassedTapeout');
  } catch (error) {
    resetDeployment(error.message || 'Tapeout review failed.');
    tapeoutError.textContent = error.message || 'Tapeout review failed.';
    tapeoutError.hidden = false;
  }
}

async function requestGenesisTapeout() {
  if (tapeoutRequestInFlight || tapeoutRequestAccepted) return;
  tapeoutError.textContent = '';
  tapeoutError.hidden = true;
  tapeoutRequestInFlight = true;
  tapeoutButton.disabled = true;
  try {
    const packet = await validateTapeoutPacket();
    tapeoutResult.textContent = t('waitingWallet');
    const transactionHash = await okxProvider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: packet.account,
        to: GENESIS_TAPEOUT.processor,
        data: packet.data,
        value: `0x${GENESIS_TAPEOUT.value.toString(16)}`,
      }],
    });
    tapeoutRequestAccepted = true;
    tapeoutResult.textContent = `Wallet request accepted · ${transactionHash}`;
  } catch (error) {
    tapeoutResult.textContent = '';
    tapeoutError.textContent = error?.code === 4001 ? t('transactionRejected') : (error.message || (language === 'zh' ? 'Tapeout 请求失败。' : 'Tapeout request failed.'));
    tapeoutError.hidden = false;
    tapeoutButton.disabled = false;
  } finally {
    tapeoutRequestInFlight = false;
  }
}

connectWalletButton.addEventListener('click', connectOkxWallet);
reviewDeploymentButton.addEventListener('click', reviewDeployment);
deployProcessorButton.addEventListener('click', requestCreateCpu);
reviewMintButton.addEventListener('click', reviewGenesisMint);
mintButton.addEventListener('click', requestGenesisMint);
reviewTapeoutButton.addEventListener('click', reviewGenesisTapeout);
tapeoutButton.addEventListener('click', requestGenesisTapeout);
