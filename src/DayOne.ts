import {readFileSync} from "node:fs";

const file:string = readFileSync('Input/sample.txt', 'utf-8');
let lines:string[] = file.split("\n");

lines.forEach((line:string, index:number)=>{
    console.log(line)
});