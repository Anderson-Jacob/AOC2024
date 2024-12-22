import { readFileSync } from "node:fs";
import { Queue } from "@datastructures-js/queue";

const filename = "actual-input.txt";
const filename2 = "sample.txt";

const actualFile: string = readFileSync(`Input/${filename}`, "utf-8");
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync(`Input/${filename2}`, "utf-8");
const sampleLines: string[] = sampleFile.split("\n");

console.log("sample p1: ");
//partOne(sampleFile, sampleLines, 10);
console.log("actual p1: ");
//partOne(actualFile, actualLines, 100);

console.log("sample p2: ");
partTwo(sampleFile, sampleLines, 60);
console.log("actual p2: ");

//partTwo(actualFile, actualLines, 100);

function partOne(file: string, lines: string[], threshold: number) {
  const blocks = new Set<string>();
  let initI = 0;
  let initJ = 0;
  lines.forEach((line, index) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) === "S") {
        initI = index;
        initJ = j;
      } else if (line.charAt(j) === "#") {
        blocks.add(toStr(index, j));
      }
    }
  });
  const queue = new Queue<number[]>();
  queue.enqueue([initI, initJ]);
  console.log(queue);
  const visits = new Set<string>();
  let count = 0;
  const lookupTable = new Map<string, number>();
  while (!queue.isEmpty()) {
    const coord = queue.dequeue();
    visits.add(toStr(coord[0], coord[1]));
    const allMoves = allMovesFrom(coord[0], coord[1], lines, blocks, visits, 2);
    allMoves[0].forEach((coord) => queue.enqueue(coord));
    const skips = allMoves[1];
    if (skips.length === 0) {
      continue;
    }
    const distance = shortestFrom(
      coord[0],
      coord[1],
      lines,
      blocks,
      lookupTable,
    );
    skips.forEach((skip) => {
      const skipDist = shortestFrom(
        skip[0],
        skip[1],
        lines,
        blocks,
        lookupTable,
      );
      //console.log(`skip: ${skipDist} act: ${distance}`);
      if (distance - skipDist - skip[2] >= threshold) {
        count++;
        printGrid(skip, coord, lines);
        console.log(`skip: ${skip} act: ${coord}`);
        console.log(distance - skipDist - skip[2]);
      }
    });
  }
  console.log(count);
}

function partTwo(file: string, lines: string[], threshold: number) {
  const blocks = new Set<string>();
  let initI = 0;
  let initJ = 0;
  lines.forEach((line, index) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) === "S") {
        initI = index;
        initJ = j;
      } else if (line.charAt(j) === "#") {
        blocks.add(toStr(index, j));
      }
    }
  });
  const queue = new Queue<number[]>();
  queue.enqueue([initI, initJ]);
  console.log(queue);
  const visits = new Set<string>();
  let count = 0;
  const lookupTable = new Map<string, number>();
  while (!queue.isEmpty()) {
    const coord = queue.dequeue();
    visits.add(toStr(coord[0], coord[1]));
    const allMoves = allMovesFrom(
      coord[0],
      coord[1],
      lines,
      blocks,
      visits,
      20,
    );
    allMoves[0].forEach((coord) => queue.enqueue(coord));
    const skips = allMoves[1];
    if (skips.length === 0) {
      continue;
    }
    const distance = shortestFrom(
      coord[0],
      coord[1],
      lines,
      blocks,
      lookupTable,
    );
    skips.forEach((skip) => {
      const skipDist = shortestFrom(
        skip[0],
        skip[1],
        lines,
        blocks,
        lookupTable,
      );
      //console.log(`skip: ${skipDist} act: ${distance}`);
      if (distance - skipDist - skip[2] >= threshold) {
        count++;
        //printGrid(skip, coord, lines);
        //console.log(`skip: ${skip} act: ${coord}`);
        console.log(distance - skipDist - skip[2]);
      }
    });
  }
  console.log(count);
}

