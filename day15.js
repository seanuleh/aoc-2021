'use strict'
const readline = require('readline');
const fs = require('fs');
const { Heap } = require('heap-js');

class qItem {
  constructor(node, index, cost, parent) {
      this.node = node
      this.index = index
      this.parent = parent
      this.cost = cost
  }
}

const getNeighbours = (cave, [x, y]) => {
  let neighbours = new Array();

  if (x > 0) neighbours.push([x - 1, y])
  if (y > 0) neighbours.push([x, y - 1])
  if (x < cave[0].length-1) neighbours.push([x+1, y])
  if (y < cave.length-1) neighbours.push([x, y+1])

  return neighbours
}

const getRiskLevel = (cave, [x, y]) => {
  return cave[y][x]
}

const n2i = (node) => {
  return node[0]+","+node[1]
}

const dikstraBkp = (cave, qMap, settled, unsettled, unsettledIndexes) => {
  while (unsettled.length > 0) {
    let parent = unsettled.pop();
    unsettledIndexes = unsettledIndexes.filter(remove => remove.index != parent.index)

    let neighbours = getNeighbours(cave,parent.node)
    for (let n of neighbours) {
      if (!settled.includes(n2i(n))) {
        let updating = updateCost(cave, qMap, n, parent.cost)
        if (!unsettledIndexes.includes(updating.index)) {
          unsettledIndexes.push(updating.index)
          unsettled.push(updating)
        }
      }
    }

    settled.push(parent.index)
    if (settled.length % 1000 == 0) console.log(settled.length)
  }
}

const updateCost = (cave, qMap, node, parentCost) => {
  let newCost = parentCost + getRiskLevel(cave, node)
  let qItem = qMap.get(n2i(node))
  if (qItem.cost > newCost) {
    qItem.cost = newCost
  }

  return qItem
}

const dikstra = (cave, qMap, settled, unsettled) => {
  let iterations = 0;
  while (unsettled.length > 0) {
    let parent = unsettled.pop();

    let neighbours = getNeighbours(cave,parent.node)
    for (let n of neighbours) {
      if (!settled.includes(n2i(n))) {
        settled.push(parent.index)

        let newCost = parent.cost + getRiskLevel(cave, n)
        let qItem = qMap.get(n2i(n))
        if (newCost < qItem.cost) {
          qItem.cost = newCost
          unsettled.push(qItem)
          iterations++
        }
      }
    }

    if (iterations % 1000 == 0) console.log(iterations)
    
    // if (settled.length % 1000 == 0) console.log(settled.length)
  }
}

const setupCave = (input) => {
  var array = fs.readFileSync(input).toString().split("\n");

  // Init Cave 2d Array
  let cave = new Array()
  for (let line of array) {
    cave.push(line.split("").map(x => parseInt(x)))
  }
  let size = cave.length

  return [cave, size]
}

const setupDjikstra = (cave, size) => {
  // Init qMap,unsetlled pQue
  // qMap is a hashmap of all node elements
  // unsettled is a priority queue helper of qMap nodes
  // unsettledIndexes is an unsettled pq helper of currently active nodes in unsettled
  // settled is an array of visited nodes
  const customPriorityComparator = (a, b) => a.cost - b.cost;
  let qMap = new Map();
  let unsettled = new Heap(customPriorityComparator);
  let settled = new Array();

  for (let y in cave) {
    for (let x in cave[y]) {
      let node = [parseInt(x), parseInt(y)]
      let qi = new qItem(node, n2i(node), Number.MAX_SAFE_INTEGER);
      qMap.set(qi.index, qi);
    }
  }

  let startIndex = "0,0";
  let q = qMap.get(startIndex)
  q.cost = 0;
  unsettled.push(q)

  return [qMap, settled, unsettled]
}

const c2s = (cave) => {
  for (let y of cave) {
    console.log(y.join(","))
  }
}

// Part 1
// ======
const part1 = (input) => {
  let [cave, size] = setupCave(input);
  let [qMap, settled, unsettled] = setupDjikstra(cave, size)

  dikstra(cave, qMap, settled, unsettled);

  // console.log(qMap)

  let endItem = qMap.get(n2i([size-1, size-1]))
  return endItem.cost;
}


// Part 2
// ======
const createOffsetCave = (cave, offset) => {
  let size = cave.length
  let newCave = new Array(size).fill(0).map(() => new Array(size).fill(0));
  // c2s(newCave)

  for (let y in newCave) {
    for (let x in newCave[y]) {
      newCave[x][y] = cave[x][y] + offset
      if (newCave[x][y] > 9) newCave[x][y] -= 9
    }
  }

  return newCave
}

const createBigCave = (cave, size, numOffset, multiplier) => {
  let bigSize = size*multiplier
    let bigCave = new Array(bigSize).fill(0).map(() => new Array(bigSize).fill(0));

    let offsetCaves = new Array(numOffset);
    for (let i = 0; i < numOffset; i++) {
      offsetCaves[i] = createOffsetCave(cave, i)
    }

    for (let row in bigCave) {
      let bigCaveRow = new Array()
      let columnOffset = Math.floor(row / size)
      for (let i = 0; i < multiplier; i++) {
        let rowOffset = row % size
        bigCaveRow.push(...offsetCaves[columnOffset+i][rowOffset])
      }
      bigCave[row] = bigCaveRow.flat()
    }
  
    return [bigCave, bigSize];
  }

const part2 = async(input) => {
  let [cave, size] = setupCave(input);
  let [bigCave, bigSize]  = createBigCave(cave, size, 9, 5);
  let [qMap, settled, unsettled] = setupDjikstra(bigCave, bigSize)

  c2s(bigCave)
  console.log("Got big cage doing dik")

  dikstra(bigCave, qMap, settled, unsettled);

  let endItem = qMap.get(n2i([bigSize-1, bigSize-1]))
  return endItem.cost;
}

module.exports = { part1, part2 }
