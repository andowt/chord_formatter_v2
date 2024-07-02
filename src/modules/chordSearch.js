const chordSharps = ['A#', 'C#', 'D#', 'F#', 'G#'];
const chordFlats = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
const chordNaturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const transposeSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const transposeFlat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

const base = '[A-G]';
const accidentals = '(b|#)?';
let types = ['major', 'minor', 'majmin', 'minmaj', 'maj', 'min', 'aug', 'dim', 'sus'];

// Accommodate for first letter capital ie maj -> Maj
const typesCapitalize = types.map(item => item.charAt(0).toUpperCase() + item.slice(1));
types = types.concat(typesCapitalize);
// Accommodate for all letter caps ie maj -> MAJ
const typesUpper = types.map(item => item.toUpperCase());
types = types.concat(typesUpper);
// Accommodate for short hand ie Am7 or BM7
types = types.concat(['m', 'M']);
types = '(' + types.join('|') + ')?';

const dominant = '\\d*';
const extensions = '((b\\d{1,2})|(#\\d{1,2}))*';

const formattedChordOptions = accidentals + types + dominant + extensions;
console.log("formattedChordOptions: %s", formattedChordOptions);
const formattedSingleChords = base + formattedChordOptions;
console.log("formattedSingleChord: %s", formattedSingleChords);
const formattedFullChords = '(' + formattedSingleChords + '(' + '[\\/]' + base + formattedChordOptions + ')?)';
console.log("formattedFullChords: %s", formattedFullChords);
const singleLetterChord1 = '(' + base + '\\s' + ')';
const singleLetterChord2 = '(' + base + '$' + ')';
const formattedAllOptions = '(' + [formattedFullChords, singleLetterChord1, singleLetterChord2].join('|') + ')';

function isChord(text) {
  const regex = new RegExp(formattedAllOptions);
  const match = text.match(regex);
  return match ? match[0].trim() : null;
}

module.exports = { isChord, chordSharps, chordFlats, chordNaturals, transposeSharp, transposeFlat, formattedAllOptions };
