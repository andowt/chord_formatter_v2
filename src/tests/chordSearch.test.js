const { isChord } = require('../modules/chordSearch'); // Adjust the path as necessary

const testCases = {
    'A':        'A',
    'Bm':       'Bm',
    'AMaj':     'AMaj',
    'BMinor':   'BMinor',
    'CMajor':   'CMajor',
    'Ab7':      'Ab7',
    'Abb7':     'Abb7',
    'Bm7':      'Bm7',
    'A#7':      'A#7',
    'Am7/Bb':   'Am7/Bb',
    'Am7b5':    'Am7b5',
    'Fm7#11':   'Fm7#11',
    'Cmin7b5#11b9#13b12#2': 'Cmin7b5#11b9#13b12#2',
    'Cminmaj7': 'Cminmaj7',
    'Cheese':   'C', // No chord found, should return null
    'I am the highway':     null, // No chord found, should return null
    'I Am the highway':     'Am', // Match found, should return 'Am'
    'On the road again':    null, // No chord found, should return null
    'A man from kentucket': 'A',
    'Rebert E Lee': 'E', // Should return 'E'
};

describe('Chord Finder Tests', () => {
    let passCount = 0;
    let totTests = 0;

    for (const [input, expected] of Object.entries(testCases)) {
        test(`Test ${totTests}: ${input}`, () => {
            const result = isChord(input);
            expect(result).toBe(expected);

            if (result === expected) {
                passCount += 1;
            }
            totTests += 1;
        });
    }

    afterAll(() => {
        console.log(`Tests completed - ${passCount}/${totTests} passed`);
    });
});
