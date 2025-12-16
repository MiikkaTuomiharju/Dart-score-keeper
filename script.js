const state = {
  players: [],
  startScore: 301,
  bestOf: 3,
  leg: 1,
  legsWon: {},
  scores: {},
  turns: []
};

const el = id => document.getElementById(id);

function renderScores() {
  const wrap = el('scores');
  wrap.innerHTML = state.players.map(p => `
    <div class="row">
      <div><span class="pill">${p}</span></div>
      <div class="score">${state.scores[p]}</div>
    </div>
    <div class="muted">Legs won: ${state.legsWon[p]}</div>
  `).join('');
}

function renderTurns() {
  el('turns').innerHTML = state.turns.map((t, i) => `
    <tr>
      <td>${t.player}</td>
      <td>${t.thrown}</td>
      <td>${t.remaining}</td>
      <td><button data-i="${i}" class="ghost">✕</button></td>
    </tr>
  `).join('');
}

function renderLegInfo() {
  el('legInfo').textContent = `Leg ${state.leg} • First to ${Math.ceil(state.bestOf / 2)} legs wins the set`;
}

function resetLeg() {
  state.turns = [];
  state.players.forEach(p => state.scores[p] = state.startScore);
  renderScores();
  renderTurns();
}

el('start').onclick = () => {
  const p1 = el('p1').value || 'Player 1';
  const p2 = el('p2').value || 'Player 2';
  state.players = [p1, p2];
  state.startScore = Number(el('gameType').value);
  state.bestOf = Number(el('bestOf').value);
  state.leg = 1;
  state.legsWon = { [p1]: 0, [p2]: 0 };
  state.scores = { [p1]: state.startScore, [p2]: state.startScore };
  state.turns = [];
  el('active').innerHTML = state.players.map(p => `<option>${p}</option>`).join('');
  renderLegInfo();
  renderScores();
  renderTurns();
};

el('addTurn').onclick = () => {
  const player = el('active').value;
  const thrown = Number(el('throw').value || 0);
  state.scores[player] = Math.max(0, state.scores[player] - thrown);
  state.turns.push({ player, thrown, remaining: state.scores[player] });
  el('throw').value = '';
  renderScores();
  renderTurns();
};

el('turns').onclick = e => {
  if (!e.target.dataset.i) return;
  state.turns.splice(Number(e.target.dataset.i), 1);
  resetLeg();
  state.turns.forEach(t => {
    state.scores[t.player] -= t.thrown;
  });
  renderScores();
  renderTurns();
};

el('endLeg').onclick = () => {
  const winner = state.players.find(p => state.scores[p] === 0);
  if (!winner) return alert('No player at zero yet');
  state.legsWon[winner]++;
  if (state.legsWon[winner] >= Math.ceil(state.bestOf / 2)) {
    el('setResult').innerHTML = `<span class="winner">${winner} wins the set</span>`;
    return;
  }
  state.leg++;
  resetLeg();
  renderLegInfo();
};

el('reset').onclick = () => location.reload();
