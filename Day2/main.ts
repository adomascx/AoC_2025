import { parseArgs } from "@std/cli/parse-args";

export type IdRange = {
  lowerBound: number,
  upperBound: number
}

export function processFileInput(filePath: string): IdRange[] {
  const inputString: string = Deno.readTextFileSync(filePath); // first, input text file into a singular string

  const structuredRanges: IdRange[] = [];

  // Split 'input ranges string' into numbers, then push to an array
  inputString.split(',').forEach(element => {

    const parts = element.split('-');
    const thisRange: IdRange = {
      lowerBound: parseInt(parts[0]),
      upperBound: parseInt(parts[1])
    };

    structuredRanges.push(thisRange);
  });

  // sort the array before returning
  structuredRanges.sort((a, b) => a.lowerBound - b.lowerBound);

  return structuredRanges;
}

export function findInvalidIds(range: IdRange): number[] {
  const foundIds: number[] = [];

  for (let i: number = range.lowerBound; i < range.upperBound; i++) {
    // main computation is string-based
    const string: string = i.toString();

    // split the string in two equal parts and compare them
    // if they're the same, we have an invalid ID
    if (string.length % 2 == 0) {

      const middle = string.length / 2;
      if (string.slice(0, middle) == string.slice(middle)) {
        foundIds.push(i);
      }
    }
  }

  return foundIds;
}

export function getInvalidIdSum(structuredRanges: IdRange[]): number {
  let invalidIdSum: number = 0;

  // iterate over all ranges
  for (const range of structuredRanges) {

    // for each range, sum up all invalid IDs
    const invalidIds: number[] = findInvalidIds(range);
    for (const id of invalidIds) {
      invalidIdSum += id;
    }
  }

  return invalidIdSum;
}

function main() {
  // optional command line functionality
  const inputFilePath: string = parseArgs(Deno.args).file || "input.txt";
  
  const Ids: IdRange[] = processFileInput(inputFilePath);
  console.log(getInvalidIdSum(Ids));
}

main();