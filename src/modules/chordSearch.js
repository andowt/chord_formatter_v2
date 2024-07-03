const chordSharps = ['A#', 'C#', 'D#', 'F#', 'G#'];
const chordFlats = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
const chordNaturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const transposeSharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const transposeFlat =  ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
const transposeMixed = ['A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#'];

const base = '\\b[A-Ga-g]';
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

function normaliseChord(chord)
{
  if (/[a-g]/.test(chord.charAt(0))) // Convert to uppercase if lowercase chord detected
  {
    chord = chord.charAt(0).toUpperCase() + chord.slice(1)
  }
  return chord.replace(/^Cb/, 'B').replace(/^Fb/, 'E').replace(/^E#/, 'F').replace(/^B#/, 'C');
}

function findChords(text, nonChordThreshold = 0.5) {
  const regex = new RegExp(formattedAllOptions, 'g'); // Use 'g' flag for global matching
  let matches = text.match(regex);

  let text_no_chords = text.replace(regex, '').replace(/\s/g, ''); // Remove matches and then remove all whitespace
  let num_non_chord_chars = text_no_chords.length;
  let num_text_chars = text.length;
  let percent_non_chord = (num_non_chord_chars / num_text_chars);

  if ((percent_non_chord < nonChordThreshold) && (matches && matches.length > 0))
  {
    normalised_matches = matches.map(match => {
      // Check if the first character is lowercase
      if (/[a-g]/.test(match.charAt(0))) 
      {
        return normaliseChord(match.charAt(0).toUpperCase() + match.slice(1)); // Capitalize the first letter
      }
      else 
      {
        return normaliseChord(match); // Return unchanged if already capitalized or not a chord
      }
    });
    return [matches, normalised_matches];
  } 
  else 
  {
    return [null, null]; // Return null if no matches found
  }
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

  chord = normaliseChord(chord); // Capitalize the first letter
  let isSharp = chordSharps.some(sharpChord => chord.startsWith(sharpChord));
  let isFlat = chordFlats.some(flatChord => chord.startsWith(flatChord));

  let lookup_scale = transposeMixed;
  if (isSharp) {
    lookup_scale = transposeSharp;
  } else if (isFlat) {
    lookup_scale = transposeFlat;
  }

  let output_scale = transposeMixed; // TODO could switch this on key?

  const regex = new RegExp(`^([A-G][b#]?)`);
  const match = chord.match(regex);
  if (!match) return chord;

  const rootNote = match[0];
  const currentIndex = lookup_scale.indexOf(rootNote);
  if (currentIndex === -1) return chord;

  const newIndex = (currentIndex + steps + lookup_scale.length) % lookup_scale.length;
  const newRoot = output_scale[newIndex];

  return chord.replace(rootNote, newRoot);
}

function transposeChords(text, steps) {
  const [raw_chords, _] = findChords(text);

  if (!raw_chords) {
    return text;
  }

  // Create a mapping of chord positions in the text
  const chordPositions = [];
  raw_chords.forEach(chord => {
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