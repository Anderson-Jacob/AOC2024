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
  const segs = file.split("\n\n");
  const towels = segs[0].split(",").map((s) => s.trim());
  const patterns = segs[1].split("\n");
  let count = 0;
  patterns.forEach((pattern) => {
    if (isMatch(pattern, towels, new Set<number>())) {
      count++;
    }
  });
  console.log(count);
}

function partTwo(file: string, lines: string[]) {
  lines.forEach((line: string, index: number) => {});
}

function isMatch(pattern: string, towels: string[], used: Set<number>) {
  if (pattern.length === 0) {
    return true;
  }
  let valid = false;
  towels.forEach((towel, index) => {
    if (
      !valid &&
      pattern.length >= towel.length &&
      !used.has(index) &&
      pattern.startsWith(towel)
    ) {
      const usedCopy = new Set(used);
      usedCopy.add(index);
      valid =
        valid || isMatch(pattern.substring(towel.length), towels, usedCopy);
    }
  });
  if (used.size === 0 && valid) console.log(pattern);
  return valid;
}
