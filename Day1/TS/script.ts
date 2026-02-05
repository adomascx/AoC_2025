import { parseArgs } from "@std/cli/parse-args";
import { error } from "node:console";

const inputFile: string = parseArgs(Deno.args).file;

export type dialState = {
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

	// handle positive overflow
	if (newPosition > 99) {
		// increment zeroCounter (C++ style int division)
		newZeroCounter += Math.trunc(newPosition / 100);
	}

	// handle negative overflow
	if (newPosition <= 0) {
		// same as before, but reverse sign (-150 => 150)
		// also, conditional +1 (only if the dial wasn't at 0 previously)
		newZeroCounter += Math.trunc((newPosition * -1) / 100) + (state.currentPosition == 0 ? 0 : 1);
	}

	// "fix" position back to range (0, 99)
	newPosition = (newPosition % 100 + 100) % 100;

	return { currentPosition: newPosition, zeroCounter: newZeroCounter };
}

if (import.meta.main) {
	const actions: number[] = processInput(inputFile);

	let state: dialState = { currentPosition: 50, zeroCounter: 0 }

	actions.forEach(thisAction => {
		state = evalAction(thisAction, state);
	});

	console.log("The result is:", state.zeroCounter);
}