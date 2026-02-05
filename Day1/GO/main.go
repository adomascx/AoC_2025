package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strconv"
)

type dialState struct {
	currentPosition int // Track the current position of the dial (from 0 to 99; default is middle = 50)
	zeroCounter     int // Counter for how many times the dial passed through 0
}

func parseInput(inputFile ...string) ([]int, error) {

	// handle default inputFile value "input.txt"
	var file string

	if len(inputFile) == 0 {
		file = "input.txt"
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

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		// scan the current row
		row := scanner.Text()

		var sign bool = row[0] == 'R'                    // choose sign based on direction
		uNumber, err := strconv.ParseUint(row[1:], 0, 0) // parse the rest of the number
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

func evalAction(action int, state dialState) (dialState, error) {
	// Move the dial (direction depends on sign of thisAction)
	newPosition := state.currentPosition + action
	newZeroCounter := state.zeroCounter

	// handle positive overflow
	if newPosition > 99 {
		// increment zeroCounter
		newZeroCounter += newPosition / 100
	}

	// handle negative overflow
	if newPosition <= 0 {
		// same as before, but reverse sign (-150 -> 150)
		newZeroCounter += (newPosition * -1) / 100

		// also add 1 if the dial wasn't at 0 previously
		if state.currentPosition != 0 {
			newZeroCounter++
		}
	}

	// "fix" position back to range (0, 99)
	newPosition = (newPosition%100 + 100) % 100

	return dialState{currentPosition: newPosition, zeroCounter: newZeroCounter}, nil
}

func main() {
	inputFile := flag.String("file", "../input.txt", "Path to the text file containing input data")
	flag.Parse()

	actions, err := parseInput(*inputFile)
	if err != nil {
		fmt.Println("Error:", err)
	}

	state := dialState{
		currentPosition: 50,
		zeroCounter:     0,
	}

	for _, action := range actions {
		state, err = evalAction(action, state)
		if err != nil {
			fmt.Println("Error:", err)
		}
	}

	fmt.Println("The result is:", state.zeroCounter)
}
