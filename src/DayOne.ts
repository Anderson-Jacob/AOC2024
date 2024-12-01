import {readFileSync} from "node:fs";
const filename = 'actual-input.txt';
//const filename = 'sample.txt';


const file:string = readFileSync('Input/'+filename, 'utf-8');
const lines:string[] = file.split("\n");
let map = new Map<number, number>();

let left:number[] = [];
lines.forEach((line:string, index:number)=>{
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
let total = 0;
for(let i = 0; i<left.length; i++){
    if(map.has(left[i]))
        total+= left[i] * map.get(left[i])
}
console.log(total)