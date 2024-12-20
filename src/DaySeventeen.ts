import { readFileSync } from "node:fs";

const filename = "actual-input.txt";
const filename2 = "sample.txt";

const actualFile: string = readFileSync(`Input/${filename}`, "utf-8");
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync(`Input/${filename2}`, "utf-8");
const sampleLines: string[] = sampleFile.split("\n");
//tryAll();
console.log("sample p1: ");
partOne(sampleFile, sampleLines);
console.log("actual p1: ");
partOne(actualFile, actualLines);

console.log("sample p2: ");
partTwo(sampleFile, sampleLines);
console.log("actual p2: ");

partTwo(actualFile, actualLines);

function partOne(file: string, lines: string[]) {
  const regex = /\d+/g;
  const vals = Array.from(file.matchAll(regex)).map((s) =>
    Number(s.toString()),
  );
  let r1 = BigInt(vals[0]);
  const ins = vals.slice(3, vals.length);
  console.log(calc(r1, ins).join(","));
}

function tryAll() {
  let r1 = BigInt(156985331110651);
  const inst = [2, 4, 1, 4, 7, 5, 4, 1, 1, 4, 5, 5, 0, 3, 3, 0];
  while (r1 <= 156985331241723) {
    console.log(calc(r1, inst).join(","));
    if (calc(r1, inst).join(",") == inst.join(",")) {
      console.log(r1);
      break;
    }
    r1++;
  }
  throw Error;
}

function partTwo(file: string, lines: string[]) {
  const regex = /\d+/g;
  const vals = Array.from(file.matchAll(regex)).map((s) =>
    Number(s.toString()),
  );
  const ins = vals.slice(3, vals.length);
  const valids = allValid(ins, ins.length - 1);
  valids.forEach((vstr) => {
    const voct = BigInt("0o" + vstr).toString();
    const v = Number(voct);
    console.log(
      `bi:${voct},\t num:${v},\t calc: ${calc(BigInt(voct), ins).join(",")}\t octStr:${vstr}`,
    );
  });
  const updated = valids
    .filter((s) => {
      const num = BigInt("0o" + s);
      return calc(num, ins).join(",") == ins.join(",");
    })
    .map((s) => BigInt("0o" + s));
  console.log("passes:");
  console.log(updated);
}

function allValid(ins: number[], matching: number) {
  let potValids = [""];
  if (matching !== 0) {
    potValids = allValid(ins, matching - 1);
  }
  const valids: string[] = [];
  potValids.forEach((octalStr) => {
    for (let i = 0; i < 8; i++) {
      const next = octalStr + String(i);
      const numStr = BigInt("0o" + next).toString();
      const result = calc(BigInt(numStr), ins);
      if (matches(result, ins, matching)) {
        valids.push(next);
      }
    }
  });
  return valids;
}

function matches(actual: number[], ins: number[], matching: number) {
  for (let i = 0; i < matching; i++) {
    if (actual[actual.length - 1 - i] !== ins[ins.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function calc(r1: bigint, instructions: number[]) {
  let r2: bigint = BigInt(0);
  let r3: bigint = BigInt(0);
  let ip: number = 0;
  const outputs: number[] = [];
  while (ip < instructions.length - 1) {
    const literalOperand = instructions[ip + 1];
    const comboOperand = getComboOperand(r1, r2, r3, instructions[ip + 1]);
    switch (instructions[ip]) {
      case 0: {
        r1 = r1 / BigInt(Math.pow(2, comboOperand));
        break;
      }
      case 1: {
        r2 = (r2 ^ BigInt(literalOperand)) % BigInt(8);
        break;
      }
      case 2: {
        r2 = BigInt(comboOperand) % BigInt(8);
        break;
      }
      case 3: {
        if (r1 === BigInt(0)) {
          break;
        }
        ip = literalOperand - 2;
        break;
      }
      case 4: {
        r2 = r2 ^ r3;
        break;
      }
      case 5: {
        outputs.push(comboOperand % 8);
        break;
      }
      case 6: {
        r2 = r1 / BigInt(Math.pow(2, comboOperand));
        break;
      }
      case 7: {
        r3 = r1 / BigInt(Math.pow(2, comboOperand));
        break;
      }
    }
    ip += 2;
  }
  return outputs;
}

function getComboOperand(r1: bigint, r2: bigint, r3: bigint, operand: number) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3: {
      return operand;
    }
    case 4: {
      return Number(r1);
    }
    case 5: {
      return Number(r2);
    }
    case 6: {
      return Number(r3);
    }
    case 7: {
      console.log("ERROR");
      return Number.NaN;
    }
  }
}

function toBigInt(arr: number[]) {
  return BigInt(arr.join(""));
}
