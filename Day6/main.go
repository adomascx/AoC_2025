package main

import (
	"bufio"
	"os"
	"strconv"
	"strings"
)

type Problem struct {
	numbers   []int
	operation Operation
}

type Operation int

// since Go doesn't have enums, we have to do this terribleness
const (
	multiplication Operation = iota
	addition
)

func processInput(inputFile string) ([]Problem, error) {

	// open input file for reading
	file, err := os.Open(inputFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var problems []Problem

	scanner := bufio.NewScanner(file)

	// keep an index of which line of the file is currently being read
	lineIdx := 0

	for scanner.Scan() {

		// read all space-separated values on this line
		entries := strings.Fields(scanner.Text())

		for i, v := range entries {
			entryAsInt, _ := strconv.ParseInt(v)
			problems[i].numbers[lineIdx] = append(problems[i].numbers[lineIdx], entryAsInt)
		}
		lineIdx++
	}

	return nil, nil
}

func main() {

	processInput("input.test.txt")
}
