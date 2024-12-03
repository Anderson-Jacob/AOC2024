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
    let res = 0
    const regex = /mul\((\d+),(\d+)\)/g;

    const iter = Array.from(file.matchAll(regex))

    for(const match of iter){
        let strs = match.toString().split(",")
        let fnum = Number(strs[0].substring(4))
        let snum = Number(strs[1].substring(0, strs[1].length-1))
        res += fnum * snum
    }
    console.log(res)


}
function partTwo(file:string, lines:string[]){
    let res = 0
    const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

    const iter = Array.from(file.matchAll(regex))
    let go = true;
    for(const match of iter){
        if(match.toString().startsWith("do()")){
            go = true;
        }else if(match.toString().startsWith("don't()")){
            go = false;
        }else if(go === true){
            let strs = match.toString().split(",")
            let fnum = Number(strs[0].substring(4))
            let snum = Number(strs[1].substring(0, strs[1].length-1))
            res += fnum * snum
        }
    }
    console.log(res)

}