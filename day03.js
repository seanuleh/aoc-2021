'use strict'
const readline = require('readline');
const fs = require('fs');


function getCommonBits(array) {
  let sums = new Array(array[0].length).fill(0);
  let size = sums.length;
  
  let mcb = [];
  let lcb = []; 

  // Calculate the MCB by adding all the bits in each bit position;
  //  then divide by the number of lines in the input
  //  then round to the nearest integer
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < size; j++) {     
      sums[j] += parseInt(array[i][j])
    }
  }

  for (let j = 0; j < size; j++) {      
    mcb[j] = Math.round((sums[j] / array.length));
    switch (mcb[j]) {
      case 1:
        lcb[j] = 0;
        break;
      case 0:
        lcb[j] = 1;
        break;
    }
  }

  return { mcb: mcb, lcb: lcb }
};


// Part 1
// ======

const part1 = async(input) => {
  var array = fs.readFileSync(input).toString().split("\n");
  let { mcb, lcb } = getCommonBits(array);

  let mcbDecimal = parseInt(parseInt(mcb.join('')), 2);
  let lcbDecimal = parseInt(parseInt(lcb.join('')), 2);

  return mcbDecimal*lcbDecimal;
}

// Part 2
// ======



const part2 = async(input) => {

  var array = fs.readFileSync(input).toString().split("\n");
  let inputSize = array[0].length; // grab length of first item to determine input size
  let { mcb, lcb } = getCommonBits(array);
    
  // Loop through the array (readingsMcb) and remove items
  // once they no longer match the mcb bit position
  // break when there is only one item left in the array
  let readingsMcb = Array.from(array);
  for (let bitPosition = 0; bitPosition < inputSize; bitPosition++) {
    if (readingsMcb.length == 1) break;
    for (let index = 0; index < readingsMcb.length; index++) {
      if (readingsMcb.length == 1) break;
      if (parseInt(readingsMcb[index][bitPosition]) != mcb[bitPosition]) {
        // when removing item from array need to reset the index
        readingsMcb.splice(index, 1)
        index--;
      }
    }
    
    // recalculate mcb after each pass
    mcb = getCommonBits(readingsMcb).mcb;
  }

  // Loop through the array (readingsLcb) and remove items
  // when they no longer match the mcb bit position
  // break when there is only one item left in the array
  let readingsLcb = Array.from(array);
  for (let bitPosition = 0; bitPosition < inputSize; bitPosition++) {
    if (readingsLcb.length == 1) break;
    for (let index = 0; index < readingsLcb.length; index++) {
      if (parseInt(readingsLcb[index][bitPosition]) != lcb[bitPosition]) {
        if (readingsLcb.length == 1) break;
        // when removing item from array need to reset the index
        readingsLcb.splice(index, 1)
        index--;
      }
    }

    // recalculate lcb after each pass
    lcb = getCommonBits(readingsLcb).lcb;
  }

  let mcbDecimal = parseInt(readingsMcb, 2);
  let lcbDecimal = parseInt(readingsLcb, 2);
  return mcbDecimal*lcbDecimal;
}

module.exports = { part1, part2 }