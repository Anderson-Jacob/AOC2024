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
  const nums = file.split("\n").map((s) => Number(s));
  const results = nums.map((num) => nthSecretNumber(num, 2000));
  console.log(results.reduce((prev, curr) => prev + curr));
}

function partTwo(file: string, lines: string[]) {
  const nums = file.split("\n").map((s) => Number(s));
  const prices = nums
    .map((num) => nSecretNumbers(num, 2000))
    .map((nums) => nums.map((num) => Number(num % BigInt(10))));
  const changes = prices.map((list) => {
    return list.map((num, ind) => {
      if (ind === 0) return Number.NaN;
      return num - list[ind - 1];
    });
  });
  const changeMap = new Map<string, number>();
  prices.forEach((priceList, index) => {
    const changeList = changes[index];
    const currChangeMap = new Map<string, number>();
    for (let j = 4; j < priceList.length; j++) {
      const subListStr = changeStr(changeList.slice(j - 3, j + 1));
      if (!currChangeMap.has(subListStr)) {
        currChangeMap.set(subListStr, priceList[j]);
      }
    }
    currChangeMap.forEach((v, k) => {
      if (changeMap.has(k)) {
        changeMap.set(k, v + changeMap.get(k));
      } else {
        changeMap.set(k, v);
      }
    });
  });

  console.log(Math.max(...Array.from(changeMap.values())));
}

function nSecretNumbers(num: number, n: number) {
  let nn = BigInt(num);
  const nums = [nn];
  for (let i = 1; i < n; i++) {
    nn = nextSecretNumber(nn);
    nums.push(nn);
  }
  return nums;
}

function nthSecretNumber(num: number, n: number) {
  let nn = BigInt(num);
  for (let i = 0; i < n; i++) {
    nn = nextSecretNumber(nn);
  }
  return nn;
}

function nextSecretNumber(curr: bigint) {
  let temp = curr * BigInt(64);
  curr = temp ^ curr;
  curr %= BigInt(16777216);
  temp = curr / BigInt(32);
  curr = temp ^ curr;
  curr %= BigInt(16777216);
  temp = curr * BigInt(2048);
  curr = temp ^ curr;
  curr %= BigInt(16777216);
  return curr;
}

function changeStr(changes: number[]) {
  return changes.join(",");
}
