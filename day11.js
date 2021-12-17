
'use strict'
const readline = require('readline');
const fs = require('fs');

let flashes = 0;
let flashed;

const neighbors = (inputs, x, y) => {
  if (!Number.isInteger(inputs[y][x])) {
    return [];
  }

  const around = [];
  if (x > 0) {
    around.push({ x: x - 1, y, v: inputs[y][x - 1] });
  }
  if (x < inputs[0].length - 1) {
    around.push({ x: x + 1, y, v: inputs[y][x + 1] });
  }
  if (y > 0) {
    around.push({ x, y: y - 1, v: inputs[y - 1][x] });
  }
  if (y < inputs.length - 1) {
    around.push({ x, y: y + 1, v: inputs[y + 1][x] });
  }
  if (x > 0 && y > 0) {
    around.push({ x: x - 1, y: y - 1, v: inputs[y - 1][x - 1] });
  }
  if (x < inputs[0].length - 1 && y < inputs.length - 1) {
    around.push({ x: x + 1, y: y + 1, v: inputs[y + 1][x + 1] });
  }
  if (x > 0 && y < inputs.length - 1) {
    around.push({ x: x - 1, y: y + 1, v: inputs[y + 1][x - 1] });
  }
  if (x < inputs[0].length - 1 && y > 0) {
    around.push({ x: x + 1, y: y - 1, v: inputs[y - 1][x + 1] });
  } 

  return around;
};

const increasePoint = (inputs, x, y) => {
  if (flashed[x][y] == 0) {
    inputs[x][y]++;
    if (inputs[x][y] == 10) {
      flashes++;
      flashed[x][y] = 1;
      inputs[x][y] = 0
      let neighbours = neighbors(inputs, x, y)
      neighbours.forEach(p => {
        increasePoint(inputs, p.x, p.y)
      })
    }
  }
  return inputs;
};

// Part 1
// ======

const part1 = async(input) => {
  let inputs = fs.readFileSync(input).toString().split("\n").map(x => x.split("").map(Number))
  console.log(inputs)

  let steps = 100
  for(let s=0; s < steps; s++){
    flashed = new Array(10).fill(0).map(() => new Array(10).fill(0));
    for(let i=0; i < inputs.length; i++){
      for(let j=0; j < inputs[i].length; j++){
        // console.log("increasing: ",j,i,inputs[j][i])
        inputs = increasePoint(inputs, j, i, flashed)
        // console.log(inputs)

      }
    }
    // console.log("Step: " + s)
    // console.log(inputs)
  }
  
  return flashes;
}

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

// Part 2
// ======

const part2 = async(input) => {
  let inputs = fs.readFileSync(input).toString().split("\n").map(x => x.split("").map(Number))
  console.log(inputs)

  let steps = 99999999;
  for(let s=0; s < steps; s++){
    flashed = new Array(10).fill(0).map(() => new Array(10).fill(0));
    for(let i=0; i < inputs.length; i++){
      for(let j=0; j < inputs[i].length; j++){
        // console.log("increasing: ",j,i,inputs[j][i])
        inputs = increasePoint(inputs, j, i, flashed)
        // console.log(inputs)
      }
    }

    let checkValue = inputs[0][0];
    if (inputs.every(row => row.every(cell => cell == checkValue))) {
      return s+1
    }
    // console.log("Step: " + s + " All Equal: " + inputs.every(row => row.every(val => val === checkValue)))
  
  }


  
  return 0;
}

module.exports = { part1, part2 }
