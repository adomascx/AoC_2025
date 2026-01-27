import { assertEquals } from "@std/assert";
import { getInvalidIdSum, findInvalidIds, processFileInput, type IdRange } from "./main.ts";

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