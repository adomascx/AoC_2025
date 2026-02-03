import { assertEquals } from "@std/assert";
import { countNeighbours, findAccessibleRolls, type coordinates } from "./main.ts";


Deno.test("countNeighbours - no neighbours", () => {
    const matrix: boolean[][] = [
        [false, false, false],
        [false, true, false],
        [false, false, false]
    ];
    const coords: coordinates = { x: 1, y: 1 };

    assertEquals(countNeighbours(matrix, coords), 0);
});

Deno.test("countNeighbours - all neighbours present", () => {
    const matrix: boolean[][] = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
    ];
    const coords: coordinates = { x: 1, y: 1 };

    assertEquals(countNeighbours(matrix, coords), 8);
});

Deno.test("countNeighbours - corner element", () => {
    const matrix: boolean[][] = [
        [true, true],
        [true, false]
    ];
    const coords: coordinates = { x: 1, y: 1 };

    assertEquals(countNeighbours(matrix, coords), 3);
});

Deno.test("countNeighbours - edge element", () => {
    const matrix: boolean[][] = [
        [true, true, true],
        [true, false, true],
        [false, false, false]
    ];
    const coords: coordinates = { x: 0, y: 1 };

    assertEquals(countNeighbours(matrix, coords), 4);
});
Deno.test("findAccessibleRolls - accessible edge rolls", () => {
    const matrix: boolean[][] = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
    ];
    const expectedResult: coordinates[] = [
        { x: 0, y: 0 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
        { x: 2, y: 2 }
    ]

    assertEquals(findAccessibleRolls(matrix).length, 4);
    assertEquals(findAccessibleRolls(matrix), expectedResult);
});

Deno.test("findAccessibleRolls - all rolls accessible", () => {
    const matrix: boolean[][] = [
        [true, true],
        [true, true]
    ];

    const expectedResult: coordinates[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 }
    ]

    assertEquals(findAccessibleRolls(matrix).length, 4);
    assertEquals(findAccessibleRolls(matrix), expectedResult);
});

Deno.test("findAccessibleRolls - mixed accessibility", () => {
    const matrix: boolean[][] = [
        [true, true, false],
        [true, false, false],
        [false, false, false]
    ];

    const expectedResult: coordinates[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 }
    ]

    assertEquals(findAccessibleRolls(matrix).length, 3);
    assertEquals(findAccessibleRolls(matrix), expectedResult);
});

Deno.test("findAccessibleRolls - single roll matrix", () => {
    const matrix: boolean[][] = [[true]];

    assertEquals(findAccessibleRolls(matrix).length, 1);
    assertEquals(findAccessibleRolls(matrix)[0], { x: 0, y: 0 });
});
