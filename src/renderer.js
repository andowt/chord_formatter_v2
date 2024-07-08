const { remote, ipcRenderer } = require('electron');
const path = require('path');
const { 
  markChordsInContent, 
  unMarkChordsInContent, 
  nestChordsInContent, 
  unNestChordsInContent, 
  removeBlankLinesInContent, 
  transposeInContent,
  loadExample
} = require('./modules/chordContentProcessor');

// Initialize UI interactions
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');

  document.getElementById('loadExampleBtn').addEventListener('click', () => {
    loadExample(editor);
  });

  document.getElementById('markBtn').addEventListener('click', () => {
    editor.innerText = markChordsInContent(editor.innerText); // Format content with chord highlighting
  });

  document.getElementById('unMarkBtn').addEventListener('click', () => {
    editor.innerText = unMarkChordsInContent(editor.innerText);
  });

  document.getElementById('nestBtn').addEventListener('click', () => {
    editor.innerText = nestChordsInContent(editor.innerText);
  });

  document.getElementById('unNestBtn').addEventListener('click', () => {
    editor.innerText = unNestChordsInContent(editor.innerText);
  });

  document.getElementById('rmEmptyBtn').addEventListener('click', () => {
    editor.innerText = removeBlankLinesInContent(editor.innerText);
  });

  document.getElementById('transUpBtn').addEventListener('click', () => {
    editor.innerText = transposeInContent(editor.innerText, 1);
  });

  document.getElementById('transDownBtn').addEventListener('click', () => {
    editor.innerText = transposeInContent(editor.innerText, -1);
  });

  document.getElementById('generateButton').addEventListener('click', () => {
    ipcRenderer.send('generate-docx', editor.innerText);
  });

  ipcRenderer.on('docx-saved', (event, filePath) => {
    document.getElementById('status').textContent = `Document saved to: ${filePath}`;
  });

  ipcRenderer.on('docx-error', (event, error) => {
    document.getElementById('status').textContent = `Error: ${error}`;
  });

});