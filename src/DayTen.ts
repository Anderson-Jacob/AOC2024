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
  let total = 0;
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) == "0") {
        const visits = new Set<string>();
        total += countTrailheads(index, j, lines, visits);
      }
    }
  });
  console.log(total);
}

function partTwo(file: string, lines: string[]) {
  let total = 0;
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (line.charAt(j) == "0") {
        total += countTrailheadsP2(index, j, lines);
      }
    }
  });
  console.log(total);
}

function countTrailheads(
  i: number,
  j: number,
  lines: string[],
  visits: Set<string>,
) {
  const desired = Number(lines[i].charAt(j)) + 1;
  visits.add(coordStr(i, j));
  if (desired === 10) return 1;
  let total = 0;

  if (
    i > 0 &&
    !visits.has(coordStr(i - 1, j)) &&
    Number(lines[i - 1].charAt(j)) === desired
  ) {
    total += countTrailheads(i - 1, j, lines, visits);
  }
  if (
    j > 0 &&
    !visits.has(coordStr(i, j - 1)) &&
    Number(lines[i].charAt(j - 1)) === desired
  ) {
    total += countTrailheads(i, j - 1, lines, visits);
  }
  if (
    i + 1 < lines.length &&
    !visits.has(coordStr(i + 1, j)) &&
    Number(lines[i + 1].charAt(j)) === desired
  ) {
    total += countTrailheads(i + 1, j, lines, visits);
  }
  if (
    j + 1 < lines[0].length &&
    !visits.has(coordStr(i, j + 1)) &&
    Number(lines[i].charAt(j + 1)) === desired
  ) {
    total += countTrailheads(i, j + 1, lines, visits);
  }

  return total;
}

function countTrailheadsP2(i: number, j: number, lines: string[]) {
  const desired = Number(lines[i].charAt(j)) + 1;

  if (desired === 10) return 1;
  let total = 0;

  if (i > 0 && Number(lines[i - 1].charAt(j)) === desired) {
    total += countTrailheadsP2(i - 1, j, lines);
  }
  if (j > 0 && Number(lines[i].charAt(j - 1)) === desired) {
    total += countTrailheadsP2(i, j - 1, lines);
  }
  if (i + 1 < lines.length && Number(lines[i + 1].charAt(j)) === desired) {
    total += countTrailheadsP2(i + 1, j, lines);
  }
  if (j + 1 < lines[0].length && Number(lines[i].charAt(j + 1)) === desired) {
    total += countTrailheadsP2(i, j + 1, lines);
  }

  return total;
}

function coordStr(i: number, j: number) {
  return `${i}|${j}`;
}
