/**
 * game.js
 * Manages board state, win detection, and DOM rendering.
 */

const HUMAN = 'X';
const AI    = 'O';
const EMPTY = null;


const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6],           // diagonals
];

/**
 * Creates and returns a fresh 9-element board (all null).
 */
function createBoard() {
  return Array(9).fill(EMPTY);
}

/**
 * Returns an array of indices of all empty cells.
 * @param {Array} board
 * @returns {number[]}
 */
function getEmptyCells(board) {
  return board.reduce((acc, v, i) => {
    if (v === EMPTY) acc.push(i);
    return acc;
  }, []);
}

/**
 * Checks the board for a terminal state.
 * @param {Array} board
 * @returns {{ winner: string|'draw'|null, cells: number[] }}
 */
function checkResult(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], cells: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== EMPTY)) {
    return { winner: 'draw', cells: [] };
  }
  return { winner: null, cells: [] };
}

/**
 * Renders the current board state to the DOM.
 * Highlights winning cells if provided.
 * @param {Array}    board
 * @param {number[]} [winCells=[]]
 */
function renderBoard(board, winCells = []) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    const value = board[i];
    cell.className = 'cell';
    cell.innerHTML  = '';

    if (value) {
      cell.classList.add('taken', value === HUMAN ? 'x-mark' : 'o-mark');
      const span = document.createElement('span');
      span.className   = 'symbol';
      span.textContent = value;
      cell.appendChild(span);
    }

    if (winCells.includes(i)) {
      cell.classList.add('win-cell');
    }
  });
}
