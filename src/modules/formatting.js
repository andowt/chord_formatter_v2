const { markChords, transposeChords } = require('./chordSearch');

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
