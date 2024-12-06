import {readFileSync} from "node:fs";
const filename = 'actual-input.txt';
const filename2 = 'sample.txt';

const actualFile:string = readFileSync('Input/'+filename, 'utf-8');
const actualLines:string[] = actualFile.split("\n");
const sampleFile:string = readFileSync('Input/'+filename2, 'utf-8');
const sampleLines:string[] = sampleFile.split("\n");

console.log('sample p1: ');
partOne(sampleFile, sampleLines);
console.log('actual p1: ');
partOne(actualFile, actualLines);
console.log('sample p2: ');
partTwo(sampleFile, sampleLines);
console.log('actual p2: ');
partTwo(actualFile, actualLines);


function partOne(file:string, lines:string[]){
    const rows = lines.length
    const cols = lines[0].length
    let i = 0;
    let j = 0;
    let lineChars = lines.map(str => str.split(""))
    lines.forEach((str, ind)=>{
        if(str.indexOf("^") != -1){
            i = ind;
            j = str.indexOf("^")
        }
    })
    let visits  = new Set<string>()
    while(inBounds(i,j, rows, cols)){
     //   printArr(lineChars)
        visits.add(toStr(i,j))
        const newCoords = move(i, j, rows, cols, lineChars);
        i = newCoords[0]
        j = newCoords[1]
     //   console.log("\n\n\n step \n\n\n")
    }
    console.log(visits.size)

}
function partTwo(file:string, lines:string[]){
    const rows = lines.length
    const cols = lines[0].length
    let i = 0;
    let j = 0;
    let lineChars = lines.map(str => str.split(""))
    lines.forEach((str, ind)=>{
        if(str.indexOf("^") != -1){
            i = ind;
            j = str.indexOf("^")
        }
    })
    const initI = i
    const initJ = j
    let visits  = new Set<string>()
    while(inBounds(i,j, rows, cols)){
        //   printArr(lineChars)
        visits.add(toStr(i,j))
        const newCoords = move(i, j, rows, cols, lineChars);
        i = newCoords[0]
        j = newCoords[1]
        //   console.log("\n\n\n step \n\n\n")
    }

    let positions = 0;
    visits.delete(toStr(initI, initJ))
    visits.forEach(visit => {
        lineChars = lines.map(str => str.split(""))
        const numbers = parseVisit(visit);
        lineChars[numbers[0]][numbers[1]] = "#"
        i = initI
        j = initJ
        if(causesLoop(i, j, lineChars)){
            positions++
        }
    })
    console.log(positions)

}
function inBounds(i:number, j:number, rows:number, cols:number){
    return i > -1 && j > -1 && i < rows && j < cols;
}
function toStr(i:number,j:number){
    return `${i}|${j}`;
}
function move(i:number, j:number, rows:number, cols:number, lineChars:string[][]){
    const char = lineChars[i][j]
    const dir = getDir(char)
    lineChars[i][j] = ".";
    i+=dir[0]
    j+=dir[1]
    if(!inBounds(i,j, rows, cols)){
        return [i,j]
    }
    if(lineChars[i][j]=="#"){
        i -= dir[0]
        j -= dir[1]
        lineChars[i][j] = rotate90(char)
    }else{
        lineChars[i][j] = char
    }
    return [i,j]
}
function getDir(char:string){
    switch(char){
        case "<": return [0,-1]
        case ">": return [0, 1]
        case "v": return [1, 0]
        case "^": return [-1, 0]
    }
}
function rotate90(char:string){
    switch(char){
        case "^": return ">"
        case ">": return "v"
        case "v": return "<"
        case "<": return "^"
    }
}
function printArr(s:string[][]){
    s.forEach(s=>console.log(s.join(' ')))
}
function parseVisit(s:string){
    const arr = s.split("|")
    return [Number(arr[0]), Number(arr[1])]
}
function causesLoop(i:number, j:number, lineChars:string[][]) {
    let movements = new Set<string>
    const rows = lineChars.length
    const cols = lineChars[0].length
    while (inBounds(i, j, rows, cols)) {
        const char = lineChars[i][j]
        const dir = getDir(char)
        const str = moveStr(i, j, dir)
        if(movements.has(str)){
            return true
        }
        movements.add(str)
        lineChars[i][j] = ".";
        i+=dir[0]
        j+=dir[1]
        if(!inBounds(i,j, rows, cols)){
            return false
        }
        if(lineChars[i][j]=="#"){
            i -= dir[0]
            j -= dir[1]
            lineChars[i][j] = rotate90(char)
        }else{
            lineChars[i][j] = char
        }
    }
    return false
}
function moveStr(i:number,j:number, dir:number[]){
    return `${i}|${j}|${dir[0]}|${dir[1]}`;
}


