'use strict'
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const pathToArray = (path) => {
  let sPath = new Array();
  path = Array.from(path);
  for (let n in path) {
    sPath.push(path[n].name);
  }

  return sPath;
}

class CaveNode {
  constructor(name, type) {
      this.name = name
      this.type = type
      this.links = new Set();
  }
}

const caveMap = new Map();

const setupCaveMap = (input) => {
  let inputs = fs.readFileSync(input).toString().split("\n")
  let caveNames = uniq(inputs.map(x => x.split("-")).flat())

  caveNames.forEach(name => {
    let type;
    if (name == name.toUpperCase()) type = "big"
    if (name == name.toLowerCase()) type = "small"
    if (name == "start" || name == "end") type = "edge"
    caveMap.set(name, new CaveNode(name, type))
  })

  inputs.forEach(links => {
    let nodes = links.split("-");
    let node1 = caveMap.get(nodes[0])
    let node2 = caveMap.get(nodes[1])
    if (!node1.links.has(node2)) node1.links.add(node2);
    if (!node2.links.has(node1)) node2.links.add(node1);
  })

  console.log(caveMap)
}

const uniq = (a) => {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

const dfs = (allPaths, localPath, node, end) => {
  if (node.name == end.name) {
    localPath.push(node);
    allPaths.push(localPath)
    return;
  }

  if (localPath.includes(node)) {
    if (node.name == "start" || node.name == "end") return
    if (node.name.toLowerCase() == node.name) {
      if (localPath.filter(n => { return n.name == node.name}).length > 0) {
        return
      }
    }
  }

  localPath.push(node);

  node.links.forEach(n => {
    return dfs(allPaths, new Array(localPath).flat(), caveMap.get(n.name), end)
  })
}

// Part 1
// ======

const part1 = async(input) => {
  setupCaveMap(input)
  let start = caveMap.get("start")
  let end = caveMap.get("end")
  let localPath = new Array();
  let allPaths = new Array();
  dfs(allPaths, localPath, start, end)  

  return allPaths.length;
}

const dfs2 = (allPaths, localPath, node, end) => {
  if (node.name == end.name) {
    localPath.push(node);
    allPaths.push(localPath)
    return;
  }

  if (localPath.includes(node)) {
    if (node.type == "edge") return
    // allow 1 small cave to already exist in the local path
    if (node.type == "small") {
      if (localPath.filter(n => { return n.name == node.name}).length > 1 ) {
        return
      }
    }
  }

  localPath.push(node);

  // check if there are too many multiple instances of small caves in localPath
  let numMultiple = 0;
  localPath.filter(n => { return n.type == "small"}).forEach( s => {
    if (localPath.filter(n => { return n.name == s.name}).length > 1) numMultiple++
  })
  if (numMultiple > 2) return

  node.links.forEach(n => {
    return dfs2(allPaths, new Array(localPath).flat(), caveMap.get(n.name), end)
  })
}

// Part 2
// ======

const part2 = async(input) => {
  setupCaveMap(input)
  let start = caveMap.get("start")
  let end = caveMap.get("end")
  let localPath = new Array();
  let allPaths = new Array();
  dfs2(allPaths, localPath, start, end)

  return allPaths.length;
}

module.exports = { part1, part2 }
