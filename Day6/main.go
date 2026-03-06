package main

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Problem struct {
	numbers   []int64
	operation Operation
}

// since Go doesn't have enums, we create this
// as a slight memory optimization, 'Operation' is typed as bool (1 byte) instead of int (8 bytes)
type Operation bool

const (
	multiplication Operation = false
	addition       Operation = true
)

func transposeInputFile(inputFile string) error {
	file, err := os.Open(inputFile)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	var lines []string

	// read whole file into memory
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// pre-allocate memory for transposed text
	transposedLines := make([]string, len(lines[0]))

	// transpose into a new strings array
	for i := 0; i < len(lines)-1; i++ {
		for j := 0; j < len(lines[0]); j++ {
			transposedLines[j] += string(lines[i][j])
		}
	}

	// create and open new file
	file, err = os.OpenFile("transposedInput.txt", os.O_CREATE, 0644)
	if err != nil {
		return err
	}

	writer := bufio.NewWriter(file)

	for _, line := range transposedLines {
		writer.WriteString(line + "\n")
	}
	writer.WriteString(lines[len(lines)-1])

	return nil
}

func parseOperation(inputToken string) (Operation, error) {
	switch inputToken {

	case "*":
		return multiplication, nil

	case "+":
		return addition, nil

	default:
		return false, fmt.Errorf("could not parse operation %#v", inputToken)
	}
}

func readInput(inputFile string) ([]Problem, error) {

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
		fields := strings.Fields(scanner.Text())

		if lineIdx == 0 {
			// on first run, pre-allocate memory so 0 index doesn't throw 'out of range'
			problems = make([]Problem, len(fields))
		}

		// finds the last line indicated by the first symbol that is read, since the last line always contains 'operations'
		if fields[0] == "*" || fields[0] == "+" {
			// parse input fields
			for i, field := range fields {
				problems[i].operation, err = parseOperation(field)
				if err != nil {
					return nil, fmt.Errorf("could not do parseOperation(%#v):  %w", field, err)
				}
			}

			return problems, nil
		}

		// place each field into its respective problem,
		// so each problem's numbers are built up incrementally as lines are read
		for i, v := range fields {
			// parse input fields
			entryAsInt, err := strconv.ParseInt(v, 0, 0)
			if err != nil {
				return nil, fmt.Errorf("could not do ParseInt(%v):  %w", v, err)
			}

			problems[i].numbers = append(problems[i].numbers, entryAsInt)
		}

		lineIdx++
	}

	return nil, errors.New("readInput did not terminate at 'operations'")
}

func calculatePuzzleAnswer(problems []Problem) int64 {
	var problemSum int64

	for _, problem := range problems {
		switch problem.operation {

		case addition:
			for _, number := range problem.numbers {
				problemSum += number
			}

		case multiplication:
			var currAnswer int64 = 1

			for _, number := range problem.numbers {
				currAnswer *= number
			}

			problemSum += currAnswer
		}
	}
	return problemSum
}

func main() {
	inputFile := flag.String("f", "input.txt", "path to the input text file")
	part := flag.Int("pt", 1, "which part's answer to calculate (1|2)")
	flag.Parse()

	var answer int64

	switch *part {

	case 1:
		problems, err := readInput(*inputFile)
		if err != nil {
			log.Fatalf("could not do readInput():  %v", err)
		}

		answer = calculatePuzzleAnswer(problems)

	case 2:
		err := transposeInputFile(*inputFile)
		if err != nil {
			log.Fatalf("could not do transposeInputFile(): %v", err)
		}
		answer = 0

	default:
		log.Fatalf("Invalid 'part' chosen. Available options are '1' and '2'")
	}

	fmt.Printf("The answer to part %v is: %v", *part, answer)
}
