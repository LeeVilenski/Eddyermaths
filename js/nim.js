(function () {
  const STARTING_PILES = [1, 3, 5, 7];

  let piles = [];
  let gameOver = false;

  const pilesEl = document.getElementById('nim-piles');
  const statusEl = document.getElementById('nim-status');
  const resetBtn = document.getElementById('nim-reset');

  function nimSum(arr) {
    return arr.reduce((acc, n) => acc ^ n, 0);
  }

  function render() {
    pilesEl.innerHTML = '';
    piles.forEach((count, pileIndex) => {
      const pileEl = document.createElement('div');
      pileEl.className = 'nim-pile';
      for (let i = 0; i < count; i++) {
        const counter = document.createElement('div');
        counter.className = 'nim-counter' + (gameOver ? ' disabled' : '');
        counter.title = 'Remove this and everything to its right';
        counter.addEventListener('click', () => takeTurn(pileIndex, i));
        pileEl.appendChild(counter);
      }
      pilesEl.appendChild(pileEl);
    });
  }

  function takeTurn(pileIndex, counterIndex) {
    if (gameOver) return;
    const removed = piles[pileIndex] - counterIndex;
    piles[pileIndex] -= removed;
    render();

    if (piles.every((p) => p === 0)) {
      statusEl.textContent = 'You took the last counter — you win! 🎉';
      gameOver = true;
      render();
      return;
    }

    statusEl.textContent = "Computer's turn...";
    setTimeout(computerTurn, 600);
  }

  function computerTurn() {
    const sum = nimSum(piles);
    let move = null;

    if (sum !== 0) {
      // Winning move: find a pile to reduce so the nim-sum becomes 0
      for (let i = 0; i < piles.length; i++) {
        const target = piles[i] ^ sum;
        if (target < piles[i]) {
          move = { pile: i, newCount: target };
          break;
        }
      }
    }

    if (!move) {
      // No winning move available: take one counter from the first non-empty pile
      const pile = piles.findIndex((p) => p > 0);
      move = { pile, newCount: piles[pile] - 1 };
    }

    piles[move.pile] = move.newCount;
    render();

    if (piles.every((p) => p === 0)) {
      statusEl.textContent = 'The computer took the last counter — better luck next time!';
      gameOver = true;
      render();
      return;
    }

    statusEl.textContent = 'Your turn — click a counter to remove it and everything to its right in that pile.';
  }

  function reset() {
    piles = [...STARTING_PILES];
    gameOver = false;
    statusEl.textContent = 'Your turn — click a counter to remove it and everything to its right in that pile.';
    render();
  }

  resetBtn.addEventListener('click', reset);
  reset();
})();
