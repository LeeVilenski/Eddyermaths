(function () {
  const boardEl = document.getElementById('hanoi-board');
  const movesEl = document.getElementById('hanoi-moves');
  const minEl = document.getElementById('hanoi-min');
  const statusEl = document.getElementById('hanoi-status');
  const discSelect = document.getElementById('hanoi-discs');
  const resetBtn = document.getElementById('hanoi-reset');
  const solveBtn = document.getElementById('hanoi-solve');

  const COLORS = ['#e76f51', '#f4a261', '#2a9d8f', '#264653', '#8ab17d', '#e9c46a', '#9d8189'];

  let pegs = [];
  let discCount = 4;
  let selectedPeg = null;
  let moveCount = 0;
  let solving = false;

  function setup() {
    discCount = parseInt(discSelect.value, 10);
    pegs = [[], [], []];
    for (let i = discCount; i >= 1; i--) {
      pegs[0].push(i);
    }
    moveCount = 0;
    selectedPeg = null;
    solving = false;
    minEl.textContent = String(2 ** discCount - 1);
    movesEl.textContent = String(moveCount);
    render();
  }

  function render() {
    boardEl.innerHTML = '';
    pegs.forEach((peg, pegIndex) => {
      const pegEl = document.createElement('div');
      pegEl.className = 'hanoi-peg' + (selectedPeg === pegIndex ? ' selected' : '');
      pegEl.addEventListener('click', () => handlePegClick(pegIndex));

      peg.forEach((discSize) => {
        const discEl = document.createElement('div');
        discEl.className = 'hanoi-disc';
        const widthPercent = 30 + discSize * 10;
        discEl.style.width = widthPercent + '%';
        discEl.style.background = COLORS[(discSize - 1) % COLORS.length];
        discEl.textContent = discSize;
        pegEl.appendChild(discEl);
      });

      boardEl.appendChild(pegEl);
    });
  }

  function handlePegClick(pegIndex) {
    if (solving) return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length === 0) return;
      selectedPeg = pegIndex;
      render();
      return;
    }

    if (selectedPeg === pegIndex) {
      selectedPeg = null;
      render();
      return;
    }

    const fromPeg = pegs[selectedPeg];
    const toPeg = pegs[pegIndex];
    const moving = fromPeg[fromPeg.length - 1];
    const target = toPeg[toPeg.length - 1];

    if (target !== undefined && moving > target) {
      statusEl.textContent = `Moves: ${moveCount} | Minimum possible: ${minEl.textContent} — can't place a larger disc on a smaller one!`;
      selectedPeg = null;
      render();
      setTimeout(() => {
        statusEl.innerHTML = `Moves: <span id="hanoi-moves">${moveCount}</span> &nbsp;|&nbsp; Minimum possible: <span id="hanoi-min">${minEl.textContent}</span>`;
      }, 1500);
      return;
    }

    toPeg.push(fromPeg.pop());
    moveCount++;
    selectedPeg = null;
    movesEl.textContent = String(moveCount);
    render();
    checkWin();
  }

  function checkWin() {
    if (pegs[2].length === discCount) {
      statusEl.innerHTML = `Solved in ${moveCount} moves! (Minimum possible: ${minEl.textContent})`;
    }
  }

  function* solveMoves(n, from, to, via) {
    if (n === 0) return;
    yield* solveMoves(n - 1, from, via, to);
    yield [from, to];
    yield* solveMoves(n - 1, via, to, from);
  }

  function autoSolve() {
    if (solving) return;
    solving = true;
    selectedPeg = null;
    setup();
    const moves = [...solveMoves(discCount, 0, 2, 1)];
    let i = 0;

    function step() {
      if (i >= moves.length) {
        solving = false;
        checkWin();
        return;
      }
      const [from, to] = moves[i];
      pegs[to].push(pegs[from].pop());
      moveCount++;
      movesEl.textContent = String(moveCount);
      render();
      i++;
      setTimeout(step, 500);
    }

    step();
  }

  discSelect.addEventListener('change', setup);
  resetBtn.addEventListener('click', setup);
  solveBtn.addEventListener('click', autoSolve);

  setup();
})();
