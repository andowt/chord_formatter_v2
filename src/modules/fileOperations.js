const fs = require('fs');
const path = require('path');

function loadExample(editor) {
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
}

module.exports = {
  loadExample
};
