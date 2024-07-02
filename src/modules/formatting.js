const { markChords } = require('./chordSearch');

// Function to format content with chord highlighting
function markChordsInContent(content)
{
  // Highlight chords using spans
  let markedText = [];
  const lines = content.split('\n');
  for (const line of lines) {
    markedText.push(markChords(line, '{', '}'));
  }
  return markedText.join('\n');
}

function unMarkChordsInContent(content)
{
  // Replace all '{' and '}' with an empty string
  return content.replace(/\{/g, '').replace(/\}/g, '');
}

function nestChordsInContent(content)
{
  return content;
}

function unNestChordsInContent(content)
{
  return content;
}

function transposeInContent(content, steps)
{
  return content;
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
