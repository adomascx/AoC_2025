import { assertEquals } from "@std/assert";
import { processFileInput, type IdRange } from "./main.ts";
// 
Deno.test("processFileInput parses and sorts ranges correctly", () => {
  const testFilePath = "./test_input.txt";
  
  // Create a temporary test file
  Deno.writeTextFileSync(testFilePath, "5-7,1-4,3-6");
  
  const result: IdRange[] = processFileInput(testFilePath);
  
  assertEquals(result.length, 3);
  assertEquals(result[0], { lowerBound: 1, upperBound: 4 });
  assertEquals(result[1], { lowerBound: 3, upperBound: 6 });
  assertEquals(result[2], { lowerBound: 5, upperBound: 7 });
  
  // Cleanup
  Deno.removeSync(testFilePath);
});

Deno.test("processFileInput handles single range", () => {
  const testFilePath = "./test_input_single.txt";
  Deno.writeTextFileSync(testFilePath, "10-20");
  
  const result: IdRange[] = processFileInput(testFilePath);
  
  assertEquals(result.length, 1);
  assertEquals(result[0], { lowerBound: 10, upperBound: 20 });
  
  Deno.removeSync(testFilePath);
});

Deno.test("processFileInput maintains sort order with equal lower bounds", () => {
  const testFilePath = "./test_input_equal.txt";
  Deno.writeTextFileSync(testFilePath, "1-10,1-5,1-20");
  
  const result: IdRange[] = processFileInput(testFilePath);
  
  assertEquals(result.length, 3);
  assertEquals(result[0].lowerBound, 1);
  assertEquals(result[1].lowerBound, 1);
  assertEquals(result[2].lowerBound, 1);
  
  Deno.removeSync(testFilePath);
});
