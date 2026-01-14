import fs from "node:fs";

const is: string = fs.readFileSync("../input.txt", "utf-8").trim();

// Split input string into array of substrings for each line
const allActionsString: string[] = is.split('\n');

// Array of all actions that will be completed
const allActions: number[] = [];

allActionsString.forEach(thisActionString => {
    const thisAction = parseInt(thisActionString.slice(1)) * (thisActionString.charAt(0) === 'R' ? 1 : -1);
    allActions.push(thisAction);
});

// Track the current position of the dial (from 0 to 99; default is middle = 50)
let currentPosition: number = 50;

// Counter for how many times the dial passed through 0
let zeroCounter: number = 0;

allActions.forEach(thisAction => {
    // Move the dial (direction depends on sign of thisAction)
    currentPosition += thisAction;

    // If the dial is left pointing at 0, increment zeroCounter
    if (currentPosition % 100 == 0) { zeroCounter++; }

    // God help whoever attempts to understand this
    // Count how many times dial passed *through* 0, add that many to zeroCounter
    // Conditionals for when dial is "overflowing, isn't currently at 0 and wasn't at 0 last action"
    const isOverflowing = currentPosition > 99 || currentPosition < 0;
    const isAtZeroNow = currentPosition % 100 === 0;
    const wasAtZeroBeforeAction = (currentPosition - thisAction) === 0;

    if (isOverflowing && !isAtZeroNow && !wasAtZeroBeforeAction) {
        // increment zeroCounter (C++ style int division)
        const x: number = Math.trunc(currentPosition / 100);
        // i don't know.
        zeroCounter += (x == 0 ? 1 : x);
    }

    // "fix" position back to range (0, 99)
    currentPosition = (currentPosition % 100 + 100) % 100;
});

console.log("The result is:", zeroCounter);