'use strict'
const readline = require('readline');
const fs = require('fs');
// const { Map } = require('immutable');


// Part 1
// ======

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

const part1 = async(input) => {

  var parsedInput = fs.readFileSync(input).toString().split("\n")

  let template = parsedInput[0]
  let ruleMap = new Map();
  parsedInput.slice(2).map(x => x.split(" -> ")).forEach(rule => {
    ruleMap.set(rule[0], rule[1])
  });
  
  let steps = 12
  for (let s = 0; s < steps; s++) {
    let templateStep = template;
    for (let i=0; i < templateStep.length - 1; i++) {
      let insertion = ruleMap.get(templateStep.substring(i,i+2));
      template = template.substring(0,2*i+1) + insertion + template.substring(2*i+1)
    }  
  }

  let polymer = template.split("");
  let elementFreq = new Map();
  uniq(polymer).forEach(p => {
    elementFreq.set(p, 0)
  })

  let mostCommon = 0
  let leastCommon = Number.MAX_SAFE_INTEGER
  polymer.forEach(p => {
    elementFreq.set(p, elementFreq.get(p) + 1)
  })

  polymer.forEach(p => {
    if (elementFreq.get(p) > mostCommon) mostCommon = elementFreq.get(p)
    if (elementFreq.get(p) < leastCommon) leastCommon = elementFreq.get(p)
  })

  console.log(elementFreq);

  return mostCommon-leastCommon
}

// Part 2
// ======

const part2 = async(input) => {
  var parsedInput = fs.readFileSync(input).toString().split("\n")


  let template = parsedInput[0]
  let ruleMap = new Map();
  let elementPairsEmpty = new Map();
  parsedInput.slice(2).map(x => x.split(" -> ")).forEach(rule => {
    ruleMap.set(rule[0], rule[1])
    elementPairsEmpty.set(rule[0], 0)
  });
  
  let elementPairs = new Map(elementPairsEmpty);
  for (let i=0; i < template.length - 1; i++) {
    elementPairs.set(template.substring(i,i+2), elementPairs.get(template.substring(i,i+2))+1)
  }

  // DO STEPS
  let steps = 40
  for (let s = 1; s <= steps; s++) {
    let elementPairsStep = new Map(elementPairsEmpty)
    elementPairs.forEach((val, key) => {
      if (val > 0) {
        let first = key[0]
        let second = key[1]
        let insert = ruleMap.get(key);
        elementPairsStep.set(first+insert, elementPairsStep.get(first+insert)+val)
        elementPairsStep.set(insert+second, elementPairsStep.get(insert+second)+val)
      }
    })

    elementPairs = new Map(elementPairsStep)
  }

  // CREATE ELEMENTS ARRAY
  let elementsFreq = new Map();
  let elements = new Array();
  elementPairs.forEach((val, key) => {
    elements.push(key.split("").flat())
  });
  elements = uniq(elements.flat())

  // CREATE AND INIT FREQ MAP
  elements.forEach( e => {
    elementsFreq.set(e, 0)
  })

  // CALCUALTE FREQ OF ELEMENT
  elementPairs.forEach((val, key) => {
    let first = key[0]
    let second = key[1]
    elementsFreq.set(first, elementsFreq.get(first) + val)
    elementsFreq.set(second, elementsFreq.get(second) + val)
  });

  let mostCommon = 0
  let leastCommon = Number.MAX_SAFE_INTEGER
  elements.forEach(p => {
    if (elementsFreq.get(p) > mostCommon) mostCommon = elementsFreq.get(p)
    if (elementsFreq.get(p) < leastCommon) leastCommon = elementsFreq.get(p)
  })
  
  return (mostCommon-leastCommon)/2
}

module.exports = { part1, part2 }
