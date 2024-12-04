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
    const data = file.split("\n")
    let total = 0;
    data.forEach((line, i) =>{
        for(let j = 0; j<line.length; j++){
            if(line.charAt(j)=='X'){
                total += findAll(i, j, data)
            }
        }
    })
    console.log(total)
}
function partTwo(file:string, lines:string[]){
    const data = file.split("\n")
    let total = 0;
    data.forEach((line, i) =>{
        for(let j = 0; j<line.length; j++){
            if(line.charAt(j)=='A'){
                total += masFind(i, j, data)
            }
        }
    })
    console.log(total)

}
function masFind(i : number, j: number, data:string[]){
    const dir1 = [[-1,1],[1,-1]]
    const dir2 = [[-1,-1],[1,1]]
    const c1 = [i + dir1[0][0], j + dir1[0][1]]
    const c2 = [i + dir1[1][0], j + dir1[1][1]]
    const c3 = [i + dir2[0][0], j + dir2[0][1]]
    const c4 = [i + dir2[1][0], j + dir2[1][1]]
    if(!inBounds(c1, data) || !inBounds(c2, data) || !inBounds(c3, data) || !inBounds(c4, data)){
        return 0;
    }
    const l1 = data[c1[0]].charAt(c1[1])
    const l2 = data[c2[0]].charAt(c2[1])
    const l3 = data[c3[0]].charAt(c3[1])
    const l4 = data[c4[0]].charAt(c4[1])
    let v1 = false;
    let v2 = false;
    if((l1 === 'M' && l2 === 'S') || (l1 === 'S' && l2 === 'M')){
        v1 = true;
    }

    if((l3 === 'M' && l4 === 'S') || (l3 === 'S' && l4 === 'M')){
        v2 = true;
    }
    if(!(v1 && v2))
        return 0;
    return 1;
}
function findAll(i :number, j:number, data:string[]){
    const dirs = [[-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1]]
    let total = 0;
    dirs.forEach(dir =>{
        let coords = [i + dir[0], j + dir[1]]
        let valid = true;
        for(let ind = 1; ind<4; ind++){
            if(!inBounds(coords, data)){
                valid = false;
                break;
            }
            let char = data[coords[0]].charAt(coords[1])
            if(ind===1 && char !== 'M'){
                valid = false;
                break;
            }
            if(ind===2 && char !== 'A'){
                valid = false;
                break;
            }
            if(ind===3 && char !== 'S'){
                valid = false;
                break;
            }

           coords[0]+=dir[0]
           coords[1]+=dir[1]
        }
        if(valid){
            total++;
        }
    })
    return total
}
function inBounds(coords : number[], data:string[]){
    return coords[0] > -1 && coords[1] > -1 && coords[0]<data.length && coords[1]<data[0].length
}