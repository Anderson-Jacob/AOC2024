import { readFileSync } from "node:fs";

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
  const map = new Map<string, number[][]>();
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) !== ".") {
        const char = line.charAt(j);
        if (map.has(char)) {
          const arr = map.get(char);
          arr.push([index, j]);
        } else {
          map.set(char, [[index, j]]);
        }
      }
    }
  });
  console.log(countAntiNodes(map, lines.length, lines[0].length));
}

function partTwo(file: string, lines: string[]) {
  const map = new Map<string, number[][]>();
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) !== ".") {
        const char = line.charAt(j);
        if (map.has(char)) {
          const arr = map.get(char);
          arr.push([index, j]);
        } else {
          map.set(char, [[index, j]]);
        }
      }
    }
  });
  console.log(countAntiNodesP2(map, lines.length, lines[0].length));
}

function countAntiNodes(
  map: Map<string, number[][]>,
  rows: number,
  cols: number,
) {
  const set = new Set<string>();
  for (let value of Array.from(map.values())) {
    value.forEach((coord, index) => {
      for (let i = index + 1; i < value.length; i++) {
        const strs = calcOffsets(coord, value[i], rows, cols);

        strs.forEach((s) => {
          set.add(s);
        });
      }
    });
  }
  return set.size;
}

function calcOffsets(
  coord1: number[],
  coord2: number[],
  rows: number,
  cols: number,
) {
  const difi = coord1[0] - coord2[0];
  const difj = coord1[1] - coord2[1];
  const reflect1 = [coord1[0] + difi, coord1[1] + difj];
  const reflect2 = [coord2[0] - difi, coord2[1] - difj];
  let toRet: string[] = [];
  if (isValid(reflect1, rows, cols)) {
    toRet.push(indexStr(reflect1[0], reflect1[1]));
  }
  if (isValid(reflect2, rows, cols)) {
    toRet.push(indexStr(reflect2[0], reflect2[1]));
  }
  return toRet;
}

function indexStr(i: number, j: number) {
  return `${i}|${j}`;
}

function isValid(coord: number[], rows: number, cols: number) {
  return coord[0] > -1 && coord[0] < rows && coord[1] > -1 && coord[1] < cols;
}

function countAntiNodesP2(
  map: Map<string, number[][]>,
  rows: number,
  cols: number,
) {
  const set = new Set<string>();
  for (let value of Array.from(map.values())) {
    value.forEach((coord, index) => {
      set.add(indexStr(coord[0], coord[1]));
      for (let i = index + 1; i < value.length; i++) {
        const strs = calcOffsetsRecurse(coord, value[i], rows, cols);

        strs.forEach((s) => {
          set.add(s);
        });
      }
    });
  }
  return set.size;
}

function calcOffsetsRecurse(
  coord1: number[],
  coord2: number[],
  rows: number,
  cols: number,
) {
  const difi = coord1[0] - coord2[0];
  const difj = coord1[1] - coord2[1];
  const reflects: number[][] = [];
  let coordi = coord1[0];
  let coordj = coord1[1];
  while (true) {
    coordi += difi;
    coordj += difj;
    const arr = [coordi, coordj];
    if (!isValid(arr, rows, cols)) {
      break;
    }
    reflects.push(arr);
  }
  coordi = coord2[0];
  coordj = coord2[1];
  while (true) {
    coordi -= difi;
    coordj -= difj;
    const arr = [coordi, coordj];
    if (!isValid(arr, rows, cols)) {
      break;
    }
    reflects.push(arr);
  }
  return reflects.map((coord) => indexStr(coord[0], coord[1]));
}
