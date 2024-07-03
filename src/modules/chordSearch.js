const chordSharps = ['A#', 'C#', 'D#', 'F#', 'G#'];
const chordFlats = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
const chordNaturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const transposeSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const transposeFlat =  ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
const transposeMixed = ['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#'];

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

function transposeSingleChord(chord, steps) {

  chord = chord.replace(/^Cb/, 'B').replace(/^Fb/, 'E').replace(/^E#/, 'F').replace(/^B#/, 'C');
  let isSharp = chordSharps.some(sharpChord => chord.startsWith(sharpChord));
  let isFlat = chordFlats.some(flatChord => chord.startsWith(flatChord));
  console.log("sanitised chord: %s", chord);

  let lookup_scale = transposeMixed;
  if (isSharp) {
    console.log("chord is sharp");
    lookup_scale = transposeSharp;
  } else if (isFlat) {
    console.log("chord is flat");
    lookup_scale = transposeFlat;
  }
  else
  {
    console.log("chord is natural");
  }

  let output_scale = transposeMixed; // TODO could switch this on key?

  const regex = new RegExp(`^([A-G][b#]?)`);
  const match = chord.match(regex);
  if (!match) return chord;

  const rootNote = match[0];
  const currentIndex = lookup_scale.indexOf(rootNote);
  if (currentIndex === -1) return chord;
  console.log("Chord root is: %s, index is: %d", rootNote, currentIndex);

  const newIndex = (currentIndex + steps + lookup_scale.length) % lookup_scale.length;
  const newRoot = output_scale[newIndex];
  console.log("Transpose root is: %s, index is: %d", newRoot, newIndex)

  return chord.replace(rootNote, newRoot);
}

function transposeChords(text, steps) {
  const chords = findChords(text);
  console.log("Processing Line: %s", text);

  if (!chords) {
    return text;
  }

  // Create a mapping of chord positions in the text
  const chordPositions = [];
  chords.forEach(chord => {
    const index = text.indexOf(chord);
    if (index !== -1) {
      chordPositions.push({ chord, index });
    }
  });

  // Sort chord positions by index in descending order to process from right to left
  chordPositions.sort((a, b) => b.index - a.index);

  // Transpose and replace each chord in the result
  let result = text;
  chordPositions.forEach(({ chord, index }) => {
    const transposedChord = transposeSingleChord(chord, steps);
    if (transposedChord !== chord) {
      result = result.substring(0, index) + transposedChord + result.substring(index + chord.length);
    }
  });

  return result;
}


module.exports = {findChords, markChords, transposeChords};