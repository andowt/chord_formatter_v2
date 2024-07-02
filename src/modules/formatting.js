const { markChords } = require('./chordSearch');

// Function to format content with chord highlighting
function formatContent(content) {
  // Highlight chords using spans
  let markedText = [];
  const lines = content.split('\n');
  for (const line of lines) {
    markedText.push(markChords(line, '{', '}'));
  }
  return markedText.join('\n');
}

module.exports = {
  formatContent
};
