import { readFileSync } from "node:fs";
import { Queue } from "@datastructures-js/queue";

const filename = "actual-input.txt";
const filename2 = "sample.txt";

const actualFile: string = readFileSync(`Input/${filename}`, "utf-8");
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync(`Input/${filename2}`, "utf-8");
const sampleLines: string[] = sampleFile.split("\n");

console.log("sample p1: ");
partOne(sampleFile, sampleLines, 6, 12);
console.log("actual p1: ");
partOne(actualFile, actualLines, 70, 1024);

console.log("sample p2: ");
partTwo(sampleFile, sampleLines, 6, 12);
console.log("actual p2: ");
partTwo(actualFile, actualLines, 70, 1024);

function partOne(
  file: string,
  lines: string[],
  gridSize: number,
  read: number,
) {
  const blocks = new Set<string>();
  lines.forEach((line: string, index: number) => {
    if (index < read) {
      const nums = fromStr(line);
      blocks.add(toStr(nums[0], nums[1]));
    }
  });
  console.log(shortest(blocks, gridSize));
}

function partTwo(
  file: string,
  lines: string[],
  gridSize: number,
  read: number,
) {
  const blocks = new Set<string>();
  let done = false;
  lines.forEach((line: string, index: number) => {
    if (!done) {
      const nums = fromStr(line);
      blocks.add(toStr(nums[0], nums[1]));
      if (shortest(blocks, gridSize) === -1) {
        console.log(line);
        done = true;
      }
    }
  });
}

function shortest(blocks: Set<string>, size: number) {
  const queue = new Queue<number[]>();
  queue.enqueue([0, 0, 0]);

  const visits = new Set<string>();
  while (!queue.isEmpty()) {
    const curr = queue.dequeue();
    if (curr[0] === size && curr[1] === size) {
      return curr[2];
    }
    const i = curr[0];
    const j = curr[1];
    const moves = curr[2] + 1;
    if (isValid(i - 1, j, size, blocks, visits)) {
      visits.add(toStr(i - 1, j));
      queue.enqueue([i - 1, j, moves]);
    }
    if (isValid(i + 1, j, size, blocks, visits)) {
      visits.add(toStr(i + 1, j));
      queue.enqueue([i + 1, j, moves]);
    }
    if (isValid(i, j - 1, size, blocks, visits)) {
      visits.add(toStr(i, j - 1));
      queue.enqueue([i, j - 1, moves]);
    }
    if (isValid(i, j + 1, size, blocks, visits)) {
      visits.add(toStr(i, j + 1));
      queue.enqueue([i, j + 1, moves]);
    }
  }
  console.log("empty");
  return -1;
}

function isValid(
  i: number,
  j: number,
  size: number,
  blocks: Set<string>,
  visits: Set<string>,
) {
  return (
    i > -1 &&
    j > -1 &&
    j <= size &&
    i <= size &&
    !visits.has(toStr(i, j)) &&
    !blocks.has(toStr(i, j))
  );
}

function toStr(i: number, j: number) {
  return `${i}|${j}`;
}

function fromStr(coord: string) {
  return coord
    .split(",")
    .map((s) => Number(s))
    .reverse();
}
