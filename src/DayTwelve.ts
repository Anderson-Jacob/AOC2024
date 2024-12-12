import { readFileSync } from "node:fs";
import { Queue } from "@datastructures-js/queue";

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
  const visits = new Set<string>();
  let price = 0;
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (!visits.has(coordStr(index, j))) {
        const areaPerim = calculateAreaPrice(index, j, lines, visits);
        //console.log(lines[index].charAt(j));
        //  console.log(areaPerim);
        price += areaPerim[0] * areaPerim[1];
      }
    }
  });
  console.log(price);
}

function partTwo(file: string, lines: string[]) {
  const visits = new Set<string>();
  let price = 0;
  lines.forEach((line: string, index: number) => {
    for (let j = 0; j < line.length; j++) {
      if (!visits.has(coordStr(index, j))) {
        const areaSides = calculateAreaSidesPrice(index, j, lines, visits);
        price += areaSides[0] * areaSides[1];
      }
    }
  });
  console.log(price);
}

function calculateAreaPrice(
  i: number,
  j: number,
  lines: string[],
  visits: Set<string>,
) {
  const queue = new Queue<number[]>();
  queue.enqueue([i, j]);
  visits.add(coordStr(i, j));
  let totalArea = 0;
  let totalPerim = 0;
  while (!queue.isEmpty()) {
    const coord = queue.dequeue();
    i = coord[0];
    j = coord[1];
    const perim = countNonNeighborsAddQueue(i, j, lines, visits, queue);
    // console.log(`pos: ${coordStr(i, j)} has ${perim} perimeter contribution`);
    totalArea++;
    totalPerim += perim;
  }
  return [totalArea, totalPerim];
}

function coordStr(i: number, j: number) {
  return `${i}|${j}`;
}

function countNonNeighborsAddQueue(
  i: number,
  j: number,
  lines: string[],
  visits: Set<string>,
  queue: Queue<number[]>,
) {
  let count = 0;
  const char = lines[i].charAt(j);
  if (i < 1 || lines[i - 1].charAt(j) !== char) {
    count++;
  } else if (!visits.has(coordStr(i - 1, j))) {
    visits.add(coordStr(i - 1, j));
    queue.enqueue([i - 1, j]);
  }
  if (j < 1 || lines[i].charAt(j - 1) !== char) {
    count++;
  } else if (!visits.has(coordStr(i, j - 1))) {
    visits.add(coordStr(i, j - 1));
    queue.enqueue([i, j - 1]);
  }

  if (i > lines.length - 2 || lines[i + 1].charAt(j) !== char) {
    count++;
  } else if (!visits.has(coordStr(i + 1, j))) {
    visits.add(coordStr(i + 1, j));
    queue.enqueue([i + 1, j]);
  }
  if (j > lines.length - 2 || lines[i].charAt(j + 1) !== char) {
    count++;
  } else if (!visits.has(coordStr(i, j + 1))) {
    visits.add(coordStr(i, j + 1));
    queue.enqueue([i, j + 1]);
  }
  return count;
}

function calculateAreaSidesPrice(
  i: number,
  j: number,
  lines: string[],
  visits: Set<string>,
) {
  const queue = new Queue<number[]>();
  queue.enqueue([i, j]);
  visits.add(coordStr(i, j));
  let totalArea = 0;
  let totalSides = 0;
  while (!queue.isEmpty()) {
    const coord = queue.dequeue();
    i = coord[0];
    j = coord[1];
    totalSides += countSidesAddQueue(i, j, lines, visits, queue);
    // console.log(`pos: ${coordStr(i, j)} has ${perim} perimeter contribution`);
    totalArea++;
  }
  // console.log(`pos: ${lines[i].charAt(j)} has ${totalSides} sides`);
  return [totalArea, totalSides];
}

function countSidesAddQueue(
  i: number,
  j: number,
  lines: string[],
  visits: Set<string>,
  queue: Queue<number[]>,
) {
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  const char = lines[i].charAt(j);
  if (i < 1 || lines[i - 1].charAt(j) !== char) {
    up = true;
  } else if (!visits.has(coordStr(i - 1, j))) {
    visits.add(coordStr(i - 1, j));
    queue.enqueue([i - 1, j]);
  }
  if (j < 1 || lines[i].charAt(j - 1) !== char) {
    left = true;
  } else if (!visits.has(coordStr(i, j - 1))) {
    visits.add(coordStr(i, j - 1));
    queue.enqueue([i, j - 1]);
  }

  if (i > lines.length - 2 || lines[i + 1].charAt(j) !== char) {
    down = true;
  } else if (!visits.has(coordStr(i + 1, j))) {
    visits.add(coordStr(i + 1, j));
    queue.enqueue([i + 1, j]);
  }
  if (j > lines.length - 2 || lines[i].charAt(j + 1) !== char) {
    right = true;
  } else if (!visits.has(coordStr(i, j + 1))) {
    visits.add(coordStr(i, j + 1));
    queue.enqueue([i, j + 1]);
  }
  return sideCombos(up, down, left, right, i, j, lines);
}

function sideCombos(
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  i: number,
  j: number,
  lines: string[],
) {
  //none
  if (!up && !down && !left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  //straights
  if (up && down && !left && !right) {
    return 0;
  }
  if (!up && !down && left && right) {
    return 0;
  }

  //just left and just right
  if (!up && !down && !left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (!up && !down && left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }

  //just up and just down
  if (up && !down && !left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (!up && down && !left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  //UL, UR, DL, DR
  //corners
  if (up && !down && left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (up && !down && !left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (!up && down && left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (!up && down && !left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  //UDL, UDR, ULR, DLR
  if (up && down && left && !right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (up && down && !left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (up && !down && left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  if (!up && down && left && right) {
    return corners(up, down, left, right, i, j, lines);
  }
  //all
  if (up && down && left && right) {
    return 4;
  }
}

function corners(
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  i: number,
  j: number,
  lines: string[],
) {
  const diags = getDiags(i, j, lines, up, down, left, right); //UL UR DL DR
  const ul = diags[0];
  const ur = diags[1];
  const dl = diags[2];
  const dr = diags[3];
  let corners = 0;
  //outer corners
  if (up && left && ul) {
    corners++;
  }
  if (up && right && ur) {
    corners++;
  }
  if (down && left && dl) {
    corners++;
  }
  if (down && right && dr) {
    corners++;
  }

  //inner corners
  if (!down && !right && dr) {
    corners++;
  }
  if (!down && !left && dl) {
    corners++;
  }
  if (!up && !left && ul) {
    corners++;
  }
  if (!up && !right && ur) {
    corners++;
  }
  // console.log(`${coordStr(i, j)} has ${corners} corners`);
  return corners;
}

function getDiags(
  i: number,
  j: number,
  lines: string[],
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
) {
  const char = lines[i].charAt(j);
  const diags: boolean[] = [false, false, false, false];
  diags[0] =
    i == 0 || j == 0 || (up && left) || lines[i - 1].charAt(j - 1) !== char;
  diags[1] =
    i == 0 ||
    j == lines[0].length - 1 ||
    (up && right) ||
    lines[i - 1].charAt(j + 1) !== char;
  diags[2] =
    i == lines.length - 1 ||
    j == 0 ||
    (down && left) ||
    lines[i + 1].charAt(j - 1) !== char;
  diags[3] =
    i == lines.length - 1 ||
    j == lines[0].length - 1 ||
    (down && right) ||
    lines[i + 1].charAt(j + 1) !== char;
  return diags;
}
