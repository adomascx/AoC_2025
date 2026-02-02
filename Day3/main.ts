/**
 * Processes input file and converts it into a 2D array of numbers.
 * 
 * @param inputFilePath - The path to the input file. (default: "input.txt")
 * @returns A 2D array where the 1st dimension represents rows (batteries), whereas the 2nd dimension represents elements (digits)
 */
export function processInput(inputFilePath: string = "input.txt"): number[][] {

  const banks: number[][] = Deno.readTextFileSync(inputFilePath)
    .split('\r\n') // split strings by newline char
    .map(bank => {
      return bank.split('') // split each bank (row) into array of individual chars
        .map(Number); // cast each symbol to number
    });

  return banks;
}

/**
 * Finds the maximum battery combination by selecting the largest digits from a bank
 * in a way that allows enough remaining elements to fulfill the required digit count.
 * 
 * @param bank - Array of numbers representing available digits to select from
 * @param digitsNeeded - The number of digits to select (default: 12)
 * @returns The maximum number that can be formed by combining the selected digits
 */
export function findMaxBatteryCombination2(bank: number[], digitsNeeded: number = 12): number {

  const digits: number[] = [];

  function findBestDigits(bank: number[], lastDigitIdx: number) {

    // per-loop counters
    let currBestDigit: number = 0;
    let currBestDigitIdx: number = 0;

    // while digits left to check >= how many more digits we need (including this one)
    for (let i = lastDigitIdx; bank.length - i >= digitsNeeded - digits.length; i++) {
      if (bank[i] > currBestDigit) {
        currBestDigit = bank[i];
        currBestDigitIdx = i;
      }
    }

    digits.push(currBestDigit);

    // recursively search for next digit if more digits are needed
    if (digits.length < digitsNeeded) { findBestDigits(bank, currBestDigitIdx + 1) }
  }

  findBestDigits(bank, 0);


  // flatten array of digits into one number
  let maxBatteryCombination = 0;
  let multiplier = digitsNeeded - 1;

  for (const digit of digits) {
    maxBatteryCombination += digit * 10 ** multiplier;
    multiplier--;
  }

  return maxBatteryCombination;
}

/**
 * Finds the maximum two-digit number that can be formed from an array of single digits.
 * 
 * This function searches for the largest digit in the array to use as the first digit,
 * then searches for the largest digit after that position to use as the second digit.
 * 
 * @param bank - An array of single-digit numbers
 * @returns A two-digit number formed by concatenating the largest digit followed by the second-largest digit found after it
 */
export function findMaxBatteryCombination(bank: number[]): number {
  let firstDigit = 0;
  let firstDigitIdx = 0;


  // Search the array for the largest digit, make it the first digit of out number
  // Doesn't check last digit, since any 2-digit number is larger than a 1-digit number (under our constraints, we can guarantee a 2-digit number)
  for (let i = 0; i < bank.length - 1; i++) {
    if (bank[i] > firstDigit) {
      firstDigit = bank[i];
      firstDigitIdx = i;
    }
  }

  let secondDigit = 0;
  // Search the remaining array with the same principle for the second digit
  for (let j = firstDigitIdx + 1; j < bank.length; j++) {
    if (bank[j] > secondDigit) {
      secondDigit = bank[j];
    }
  }

  return firstDigit * 10 + secondDigit;
}

/**
 * Calculates the sum of all joltage values in the provided array.
 *
 * @param joltages - An array of numbers representing joltage values.
 * @returns The sum of all joltage values in the array.
 */
export function calculateJoltageSum(joltages: number[]): number {
  let sum = 0;
  for (const joltage of joltages) {
    sum += joltage;
  }

  return sum;
}

if (import.meta.main) {
  const banks: number[][] = processInput("input.txt");
  const bankJoltages: number[] = banks.map(bank => findMaxBatteryCombination2(bank));

  console.log(calculateJoltageSum(bankJoltages))
}