function shortestFrom(
  i: number,
  j: number,
  lines: string[],
  blocks: Set<string>,
  lookup: Map<string, number>,
) {
  const queue = new Queue<number[]>();
  queue.enqueue([i, j, 0]);
  const visits = new Set<string>();
  while (!queue.isEmpty()) {
    const curr = queue.dequeue();
    if (lines[curr[0]].charAt(curr[1]) === "E") {
      return curr[2];
    }
    const i = curr[0];
    const j = curr[1];
    const moves = curr[2] + 1;
    if (isValid(i - 1, j, lines, blocks, visits)) {
      visits.add(toStr(i - 1, j));
      queue.enqueue([i - 1, j, moves]);
    }
    if (isValid(i + 1, j, lines, blocks, visits)) {
      visits.add(toStr(i + 1, j));
      queue.enqueue([i + 1, j, moves]);
    }
    if (isValid(i, j - 1, lines, blocks, visits)) {
      visits.add(toStr(i, j - 1));
      queue.enqueue([i, j - 1, moves]);
    }
    if (isValid(i, j + 1, lines, blocks, visits)) {
      visits.add(toStr(i, j + 1));
      queue.enqueue([i, j + 1, moves]);
    }
  }
  console.log("ERROR");
  return -1;
}

function isValid(
  i: number,
  j: number,
  lines: string[],
  blocks: Set<string>,
  visits: Set<string>,
) {
  return (
    coordsValid(i, j, lines) &&
    !visits.has(toStr(i, j)) &&
    !blocks.has(toStr(i, j))
  );
}

function toStr(i: number, j: number) {
  return `${i}|${j}`;
}

function allMovesFrom(
  i: number,
  j: number,
  lines: string[],
  blocks: Set<string>,
  visits: Set<string>,
  maxSkipDist: number,
) {
  const moves: number[][][] = [[], []];
  if (coordsValid(i - 1, j, lines)) {
    if (isValid(i - 1, j, lines, blocks, visits)) {
      moves[0].push([i - 1, j]);
    } else {
      moves[1] = allSkips(i - 1, j, lines, maxSkipDist);
    }
  }
  if (coordsValid(i + 1, j, lines)) {
    if (isValid(i + 1, j, lines, blocks, visits)) {
      moves[0].push([i + 1, j]);
    } else {
      moves[1] = allSkips(i + 1, j, lines, maxSkipDist);
    }
  }
  if (coordsValid(i, j - 1, lines)) {
    if (isValid(i, j - 1, lines, blocks, visits)) {
      moves[0].push([i, j - 1]);
    } else {
      moves[1] = allSkips(i, j - 1, lines, maxSkipDist);
    }
    if (coordsValid(i, j + 1, lines)) {
      if (isValid(i, j + 1, lines, blocks, visits)) {
        moves[0].push([i, j + 1]);
      } else {
        moves[1] = allSkips(i, j + 1, lines, maxSkipDist);
      }
    }
  }
  return moves;
}

function coordsValid(i: number, j: number, lines: string[]) {
  return i > -1 && j > -1 && i < lines.length && j < lines[0].length;
}

function allSkips(i: number, j: number, lines: string[], maxSkipDist: number) {
  const nums: number[][] = [];
  const queue = new Queue<number[]>();
  queue.enqueue([i, j, 1]);
  while (!queue.isEmpty()) {
    const curr = queue.dequeue();
    i = curr[0];
    j = curr[1];
    if (lines[i].charAt(j) !== "#") {
      nums.push([...curr]);
      continue;
    }
    if (curr[2] === maxSkipDist) {
      continue;
    }
    let dist = curr[2] + 1;
    if (coordsValid(i - 1, j, lines)) {
      queue.enqueue([i - 1, j, dist]);
    }
    if (coordsValid(i + 1, j, lines)) {
      queue.enqueue([i + 1, j, dist]);
    }
    if (coordsValid(i, j - 1, lines)) {
      queue.enqueue([i, j - 1, dist]);
    }
    if (coordsValid(i, j + 1, lines)) {
      queue.enqueue([i, j + 1, dist]);
    }
  }
  return nums;
}

function printGrid(skip: number[], coord: number[], lines: string[]) {
  const copy = lines.map((line) => line.split(""));
  copy.forEach((row, index) => {
    if (skip[0] === index) {
      row[skip[1]] = "*";
    }
    if (coord[0] === index) {
      row[coord[1]] = "X";
    }
    console.log(row.join(""));
  });
}
