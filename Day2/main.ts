import { parseArgs } from "@std/cli/parse-args";

export type IdRange = {
  lowerBound: number,
  upperBound: number
}

export function getFactors(num: number): number[] {
    const factors: number[] = [];
    const limit = Math.sqrt(num);

    for (let i = 1; i <= limit; i++) {
      
        if (num % i === 0) {
            factors.push(i);
            
            // If the divisors are distinct, add the pair
            if (i !== num / i) {
                factors.push(num / i);
            }
        }
    }

    return factors.sort((a, b) => a - b);
}

export function sliceIntoSubstrings(inputString: string, numOfSubstrings: number): string[] {
  const substrings: string[] = [];
  const substringLength = inputString.length / numOfSubstrings;

  for (let i = 0; i < numOfSubstrings; i++) {
    const start = i * substringLength;
    const end = start + substringLength;
    substrings.push(inputString.slice(start, end));
  }

  return substrings;
}

export function processFileInput(filePath: string): IdRange[] {
  const inputString: string = Deno.readTextFileSync(filePath); // first, input text file into a singular string

  const structuredRanges: IdRange[] = [];

  // Split 'input ranges string' into numbers, then push to an array
  inputString.split(',').forEach(rangeElement => {

    const parts = rangeElement.split('-');
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

  for (let id: number = range.lowerBound; id < range.upperBound; id++) {

    const idString: string = id.toString();
    const factors: number[] = getFactors(idString.length); // using factors for less comparisons later on

    for (const factor of factors) {
      const substrings = sliceIntoSubstrings(idString, factor);
      if (new Set(substrings).size === 1 && substrings.length > 1) {
        foundIds.push(id);
      }
    }

    // v1 implementation

    // if (idString.length % 2 === 0) {
    //   const middle = idString.length / 2;
    //   if (idString.slice(0, middle) === idString.slice(middle)) {
    //     foundIds.push(id);
    //   }
    // }
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

export function main(paramFilePath: string = "input.txt") {
  // optional command line functionality
  const inputFile: string = parseArgs(Deno.args).file || paramFilePath;

  const Ids: IdRange[] = processFileInput(inputFile);

  const finalSum: number = getInvalidIdSum(Ids);

  console.log(finalSum);
  return finalSum;
}

main();