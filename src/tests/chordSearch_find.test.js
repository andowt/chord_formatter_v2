const { findChords } = require('../modules/chordSearch'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');

const testCases = [
    { input: 'A', expected: ['A'] },
    { input: 'A#', expected: ['A#'] },
    { input: 'Bm', expected: ['Bm'] },
    { input: 'AMaj', expected: ['AMaj'] },
    { input: 'BMinor', expected: ['BMinor'] },
    { input: 'CMajor', expected: ['CMajor'] },
    { input: 'Ab7', expected: ['Ab7'] },
    { input: 'Abb7', expected: ['Abb7'] },
    { input: 'Bm7', expected: ['Bm7'] },
    { input: 'A#7', expected: ['A#7'] },
    { input: 'Am7/Bb', expected: ['Am7/Bb'] },
    { input: 'Am7b5', expected: ['Am7b5'] },
    { input: 'Fm7#11', expected: ['Fm7#11'] },
    { input: 'Cmin7b5#11b9#13b12#2', expected: ['Cmin7b5#11b9#13b12#2'] },
    { input: 'Cminmaj7', expected: ['Cminmaj7'] },
    { input: 'Cheese', expected: null }, // No chord found, should return null
    { input: 'I am the highway', expected: null }, // No chord found, should return null
    { input: 'I Am the highway', expected: ['Am'] }, // Match found - Unavoidable False positive
    { input: 'On the road again', expected: null }, // No chord found, should return null
    { input: 'A man from kentucket', expected: ['A'] }, // Match found - Unavoidable False positive
    { input: 'Rebert E Lee', expected: ['E'] }, // No chord found, should return null
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', expected: ["Am", "BMaj7", "DMinor", "CbMajor", "A#"] },
    { input: 'Em     Em  Am  DMajor DMajor', expected: ["Em", "Em", "Am", "DMajor", "DMajor"]}
];


describe('Chord Finder Single Line Tests', () => {
    let passCount = 0;
    const totTests = testCases.length;

    testCases.forEach(({ input, expected }, index) => {
        test(`Test ${index}: ${input}`, () => {
            const result = findChords(input);
            expect(result).toEqual(expected); // Use toEqual for array comparison

            if (result && expected && result.length === expected.length && result.every((value, idx) => value === expected[idx])) {
                passCount += 1;
            } else if (!result && !expected) {
                passCount += 1;
            }
        });
    });

    afterAll(() => {
        console.log(`Tests completed - ${passCount}/${totTests} passed`);
    });
});

describe('Chord Finder File Test', () => {
    const filePath = path.join(__dirname, 'chordSheetSample.txt');
    test('Test 0: Chord Sheet Sample', () => {
        console.log("PATH: %s", filePath);
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log("FILE NOT FOUND");
            fail(`File not found at "${filePath}"`);
        }

        // Read the entire file into memory
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log("File Content:");
        console.log(fileContent);

        // Split the file content into an array of lines
        const lines = fileContent.split(/\r?\n/);

        const expected = [
            ['E', 'G#7'],
            ['F#m'],
            ['A', 'B7', 'E'],
            ['E', 'G#7', 'F#m', 'A', 'B7', 'E'],
            ['E', 'G#7', 'F#m', 'A', 'B7', 'E'],
            ['A', 'E'],
            ['A', 'E', 'B7']
        ]

        // Process each line
        let i = 0;
        for (const line of lines) {
            const chords = findChords(line);
            if (chords == null) continue;
            expect(chords).toEqual(expected[i++]);
        }

    });

    afterAll(() => {
        console.log(`Tests completed`);
    });
});
