import { parseArgs } from "@std/cli/parse-args";

const inputFilePath: string = parseArgs(Deno.args).file;

export type IdRange = {
  lowerBound: number,
  upperBound: number
}

export function processFileInput(filePath: string = "input.txt"): IdRange[] {
  const inputString: string = Deno.readTextFileSync(filePath); // first, input text file into a singular string

  const structuredRanges: IdRange[] = [];

  // Split input ranges string into numbers, then push to an array
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

console.log(processFileInput(inputFilePath));