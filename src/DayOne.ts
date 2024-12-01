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
    let left:number[] = [];
    let right:number[] = [];
    lines.forEach((line:string)=>{
        const sides = line.split(" ")
        left.push(Number(sides[0]))
        right.push(Number(sides[3]))
    });
    left.sort()
    right.sort()
    let result = 0;
    for(let i = 0; i<left.length; i++){
        result += Math.abs(left[i]-right[i]);
    }
    console.log(result)
}
function partTwo(file:string, lines:string[]){
    let map = new Map<number, number>();
    let left:number[] = [];
    lines.forEach((line:string)=>{
        const sides = line.split(" ")
        let l = Number(sides[0])
        let r = Number(sides[3])
        left.push(l)
        if(!map.has(r)){
            map.set(r, 1)
        }else{
            map.set(r, map.get(r)+1)
        }
    });
    let result = 0;
    for(let i = 0; i<left.length; i++){
        if(map.has(left[i]))
            result+= left[i] * map.get(left[i])
    }
    console.log(result)
}