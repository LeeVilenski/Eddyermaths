(function () {
  const HUMAN = 'X';
  const AI = 'O';
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  let board = Array(9).fill(null);
  let gameOver = false;

  const boardEl = document.getElementById('ttt-board');
  const statusEl = document.getElementById('ttt-status');
  const resetBtn = document.getElementById('ttt-reset');

  function getWinner(b) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every((cell) => cell)) return 'draw';
    return null;
  }

  function minimax(b, player) {
    const winner = getWinner(b);
    if (winner === AI) return { score: 1 };
    if (winner === HUMAN) return { score: -1 };
    if (winner === 'draw') return { score: 0 };

    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        const next = b.slice();
        next[i] = player;
        const result = minimax(next, player === AI ? HUMAN : AI);
        moves.push({ index: i, score: result.score });
      }
    }

    if (player === AI) {
      return moves.reduce((best, m) => (m.score > best.score ? m : best));
    }
    return moves.reduce((best, m) => (m.score < best.score ? m : best));
  }

  function render() {
    boardEl.innerHTML = '';
    board.forEach((value, i) => {
      const cell = document.createElement('div');
      cell.className = 'ttt-cell' + (value ? ' filled' : '');
      cell.textContent = value || '';
      cell.addEventListener('click', () => handleClick(i));
      boardEl.appendChild(cell);
    });
  }

  function handleClick(index) {
    if (gameOver || board[index]) return;
    board[index] = HUMAN;
    render();

    const winner = getWinner(board);
    if (winner) {
      finish(winner);
      return;
    }

    statusEl.textContent = "Computer's turn...";
    setTimeout(() => {
      const move = minimax(board, AI);
      board[move.index] = AI;
      render();

      const winnerAfterAi = getWinner(board);
      if (winnerAfterAi) {
        finish(winnerAfterAi);
        return;
      }
      statusEl.textContent = 'Your move — you are X.';
    }, 400);
  }

  function finish(winner) {
    gameOver = true;
    if (winner === 'draw') {
      statusEl.textContent = "It's a draw — exactly as the maths predicts!";
    } else if (winner === HUMAN) {
      statusEl.textContent = "You won! (The computer must have slipped up — try again?)";
    } else {
      statusEl.textContent = 'The computer wins. With perfect play, the best you can usually hope for is a draw!';
    }
  }

  function reset() {
    board = Array(9).fill(null);
    gameOver = false;
    statusEl.textContent = 'Your move — you are X.';
    render();
  }

  resetBtn.addEventListener('click', reset);
  reset();
})();
