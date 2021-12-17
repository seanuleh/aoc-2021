'use strict'
const readline = require('readline');
const fs = require('fs');


const parseInput = (input) => {
  var lines = fs.readFileSync(input).toString().split("\n");
  let dots = new Array();
  
  let folds = new Array();
  for (let line of lines) {
    if (line.includes("fold")) {
      let [axis, index] = line.replace("fold along ", "").split("=")
      folds.push({axis: axis, index:index})
    }
  }

  for (let i = 0; i < lines.length - (folds.length+1); i++) {
    let [x, y] = lines[i].split(',').map(x => parseInt(x));; 
    dots.push({x: x, y: y});
  };

  return {dots: dots, folds: folds}

}

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

// Part 1
// ======

const part1 = async(input) => {
  let {dots, folds} = parseInput(input);

  let fold = folds[0]
  dots.forEach((p, i) => {
    if (fold.axis == 'y') {
      if (p.y > fold.index) {
        dots[i] = {x: p.x, y: 2*fold.index-p.y}
      }
    }

    if (fold.axis == 'x') {
      if (p.x > fold.index) {
        dots[i] = {x: 2*fold.index-p.x, y: p.y}
      }
    }
  });

  let points = new Array()
  dots.forEach((p, i) => {
    points.push(p.x+","+p.y)
  })
  return uniq(points).length
}

// Part 2
// ======

const part2 = async(input) => {

  let {dots, folds} = parseInput(input);

  for (let fold of folds) {
    dots.forEach((p, i) => {
      if (fold.axis == 'y') {
        if (p.y > fold.index) {
          dots[i] = {x: p.x, y: 2*fold.index-p.y}
        }
      }

      if (fold.axis == 'x') {
        if (p.x > fold.index) {
          dots[i] = {x: 2*fold.index-p.x, y: p.y}
        }
      }
    })
  }

  let foldedMap = new Array(Math.max(...dots.map(p => p.y))+1).fill(" ")
                .map(() => new Array(Math.max(...dots.map(p => p.x))+1).fill(" "));
  dots.forEach(p => {
    foldedMap[p.y][p.x] = "X"
  })
  for (let pointLine of foldedMap) {
    process.stdout.write(pointLine.join(""))
    console.log()
  }

  return
}

module.exports = { part1, part2 }
