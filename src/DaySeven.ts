import {readFileSync} from "node:fs";

const filename = 'actual-input.txt';
const filename2 = 'sample.txt';

const actualFile: string = readFileSync('Input/' + filename, 'utf-8');
const actualLines: string[] = actualFile.split("\n");
const sampleFile: string = readFileSync('Input/' + filename2, 'utf-8');
const sampleLines: string[] = sampleFile.split("\n");

console.log('sample p1: ');
partOne(sampleFile, sampleLines);
console.log('actual p1: ');
partOne(actualFile, actualLines);
console.log('sample p2: ');
partTwo(sampleFile, sampleLines);
console.log('actual p2: ');
partTwo(actualFile, actualLines);


function partOne(file: string, lines: string[]) {
    let sum = 0
    lines.forEach((line: string, index: number) => {
        const segs = line.split(":")
        const res = Number(segs[0])
        const numbers = segs[1].split(" ")
            .filter(s => s.trim().length > 0)
            .map(s => Number(s))
        if (canMake(res, 0, numbers)) {
            sum += res
        }
    });
    console.log(sum)
}

function partTwo(file: string, lines: string[]) {

    let sum = 0
    lines.forEach((line: string, index: number) => {
        const segs = line.split(":")
        const res = Number(segs[0])
        const numbers = segs[1].split(" ")
            .filter(s => s.trim().length > 0)
            .map(s => Number(s))
        if (canMakeP2(res, 0, numbers)) {
            sum += res
        }
    });
    console.log(sum)

}

function canMake(result: number, current: number, numbers: number[]) {
    if (numbers.length === 1) {
        return current + numbers[0] == result || current * numbers[0] == result
    }
    const next = numbers.slice(1, numbers.length)
    return canMake(result, current + numbers[0], next) || canMake(result, current * numbers[0], next);
}

function canMakeP2(result: number, current: number, numbers: number[]) {
    if (numbers.length === 1) {
        return current + numbers[0] === result || current * numbers[0] === result || concat(current, numbers[0]) === result;
    }
    const next = numbers.slice(1, numbers.length)
    return canMakeP2(result, current + numbers[0], next) || canMakeP2(result, current * numbers[0], next) || canMakeP2(result, concat(current, numbers[0]), next);
}

function concat(num1: number, num2: number) {
    return Number(num1.toString() + num2.toString())
}