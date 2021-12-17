'use strict'
const readline = require('readline');
const fs = require('fs');



// Part 1
// ======

const part1 = async(input) => {
  var crabPositions = fs.readFileSync(input).toString().split(",").map(x => parseInt(x));
  var positionFuel = new Array(Math.max(...crabPositions)).fill(0);
  for(let i = 0; i < positionFuel.length; i++) {
    positionFuel[i] = crabPositions.reduce(function(acc, val) { return acc + Math.abs(val - i); }, 0);
  }
  return Math.min(...positionFuel)
}

// Part 2
// ======

function getFuelCost(moves) {
  let sum = 0
  for (let i = 0; i <= moves; i ++) {
    sum += i
  }
  return sum
}

const part2 = async(input) => {
  var crabPositions = fs.readFileSync(input).toString().split(",").map(x => parseInt(x));
  var positionFuel = new Array(Math.max(...crabPositions)).fill(0);
  for(let i = 0; i < positionFuel.length; i++) {
    positionFuel[i] = crabPositions.reduce(function(acc, val) { return acc + getFuelCost(Math.abs(val - i)); }, 0);
  }

  return Math.min(...positionFuel)
}

module.exports = { part1, part2 }
