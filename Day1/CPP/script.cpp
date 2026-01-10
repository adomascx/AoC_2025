#include <iostream>
#include <fstream>
#include <chrono>

using namespace std;

const string INPUT_FILE = "../input.txt";

int getAction(string inputString)
{
    // Inputs
    bool directionIsRight = inputString[0] == 'R' ? true : false;
    int degree = stoi(inputString.substr(1, inputString.length() - 1));

    // Return relative positional change (right is +, left is -)
    return (directionIsRight ? degree : degree * -1);
}

int main()
{
    
    // Track total rotational change (how much to the RIGHT)
    int currentPosition = 50;
    
    // Track how many times the dial reached position '0'
    int zerosEncountered = 0;
    
    auto start = chrono::steady_clock::now();
    
    // Main loop
    ifstream fin(INPUT_FILE);
    string inputString;
    while (fin >> inputString)
    {
        currentPosition += getAction(inputString);
        if (currentPosition % 100 == 0)
            zerosEncountered++;
    }

    auto end = chrono::steady_clock::now();

    cout << "The code is: " << zerosEncountered << endl << "Time taken: " << chrono::duration<double, milli>(end - start).count() << " ms";

    return 0;
}