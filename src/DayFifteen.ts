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
  const moves = segs[1].split("").filter((s) => s !== "\n");
  const grid = segs[0].split("");
  const locations = new Map<string, string>();
  let i = 0;
  let j = 0;
  let botCoord = [0, 0];
  grid.forEach((elem) => {
    switch (elem) {
      case "\n": {
        i++;
        j = -1;
        break;
      }
      case ".": {
        break;
      }
      default: {
        if (elem === "@") {
          botCoord = [i, j];
        }
        locations.set(coord([i, j]), elem);
      }
    }
    j++;
  });
  allMoves(moves, locations, botCoord[0], botCoord[1]);
  console.log(boxSum(locations));
}

function allMoves(
  moves: string[],
  locations: Map<string, string>,
  i: number,
  j: number,
) {
  const pos = [i, j];
  moves.forEach((move) => {
    let dir: number[] = [];
    switch (move) {
      case "v": {
        dir = [1, 0];
        break;
      }
      case "^": {
        dir = [-1, 0];
        break;
      }
      case ">": {
        dir = [0, 1];
        break;
      }
      case "<": {
        dir = [0, -1];
        break;
      }
    }
    tryMove(pos, dir, locations);
  });
}

function tryMove(pos: number[], dir: number[], locations: Map<string, string>) {
  const i = pos[0];
  const j = pos[1];
  const c = coord([i, j]);
  const char = locations.get(c);
  const desi = i + dir[0];
  const desj = j + dir[1];
  const desCord = coord([desi, desj]);
  if (canMove(desi, desj, locations)) {
    locations.delete(c);
    locations.set(desCord, char);
    pos[0] = desi;
    pos[1] = desj;
    return true;
  }
  if (locations.get(desCord) === "#") {
    return false;
  }
  if (!tryMove([desi, desj], dir, locations)) {
    return false;
  }
  locations.delete(c);
  locations.set(desCord, char);
  pos[0] = desi;
  pos[1] = desj;
  return true;
}

function canMove(i: number, j: number, locations: Map<string, string>) {
  const coords = coord([i, j]);
  return !locations.has(coords);
}

function boxSum(locations: Map<string, string>) {
  let sum = 0;
  locations.forEach((v, k) => {
    if (v === "O" || v === "[") {
      const coords = getCoords(k);
      sum += 100 * coords[0] + coords[1];
    }
  });
  return sum;
}

function partTwo(file: string, lines: string[]) {
  const segs = file.split("\n\n");
  const moves = segs[1].split("").filter((s) => s !== "\n");
  const grid = segs[0].split("");
  const locations = new Map<string, string>();
  let i = 0;
  let j = 0;
  let botCoord = [0, 0];
  grid.forEach((elem) => {
    switch (elem) {
      case "\n": {
        i++;
        j = -2;
        break;
      }
      case ".": {
        break;
      }
      default: {
        if (elem === "@") {
          botCoord = [i, j];
          locations.set(coord([i, j]), elem);
          break;
        }
        if (elem === "O") {
          locations.set(coord([i, j]), "[");
          locations.set(coord([i, j + 1]), "]");
          break;
        }
        locations.set(coord([i, j]), elem);
        locations.set(coord([i, j + 1]), elem);
      }
    }
    j += 2;
  });
  allMovesP2(moves, locations, botCoord[0], botCoord[1]);
  console.log(boxSum(locations));
}

function coord(data: number[]) {
  return `${data[0]}|${data[1]}`;
}

function getCoords(coord: string) {
  return coord.split("|").map((s) => Number(s));
}

function printGrid(map: Map<string, string>) {
  let y = 0;
  let x = 0;
  map.forEach((_, k) => {
    const cs = getCoords(k);
    y = Math.max(cs[0], y);
    x = Math.max(cs[1], x);
  });
  for (let i = 0; i <= y; i++) {
    let line: string[] = [];
    for (let j = 0; j <= x; j++) {
      if (map.has(coord([i, j]))) {
        line.push(map.get(coord([i, j])));
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }
}

function allMovesP2(
  moves: string[],
  locations: Map<string, string>,
  i: number,
  j: number,
) {
  const pos = [i, j];
  moves.forEach((move) => {
    let dir: number[] = [];
    switch (move) {
      case "v": {
        dir = [1, 0];
        break;
      }
      case "^": {
        dir = [-1, 0];
        break;
      }
      case ">": {
        dir = [0, 1];
        break;
      }
      case "<": {
        dir = [0, -1];
        break;
      }
    }
    tryMoveP2(pos, dir, locations);
  });
}

function tryMoveP2(
  pos: number[],
  dir: number[],
  locations: Map<string, string>,
) {
  const i = pos[0];
  const j = pos[1];
  if (canMoveSafe(i, j, dir, locations)) {
    moveSafe(i, j, dir, locations);
    pos[0] += dir[0];
    pos[1] += dir[1];
    return true;
  }
  return false;
}

function canMoveSafe(
  i: number,
  j: number,
  dir: number[],
  locations: Map<string, string>,
) {
  const c = coord([i, j]);
  if (!locations.has(c)) return true;
  const char = locations.get(c);
  if (char === "#") return false;
  const desI = i + dir[0];
  const desJ = j + dir[1];
  if (char === "@" || dir[1] !== 0) {
    if (!canMove(desI, desJ, locations)) {
      return canMoveSafe(desI, desJ, dir, locations);
    }
    return true;
  }
  let partnerJ: number;
  if (char === "[") {
    partnerJ = j + 1;
  } else {
    partnerJ = j - 1;
  }

  if (
    canMove(desI, desJ, locations) &&
    canMove(desI, partnerJ + dir[1], locations)
  ) {
    return true;
  }
  return (
    canMoveSafe(desI, desJ, dir, locations) &&
    canMoveSafe(desI, partnerJ + dir[1], dir, locations)
  );
}

function moveSafe(
  i: number,
  j: number,
  dir: number[],
  locations: Map<string, string>,
) {
  const c = coord([i, j]);
  const char = locations.get(c);
  const desI = i + dir[0];
  const desJ = j + dir[1];
  const desCord = coord([desI, desJ]);

  if (char === "@" || dir[1] !== 0) {
    if (!canMove(desI, desJ, locations)) {
      moveSafe(desI, desJ, dir, locations);
    }
    locations.delete(c);
    locations.set(desCord, char);
    return;
  }
  let partnerJ: number;
  let partnerChar: string;
  if (char === "[") {
    partnerJ = j + 1;
    partnerChar = "]";
  } else {
    partnerJ = j - 1;
    partnerChar = "[";
  }
  if (!canMove(desI, desJ, locations)) {
    moveSafe(desI, desJ, dir, locations);
  }
  if (!canMove(desI, partnerJ + dir[1], locations)) {
    moveSafe(desI, partnerJ + dir[1], dir, locations);
  }
  locations.delete(c);
  locations.set(desCord, char);

  locations.delete(coord([i, partnerJ]));
  locations.set(coord([desI, partnerJ + dir[1]]), partnerChar);
}
