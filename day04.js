'use strict'
const readline = require('readline');
const fs = require('fs');

const boardSize = 5; 
const arrayColumn = (arr, boardSize) => arr.map(x => x[boardSize]);
const arrSum = array =>
    array.reduce(
        (sum, num) => sum + (Array.isArray(num) ? arrSum(num) : num * 1),
        0
    );

function lineWin(draw, line) {
  return line.every(val => draw.includes(val))
};

function checkColumns(draw, board) {
  for (let i=0,winner=false; i < boardSize && !winner; i++) {
    winner = lineWin(draw, arrayColumn(board, i));
    if (winner) return { winner: winner, index: i }
  }

  return { winner: false, index: -1 };
}

function checkRows(draw, board) {
  for (let i=0,winner=false; i < boardSize && !winner; i++) {
    winner = lineWin(draw, board[i]);
    if (winner) return { winner: winner, index: i }
  }

  return { winner: false, index: -1 };
}

function checkBoard(draw, board) {
  let boardWin = {
    column: -1,
    row: -1,
    winner: false
  }

  if (checkColumns(draw, board).winner) {
    boardWin.column = checkColumns(draw, board).index;
    boardWin.winner = true;
  }

  if (checkRows(draw, board).winner) {
    boardWin.row = checkRows(draw, board).index;
    boardWin.winner = true;
  }

  return boardWin
};

function parseInput(input) {
  var array = fs.readFileSync(input).toString().split("\n");
  let draw = new Array();
  let boards = new Array();
  

  draw = array[0].split(',').map(x => parseInt(x));

  let board = new Array();
  for (let i=2,boardIndex=0,boardLine=[],boardRow=0; i < array.length; i++,boardLine=[]) {
    if (boardRow == boardSize) {
      // If we finished capturing a board
      // Set variables to start processing a new board
      boards.push(board);
      boardRow = 0;
      boardIndex++
      board = new Array();
    } else {
      boardLine = array[i].trim().split(/\s+/).map(x => parseInt(x));
      board.push(boardLine);
      boardRow++
    }    
  }

  // push the last board in
  boards.push(board);

  return { draw: draw, boards: boards }
};

// Part 1
// ======

const part1 = async(input) => {

  let { draw, boards } = parseInput(input);

  let checkDraw = []
  for (let j=0; j < draw.length; j++) {
    checkDraw = draw.slice(0, j);

    for (let i=0; i < boards.length; i++) {
      if (checkBoard(checkDraw, boards[i]).winner) {
        let winningBoard = boards[i].flat();
        let unmarkedNumbers = winningBoard.filter((num) => {
          // return those numbers not in the draw
          return !checkDraw.includes(num);
        });

        return arrSum(unmarkedNumbers) * checkDraw[checkDraw.length-1];
      }
    }
  }
  
  return 0
}

// Part 2
// ======

const part2 = async(input) => {

  let { draw, boards } = parseInput(input);

  let checkDraw = []

  let winner = false;
  for (let j=0; j < draw.length; j++) {
    checkDraw = draw.slice(0, j);

    for (let i=0; i < boards.length; i++) {
      winner = checkBoard(checkDraw, boards[i]).winner
      if (winner && boards.length == 1) {
        let winningBoard = boards[0].flat();
        let unmarkedNumbers = winningBoard.filter((num) => {
          // return those numbers not in the draw
          return !checkDraw.includes(num);
        });

        return arrSum(unmarkedNumbers) * checkDraw[checkDraw.length-1];
      }

      // remove boards until there is only one left
      if (winner && boards.length > 1) {
        boards.splice(i, 1)
        i--;
      }
    }
  }

  return input
}

module.exports = { part1, part2 }
