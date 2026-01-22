import { parseArgs } from "@std/cli/parse-args";
import { error } from "node:console";

const inputFile: string = parseArgs(Deno.args).file;

type dialState = {
    currentPosition: number, // Track the current position of the dial (from 0 to 99; default is middle = 50)
    zeroCounter: number // Counter for how many times the dial passed through 0
}

export function processInput(path: string = "../input.txt"): number[] {
    const inputString: string = Deno.readTextFileSync(path).trim();
    if (inputString.length == 0) {
        error("Input file is empty");
        return [];
    }

    // Array of all actions that will be completed
    const allActions: number[] = [];

    inputString.split('\n').forEach(thisActionString => {
        const thisAction = parseInt(thisActionString.slice(1)) * (thisActionString.charAt(0) === 'R' ? 1 : -1);
        allActions.push(thisAction);
    });

    return allActions;
}

export function evalAction(action: number, state: dialState): dialState {
    // Move the dial (direction depends on sign of thisAction)
    let newPosition = state.currentPosition + action;
    let newZeroCounter = state.zeroCounter;

    // If the dial is left pointing at 0, increment zeroCounter
    // if (newPosition % 100 == 0) { newZeroCounter++; }

    // God help whoever attempts to understand this
    // Count how many times dial passed *through* 0, add that many to zeroCounter

    // Conditionals for when dial is "overflowing, isn't currently at 0 and wasn't at 0 last action"
    if (newPosition > 99 || newPosition <= 0) {
        // increment zeroCounter (C++ style int division)
        const x: number = Math.trunc(newPosition / 100);
        // i don't know.
        newZeroCounter += (x == 0 ? 1 : Math.abs(x));
    }

    // "fix" position back to range (0, 99)
    newPosition = (newPosition % 100 + 100) % 100;

    return { currentPosition: newPosition, zeroCounter: newZeroCounter };
}

const actions = processInput(inputFile);

const state: dialState = { currentPosition: 50, zeroCounter: 0 }

actions.forEach(thisAction => {
    evalAction(thisAction, state);
});

console.log("The result is:", state.zeroCounter);