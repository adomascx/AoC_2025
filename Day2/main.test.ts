import { assertEquals } from "@std/assert";
import { getFactors, sliceIntoSubstrings, processFileInput, findInvalidIds, getInvalidIdSum, main, type IdRange } from "./main.ts";

// getFactors

Deno.test("getFactors finds correct factors for small numbers", () => {
  assertEquals(getFactors(12), [1, 2, 3, 4, 6, 12]);
})

Deno.test("getFactors handles edge cases", () => {
  assertEquals(getFactors(1), [1]);
})

Deno.test("getFactors handles large numbers", () => {
  assertEquals(getFactors(123456), [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 192, 643, 1286, 1929, 2572, 3858, 5144, 7716, 10288, 15432, 20576, 30864, 41152, 61728, 123456]);
})

// sliceIntoSubstrings
Deno.test("sliceIntoSubstrings divides string into equal parts", () => {
  assertEquals(sliceIntoSubstrings("abcdef", 2), ["abc", "def"]);
});

Deno.test("sliceIntoSubstrings handles single substring", () => {
  assertEquals(sliceIntoSubstrings("hello", 1), ["hello"]);
});

Deno.test("sliceIntoSubstrings divides into three parts", () => {
  assertEquals(sliceIntoSubstrings("123456789", 3), ["123", "456", "789"]);
});

Deno.test("sliceIntoSubstrings handles empty string", () => {
  assertEquals(sliceIntoSubstrings("", 1), [""]);
});

// processFileInput
Deno.test("processFileInput sorts unordered ranges", () => {
  const tempFilePath = Deno.makeTempFileSync();
  try {
    Deno.writeTextFileSync(tempFilePath, "5-8,1-3,10-12");
    const ranges = processFileInput(tempFilePath);
    assertEquals(ranges, [
      { lowerBound: 1, upperBound: 3 },
      { lowerBound: 5, upperBound: 8 },
      { lowerBound: 10, upperBound: 12 },
    ]);
  } finally {
    Deno.removeSync(tempFilePath);
  }
});

Deno.test("processFileInput trims whitespace between ranges", () => {
  const tempFilePath = Deno.makeTempFileSync();
  try {
    Deno.writeTextFileSync(tempFilePath, "1-2, 4-5 ,7-9");
    const ranges = processFileInput(tempFilePath);
    assertEquals(ranges, [
      { lowerBound: 1, upperBound: 2 },
      { lowerBound: 4, upperBound: 5 },
      { lowerBound: 7, upperBound: 9 },
    ]);
  } finally {
    Deno.removeSync(tempFilePath);
  }
});

Deno.test("processFileInput handles single range", () => {
  const tempFilePath = Deno.makeTempFileSync();
  try {
    Deno.writeTextFileSync(tempFilePath, "42-99");
    const ranges = processFileInput(tempFilePath);
    assertEquals(ranges, [{ lowerBound: 42, upperBound: 99 }]);
  } finally {
    Deno.removeSync(tempFilePath);
  }
});

Deno.test("processFileInput parses example file correctly", () => {
  const ranges = processFileInput("input1.test.txt");
  assertEquals(ranges, [
    { lowerBound: 11, upperBound: 22 },
    { lowerBound: 95, upperBound: 115 },
    { lowerBound: 998, upperBound: 1012 },
    { lowerBound: 222220, upperBound: 222224 },
    { lowerBound: 446443, upperBound: 446449 },
    { lowerBound: 565653, upperBound: 565659 },
    { lowerBound: 1698522, upperBound: 1698528 },
    { lowerBound: 38593856, upperBound: 38593862 },
    { lowerBound: 824824821, upperBound: 824824827 },
    { lowerBound: 1188511880, upperBound: 1188511890 },
    { lowerBound: 2121212118, upperBound: 2121212124 },
  ]);
});

// findInvalidIds
Deno.test("findInvalidIds returns empty when no even-length ids", () => {
  const range: IdRange = { lowerBound: 1, upperBound: 10 };
  assertEquals(findInvalidIds(range), []);
});

Deno.test("findInvalidIds finds mirrored two-digit ids", () => {
  const range: IdRange = { lowerBound: 10, upperBound: 23 };
  assertEquals(findInvalidIds(range), [11, 22]);
});

Deno.test("findInvalidIds ignores upper bound and captures four-digit", () => {
  const range: IdRange = { lowerBound: 1000, upperBound: 1011 };
  assertEquals(findInvalidIds(range), [1010]);
});

Deno.test("findInvalidIds returns correct value for example file", () => {
  const idRanges: IdRange[] = processFileInput("input1.test.txt");
  const invalidIds: number[] = idRanges.flatMap(findInvalidIds);

  assertEquals(invalidIds, [11, 22, 99, 111, 999, 1010, 222222, 446446, 565656, 38593859, 824824824, 1188511885, 2121212121]);
})

// getInvalidSum
Deno.test("getInvalidIdSum returns zero for empty ranges", () => {
  assertEquals(getInvalidIdSum([]), 0);
});

Deno.test("getInvalidIdSum sums multiple invalid ids across ranges", () => {
  const ranges: IdRange[] = [
    { lowerBound: 10, upperBound: 23 },   // 11,22
    { lowerBound: 1000, upperBound: 1011 } // 1010
  ];
  assertEquals(getInvalidIdSum(ranges), 1043);
});

Deno.test("getInvalidIdSum returns zero when no invalid ids found", () => {
  const ranges: IdRange[] = [
    { lowerBound: 1, upperBound: 10 },
    { lowerBound: 1012, upperBound: 1015 },
  ];
  assertEquals(getInvalidIdSum(ranges), 0);
});

Deno.test("getInvalidIdSum returns correct value for example file", () => {
  const idRanges: IdRange[] = processFileInput("input1.test.txt");
  assertEquals(getInvalidIdSum(idRanges), 4174379265);
});

Deno.test("main returns correct value for example file", () => {
  assertEquals(main("input1.test.txt"), 4174379265);
})