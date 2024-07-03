const { findChords } = require('../modules/chordSearch'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');

const testCases = [
    { 
        input: 'A', 
        expected: {
            found: ['A'],
            normal: ['A']
        }
    },
    { 
        input: 'A#', 
        expected: {
            found: ['A#'],
            normal: ['A#']
        }
    },
    { 
        input: 'Cb', 
        expected: {
            found: ['Cb'],
            normal: ['B']
        }
    },
    { 
        input: 'e#', 
        expected: {
            found: ['e#'],
            normal: ['F']
        }
    },
    { 
        input: 'Bm', 
        expected: {
            found: ['Bm'],
            normal: ['Bm']
        }
    },
    { 
        input: 'AMaj', 
        expected: {
            found: ['AMaj'],
            normal: ['AMaj']
        }
    },
    { 
        input: 'BMinor', 
        expected: {
            found: ['BMinor'],
            normal: ['BMinor']
        }
    },
    { 
        input: 'CMajor', 
        expected: {
            found: ['CMajor'],
            normal: ['CMajor']
        }
    },
    { 
        input: 'Ab7', 
        expected: {
            found: ['Ab7'],
            normal: ['Ab7']
        }
    },
    { 
        input: 'Abb7', 
        expected: {
            found: ['Abb7'],
            normal: ['Abb7']
        }
    },
    { 
        input: 'Bm7', 
        expected: {
            found: ['Bm7'],
            normal: ['Bm7']
        }
    },
    { 
        input: 'A#7', 
        expected: {
            found: ['A#7'],
            normal: ['A#7']
        }
    },
    { 
        input: 'Am7/Bb', 
        expected: {
            found: ['Am7/Bb'],
            normal: ['Am7/Bb']
        }
    },
    { 
        input: 'Am7b5', 
        expected: {
            found: ['Am7b5'],
            normal: ['Am7b5']
        }
    },
    { 
        input: 'Fm7#11', 
        expected: {
            found: ['Fm7#11'],
            normal: ['Fm7#11']
        }
    },
    { 
        input: 'Cminmaj7', 
        expected: {
            found: ['Cminmaj7'],
            normal: ['Cminmaj7']
        }
    },
    { 
        input: 'Cheese', 
        expected: {
            found: null,
            normal: null
        }
    },
    { 
        input: 'I am the highway', 
        expected: {
            found: null,
            normal: null,
        }
    },
    { 
        input: 'I Am the highway', 
        expected: {
            found: null,
            normal: null,
        }
    },
    { 
        input: 'On the road again', 
        expected: {
            found: null,
            normal: null
        }
    },
    { 
        input: 'A man from kentucket', 
        expected: {
            found: null, // Match found - Unavoidable False positive
            normal: null, // Match found - Unavoidable False positive
        }
    },
    { 
        input: 'Robert E Lee', 
        expected: {
            found: null, // No chord found, should return null
            normal: null, // No chord found, should return null
        }
    },
    { 
        input: 'Am   BMaj7    DMinor  CbMajor  A#', 
        expected: {
            found: ["Am", "BMaj7", "DMinor", "CbMajor", "A#"],
            normal: ["Am", "BMaj7", "DMinor", "BMajor", "A#"]
        }
    },
    { 
        input: 'Cmin7b5#11b9#13b12#2', 
        expected: {
            found: ['Cmin7b5#11b9#13b12#2'],
            normal: ['Cmin7b5#11b9#13b12#2']
        }
    },
    { 
        input: 'Em     Em  Am  DMajor DMajor', 
        expected: {
            found: ["Em", "Em", "Am", "DMajor", "DMajor"],
            normal: ["Em", "Em", "Am", "DMajor", "DMajor"]
        }
    },
    { 
        input: 'e#7 a  d   em9', 
        expected: {
            found: ['e#7', 'a', 'd', 'em9'],
            normal: ['F7', 'A', 'D', 'Em9']
        }
    },
    {
        input: '[INTRO] Am D7  eb5',
        expected: {
            found: ['Am', 'D7', 'eb5'],
            normal: ['Am', 'D7', 'Eb5']
        }
    },
    {
        input: '[INTRO] Am D7  eb5 X3',
        expected: {
            found: ['Am', 'D7', 'eb5'],
            normal: ['Am', 'D7', 'Eb5']
        }
    }
];


describe('Chord Finder Single Line Tests', () => {
    let passCount = 0;
    const totTests = testCases.length;

    testCases.forEach(({ input, expected }, index) => {
        test(`Test ${index}: ${input}`, () => {
            const [result, normal] = findChords(input);
            expect(result).toEqual(expected?.found); // Use expected.found for array comparison
            expect(normal).toEqual(expected?.normal);

            if (
                result &&
                expected &&
                result.length === expected.found.length &&
                result.every((value, idx) => value === expected.found[idx]) &&
                normal &&
                expected.normal &&
                normal.length === expected.normal.length &&
                normal.every((value, idx) => value === expected.normal[idx])
            ) {
                passCount += 1;
            } else if (!result && !expected.found && !normal && !expected.normal) {
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
        
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log("FILE NOT FOUND");
            fail(`File not found at "${filePath}"`);
        }

        // Read the entire file into memory
        const fileContent = fs.readFileSync(filePath, 'utf8');

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
            const [chords, normal] = findChords(line);
            if (chords == null) continue;
            expect(chords).toEqual(expected[i++]);
        }

    });

    afterAll(() => {
        console.log(`Tests completed`);
    });
});
