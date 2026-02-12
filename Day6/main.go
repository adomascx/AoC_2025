package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

type Operation int

// since Go doesn't have enums, we have to do this terribleness
const (
	multiplication Operation = iota
	addition
)

func processInput(inputFile string) ([][]int, []Operation, error) {
	file, err := os.Open(inputFile)
	if err != nil {
		return nil, nil, err
	}
	defer file.Close()

	reader := bufio.NewReader(file)

	for {
		var token string
		_, err := fmt.Fscan(reader, &token)
		if err == io.EOF {
			break
		}

		if err != nil {
			return nil, nil, err
		}

	}

	return nil, nil, nil
}

func main() {
}
