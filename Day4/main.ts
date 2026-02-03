export type coordinates = {
  x: number,
  y: number
}

export function processInput(inputFile: string = "input.txt"): boolean[][] {
  return Deno.readTextFileSync(inputFile)
    .split('\r\n') // split by newlines
    .map(row => {
      return row.split('') // turn string into an array
        .map(x => x === '@') // encode each symbol into binary
    });
}

export function countNeighbours(rollMatrix: boolean[][], coords: coordinates): number {
  let neighbourCounter: number = 0;
  const thisX = coords.x;
  const thisY = coords.y;

  // array of this element's neighbour coordinates
  const neighboursToCheck: coordinates[] = [
    { x: thisX - 1, y: thisY - 1 },
    { x: thisX - 1, y: thisY },
    { x: thisX - 1, y: thisY + 1 },
    { x: thisX, y: thisY - 1 },
    { x: thisX, y: thisY + 1 },
    { x: thisX + 1, y: thisY - 1 },
    { x: thisX + 1, y: thisY },
    { x: thisX + 1, y: thisY + 1 }
  ]

  for (const neighbour of neighboursToCheck) {
    // prevent exception throw due to OOB access
    if (neighbour.x < 0 || neighbour.x >= rollMatrix.length || neighbour.y < 0 || neighbour.y >= rollMatrix.length)
      continue;

    // check if this neighbour exists, if so increment counter
    if (rollMatrix[neighbour.x][neighbour.y] === true) neighbourCounter++;
  }

  return neighbourCounter;
}

export function findAccessibleRolls(rollMatrix: boolean[][]): coordinates[] {
  const coordsArray: coordinates[] = [];

  for (let i = 0; i < rollMatrix.length; i++) {
    const row = rollMatrix[i];

    for (let j = 0; j < row.length; j++) {
      const element = row[j];

      if (element === false) {
        continue;
      }

      const elementCoords: coordinates = { x: i, y: j }
      if (countNeighbours(rollMatrix, elementCoords) < 4)
        coordsArray.push(elementCoords);
    }
  }

  return coordsArray;
}

if (import.meta.main) {
  const rollMatrix: boolean[][] = processInput("input.txt");
  console.log(findAccessibleRolls(rollMatrix).length);
}