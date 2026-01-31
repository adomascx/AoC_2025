export function processInput(inputFilePath: string): number[][] {

  const banks: number[][] = Deno.readTextFileSync(inputFilePath)
    .split('\r\n')
    .map(bank => {
      return bank.split('')
        .map(Number);
    });

  return banks;
}

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

export function calculateJoltageSum(joltages: number[]): number {
  let sum = 0;
  for (const joltage of joltages) {
    sum += joltage;
  }

  return sum;
}

if (import.meta.main) {
  const banks: number[][] = processInput("input.txt");
  const bankJoltages: number[] = banks.map(bank => findMaxBatteryCombination(bank));

  console.log(calculateJoltageSum(bankJoltages))
}
