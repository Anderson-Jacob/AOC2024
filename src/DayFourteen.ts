import { readFileSync } from "node:fs";

const filename = "actual-input.txt";
const filename2 = "sample.txt";

const actualFile: string = readFileSync(`Input/${filename}`, "utf-8");
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync(`Input/${filename2}`, "utf-8");
const sampleLines: string[] = sampleFile.split("\n");

const sampleDims = [11, 7];
const actualDims = [101, 103];
let dims = sampleDims;

console.log("sample p1: ");
partOne(sampleFile, sampleLines);
dims = actualDims;
console.log("actual p1: ");
partOne(actualFile, actualLines);

console.log("actual p2: ");
partTwo(actualFile, actualLines);

function partOne(file: string, lines: string[]) {
  const seconds = 100;
  let quadrants = [0, 0, 0, 0, 0];
  lines.forEach((line: string, index: number) => {
    const bot = Array.from(line.matchAll(/-\d+|\d+/g)).map((v) => Number(v));
    const updatedPos = [bot[0] + seconds * bot[2], bot[1] + seconds * bot[3]];
    normalizeCoords(updatedPos, dims);
    const quadrant = getQuadrant(updatedPos, dims);
    quadrants[quadrant]++;
  });
  const final = quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
  console.log(final);
}

function partTwo(file: string, lines: string[]) {
  const bots: number[][] = [];
  lines.forEach((line: string, index: number) => {
    const bot = Array.from(line.matchAll(/-\d+|\d+/g)).map((v) => Number(v));
    bots.push(bot);
  });
  let cycles = 0;
  console.log("locating...");
  while (!gridHas(bots, dims)) {
    bots.forEach((bot) => updateAndNormalize(bot, dims));
    cycles++;
  }
  printGrid(bots, dims);
  console.log(cycles);
}

function updateAndNormalize(position: number[], dims: number[]) {
  position[0] = position[0] + position[2];
  position[1] = position[1] + position[3];
  normalizeCoords(position, dims);
}

function normalizeCoords(position: number[], dims: number[]) {
  position[0] %= dims[0];
  position[1] %= dims[1];
  if (position[0] < 0) {
    position[0] += dims[0];
  }
  if (position[1] < 0) {
    position[1] += dims[1];
  }
}

function getQuadrant(position: number[], dims: number[]) {
  const dimX = Math.floor(dims[0] / 2);
  const dimY = Math.floor(dims[1] / 2);
  if (position[0] < dimX && position[1] < dimY) {
    return 0;
  }
  if (position[0] > dimX && position[1] < dimY) {
    return 1;
  }
  if (position[0] < dimX && position[1] > dimY) {
    return 2;
  }
  if (position[0] > dimX && position[1] > dimY) {
    return 3;
  }
  return 4;
}

function printGrid(bots: number[][], dims: number[]) {
  const freqMap = new Map<string, number>();
  bots.forEach((b) => {
    const coords = str(b[0], b[1]);
    if (freqMap.has(coords)) {
      freqMap.set(coords, freqMap.get(coords) + 1);
    } else {
      freqMap.set(coords, 1);
    }
  });
  for (let y = 0; y < dims[1]; y++) {
    const line: string[] = [];
    for (let x = 0; x < dims[0]; x++) {
      if (freqMap.has(str(x, y))) {
        line.push(String(freqMap.get(str(x, y))));
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }
}

function str(data: number, data2: number) {
  return `${data}|${data2}`;
}

function gridHas(bots: number[][], dims: number[]) {
  const freqMap = new Map<string, number>();
  bots.forEach((b) => {
    const coords = str(b[0], b[1]);
    if (freqMap.has(coords)) {
      freqMap.set(coords, freqMap.get(coords) + 1);
    } else {
      freqMap.set(coords, 1);
    }
  });
  for (let y = 0; y < dims[1]; y++) {
    const line: string[] = [];
    for (let x = 0; x < dims[0]; x++) {
      if (freqMap.has(str(x, y))) {
        line.push(String(freqMap.get(str(x, y))));
      } else {
        line.push(".");
      }
    }
    const nl = line.join("");
    if (nl.indexOf("111111111111111111") > -1) return true;
  }
  return false;
}
