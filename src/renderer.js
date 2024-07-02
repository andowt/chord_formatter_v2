const { remote } = require('electron');
const path = require('path');
const { loadExample } = require('./modules/fileOperations');
const { formatContent } = require('./modules/formatting');

// Initialize UI interactions
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const loadExampleBtn = document.getElementById('loadExampleBtn');
  const markBtn = document.getElementById('markBtn');

  // Load example.txt into editor
  loadExampleBtn.addEventListener('click', () => {
    loadExample(editor);
  });

  // Event listener for auto label button
  markBtn.addEventListener('click', () => {
    console.log('Auto Label button clicked');

    const content = editor.innerText; // Get plain text content
    const formattedContent = formatContent(content); // Format content with chord highlighting
    editor.innerText = formattedContent; // Update editor content with HTML
    console.log('Updated editor content with chord highlighting.');
  });
});