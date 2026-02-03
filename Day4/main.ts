export type coordinates = {
  x: number,
  y: number
}

/**
 * Process and encode the puzzle input file into a boolean coordinate matrix
 *
 * @export
 * @param {string} [inputFile="input.txt"] Full path to the input file
 * @returns {boolean[][]} Input data encoded as a boolean coordinate matrix
 */
export function processInput(inputFile: string = "input.txt"): boolean[][] {
  return Deno.readTextFileSync(inputFile)
    .split('\r\n') // split by newlines
    .map(row => {
      return row.split('') // turn string into an array
        .map(x => x === '@') // encode each symbol into binary
    });
}

/**
 * Counts how many neighbours of a given point aren't empty
 *
 * @export
 * @param {boolean[][]} rollMatrix Coordinate matrix of boolean points
 * @param {coordinates} coords Coordinates of the point whose neighbours we check
 * @returns {number} Number of non-empty neighbours
 */
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
    if (neighbour.x < 0 || neighbour.x >= rollMatrix.length || neighbour.y < 0 || neighbour.y >= rollMatrix[neighbour.x].length)
      continue;

    // check if this neighbour exists, if so increment counter
    if (rollMatrix[neighbour.x][neighbour.y] === true) neighbourCounter++;
  }

  return neighbourCounter;
}

/**
 * Finds all accessible rolls, i.e. points in a matrix that have < 4 non-empty neighbours
 *
 * @export
 * @param {boolean[][]} rollMatrix Coordinate matrix of boolean points
 * @returns {coordinates[]} Coordinates of each accessible point
 */
export function findAccessibleRolls(rollMatrix: boolean[][]): coordinates[] {
  const coordsArray: coordinates[] = [];

  // Iterate over elements by Gutenberg principle
  for (let i = 0; i < rollMatrix.length; i++) {
    const row = rollMatrix[i];

    for (let j = 0; j < row.length; j++) {
      const element = row[j];

      // preemptively skip the point if it's empty
      if (element === false) {
        continue;
      }

      // count the point's neighbours, if valid push to coordsArray
      const elementCoords: coordinates = { x: i, y: j }
      if (countNeighbours(rollMatrix, elementCoords) < 4)
        coordsArray.push(elementCoords);
    }
  }

  return coordsArray;
}

if (import.meta.main) {
  const rollMatrix: boolean[][] = processInput("input.txt");
  let removedRollCounter = 0;
  let accessibleRolls: coordinates[];

  do {
    // find all currently accessible rolls
    accessibleRolls = findAccessibleRolls(rollMatrix);

    // remove them from the matrix
    for (const roll of accessibleRolls) {
      rollMatrix[roll.x][roll.y] = false;
      removedRollCounter++;
    }
  } while (accessibleRolls.length > 0);

  console.log(removedRollCounter);

}