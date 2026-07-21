/**
 * main.js
 * Wires the game logic and AI together.
 * Handles user interactions, turn management, and score tracking.
 */

// ─── State ────────────────────────────────────────────────────────────────────
let board      = createBoard();
let gameOver   = false;
let aiThinking = false;
let scores     = { human: 0, draw: 0, ai: 0 };

// ─── DOM References ───────────────────────────────────────────────────────────
const statusEl    = document.getElementById('status');
const algoSelect  = document.getElementById('algo');
const diffSelect  = document.getElementById('difficulty');
const resetBtn    = document.getElementById('resetBtn');
const algoInfoEl  = document.getElementById('algoInfo');
const scoreXEl    = document.getElementById('scoreX');
const scoreDrawEl = document.getElementById('scoreDraw');
const scoreOEl    = document.getElementById('scoreO');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setStatus(msg, cls = '') {
  statusEl.textContent = msg;
  statusEl.className   = 'status ' + cls;
}

function updateScoreboard() {
  scoreXEl.textContent    = scores.human;
  scoreDrawEl.textContent = scores.draw;
  scoreOEl.textContent    = scores.ai;
}

function updateAlgoInfo(nodesCount) {
  const algo = algoSelect.value;
  const desc = algo === 'alphabeta'
    ? '<strong>Alpha-Beta Pruning</strong> — skips branches that cannot affect the result. ' +
      'Reduces tree size from O(b<sup>d</sup>) to O(b<sup>d/2</sup>) in the best case.'
    : '<strong>Minimax</strong> — exhaustively explores every possible game state, ' +
      'choosing the move that maximises the AI score assuming the human plays optimally. O(b<sup>d</sup>) complexity.';

  const nodesHtml = nodesCount !== undefined
    ? `<div class="nodes">Nodes searched this move: <strong>${nodesCount.toLocaleString()}</strong></div>`
    : '';

  algoInfoEl.innerHTML = desc + nodesHtml;
}

// ─── Game Flow ────────────────────────────────────────────────────────────────
function resetGame() {
  board      = createBoard();
  gameOver   = false;
  aiThinking = false;
  renderBoard(board);
  setStatus('Your turn!');
  updateAlgoInfo();
}

function endGame(result) {
  gameOver = true;
  renderBoard(board, result.cells);

  if (result.winner === HUMAN) {
    scores.human++;
    setStatus('You win! 🎉', 'win');
  } else if (result.winner === AI) {
    scores.ai++;
    setStatus('AI wins! Try again.', 'win');
  } else {
    scores.draw++;
    setStatus("It's a draw!", 'draw');
  }

  updateScoreboard();
}

// ─── Human Move ───────────────────────────────────────────────────────────────
function handleCellClick(e) {
  const cell = e.currentTarget;
  const idx  = parseInt(cell.dataset.index, 10);

  if (gameOver || aiThinking || board[idx] !== EMPTY) return;

  board[idx] = HUMAN;
  renderBoard(board);

  const result = checkResult(board);
  if (result.winner) return endGame(result);

  // Hand off to AI
  setStatus('AI is thinking…', 'thinking');
  aiThinking = true;

  // Small delay so the human's move renders first
  setTimeout(doAiTurn, 150);
}

// ─── AI Move ──────────────────────────────────────────────────────────────────
function doAiTurn() {
  const algo = algoSelect.value;
  const diff = diffSelect.value;

  const moveIdx = getAiMove(board, algo, diff);
  board[moveIdx] = AI;
  renderBoard(board);

  // Update node count in info panel
  updateAlgoInfo(nodesSearched);

  aiThinking = false;

  const result = checkResult(board);
  if (result.winner) return endGame(result);

  setStatus('Your turn!');
}

// ─── Event Listeners ─────────────────────────────────────────────────────────
document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);

algoSelect.addEventListener('change', () => {
  resetGame();
  updateAlgoInfo();
});

diffSelect.addEventListener('change', resetGame);

// ─── Init ─────────────────────────────────────────────────────────────────────
resetGame();
