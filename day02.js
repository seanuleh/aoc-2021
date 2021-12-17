'use strict'
const readline = require('readline');
const fs = require('fs');

// Part 1
// ======

const part1 = async(input) => {
  let position = {
    depth: 0,
    horizontal: 0
  }

  var rl = readline.createInterface({
    input: fs.createReadStream(input),
    output: process.stdout,
    terminal: false
  });

  for await (const line of rl) {
    let parts = line.split(' ');

    switch (parts[0]) {
      case 'forward':
        position.horizontal += parseInt(parts[1])
        break;
      case 'down':
        position.depth += parseInt(parts[1])
        break;
      case 'up':
        position.depth -= parseInt(parts[1])
        break;
    }
  };

  return position.depth * position.horizontal
}

// Part 2
// ======

const part2 = async(input) => {
  let position = {
    depth: 0,
    horizontal: 0,
    aim: 0
  }

  var rl = readline.createInterface({
    input: fs.createReadStream(input),
    output: process.stdout,
    terminal: false
  });
  
  for await (const line of rl) {
    let parts = line.split(' ');

    switch (parts[0]) {
      case 'forward':
        position.horizontal += parseInt(parts[1])
        position.depth += position.aim * parseInt(parts[1])
        break;
      case 'down':
        position.aim += parseInt(parts[1])
        break;
      case 'up':
        position.aim -= parseInt(parts[1])
        break;
    }
  };

  return position.depth * position.horizontal
}

module.exports = { part1, part2 }
