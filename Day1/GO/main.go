package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func parseInput(inputFile ...string) ([]int, error) {

	// handle default inputFile value "../input.txt"
	var file string

	if len(inputFile) == 0 {
		file = "../input.txt"
	} else {
		file = inputFile[0]
	}

	// open input file for reading
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// parse the input into dialActions array
	var dialActions []int

	/*
		for (until EOF):
			var row string = readRow()
			var sign bool = (row[0] == 'R')
			var number uint = parseUint(row[1:])
			dialActions.push(sign ? number : number * -1)
	*/

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		// scan the current row
		row := scanner.Text()

		var sign bool = row[0] == 'R'                     // choose sign based on direction
		uNumber, err := strconv.ParseUint(row[1:], 10, 8) // parse the rest of the number
		if err != nil {
			return nil, err
		}

		// apply sign
		sNumber := int(uNumber)
		if sign == false {
			sNumber *= -1
		}

		dialActions = append(dialActions, sNumber)
	}

	return dialActions, nil
}

func main() {
	fmt.Println(parseInput())
}
