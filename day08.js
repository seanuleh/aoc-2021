'use strict'
const readline = require('readline');
const fs = require('fs');


// Part 1
// ======

const knownDigits = new Map();
knownDigits.set(2, 1);
knownDigits.set(4, 4);
knownDigits.set(3, 7);
knownDigits.set(7, 8);

const knownSizes = [2, 4, 3, 7]

const part1 = async(input) => {
  let digitOccurence = 0;
  var parsedInput = fs.readFileSync(input).toString().split("\n")
  parsedInput.forEach(inputLine => {
    
    let line = inputLine.split(" | ");
    var signalPattern = line[0].split(" ");
    var outputValue =  line[1].split(" ");

    let outputValueSizes = outputValue.map(x => x.length );
    outputValueSizes.forEach( o => {
      if (knownSizes.includes(o)) digitOccurence++
    })

    // console.log(outputValue);
    // console.log(outputValueSizes);
    // console.log()
    
  })

  return digitOccurence
}

// Part 2
// ======

function exclusion(a1, a2) {
    return a1.filter(x => !a2.includes(x))
}

const everyChecker = (arr, target) => target.every(v => arr.includes(v));


const part2 = async(input) => {
  let digitOccurence = 0;
  var parsedInput = fs.readFileSync(input).toString().split("\n")

  let decodedSignals = new Array()
  parsedInput.forEach(inputLine => {
    
    let line = inputLine.split(" | ");
    var signalPattern = line[0].split(" ");
    var outputValue =  line[1].split(" ");
    let signalDecoded = new Array(signalPattern.length+1)

    let signalPatternSizes = signalPattern.map(x => x.length );
    for (let i=0; i < signalPattern.length; i++) {
      if (knownSizes.includes(signalPatternSizes[i])) {
        signalDecoded[knownDigits.get(signalPatternSizes[i])] = signalPattern[i].split("")
      }
    }

    // let t,tl,tr,m,bl,br,b
    let t = exclusion(signalDecoded[7], signalDecoded[1])
    let b_bl = exclusion(exclusion(signalDecoded[8], signalDecoded[7]), signalDecoded[4])
    
    for (let i=0; i < signalPattern.length; i++) {
      // if size == 6, digit is 0, 6, 9
      if (signalPattern[i].length == 6) {
        if (!everyChecker(signalPattern[i].split(""), b_bl)) {
          // if size == 6 and does not contain b_bl digit is 9
          signalDecoded[9] = signalPattern[i].split("")
        } else if (everyChecker(signalPattern[i].split(""), signalDecoded[1]) && everyChecker(signalPattern[i].split(""), b_bl)) {
          // if size == 6, include segments for 1 and b_bl must be 0  
          signalDecoded[0] = signalPattern[i].split("")
        } else {
          // left over must be 6
          signalDecoded[6] = signalPattern[i].split("")
        }
      }
    }

    let bl = exclusion(signalDecoded[8], signalDecoded[9])
    let m = exclusion(signalDecoded[8], signalDecoded[0])
    let tl = exclusion(exclusion(signalDecoded[4], signalDecoded[1]), m)

    for (let i=0; i < signalPattern.length; i++) {
      // if size == 5, digit is 2, 3, 5
      if (signalPattern[i].length == 5) {
        if (signalPattern[i].includes(bl)) {
          // if it contains bl segment must be 2
          signalDecoded[2] = signalPattern[i].split("")
        } else if (everyChecker(signalPattern[i].split(""), tl)) {
          // if it contains tl segment must be 5
          signalDecoded[5] = signalPattern[i].split("")
        } else {
          // else must be 3
          signalDecoded[3] = signalPattern[i].split("")
        }
      }
    }

    // console.log("t: ", t);
    // console.log("bl: ", bl);
    // console.log("b: ", b);
    // console.log("b_bl: ", b_bl);
    // console.log("m: ", m);
    // console.log("tl: ", tl);


    // signalDecoded.forEach( (x, i) => {
    //   console.log(i,": ", x)
    // })

    let decodedOutputs = new Array();
    outputValue.forEach(output => {
      signalDecoded.forEach( (decode, i) => {
        if ( everyChecker(decode, output.split("")) && decode.length == output.split("").length) {
          decodedOutputs.push(i)
        }
      })
    });

    decodedSignals.push(parseInt(decodedOutputs.join("")))
  })


  return decodedSignals.reduce(function(acc, val) { return acc + val; }, 0);
}

module.exports = { part1, part2 }
