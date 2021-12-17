'use strict'
const readline = require('readline');
const fs = require('fs');

const restartDays = 6
const newDays = 8

// Part 1
// ======

function naiveCount(days, input) {
  var fishs = fs.readFileSync(input).toString().split(",").map(x => parseInt(x));
  let numAdditional  = 0;
  console.log("Initial state: " + fishs)
  for (let day = 0; day < days; day++) {
    let additionalFish = new Array();
    
    fishs.forEach((fish, i) => {
      if (fish == 0) {
        fishs[i] = restartDays
        additionalFish.push(newDays)
        numAdditional++;
      } else {
        fishs[i] = fish - 1
      }
    });

    if (additionalFish.length != 0) fishs.push(...additionalFish)
    console.log("After \t" + (day+1) + " days: " + fishs)
  }
  
  return fishs.length
}

function dayArrayCount(days, input) {
  var fish = fs.readFileSync(input).toString().split(",").map(x => parseInt(x));
  let fishDays = new Array(newDays+1).fill(0);
  fish.forEach((fish) => { fishDays[fish]++ });  

  for (let dayIt = 0; dayIt < days; dayIt++) {
    let zeroFish = fishDays[0];
    for (let i = 0; i < newDays; i++) {
      fishDays[i] = fishDays[i+1];
    };
    fishDays[newDays] = zeroFish
    fishDays[restartDays] += zeroFish
  }
  
  return fishDays.reduce(function(acc, val) { return acc + val; }, 0);
}

const part1 = async(input) => {
  return dayArrayCount(80, input)
}


// Part 2
// ======

const part2 = async(input) => {
  return dayArrayCount(256, input)
}

module.exports = { part1, part2 }
