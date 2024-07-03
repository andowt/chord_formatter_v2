const { transposeChords } = require('../modules/chordSearch'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path');

const testCases = [
    { input: 'A', steps: 0, expected: 'A' },
    { input: 'A', steps: 1, expected: 'Bb' },
    { input: 'A', steps: -1, expected: 'G#' },
    { input: 'C', steps: 2, expected: 'D' },
    { input: 'G', steps: -2, expected: 'F' },
    { input: 'D#', steps: 3, expected: 'F#' },
    { input: 'Eb', steps: -3, expected: 'C' },
    { input: 'F#', steps: 4, expected: 'Bb' },
    { input: 'Gb', steps: -4, expected: 'D' },
    { input: 'Bb', steps: 5, expected: 'Eb' },
    { input: 'Db', steps: -5, expected: 'G#' },
    { input: 'E', steps: 6, expected: 'Bb' },
    { input: 'F', steps: -6, expected: 'B' },
    { input: 'A#', steps: 7, expected: 'F' },
    { input: 'Cb', steps: 8, expected: 'G' },
    { input: 'Fb', steps: 9, expected: 'C#' },
    { input: 'E#', steps: 10, expected: 'Eb' },
    { input: 'B#', steps: 11, expected: 'B' },
    { input: 'G#', steps: 12, expected: 'G#' },
    { input: 'Ab', steps: -12, expected: 'G#' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: 0, expected: 'Am   BMaj7    DMinor  BMajor  Bb' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: 12, expected: 'Am   BMaj7    DMinor  BMajor  Bb' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: -12, expected: 'Am   BMaj7    DMinor  BMajor  Bb' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: 1, expected: 'Bbm   CMaj7    EbMinor  CMajor  B' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: -1, expected: 'G#m   BbMaj7    C#Minor  BbMajor  A' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: 2, expected: 'Bm   C#Maj7    EMinor  C#Major  C' },
    { input: 'Am   BMaj7    DMinor  CbMajor  A#', steps: -2, expected: 'Gm   AMaj7    CMinor  AMajor  G#' },
    { input: 'Cmaj7  Dm7  G7  E7  A', steps: 5, expected: 'Fmaj7  Gm7  C7  A7  D' },
    { input: 'Cmaj7  Dm7  G7  E7  A', steps: -3, expected: 'Amaj7  Bm7  E7  C#7  F#' },
    { input: 'Bb7  Ebm7  Ab7  Dbmaj7  Gbmaj7', steps: 1, expected: 'B7  Em7  A7  Dmaj7  Gmaj7' },
    { input: 'Bb7  Ebm7  Ab7  Dbmaj7  Gbmaj7', steps: -1, expected: 'A7  Dm7  G7  Cmaj7  Fmaj7' },
    { input: 'F#m7  B7  Emaj7  Amaj7  Dmaj7', steps: 4, expected: 'Bbm7  Eb7  G#maj7  C#maj7  F#maj7' },
    { input: 'F#m7  B7  Emaj7  Amaj7  Dmaj7', steps: -5, expected: 'C#m7  F#7  Bmaj7  Emaj7  Amaj7' },
    { input: 'G   C   D   Am   Em', steps: 7, expected: 'D   G   A   Em   Bm' },
    { input: 'G   C   D   Am   Em', steps: -7, expected: 'C   F   G   Dm   Am' },
    { input: 'Dbmaj7  Gb7  Bmaj7  Emaj7  A#m7', steps: 2, expected: 'Ebmaj7  G#7  C#maj7  F#maj7  Cm7' },
    { input: 'Dbmaj7  Gb7  Bmaj7  Emaj7  A#m7', steps: -2, expected: 'Bmaj7  E7  Amaj7  Dmaj7  G#m7' },
    { input: 'Ebm9  Ab13  Dbmaj9  Gbmaj9  C7b9', steps: 3, expected: 'F#m9  B13  Emaj9  Amaj9  Eb7b9' },
    { input: 'Ebm9  Ab13  Dbmaj9  Gbmaj9  C7b9', steps: -3, expected: 'Cm9  F13  Bbmaj9  Ebmaj9  A7b9' },
    //{ input: 'e#7 a  d   em9', steps: 0, expected: 'F7 A  D   Em9'}
];

describe('Chord Transposer Tests', () => {
    let passCount = 0;
    const totTests = testCases.length;

    testCases.forEach(({ input, steps, expected }, index) => {
        test(`Test ${index}: transpose(${steps}) - ${input}`, () => {
            const result = transposeChords(input, steps);
            expect(result).toEqual(expected); // Use toEqual for string comparison

            if (result === expected) {
                passCount += 1;
            }
        });
    });

    afterAll(() => {
        console.log(`Tests completed - ${passCount}/${totTests} passed`);
    });
});
