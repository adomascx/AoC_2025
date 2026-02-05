import { assertEquals } from "@std/assert";
import { processInput, evalAction, type dialState } from "./script.ts";

// Helper to mock Deno.readTextFileSync
function mockReadTextFileSync(mockReturn: string) {
	// @ts-ignore: Deno is a global runtime object, mocking it for testing purposes
	Object.defineProperty(Deno, 'readTextFileSync', {
		value: (_: string | URL) => mockReturn,
		writable: true,
		configurable: true
	});
}

// Helper to mock the main script's full execution
function mockProgramRuntime(inputFile: string): dialState {
	const actions: number[] = processInput(inputFile);

	let state: dialState = { currentPosition: 50, zeroCounter: 0 }

	actions.forEach(thisAction => {
		state = evalAction(thisAction, state);
	});

	return state;
}

Deno.test("processInput parses single right action", () => {
	mockReadTextFileSync("R10");
	const result = processInput("dummy.txt");
	assertEquals(result, [10]);
});

Deno.test("processInput parses single left action", () => {
	mockReadTextFileSync("L5");
	const result = processInput("dummy.txt");
	assertEquals(result, [-5]);
});

Deno.test("processInput parses multiple actions", () => {
	mockReadTextFileSync("R10\nL20\nR30");
	const result: number[] = processInput("dummy.txt");
	assertEquals(result, [10, -20, 30]);
});

Deno.test("processInput handles empty file", () => {
	mockReadTextFileSync("");
	const result: number[] = processInput("dummy.txt");
	assertEquals(result, []);
});

Deno.test("evalAction does not change state for small movements", () => {
	const state: dialState = { currentPosition: 50, zeroCounter: 0 };
	const result: dialState = evalAction(10, state);
	assertEquals(result.currentPosition, 60);
	assertEquals(result.zeroCounter, 0);
});

Deno.test("evalAction increments zeroCounter when landing on 0", () => {
	const state: dialState = { currentPosition: 10, zeroCounter: 0 };
	const result: dialState = evalAction(-10, state);
	assertEquals(result.currentPosition, 0);
	assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction wraps position correctly on overflow", () => {
	const state: dialState = { currentPosition: 90, zeroCounter: 0 };
	const result: dialState = evalAction(20, state);
	assertEquals(result.currentPosition, 10);
	assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction wraps position correctly on underflow", () => {
	const state: dialState = { currentPosition: 10, zeroCounter: 0 };
	const result: dialState = evalAction(-20, state);
	assertEquals(result.currentPosition, 90);
	assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction doesn't add to zeroCounter when dial is already at 0", () => {
	const state: dialState = { currentPosition: 0, zeroCounter: 0 };
	const result: dialState = evalAction(-5, state);
	assertEquals(result.currentPosition, 95);
	assertEquals(result.zeroCounter, 0);
})

Deno.test("evalAction counts zero crossings on large positive overflow", () => {
	const state: dialState = { currentPosition: 50, zeroCounter: 0 };
	const result: dialState = evalAction(150, state);
	assertEquals(result.currentPosition, 0);
	assertEquals(result.zeroCounter, 2);
});

Deno.test("evalAction counts zero crossings on large negative underflow", () => {
	const state: dialState = { currentPosition: 50, zeroCounter: 0 };
	const result: dialState = evalAction(-150, state);
	assertEquals(result.currentPosition, 0);
	assertEquals(result.zeroCounter, 2);
});

Deno.test("evalAction handles extremely large positive overflow", () => {
	const state: dialState = { currentPosition: 50, zeroCounter: 0 };
	const result: dialState = evalAction(20000, state);
	assertEquals(result.currentPosition, 50);
	assertEquals(result.zeroCounter, 200);
})

Deno.test("evalAction preserves existing zeroCounter", () => {
	const state: dialState = { currentPosition: 50, zeroCounter: 5 };
	const result: dialState = evalAction(10, state);
	assertEquals(result.zeroCounter, 5);
});

Deno.test("full program calculates correct result for 'test_input'", () => {
	const inputFile: string = "../test_input.txt";
	const result: dialState = mockProgramRuntime(inputFile);
	assertEquals(result.currentPosition, 32);
	assertEquals(result.zeroCounter, 6);
})

Deno.test("full program calculates correct result for 'test_input2'", () => {
	const inputFile: string = "../test_input2.txt";
	const result: dialState = mockProgramRuntime(inputFile);
	assertEquals(result.currentPosition, 70);
	assertEquals(result.zeroCounter, 1);
})

Deno.test("full program calculates correct result for 'input'", () => {
	const inputFile: string = "../input.txt";
	const result: dialState = mockProgramRuntime(inputFile);
	assertEquals(result.zeroCounter, 6122);
})