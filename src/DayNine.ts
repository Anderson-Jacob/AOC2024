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
  const all = file
    .split("")
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .map((num, ind) => {
      if (ind % 2 == 0) {
        return [num, ind / 2];
      }
      return [num, -1];
    });
  const length = file
    .split("")
    .filter((s, ind) => s.length > 0 && ind % 2 == 0)
    .map((s) => Number(s))
    .reduce((accumulator, currentValue) => accumulator + currentValue);

  const result: number[] = [];
  let currentInd = 0;
  let last = all.pop();
  while (result.length < length) {
    let curr: number[];
    if (currentInd >= all.length) {
      curr = last;
    } else {
      curr = all[currentInd];
    }
    if (curr[1] !== -1) {
      while (curr[0] > 0) {
        curr[0]--;
        result.push(curr[1]);
      }
      currentInd++;
    } else if (curr[1] === -1 && curr[0] === 0) {
      currentInd++;
    } else {
      while (curr[0] > 0 && result.length < length) {
        curr[0]--;
        while (last[1] === -1 || last[0] <= 0) {
          last = all.pop();
        }
        result.push(last[1]);
        last[0]--;
      }
    }
  }
  console.log(result.reduce((prev, curr, ind) => prev + curr * ind));
}

function partTwo(file: string, lines: string[]) {
  const all = file
    .split("")
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .map((num, ind) => {
      if (ind % 2 == 0) {
        return [num, ind / 2];
      }
      return [num, -1];
    })
    .filter((arr) => arr[1] !== -1 || arr[0] > 0)
    .reverse();
  let available = all.filter((arr) => arr[1] !== -1);
  const result: number[] = [];
  while (all.length > 0) {
    const curr = all.pop();
    if (curr[1] !== -1) {
      available = available.filter((arr) => arr[1] !== curr[1]);
      while (curr[0] > 0) {
        result.push(curr[1]);
        curr[0]--;
      }
    } else {
      findAndAppendBest(curr[0], available, result);
    }
  }
  console.log(result);
  console.log(result.reduce((prev, curr, ind) => prev + curr * ind));
}

function findAndAppendBest(
  space: number,
  available: number[][],
  result: number[],
) {
  while (space > 0) {
    let highestId = -1;
    let highestInd = -1;
    available.forEach((arr, ind) => {
      if (arr[1] > highestId && arr[0] <= space) {
        highestId = arr[1];
        highestInd = ind;
      }
    });
    if (highestId < 0) {
      while (space > 0) {
        result.push(0);
        space--;
      }
      break;
    }
    const arr = available[highestInd];
    const original = arr[0];
    while (arr[0] > 0) {
      result.push(arr[1]);
      arr[0]--;
      space--;
    }
    arr[1] = -1;
    arr[0] = original;
  }
}
