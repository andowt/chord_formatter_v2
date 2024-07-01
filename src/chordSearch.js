const chordSharps = ['A#', 'C#', 'D#', 'F#', 'G#'];
const chordFlats = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
const chordNaturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const transposeSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const transposeFlat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

const base = '[A-G]';
const accidentals = '(b|#)';

let types = ['maj', 'min', 'aug', 'dim', 'sus'];
const typesCapitalize = types.map(item => item.charAt(0).toUpperCase() + item.slice(1));
types = types.concat(typesCapitalize);
const typesUpper = types.map(item => item.toUpperCase());
types = types.concat(typesUpper);
types = types.concat(['m', 'M']);
types = '(' + types.join('|') + ')';

const dominant = '[\\d]';
const extensions = '((b\\d{1,2})|(#\\d{1,2}))';

const formattedChordOptions = accidentals + '{0,2}(' + types + '{1,2}|' + dominant + '{1,2})' + extensions + '{0,}';
const formattedSingleChord = base + '{1}' + formattedChordOptions;
const formattedFullChords = '(' + formattedSingleChord + '(' + '[\\/]' + base + formattedChordOptions + ')?)';
const singleLetterChord1 = '(' + base + '\\s' + ')';
const singleLetterChord2 = '(' + base + '$' + ')';
const formattedAllOptions = '(' + [formattedFullChords, singleLetterChord1, singleLetterChord2].join('|') + ')';

function isChord(text) {
  const regex = new RegExp(formattedAllOptions);
  return regex.test(text);
}

module.exports = { isChord, chordSharps, chordFlats, chordNaturals, transposeSharp, transposeFlat, formattedAllOptions };
