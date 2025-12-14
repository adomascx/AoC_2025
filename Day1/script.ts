const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf-8');
const lines = input.split('\n').filter(l => l.trim());

let position: number = 0;

