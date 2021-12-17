'use strict'
const fs = require('fs');

// Part 1
// ======

const part1 = async(input) => {
  let increases = 0;

  var array = fs.readFileSync(input).toString().split("\n");

  for (let i = 1; i < array.length; i++) {
    if (parseInt(array[i]) > parseInt(array[i-1])) increases++;
  }
  
  return increases
}

// Part 2
// ======

const part2 = async(input) => {
  let increases = 0;
  let windowSize = 3;
  let windows = [];

  var array = fs.readFileSync(input).toString().split("\n");

  let j = 0;
  for (let i = (windowSize-1); i < array.length; i++,j++) {
    windows[j] = parseInt(array[i]) + 
                  parseInt(array[i-1]) + 
                  parseInt(array[i-2])
  }

  for (let i = 1; i < windows.length; i++) {
    if (parseInt(windows[i]) > parseInt(windows[i-1])) increases++;
  }

  
  return increases
}

module.exports = { part1, part2 }
