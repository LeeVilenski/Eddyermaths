(function () {
  const STARTING_LINES = 18;
  const MAX_TAKE = 3;

  let remaining = STARTING_LINES;
  let gameOver = false;

  const linesEl = document.getElementById('nim-lines');
  const statusEl = document.getElementById('nim-status');
  const resetBtn = document.getElementById('nim-reset');
  const takeBtns = document.querySelectorAll('#nim-lines ~ .nim-controls [data-take]');

  function render() {
    linesEl.innerHTML = '';
    for (let i = 0; i < STARTING_LINES; i++) {
      const line = document.createElement('div');
      line.className = 'nim-line' + (i >= remaining ? ' crossed' : '');
      linesEl.appendChild(line);
    }

    takeBtns.forEach((btn) => {
      const take = parseInt(btn.dataset.take, 10);
      btn.disabled = gameOver || take > remaining;
    });
  }

  function takeTurn(take) {
    if (gameOver || take > remaining) return;
    remaining -= take;
    render();

    if (remaining === 0) {
      statusEl.textContent = 'You crossed off the last line — you lose!';
      gameOver = true;
      render();
      return;
    }

    statusEl.textContent = "Computer's turn...";
    setTimeout(computerTurn, 600);
  }

  function computerTurn() {
    // Winning strategy: leave a remainder of 1 (mod 4) for the opponent.
    let take = ((remaining - 1) % 4 + 4) % 4;
    if (take === 0 || take > remaining) take = 1;
    if (take > MAX_TAKE) take = MAX_TAKE;

    remaining -= take;
    render();

    if (remaining === 0) {
      statusEl.textContent = 'The computer crossed off the last line — you win! 🎉';
      gameOver = true;
      render();
      return;
    }

    statusEl.textContent = `Computer crossed off ${take} line${take > 1 ? 's' : ''}. Your turn!`;
  }

  function reset() {
    remaining = STARTING_LINES;
    gameOver = false;
    statusEl.textContent = 'Your turn — cross off 1, 2 or 3 lines.';
    render();
  }

  takeBtns.forEach((btn) => {
    btn.addEventListener('click', () => takeTurn(parseInt(btn.dataset.take, 10)));
  });
  resetBtn.addEventListener('click', reset);
  reset();
})();
