const { formattedAllOptions } = require('./chordSearch');

// Function to format content with chord highlighting
function formatContent(content) {
  // Replace newline characters with <br> and spaces with &nbsp;
  const formattedContent = content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
  
  // Highlight chords using spans
  const highlightedContent = formattedContent.replace(new RegExp(`(${formattedAllOptions})`, 'g'), '<span class="highlighted-chord">$1</span>');

  return highlightedContent;
}

module.exports = {
  formatContent
};
