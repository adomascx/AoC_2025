package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
)

type idRange struct {
	start int
	end   int
}

func readInputFile(inputFile ...string) ([]idRange, []int, error) {
	// handle default inputFile value "input.txt"
	var file string

	if len(inputFile) == 0 {
		file = "input.txt"
	} else {
		file = inputFile[0]
	}

	// Open input file
	f, err := os.Open(file)
	if err != nil {
		return nil, nil, err
	}

	scanner := bufio.NewScanner(f)
	scanner.Scan()
	fmt.Println(scanner.Text())

	return nil, nil, nil
}

func main() {
	inputFile := flag.String("file", "input.txt", "Defines the file used for input data")
	fmt.Println(inputFile)
	_, _, err := readInputFile(*inputFile)
	if err != nil {
		fmt.Println("Error:", err)
	}
}
