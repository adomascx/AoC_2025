import { assertEquals } from "@std/assert";
import { findMaxBatteryCombination2, findMaxBatteryCombination, calculateJoltageSum } from "./main.ts";

Deno.test("findMaxBatteryCombination finds correct max 2-digit number", () => {
  assertEquals(findMaxBatteryCombination([1, 2, 3]), 23); // 2 and 3
  assertEquals(findMaxBatteryCombination([9, 1, 5, 2]), 95); // 9 and 5
  assertEquals(findMaxBatteryCombination([1, 1, 1, 2]), 12); // 1 and 2
  assertEquals(findMaxBatteryCombination([5, 4, 3, 2]), 54); // 5 and 4
  assertEquals(findMaxBatteryCombination([2, 9, 8, 7]), 98); // 9 and 8
});

Deno.test("findMaxBatteryCombination handles repeated max digits", () => {
  assertEquals(findMaxBatteryCombination([7, 7, 7]), 77);
  assertEquals(findMaxBatteryCombination([8, 8, 1]), 88);
});

Deno.test("calculateJoltageSum sums up all joltages", () => {
  assertEquals(calculateJoltageSum([1, 2, 3]), 6);
  assertEquals(calculateJoltageSum([10, 20, 30]), 60);
  assertEquals(calculateJoltageSum([]), 0);
  assertEquals(calculateJoltageSum([42]), 42);
});

Deno.test("findMaxBatteryCombination2 finds correct max combination with default 12 digits", () => {
  assertEquals(findMaxBatteryCombination2([9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 9, 8]), 987654321198);
  assertEquals(findMaxBatteryCombination2([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 2]), 123456789112);
});

Deno.test("findMaxBatteryCombination2 finds correct max combination with custom digit count", () => {
  assertEquals(findMaxBatteryCombination2([9, 1, 5, 2], 2), 95);
  assertEquals(findMaxBatteryCombination2([1, 2, 3, 4, 5], 3), 345);
  assertEquals(findMaxBatteryCombination2([5, 4, 3, 2, 1], 2), 54);
});

Deno.test("findMaxBatteryCombination2 handles repeated digits", () => {
  assertEquals(findMaxBatteryCombination2([7, 7, 7, 7], 2), 77);
  assertEquals(findMaxBatteryCombination2([9, 9, 1, 1, 1], 3), 991);
});

Deno.test("findMaxBatteryCombination2 handles single digit request", () => {
  assertEquals(findMaxBatteryCombination2([1, 2, 3], 1), 3);
  assertEquals(findMaxBatteryCombination2([5, 4, 3, 2], 1), 5);
});

Deno.test("findMaxBatteryCombination2 handles edge case with zeros", () => {
  assertEquals(findMaxBatteryCombination2([0, 0, 0, 0], 2), 0);
  assertEquals(findMaxBatteryCombination2([9, 1, 8, 1], 2), 98);
});
