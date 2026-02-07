package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
)

type IdRange struct {
	start uint64
	end   uint64
}

// altered implementation of indexOf for finding the '-' symbol in a range string
// e.g., in the string "111-222", the function returns the index "3"
func indexOfDash(s string) (int, error) {
	for idx, thisc := range s {
		if thisc == '-' {
			return idx, nil
		}
	}
	return -1, fmt.Errorf("could not find idx of string: %v", s)
}

// process input data from a text file into structured data
func readInputFile(file string) ([]IdRange, []uint64, error) {

	// Open input file for reading
	f, err := os.Open(file)
	if err != nil {
		return nil, nil, err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)

	ranges := []IdRange{}
	ids := []uint64{}

	var line string

	// iterate over the ranges first
	for scanner.Scan() {

		line = scanner.Text()
		// stop reading ranges if the delimiter char is reached
		if line == "" {
			break
		}

		// find idx of dash
		idx, err := indexOfDash(line)
		if err != nil {
			return nil, nil, fmt.Errorf("could not do indexOfDash(): %w", err)
		}

		// put values around dash into an IdRange, then push to main array
		start, err := strconv.ParseUint(line[:idx], 0, 0)
		if err != nil {
			return nil, nil, fmt.Errorf("could not do ParseUint(start): %w", err)
		}

		end, err := strconv.ParseUint(line[idx+1:], 0, 0)
		if err != nil {
			return nil, nil, fmt.Errorf("could not do ParseUint(end): %w", err)
		}

		ranges = append(ranges, IdRange{start, end})

	}

	// then, iterate over ids
	for scanner.Scan() {
		id, err := strconv.ParseUint(scanner.Text(), 0, 0)
		if err != nil {
			return nil, nil, fmt.Errorf("could not do ParseUint(id): %w", err)
		}

		// directly push each one to array
		ids = append(ids, id)
	}

	return ranges, ids, nil
}

func findValidIds(sortedRanges []IdRange, ids []uint64) ([]uint64, error) {
	var validIds []uint64

	// iterate over ids
	for _, id := range ids {

		// for each id, check if id is valid
		for _, r := range sortedRanges {

			// if id is valid, push it and move onto checking the next id
			// else, try with next id range
			if id >= r.start && id <= r.end {
				validIds = append(validIds, id)
				break
			}
		}
	}

	if len(validIds) == 0 {
		return nil, fmt.Errorf("could not find any valid ids")
	}

	return validIds, nil
}

func main() {
	// Optionally use commandline arg for input file
	inputFile := flag.String("f", "input.txt", "Defines the file used for input data")
	flag.Parse()

	ranges, ids, err := readInputFile(*inputFile)
	if err != nil {
		log.Printf("could not do readInputFile(): %v", err)
	}

	sort.Slice(ranges, func(i, j int) bool { return ranges[i].start < ranges[j].start })

	validIds, err := findValidIds(ranges, ids)
	if err != nil {
		log.Printf("could not do findValidIds(): %v", err)
	}

	fmt.Println(len(validIds))
}
