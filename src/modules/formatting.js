const { markChords, transposeChords, getChords, getChordsWithIndex } = require('./chordOperations').default;

// Function to format content with chord highlighting
function markChordsInContent(content)
{
  let outputText = [];
  const lines = content.split('\n');
  for (const line of lines) {
    outputText.push(markChords(line, '{', '}'));
  }
  return outputText.join('\n');
}

function unMarkChordsInContent(content)
{
  // Replace all '{' and '}' with an empty string
  return content.replace(/\{/g, '').replace(/\}/g, '');
}

function nestChordsInContent(content) {
  let lines = content.split('\n');
  for (let n = 1; n < lines.length; n++) {
    const [chords_prev, indicies_prev] = getChordsWithIndex(lines[n-1])
    const chords_curr = getChords(lines[n]);

    if ((chords_curr == null) && (chords_prev != null)) {
      const len_prev = lines[n - 1].length;
      const len_curr = lines[n].length;

      if (len_curr < len_prev) {
        // Append spaces to the current line
        lines[n] += ' '.repeat(len_prev - len_curr);
      }

      let line_parts = [];
      let last_index = 0;
      for (let i = 0; i < indicies_prev.length; i++) {
        line_parts.push(lines[n].slice(last_index, indicies_prev[i]));
        line_parts.push(chords_prev[i]);
        last_index = indicies_prev[i];
      }
      line_parts.push(lines[n].slice(last_index)); // Add the remaining part of the line

      lines[n] = line_parts.join('');
    }
  }
  return lines.join('\n');
}


function unNestChordsInContent(content)
{
  return content;
}

function transposeInContent(content, steps)
{
  let outputText = [];
  const lines = content.split('\n');
  for (const line of lines) {
    outputText.push(transposeChords(line, steps));
  }
  return outputText.join('\n');
}

function removeBlankLinesInContent(content)
{
    // Regular expression to match blank lines (lines with only whitespace characters)
    const regex = /^\s*[\r\n]/gm;
    // Remove blank lines from content using regex
    const cleanedContent = content.replace(regex, '');
    return cleanedContent;
}

module.exports = {
  markChordsInContent,
  unMarkChordsInContent,
  nestChordsInContent,
  unNestChordsInContent,
  transposeInContent,
  removeBlankLinesInContent
};
