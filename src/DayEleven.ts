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
  let stones = file.split(/(\s+)/).filter((e) => e.trim().length > 0);
  for (let i = 0; i < 25; i++) {
    stones = blink(stones);
  }
  console.log(stones.length);
}

function partTwo(file: string, lines: string[]) {
  let stones = file.split(/(\s+)/).filter((e) => e.trim().length > 0);
  console.log(blinkDP(stones, 75));
}

function blink(stones: string[]) {
  let next: string[] = [];
  stones.forEach((numStr) => {
    if (numStr === "0") {
      next.push("1");
    } else if (numStr.length % 2 === 0) {
      next.push(String(Number(numStr.substring(0, numStr.length / 2))));
      next.push(String(Number(numStr.substring(numStr.length / 2))));
    } else {
      next.push(String(Number(numStr) * 2024));
    }
  });
  return next;
}

function blinkDP(stones: string[], rounds: number) {
  let dp = new Map<string, number>();
  stones.forEach((str) => dp.set(str, 1));
  for (let i = 0; i < rounds; i++) {
    let nr = new Map<string, number>();
    dp.forEach((count, num) => {
      if (num === "0") {
        if (nr.has("1")) {
          count += nr.get("1");
        }
        nr.set("1", count);
      } else if (num.length % 2 === 0) {
        const fh = String(Number(num.substring(0, num.length / 2)));
        const sh = String(Number(num.substring(num.length / 2)));
        let count1 = count;
        let count2 = count;
        if (nr.has(fh)) {
          count1 += nr.get(fh);
        }
        nr.set(fh, count1);
        if (nr.has(sh)) {
          count2 += nr.get(sh);
        }
        nr.set(sh, count2);
      } else {
        const next = String(Number(num) * 2024);
        if (nr.has(next)) {
          count += nr.get(next);
        }
        nr.set(next, count);
      }
    });
    dp = nr;
  }
  return Array.from(dp.values()).reduce((prev, curr) => prev + curr);
}
