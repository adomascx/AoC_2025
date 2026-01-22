import { assertEquals } from "@std/assert";
import { processInput, evalAction } from "./script.ts";

// Helper to mock Deno.readTextFileSync
function mockReadTextFileSync(mockReturn: string) {
    // @ts-ignore: Deno is a global runtime object, mocking it for testing purposes
    Object.defineProperty(Deno, 'readTextFileSync', {
        value: (_: string | URL) => mockReturn,
        writable: true,
        configurable: true
    });
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
    const result = processInput("dummy.txt");
    assertEquals(result, [10, -20, 30]);
});

Deno.test("processInput handles empty file", () => {
    mockReadTextFileSync("");
    const result = processInput("dummy.txt");
    assertEquals(result, []);
});

Deno.test("evalAction does not change state for small movements", () => {
    const state = { currentPosition: 50, zeroCounter: 0 };
    const result = evalAction(10, state);
    assertEquals(result.currentPosition, 60);
    assertEquals(result.zeroCounter, 0);
});

Deno.test("evalAction increments zeroCounter when landing on 0", () => {
    const state = { currentPosition: 10, zeroCounter: 0 };
    const result = evalAction(-10, state);
    assertEquals(result.currentPosition, 0);
    assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction wraps position correctly on overflow", () => {
    const state = { currentPosition: 90, zeroCounter: 0 };
    const result = evalAction(20, state);
    assertEquals(result.currentPosition, 10);
    assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction wraps position correctly on underflow", () => {
    const state = { currentPosition: 10, zeroCounter: 0 };
    const result = evalAction(-20, state);
    assertEquals(result.currentPosition, 90);
    assertEquals(result.zeroCounter, 1);
});

Deno.test("evalAction counts zero crossings on large positive overflow", () => {
    const state = { currentPosition: 50, zeroCounter: 0 };
    const result = evalAction(150, state);
    assertEquals(result.currentPosition, 0);
    assertEquals(result.zeroCounter, 2);
});

Deno.test("evalAction counts zero crossings on large negative underflow", () => {
    const state = { currentPosition: 50, zeroCounter: 0 };
    const result = evalAction(-150, state);
    assertEquals(result.currentPosition, 0);
    assertEquals(result.zeroCounter, 2);
});

Deno.test("evalAction handles extremely large positive overflow", () => {
    const state = { currentPosition: 50, zeroCounter: 0 };
    const result = evalAction(20000, state);
    assertEquals(result.currentPosition, 50);
    assertEquals(result.zeroCounter, 200);
})

Deno.test("evalAction preserves existing zeroCounter", () => {
    const state = { currentPosition: 50, zeroCounter: 5 };
    const result = evalAction(10, state);
    assertEquals(result.zeroCounter, 5);
});
