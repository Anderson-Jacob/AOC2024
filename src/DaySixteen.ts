import { readFileSync } from "node:fs";
import { PriorityQueue } from "@datastructures-js/priority-queue";

const filename = "actual-input.txt";
const filename2 = "sample.txt";

const actualFile: string = readFileSync(`Input/${filename}`, "utf-8");
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync(`Input/${filename2}`, "utf-8");
const sampleLines: string[] = sampleFile.split("\n");

console.log("sample p1: ");
partOne(sampleFile, sampleLines);
console.log("actual p1: ");
partOne(actualFile, actualLines);

console.log("sample p2: ");
partTwo(sampleFile, sampleLines);
console.log("actual p2: ");

partTwo(actualFile, actualLines);

function partOne(file: string, lines: string[]) {
  let curr: number[] = [];
  let dir = [0, 1];
  lines.forEach((l, ind) => {
    if (l.indexOf("S") > -1) {
      curr = [ind, l.indexOf("S")];
    }
  });
  const grid = lines.map((arr) => arr.split(""));
  console.log(findCheapest(grid, curr, dir));
}

function partTwo(file: string, lines: string[]) {
  let curr: number[] = [];
  let dir = [0, 1];
  lines.forEach((l, ind) => {
    if (l.indexOf("S") > -1) {
      curr = [ind, l.indexOf("S")];
    }
  });
  const grid = lines.map((arr) => arr.split(""));
  console.log(findTiles(grid, curr, dir));
}

function findCheapest(grid: string[][], curr: number[], dir: number[]) {
  const pq = new PriorityQueue<number[]>((a, b) => a[4] - b[4]);
  const visits = new Map<string, number>();
  visits.set(str(curr, dir), 0);
  pq.push([curr[0], curr[1], dir[0], dir[1], 0]);
  while (!pq.isEmpty()) {
    const data = pq.pop();
    //console.log(data);
    if (grid[data[0]][data[1]] === "E") {
      return data[4];
    }
    const coord = [data[0], data[1]];
    dir = [data[2], data[3]];
    const dirs = getDirs(dir);
    const cost = data[4] + 1001;
    dirs.forEach((direction) => {
      let cCost = cost;
      if (direction == dir) {
        cCost -= 1000;
      }
      const newCoord = [coord[0] + direction[0], coord[1] + direction[1]];
      addAndUpdateIfValid(newCoord, direction, cCost, grid, visits, pq);
    });
  }
}

function addAndUpdateIfValid(
  newCoord: number[],
  direction: number[],
  cost: number,
  grid: string[][],
  visits: Map<string, number>,
  pq: PriorityQueue<number[]>,
) {
  if (
    newCoord[0] < 0 ||
    newCoord[1] < 0 ||
    newCoord[0] >= grid.length ||
    newCoord[1] >= grid[0].length
  )
    return;
  if (grid[newCoord[0]][newCoord[1]] === "#") return;
  if (visits.has(str(newCoord, direction))) {
    if (visits.get(str(newCoord, direction)) < cost) return;
    visits.set(str(newCoord, direction), cost);
  } else {
    visits.set(str(newCoord, direction), cost);
  }
  pq.push([newCoord[0], newCoord[1], direction[0], direction[1], cost]);
}

function str(data: number[], dir: number[]) {
  return `${data[0]}|${data[1]}|${dir[0]}|${dir[1]}`;
}

function getDirs(dir: number[]) {
  const dirs = [dir];
  switch (dir[0]) {
    case 1:
    case -1: {
      dirs.push([0, -1]);
      dirs.push([0, 1]);
      break;
    }
    case 0: {
      dirs.push([1, 0]);
      dirs.push([-1, 0]);
      break;
    }
  }
  return dirs;
}

function findTiles(grid: string[][], curr: number[], dir: number[]) {
  const pq = new PriorityQueue<GridPath>((a, b) => a.data[4] - b.data[4]);
  const validTiles = new Set<string>();
  const valids = new Map<string, number>();
  let paths = 0;
  const path: GridPath = {
    data: [curr[0], curr[1], dir[0], dir[1], 0],
    path: [[curr[0], curr[1]]],
  };
  pq.push(path);
  valids.set(str(curr, dir), 0);
  let best = Number.MAX_VALUE;
  while (!pq.isEmpty()) {
    const path = pq.pop();
    const data = path.data;
    if (data[4] > best) continue;
    if (grid[data[0]][data[1]] === "E") {
      if (data[4] < best) best = data[4];
      if (data[4] === best) markAllTiles(path, validTiles);
      paths++;
    }
    const coord = [data[0], data[1]];
    dir = [data[2], data[3]];
    const dirs = getDirs(dir);
    const cost = data[4] + 1001;
    dirs.forEach((direction) => {
      let cCost = cost;
      if (direction == dir) {
        cCost -= 1000;
      }
      const newCoord = [coord[0] + direction[0], coord[1] + direction[1]];
      addAndUpdateIfValidP2(newCoord, direction, cCost, grid, path, pq, valids);
    });
  }
  console.log(transform(grid, validTiles));
  return validTiles.size;
}

interface GridPath {
  data: number[];
  path: number[][];
}

function addAndUpdateIfValidP2(
  newCoord: number[],
  direction: number[],
  cost: number,
  grid: string[][],
  path: GridPath,
  pq: PriorityQueue<GridPath>,
  valids: Map<string, number>,
) {
  if (
    newCoord[0] < 0 ||
    newCoord[1] < 0 ||
    newCoord[0] >= grid.length ||
    newCoord[1] >= grid[0].length
  )
    return;
  if (grid[newCoord[0]][newCoord[1]] === "#") return;
  let valid = true;
  if (
    valids.has(str(newCoord, direction)) &&
    valids.get(str(newCoord, direction)) < cost
  ) {
    return;
  }
  path.path.forEach((point) => {
    if (point == newCoord) {
      valid = false;
    }
  });
  if (!valid) return;
  valids.set(str(newCoord, direction), cost);
  const pathPortion = [...path.path];
  pathPortion.push([newCoord[0], newCoord[1]]);
  const newPath: GridPath = {
    data: [newCoord[0], newCoord[1], direction[0], direction[1], cost],
    path: pathPortion,
  };
  pq.push(newPath);
}

function markAllTiles(path: GridPath, tiles: Set<string>) {
  const pieces = path.path;
  pieces.forEach((coord) => tiles.add(coordStr(coord)));
}

function coordStr(coord: number[]) {
  return `${coord[0]}|${coord[1]}`;
}

function transform(grid: string[][], valid: Set<string>) {
  const coords: number[][] = [];
  valid.forEach((v) => coords.push(v.split("|").map((s) => Number(s))));
  coords.forEach((coord) => (grid[coord[0]][coord[1]] = "O"));
  return grid.map((s) => s.join("")).join("\n");
}
