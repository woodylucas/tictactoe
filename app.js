// setting up variables.
var origBoard;
const userPlayer = 'X';
const computerPlayer = 'O';
// array of winning combinations
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]
// using the DOM
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none"
  origBoard = Array.from(Array(9).keys());
  // to remove x, and o's from board. create a for loop
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false)
  }
}
function turnClick(square) {
  if (typeof origBoard[square.target.id] === 'number') {
    turn(square.target.id, userPlayer)
    if (!checkTie()) turn(bestSpot(), computerPlayer);
  }

}
// to get user 'X' to appear on screen.
//using innerText to post text on screen.
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
//checking if a certain player has won
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}
// indicating who wins with a color.
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player == userPlayer ? "green" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
   }
   declareWinner(gameWon.player == userPlayer ? "YAYYYY YOU WIN!!!" : "You Lose, try again");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;

}
function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minimax(origBoard, computerPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for ( var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "yellow";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
  return true;
  }
  return false;
}

//minimax algorithm

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);
  if (checkWin(newBoard, player)) {
    return {score: -10};
  } else if (checkWin(newBoard, computerPlayer)) {
    return {score: 20};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  var moves =[];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === computerPlayer) {
      var result = minimax(newBoard, userPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computerPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if(player === computerPlayer) {
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
