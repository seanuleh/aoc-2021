'use strict'
const readline = require('readline');
const fs = require('fs');
const path = require('path');

class CaveGraph {
  constructor(v) {
      this.V = v;
      this.adj = new Array(v);
      for(let i = 0; i < v; i++)
          this.adj[i] = [];
  }

  addEdge(v, w) {
    console.log("pushing: " + w)
    console.log("into: " + v)
		this.adj[v].push(w); // Add w to v's list.
  }

  DFSUtil(v, visited) {
  
  // Mark the current
  // node as visited and print it
  visited[v] = true;
  console.log(v + " ");

  // Recur for all the
  // vertices adjacent to this
  // vertex
  for (const n of this.adj[v]) {
    if (!visited[n]) this.DFSUtil(n, visited);
  }
  }

  // The function to do
  // DFS traversal. It uses recursive
  // DFSUtil()
  DFS() {
  
  // Mark all the vertices as not visited(set as
  var visited = new Array(this.V).fill(false);

  // Call the recursive helper
  // function to print DFS
  // traversal starting from
  // all vertices one by one
  for (var i = 0; i < this.V; ++i)
    if (visited[i] == false) this.DFSUtil(i, visited);
  }
}

const setupCaveMap = (input) => {
  let graph = new CaveGraph(4);
  let inputs = fs.readFileSync(input).toString().split("\n")
  let caveNames = uniq(inputs.map(x => x.split("-")).flat())
  console.log("caveNames: ");
  console.log(caveNames);


  inputs.forEach(links => {
    let nodes = links.split("-");
    let v = nodes[0]
    let w = nodes[1]
    console.log(v)
    console.log(w)
    graph.addEdge(0, 1);
  })

  console.log(graph)
}

const uniq = (a) => {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

// Part 1
// ======

const part1 = async(input) => {
  setupCaveMap(input)



  
  return 0;
}

// Part 2
// ======

const part2 = async(input) => {
  let inputs = fs.readFileSync(input).toString().split("\n").map(x => x.split("").map(Number))
  console.log(inputs)

  
  return 0;
}

module.exports = { part1, part2 }
