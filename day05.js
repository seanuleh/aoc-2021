'use strict'
const readline = require('readline');
const fs = require('fs');

function getMaxDimensions(linePoints) {
  let maxX = 0;
  let maxY = 0;
  linePoints.forEach(linePointsSegment => {
    if (linePointsSegment.x1 > maxX) maxX = linePointsSegment.x1
    if (linePointsSegment.x2 > maxX) maxX = linePointsSegment.x2
    if (linePointsSegment.y1 > maxY) maxY = linePointsSegment.y1
    if (linePointsSegment.y2 > maxY) maxY = linePointsSegment.y2
  })

  return (maxX > maxY) ? maxX : maxY
}

function getlinePointPairs(input) {
  var lines = fs.readFileSync(input).toString().split("\n");
  let linePoints = new Array();

  let point = {x: 0, y: 0}
  let linePointPairsRawInput = [];
  for (let i = 0; i < lines.length; i++) {
    linePointPairsRawInput = lines[i].split(' -> '); 
    let [x1, y1] = linePointPairsRawInput[0].split(',').map(x => parseInt(x));
    let [x2, y2] = linePointPairsRawInput[1].split(',').map(x => parseInt(x));
    linePoints.push({x1: x1, y1: y1, x2: x2, y2: y2});
  };

  // console.log(linePointPairs);

  return linePoints;
}

function initializeIntersections(linePoints) {
  let intersections = new Array();
  let size = getMaxDimensions(linePoints)+1;
  intersections = new Array(size).fill(0).map(() => new Array(size).fill(0));
  return intersections;
}

function getLineEquation(linePointsSegment) {
  // find an equation to solve for y

  let {x1, y1, x2, y2} = linePointsSegment;
  let m = (y2 - y1)/(x2 - x1);
  let b = y1 - m*x1;

  return {m: m,  b: b}
}

function getXInputsOnSegment(linePointsSegment){
  var list = [];
  let {x1, y1, x2, y2} = linePointsSegment;
  let lowEnd = (x1 - x2) >= 0 ? x2 : x1
  let highEnd = (x2 - x1) > 0 ? x2 : x1
  for (var i = lowEnd; i <= highEnd; i++) {
      list.push(i);
  }

  return list;
};

function getYInputsOnSegment(linePointsSegment){
  var list = [];
  let {x1, y1, x2, y2} = linePointsSegment;
  let lowEnd = (y1 - y2) >= 0 ? y2 : y1
  let highEnd = (y2 - y1) > 0 ? y2 : y1
  for (var i = lowEnd; i <= highEnd; i++) {
      list.push(i);
  }

  return list;
};

function constructIntersections(linePoints, intersections) {
  linePoints.forEach(linePointsSegment => {
    let {m, b} = getLineEquation(linePointsSegment);
    
    // check if y for x is an integer, if so add it to intersection
    if (isFinite(m)){ 
      let x_inputs = getXInputsOnSegment(linePointsSegment);
      x_inputs.forEach(x => {
        let y = m*x + b;
        if (isFinite(y) && Number.isInteger(y)) intersections[x][y]++
      })  
    } else {
      let y_inputs = getYInputsOnSegment(linePointsSegment);
      y_inputs.forEach(y => {
        intersections[linePointsSegment.x1][y]++
      })  
    }
  
  })
  return intersections;
}

function constructIntersectionsHorizontalLines(linePoints, intersections) {
  linePoints.forEach(linePointsSegment => {
    let {m, b} = getLineEquation(linePointsSegment);
    
    // check if y for x is an integer, if so add it to intersection
    if (isFinite(m)){ 
      let x_inputs = getXInputsOnSegment(linePointsSegment);
      x_inputs.forEach(x => {
        let y = m*x + b;
        if (isFinite(y) && Number.isInteger(y) && m == 0) intersections[x][y]++
      })  
    } else {
      let y_inputs = getYInputsOnSegment(linePointsSegment);
      y_inputs.forEach(y => {
        intersections[linePointsSegment.x1][y]++
      })  
    }
  })
  return intersections;
}

// Part 1
// ======

const part1 = async(input) => {
  let linePoints = getlinePointPairs(input);
  let intersections = initializeIntersections(linePoints);
  intersections = constructIntersectionsHorizontalLines(linePoints, intersections);

  let count = 0;
  intersections.map(row => {
    row.map(item => {
      if (item >= 2) count++
    })
  })

  return count
}

// Part 2
// ======

const part2 = async(input) => {
  let linePoints = getlinePointPairs(input);
  let intersections = initializeIntersections(linePoints);
  intersections = constructIntersections(linePoints, intersections);

  let count = 0;
  intersections.map(row => {
    row.map(item => {
      if (item >= 2) count++
    })
  })

  return count
}

module.exports = { part1, part2 }
