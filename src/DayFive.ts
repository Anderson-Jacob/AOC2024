import {readFileSync} from "node:fs";
import {after} from "node:test";
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
    const beforeMap = processRules(lines)
    const output = reorderAll(lines, beforeMap);
    const original = output[0]
    const reordered = output[1]
    const valid = reordered.filter((line, index)=> arrEQ(line, original[index]))
    let sum = 0;
    valid.forEach(line => {
        sum += line[Math.floor(line.length/2)]
    })
    console.log(sum)
}
function partTwo(file:string, lines:string[]){
    const stuff = processRules(lines)
    const beforeMap = stuff[0]
    const output = reorderAll(lines, beforeMap);
    const original = output[0]
    const reordered = output[1]
    const valid = reordered.filter((line, index)=> !arrEQ(line, original[index]))
    let sum = 0;
    valid.forEach(line => {
        sum += line[Math.floor(line.length/2)]
    })
    console.log(sum)


}

function processRules(lines:string[]){
    let beforeMap = new Map<number, number[]>();
    lines.forEach((line:string, index:number)=>{
        if(line.trim().length == 0) {
            return;
        }
        const segs = line.split("|").map(str => Number(str))
        if(beforeMap.has(segs[0])){
            beforeMap.get(segs[0]).push(segs[1])
        }else{
            beforeMap.set(segs[0], [segs[1]])
        }
    });
    console.log("done")
    return beforeMap
}

function reorderAll(lines: string[], beforeMap:Map<Number,Number[]>){
    let stop = 0
    lines.forEach((line:string, index:number)=>{
        if(line.trim().length == 0) {
            stop = index
            return;
        }
    })
    const numberLines = lines.filter((_, ind) => ind > stop)
        .map(str => str.split(",")
            .map(str=>Number(str)))
    const newNums :number[][] = []
    numberLines.forEach(line=>{
        const newLine = [...line]
        newLine.sort((a,b) =>{
            if(beforeMap.has(a) && beforeMap.get(a).indexOf(b) != -1){
                return -1;
            }else if(beforeMap.has(b) && beforeMap.get(b).indexOf(a) != -1){
                return 1;
            }
            return 0;
        })
        newNums.push(newLine)
    })
    return [numberLines, newNums]
}
function arrEQ(a: number[], b: number[]){
    if (a.length != b.length)
        return false
    else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]){
                return false
            }
        }
        return true
    }
}