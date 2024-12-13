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
  let tokensUsed = 0;
  file.split("\n\n").forEach((s) => {
    const segs = s.split("\n");
    const regex = /\d+/g;
    const buttonA = Array.from(segs[0].matchAll(regex)).map((v) =>
      Number(v.toString()),
    );
    const buttonB = Array.from(segs[1].matchAll(regex)).map((v) =>
      Number(v.toString()),
    );
    const prize = Array.from(segs[2].matchAll(regex)).map((v) =>
      Number(v.toString()),
    );
    const tokens = minCost(buttonA, buttonB, prize);
    tokensUsed += tokens;
  });
  console.log(tokensUsed);
}

function partTwo(file: string, lines: string[]) {
  let tokensUsed = 0;
  file.split("\n\n").forEach((s) => {
    const segs = s.split("\n");
    const regex = /\d+/g;
    const buttonA = Array.from(segs[0].matchAll(regex)).map((v) =>
      Number(v.toString()),
    );
    const buttonB = Array.from(segs[1].matchAll(regex)).map((v) =>
      Number(v.toString()),
    );
    const prize = Array.from(segs[2].matchAll(regex)).map(
      (v) => Number(v.toString()) + 10000000000000,
    );
    const tokens = minCostP2(buttonA, buttonB, prize);
    tokensUsed += tokens;
  });
  console.log(tokensUsed);
}

function minCost(buttonA: number[], buttonB: number[], prize: number[]) {
  const comp = (a: number[], b: number[]) =>
    3 * a[2] + a[3] - (3 * b[2] + b[3]);
  const queue = new PriorityQueue<number[]>(comp);
  const uniques = new Map<string, number>();
  //X pos, Y pos, A presses, B presses
  queue.push([0, 0, 0, 0]);
  while (!queue.isEmpty()) {
    const current = queue.pop();
    const currStr = str(current);
    if (uniques.has(currStr) && uniques.get(currStr) <= cost(current)) {
      continue;
    }
    uniques.set(currStr, cost(current));
    if (current[0] === prize[0] && current[1] === prize[1]) {
      return cost(current);
    }
    if (current[2] <= 100) {
      queue.push([
        current[0] + buttonA[0],
        current[1] + buttonA[1],
        current[2] + 1,
        current[3],
      ]);
    }
    if (current[3] <= 100) {
      queue.push([
        current[0] + buttonB[0],
        current[1] + buttonB[1],
        current[2],
        current[3] + 1,
      ]);
    }
  }
  return 0;
}

function cost(data: number[]) {
  return 3 * data[2] + data[3];
}

function str(data: number[]) {
  return `${data[0]}|${data[1]}`;
}

function minCostP2(a: number[], b: number[], p: number[]) {
  //b=(py*ax-px*ay)/(by*ax-bx*ay) a=(px-b*bx)/ax
  const bNum = p[1] * a[0] - p[0] * a[1];
  const bDenom = b[1] * a[0] - b[0] * a[1];
  if (bNum % bDenom !== 0) return 0;
  const bCost = bNum / bDenom;
  const aNum = p[0] - bCost * b[0];
  const aDenom = a[0];
  if (aNum % aDenom !== 0) return 0;
  const aCost = aNum / aDenom;
  return 3 * aCost + bCost;
}
