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
      editor.value = data;
      console.log('Loaded example.txt into editor.');
    });
  });

  // Event listener for auto label button
  autoLabelBtn.addEventListener('click', () => {
    console.log('Auto Label button clicked');

    const lines = editor.value.split('\n');
    console.log('Editor content lines:', lines);

    const outputLines = lines.map(line => {
      const isChordLine = isChord(line);
      console.log(`Processing line: "${line}", isChord: ${isChordLine}`);
      return isChordLine ? 'CHORD: ' + line : 'TEXT: ' + line;
    });
    console.log('Output lines:', outputLines);

    editor.value = outputLines.join('\n');
    console.log('Updated editor content:', editor.value);
  });

  // Helper function to check if a line is a chord or text
  function isChord(line) {
    const regex = new RegExp(formattedAllOptions); // Make sure formattedAllOptions is defined
    const isChord = regex.test(line);
    console.log(`Checking if "${line}" is a chord: ${isChord}`);
    return isChord;
  }
});
