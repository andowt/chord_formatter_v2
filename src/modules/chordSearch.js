const chordSharps = ['A#', 'C#', 'D#', 'F#', 'G#'];
const chordFlats = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
const chordNaturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const transposeSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const transposeFlat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

const base = '[A-G]';
const accidentals = '(bb|b|#)?';  // Ensure 'bb' is checked before 'b'
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
const formattedSingleChords = base + formattedChordOptions;
const formattedFullChords = formattedSingleChords + '(\\/(' + base + formattedChordOptions + '))?';
const formattedAllOptions = '(' + formattedFullChords + '(?=\\s|$)' + ')';
console.log("formattedAllOptions: %s", formattedAllOptions);

function findChords(text) {
  const regex = new RegExp(formattedAllOptions, 'g'); // Use 'g' flag for global matching
  let match = text.match(regex);
  return match && match.length > 0 ? match : null;
}

function markChords(text, leftStr, rightStr) {
  result = text;
  if(findChords(text) != null)
  {
  const regex = new RegExp(formattedAllOptions, 'g'); // Use 'g' flag for global matching
  // Replace each match with the surrounded version
  result = text.replace(regex, match => `${leftStr}${match}${rightStr}`);
  }
  return result;
}


module.exports = {findChords, markChords};