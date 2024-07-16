const grid = document.querySelector('.grid');
const boxes = document.querySelectorAll('.box');
const playerTurn = document.querySelector('.player-turn');
const restartBtn = document.querySelector('#restart');
// create the board and expose the necessary methods
const gameBoard = (function () {
  let board = Array(9).fill('');
  const getBoard = () => board;
  const clearBoard = () => (board = Array(9).fill(''));
  const getSquare = (position) => board[position];
  const setSquare = (position, mark) => (board[position] = mark);
  return { getBoard, clearBoard, getSquare, setSquare };
})();

const player = (name, mark) => {
  return { name, mark };
};

const winChecker = (function () {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const check = function () {
    const isWinner = winningConditions.filter((condition) => {
      a = gameBoard.getSquare(condition[0]);
      b = gameBoard.getSquare(condition[1]);
      c = gameBoard.getSquare(condition[2]);
      if (a === b && b === c && a !== '') return true;
      return false;
    });
    return isWinner;
  };

  return { check };
})();

const gameController = (function () {
  const player1 = player('Player 1', 'X');
  const player2 = player('Player 2', 'O');
  const board = gameBoard;
  let round = 0;
  let win;

  let activePlayer = player1;
  const getActivePlayer = () => activePlayer;
  const switchPlayer = () =>
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);

  const playRound = (box, e) => {
    console.log(getActivePlayer());
    // check if box is marked already
    if (board.getSquare(box) !== '') {
      console.log('already taken');
      return;
      // it might be better to restrict click on the box
    }
    board.setSquare(box, getActivePlayer().mark);
    switchPlayer();
    updateBoard();

    win = winChecker.check();
    if (Array.isArray(win) && win.length) {
      switchPlayer();
      playerTurn.innerHTML = `${getActivePlayer().name} has won!`;
      grid.removeEventListener('click', displayController.placeMarker);
      restartBtn.classList.remove('hide');
    }
    round++;
    if (round === 10 && !win.length) {
      playerTurn.innerHTML = `The game is a draw`;
      grid.removeEventListener('click', displayController.placeMarker);
      restartBtn.classList.remove('hide');
    }
  };

  const updateBoard = () => {
    boxes.forEach((box, index) => {
      box.innerHTML = gameBoard.getSquare(index);
    });
    playerTurn.innerHTML = `${getActivePlayer().name}'s turn`;
  };

  const restartGame = () => {
    gameBoard.clearBoard();
    grid.addEventListener('click', displayController.placeMarker);
    activePlayer = player1;
    round = 1;
    updateBoard();
    restartBtn.classList.add('hide');
    win = Array();
  };
  return { playRound, restartGame };
})();

const displayController = (function () {
  const placeMarker = (e) => {
    const box = e.target.dataset.index;
    //e.target.innerHTML = 'X';
    console.log(box);
    gameController.playRound(box, e);
  };
  const restartGame = (e) => {
    gameController.restartGame();
  };
  return { placeMarker, restartGame };
})();

grid.addEventListener('click', displayController.placeMarker);
restartBtn.addEventListener('click', displayController.restartGame);
console.log(boxes);
