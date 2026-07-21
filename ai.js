let nodesSearched = 0; 

/**
 * @param {Array}   board
 * @param {number}  depth     - current recursion depth
 * @param {boolean} isMaximising - true when it is the AI's turn
 * @returns {number} best score from this position
 */
function minimax(board, depth, isMaximising) {
  nodesSearched++;

  const { winner } = checkResult(board);
  if (winner === AI)    return 10 - depth;
  if (winner === HUMAN) return depth - 10;
  if (winner === 'draw') return 0;

  const empty = getEmptyCells(board);

  if (isMaximising) {
    let best = -Infinity;
    for (const i of empty) {
      board[i] = AI;
      best = Math.max(best, minimax(board, depth + 1, false));
      board[i] = EMPTY;
    }
    return best;
  } else {
    let best = +Infinity;
    for (const i of empty) {
      board[i] = HUMAN;
      best = Math.min(best, minimax(board, depth + 1, true));
      board[i] = EMPTY;
    }
    return best;
  }
}


/**
 * @param {Array}   board
 * @param {number}  depth
 * @param {boolean} isMaximising
 * @param {number}  alpha  - best score the maximiser can guarantee so far
 * @param {number}  beta   - best score the minimiser can guarantee so far
 * @returns {number}
 */
function minimaxAlphaBeta(board, depth, isMaximising, alpha, beta) {
  nodesSearched++;

  const { winner } = checkResult(board);
  if (winner === AI)    return 10 - depth;
  if (winner === HUMAN) return depth - 10;
  if (winner === 'draw') return 0;

  const empty = getEmptyCells(board);

  if (isMaximising) {
    let best = -Infinity;
    for (const i of empty) {
      board[i] = AI;
      const score = minimaxAlphaBeta(board, depth + 1, false, alpha, beta);
      board[i] = EMPTY;
      best  = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // ← β-cutoff (prune remaining siblings)
    }
    return best;
  } else {
    let best = +Infinity;
    for (const i of empty) {
      board[i] = HUMAN;
      const score = minimaxAlphaBeta(board, depth + 1, true, alpha, beta);
      board[i] = EMPTY;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // ← α-cutoff (prune remaining siblings)
    }
    return best;
  }
}


/**
 * Finds the best move for the AI using the selected algorithm.
 * @param {Array}  board
 * @param {string} algo  - 'minimax' | 'alphabeta'
 * @returns {number} index of the best move
 */
function getBestMove(board, algo) {
  nodesSearched = 0;
  let bestScore = -Infinity;
  let bestIndex = -1;

  for (const i of getEmptyCells(board)) {
    board[i] = AI;

    const score = algo === 'alphabeta'
      ? minimaxAlphaBeta(board, 0, false, -Infinity, +Infinity)
      : minimax(board, 0, false);

    board[i] = EMPTY;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}


/**
 * Returns a move index based on chosen difficulty.
 * @param {Array}  board
 * @param {string} algo
 * @param {string} difficulty  - 'easy' | 'medium' | 'hard'
 * @returns {number}
 */
function getAiMove(board, algo, difficulty) {
  const empty = getEmptyCells(board);

  if (difficulty === 'easy') {
  
    nodesSearched = 0;
    return empty[Math.floor(Math.random() * empty.length)];
  }

  if (difficulty === 'medium') {
    
    nodesSearched = 0;
    if (Math.random() < 0.6) return getBestMove(board, algo);
    return empty[Math.floor(Math.random() * empty.length)];
  }


  return getBestMove(board, algo);
}
