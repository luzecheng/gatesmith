const expressionInput = document.querySelector('#expression');
const buildButton = document.querySelector('#build');
const resultSection = document.querySelector('#result');
const errorBox = document.querySelector('#error');
const confirmButton = document.querySelector('#confirm');
const confirmState = document.querySelector('#confirm-state');
let currentResult = null;
let confirmedHash = null;

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
  confirmState.textContent = currentResult ? 'Not confirmed' : 'Awaiting build';
  confirmState.className = 'confirm-state';
}

function renderTruthTable(result) {
  const head = document.querySelector('#table-head');
  const body = document.querySelector('#table-body');
  head.innerHTML = `<tr>${result.inputs.map((name) => `<th>${name}</th>`).join('')}<th>RESULT</th></tr>`;
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
  buildButton.innerHTML = 'Compiling <span class="spinner">◌</span>';
  try {
    const response = await fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expression: expressionInput.value }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || 'The compiler rejected this expression.');
    renderResult(payload.result);
  } catch (error) {
    currentResult = null;
    resultSection.hidden = true;
    invalidateConfirmation();
    showError(error.message || 'Build failed.');
  } finally {
    buildButton.disabled = false;
    buildButton.innerHTML = 'Build Circuit <span>↗</span>';
  }
}

buildButton.addEventListener('click', buildCircuit);
expressionInput.addEventListener('input', () => { if (currentResult) invalidateConfirmation(); });
expressionInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') buildCircuit(); });
document.querySelectorAll('.example').forEach((button) => button.addEventListener('click', () => { expressionInput.value = button.dataset.expression; buildCircuit(); }));
confirmButton.addEventListener('click', () => {
  if (!currentResult) return;
  confirmedHash = currentResult.netlist_sha256;
  confirmState.textContent = `Confirmed · ${confirmedHash.slice(0, 12)}…`;
  confirmState.className = 'confirm-state confirmed';
  confirmButton.disabled = true;
});

buildCircuit();
