'use strict'
const readline = require('readline');
const fs = require('fs');

const errorValues = new Map();
errorValues.set(")", 3);
errorValues.set("]", 57);
errorValues.set("}", 1197);
errorValues.set(">", 25137);


const removeCompleteChunks = (line) => {
  let removedSubChunks = true;

  // keep removing subchunks until no more to remove
  while (removedSubChunks) {
    removedSubChunks = false;
    line.forEach((e, i) => {
      if (e == "{" && line[i+1] == "}") {
        line.splice(i, 2)
        removedSubChunks = true
      }
      if (e == "[" && line[i+1] == "]") {
        line.splice(i, 2)
        removedSubChunks = true
      }
      if (e == "(" && line[i+1] == ")") {
        line.splice(i, 2)
        removedSubChunks = true
      }
      if (e == "<" && line[i+1] == ">") {
        line.splice(i, 2)
        removedSubChunks = true
      }
    });
  }

  return line;
}


const isCloser = (c) => {
    if (c == "}" ||
        c == "]" ||
        c == ")" ||
        c == ">" ) return true
    return false
}

// Part 1
// ======

const part1 = async(input) => {

  var inputs = fs.readFileSync(input).toString().split("\n").map(x => x.split(""));

  let errorSum = 0;
  inputs.forEach(line => {
    let filtered = removeCompleteChunks(line)
    for (let c of filtered) {
      if (isCloser(c)) {
        errorSum += errorValues.get(c)
        break;
      }
    }
  })

  return errorSum
}

// Part 2
// ======


const filterCorruptLines = (inputs) => {
  let incompleteLines = new Array();

  inputs.forEach(line => {
    let filtered = removeCompleteChunks(line)
    let corruptLine = false;

    for (let c of filtered) {
      if (isCloser(c)) {
        corruptLine = true;
        break;
      }
    }
    if (!corruptLine) incompleteLines.push(line)
  })

  return incompleteLines
}

const completionScore = new Map();
completionScore.set("(", 1);
completionScore.set("[", 2);
completionScore.set("{", 3);
completionScore.set("<", 4);

const part2 = async(input) => {
  var inputs = fs.readFileSync(input).toString().split("\n").map(x => x.split(""));
  let filteredIncompleteLines = filterCorruptLines(inputs)
  let lineScores = new Array()

  filteredIncompleteLines.forEach( l => {
    let lineScore = 0;
    l.reverse().forEach( c => {
      lineScore = 5*lineScore + completionScore.get(c)
    })
    lineScores.push(lineScore)
  });

  return lineScores.sort((a, b) => b-a )[Math.round(lineScores.length/2) - 1]
}

module.exports = { part1, part2 }
