'use strict'
const readline = require('readline');
const fs = require('fs');


// Part 1
// ======

const part1 = async(input) => {

  var parsedInput = fs.readFileSync(input).toString().split(",").map(x => parseInt(x));

  return input
}

// Part 2
// ======

const part2 = async(input) => {

  return 0
}

module.exports = { part1, part2 }
