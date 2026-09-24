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
  confirmState.textContent = currentResult ? 'Not confirmed' : 'Awaiting build';
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
  proposalExplanation.textContent = proposal.explanation || 'No explanation provided.';
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
  interpretButton.textContent = 'Thinking…';
  try {
    const response = await fetch('/api/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: descriptionInput.value }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || 'AI interpretation is unavailable. You can use the Boolean workflow below.');
    renderProposal(payload.proposal);
  } catch (error) {
    showError(`${error.message || 'Interpretation failed.'} The deterministic Boolean workflow remains available.`);
  } finally {
    interpretButton.disabled = false;
    interpretButton.innerHTML = 'Ask AI <span>↗</span>';
  }
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
  confirmState.textContent = `Confirmed · ${confirmedHash.slice(0, 12)}…`;
  confirmState.className = 'confirm-state confirmed';
  confirmButton.disabled = true;
});

buildCircuit();
