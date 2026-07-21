# Tic-Tac-Toe AI

An unbeatable Tic-Tac-Toe AI built with vanilla HTML, CSS, and JavaScript.
Implements both **Minimax** and **Minimax with Alpha-Beta Pruning**.

## Project Structure

```
tictactoe-ai/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles (dark theme)
├── js/
│   ├── game.js         ← Board state, win detection, rendering
│   ├── ai.js           ← Minimax & Alpha-Beta algorithms
│   └── main.js         ← Controller: ties everything together
└── README.md
```

## How to Run

### Option 1 — Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
   (`ritwickdey.LiveServer`)
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens automatically at `http://127.0.0.1:5500`

### Option 2 — Direct file open
Open `index.html` directly in any browser (no server needed —
this project uses no ES modules or fetch calls).

## How it Works

### Minimax
Recursively explores every possible game state.
The AI picks the move with the highest score assuming the human
always plays optimally.

| Outcome   | Score        |
|-----------|--------------|
| AI wins   | +10 − depth  |
| Human wins| −10 + depth  |
| Draw      | 0            |

Depth is subtracted/added so the AI prefers *faster* wins
and *longer* losses.

### Alpha-Beta Pruning
An optimisation of Minimax that skips branches that cannot
affect the final decision.

- `alpha` = best score the maximiser (AI) can guarantee
- `beta`  = best score the minimiser (human) can guarantee
- If `beta ≤ alpha` → prune the remaining siblings

Reduces complexity from **O(b^d)** to **O(b^(d/2))** in the
best case — roughly halving the search depth for the same cost.

## Difficulty Levels

| Level     | Behaviour                        |
|-----------|----------------------------------|
| Easy      | Picks a random empty cell        |
| Medium    | 60% optimal move, 40% random     |
| Unbeatable| Full Minimax — cannot be beaten  |

## Key Files Explained

### js/game.js
- `createBoard()` — returns a fresh 9-cell array
- `getEmptyCells(board)` — returns indices of empty cells
- `checkResult(board)` — detects win / draw / in-progress
- `renderBoard(board, winCells)` — updates the DOM

### js/ai.js
- `minimax(board, depth, isMaximising)` — plain minimax
- `minimaxAlphaBeta(board, depth, isMaximising, alpha, beta)` — pruned
- `getBestMove(board, algo)` — returns the best move index
- `getAiMove(board, algo, difficulty)` — applies difficulty logic

### js/main.js
- Handles click events, turn sequencing, score tracking
- Calls AI after a 150ms delay (so the human's move renders first)
