/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//The width and height of the game board are set with these variables.
const width = 7;
const height = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

//Creates the game board in JS memory.
function makeBoard() {
  for(let row = 0; row < height; row++){
    const currRow = [];
    for(let column = 0; column < width; column++){
      const currCell = null;
      currRow.push(currCell);
    }
    board.push(currRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //Selects the game board from the DOM.
  let htmlBoard = document.querySelector('#board');
  // Creates the row where players can insert pieces into columns.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
// Creates the individual spaces where players can insert pieces into each column.
  for (let column = 0; column < width; column++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", column);
    top.append(headCell);
  }
  htmlBoard.append(top);
  // Creates the playable spaces of the board.
  for (let row = 0; row < height; row++) {
    const currRow = document.createElement("tr");
    for (let column = 0; column < width; column++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `row${row}-column${column}`);
      currRow.append(cell);
    }
    htmlBoard.append(currRow);
  }
}

// findSpotForCol: given column x, return top empty y (null if filled)
function findSpotForCol(column) {
  for(let row = 5; row >= 0; row--){
    if(board[row][column] === null){
      return row;
    }
    else{
      continue;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(row, column) {
  let piece = document.createElement('div');
  piece.classList.add('piece');
  if(currPlayer === 1){
    piece.classList.add('one');
  }
  else{
    piece.classList.add('two');
  }
  let cell = document.querySelector(`#row${row}-column${column}`)
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let column = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let row = findSpotForCol(column);
  if (row === null) {
    return;
  }
  // place piece in board and add to HTML table
  placeInTable(row, column)
  board[row][column] = currPlayer;
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let filled = board.every(function(row){
    return row.every(cell => cell !== null);
  })
  if(filled){
    endGame('Tie game!');
  }
  // switch players
  if(currPlayer === 1){
    currPlayer = 2;
  }
  else{
    currPlayer = 1;
  }
}

// checkForWin: check board cell-by-cell for "does a win start here?"

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([row, column]) =>
        row >= 0 &&
        row < height &&
        column >= 0 &&
        column < width &&
        board[row][column] === currPlayer
    );
  }

  for (let row = 0; row < height; row++) {
  //For each cell in each row...
    for (let column = 0; column < width; column++) {
      //These are the various ways--horizontal, vertical, and two diagonals--that a win that starts from the current cell can happen.
      let horiz = [[row, column], [row, column + 1], [row, column + 2], [row, column + 3]];
      let vert = [[row, column], [row + 1, column], [row + 2, column], [row + 3, column]];
      let diagDR = [[row, column], [row + 1, column + 1], [row + 2, column + 2], [row + 3, column + 3]];
      let diagDL = [[row, column], [row + 1, column - 1], [row + 2, column - 2], [row + 3, column - 3]];
      //If any of those ways to win match win conditions...
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        //...run the code that results when win conditions are met.
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
