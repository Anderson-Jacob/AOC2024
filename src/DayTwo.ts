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


function partOne(string, lines:string[]){
    let count = 0;
    lines.forEach((line:string, index:number)=>{
        const vals = line.split(/(\s+)/).filter( e => e.trim().length > 0).map(s => Number(s))
        if(vals.length == 0)
            return;
        if(tryDec(vals) || tryInc(vals))
            count++;
    });
    console.log(count)
}
function partTwo(string, lines:string[]){
    let count = 0;
    lines.forEach((line:string, index:number)=>{
            const vals = line.split(/(\s+)/).filter( e => e.trim().length > 0).map(s => Number(s))

            if(vals.length === 0)
                return;
            for(let i = 0; i<vals.length; i++) {
                const updated = vals.filter((v, ind) => ind !== i);
                if (tryInc(updated) || tryDec(updated)) {
                    count++
                    break;
                }
            }
    });
    console.log(count);
}
function tryInc(vals:number[]):boolean{
    let num = vals[0];
    for(let i = 1; i<vals.length; i++){
        if(vals[i] - num > 3 || vals[i] - num < 1){
            return false
        }
        num = vals[i];
    }
    return true
}
function tryDec(vals:number[]):boolean{
    let num = vals[0];

    for(let i = 1; i<vals.length; i++){
        if(vals[i] - num < -3 || vals[i] - num > -1){
            return false
        }
        num = vals[i];
    }
    return true
}
