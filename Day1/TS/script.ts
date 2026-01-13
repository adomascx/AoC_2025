import fs from "fs";

const is: string = fs.readFileSync("../input.txt", "utf-8").trim();

// A single action/rotation of the dial. Corresponds to one line in the text file. contains:
// direction (R/L)
// degree (a uint)
type action = {
    direction: "R" | "L";
    degree: number;
}

// Split input string into array of substrings for each line
const allActionsString: string[] = is.split('\n');

// Array of all actions that will be completed
const allActions: action[] = [];

allActionsString.forEach(thisActionString => {

    let thisAction: action = {
        direction: thisActionString.charAt(0) as "R" | "L",
        degree: parseInt(thisActionString.slice(1))
    };

    allActions.push(thisAction);
});

