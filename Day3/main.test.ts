import { assertEquals } from "@std/assert";
import { findMaxBatteryCombination, calculateJoltageSum } from "./main.ts";

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
