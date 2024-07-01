const { remote } = require('electron');
const fs = require('fs');
const path = require('path');
const { formattedAllOptions } = require('./chordSearch');

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const loadExampleBtn = document.getElementById('loadExampleBtn');
  const autoLabelBtn = document.getElementById('autoLabelBtn');

  // Load example.txt into editor
  loadExampleBtn.addEventListener('click', () => {
    const exampleFilePath = path.join(__dirname, 'example.txt');
    fs.readFile(exampleFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error loading example.txt:', err);
        return;
      }
      // Replace newline characters with <br> and spaces with &nbsp;
      const formattedData = data.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      editor.innerHTML = formattedData;
      console.log('Loaded example.txt into editor.');
    });
  });

// Event listener for auto label button
autoLabelBtn.addEventListener('click', () => {
    console.log('Auto Label button clicked');

    const content = editor.textContent; // Get plain text content
    const formattedContent = formatContent(content); // Format content with chord highlighting
    editor.innerHTML = formattedContent; // Update editor content with HTML
    console.log('Updated editor content with chord highlighting.');
  });

  // Function to format content with chord highlighting
  function formatContent(content) {
    // Replace newline characters with <br> and spaces with &nbsp;
    const formattedContent = content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    
    // Highlight chords using spans
    const highlightedContent = formattedContent.replace(new RegExp(`(${formattedAllOptions})`, 'g'), '<span class="highlighted-chord">$1</span>');

    return highlightedContent;
  }
});
