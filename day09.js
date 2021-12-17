'use strict'
const readline = require('readline');
const fs = require('fs');

const highValue = 99999;

function getValueLeft(points, i, j) {
  if (j > 0) return points[i][j-1];
  return highValue
}

function getValueRight(points, i, j) {
  if (j < points[i].length - 1) return points[i][j+1];
  return highValue
}

function getValueUp(points, i, j) {
  if (i > 0) return points[i-1][j];
  return highValue
}

function getValueDown(points, i, j) {
  if (i < points.length - 1) return points[i+1][j];
  return highValue
}

// Part 1
// ======

const part1 = async(input) => {
  let totalRisk = 0;
  let points = fs.readFileSync(input).toString().split("\n").map(x => x.split("").map(Number))
  
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      if (points[i][j] < Math.min(getValueLeft(points,i,j), 
                          getValueRight(points,i,j), 
                          getValueUp(points,i,j), 
                          getValueDown(points,i,j))) {
        totalRisk += points[i][j] + 1;
      }
    }
  }

  return totalRisk
}

function getPointLeft(points, point) {
  if (point.j > 0) return {val: points[point.i][point.j-1], i: point.i, j: point.j-1}
  return highValue
}

function getPointRight(points, point) {
  if (point.j < points[point.i].length - 1) return {val: points[point.i][point.j+1], i: point.i, j: point.j+1}
  return highValue
}

function getPointUp(points, point) {
  if (point.i > 0) return {val: points[point.i-1][point.j], i: point.i-1, j: point.j}
  return highValue
}

function getPointDown(points, point) {
  if (point.i < points.length - 1) return {val: points[point.i+1][point.j], i: point.i+1, j: point.j}
  return highValue
}

function getBasinPoints(points, point) {
  let basinPoints = new Array();
  basinPoints.push(point);
  
  if (point.val < getValueLeft(points,point.i,point.j) && getValueLeft(points,point.i,point.j) < 9) {
    basinPoints.push(getBasinPoints(points, getPointLeft(points, point)));
  }

  if (point.val < getValueRight(points,point.i,point.j) && getValueRight(points,point.i,point.j) < 9) {
    basinPoints.push(getBasinPoints(points, getPointRight(points, point)));
  }
  
  if (point.val < getValueUp(points,point.i,point.j) && getValueUp(points,point.i,point.j) < 9) {
    basinPoints.push(getBasinPoints(points, getPointUp(points, point)));
  }

  if (point.val < getValueDown(points,point.i,point.j) && getValueDown(points,point.i,point.j) < 9) {
    basinPoints.push(getBasinPoints(points, getPointDown(points, point)));
  }

  return basinPoints.flat();
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
  let points = fs.readFileSync(input).toString().split("\n").map(x => x.split("").map(Number))

  let lowPoints = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      if (points[i][j] < Math.min(getValueLeft(points,i,j), 
                          getValueRight(points,i,j), 
                          getValueUp(points,i,j), 
                          getValueDown(points,i,j))) {
        lowPoints.push({val: points[i][j], i: i, j: j});
      }
    }
  }

  let basinSizes = new Array();
  lowPoints.forEach( lowPoint => {
    let coords = getBasinPoints(points, lowPoint).map( x => x.i+","+x.j )
    basinSizes.push(uniq(coords).length)
  })

  let topThreeBasinSizes = basinSizes.sort((a, b) => b-a ).slice(0, 3);
  return topThreeBasinSizes.reduce((total, x) => total * x)
}

module.exports = { part1, part2 }
