const fs = require('fs');
const path = require('path');
const { markChords, transposeChords, getChordsWithIndex, getChords } = require('./chordOperations');

function isWhitespaceLine(line) {
  return /^\s*$/.test(line);
}

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
  let result = [];
  if((lines.length %2)!=0){lines.push("");}
  let n = 0;
  while(n < lines.length) {
    let [chords, indexes] = getChordsWithIndex(lines[n]);
    if((chords.length > 0) && ((n+1) < lines.length) && (getChords(lines[n+1]) == 0) && !lines[n+1].match(/^\s*$/))
    {
      let offset = 0;
      let newLine = lines[n+1]
      for(let i=0; i<chords.length; i++)
      {
        let new_pos = indexes[i] + offset;
        newLine = (newLine.slice(0, indexes[i] + offset) + '{' + chords[i] + '}' + newLine.slice(new_pos));
        offset += chords[i].length+2;
      }
      result.push(newLine);
      n++;
    }
    else
    {
      result.push(lines[n]);
    }
    n++;
  }
  return result.join('\n');
}


function unNestChordsInContent(content) {
  let lines = content.split('\n');
  let result = [];

  for (let n = 0; n < lines.length; n++) {
    let line = lines[n];
    let chords = [];
    let indices = [];
    let newLine = '';

    // Extract chords and their indices
    line.replace(/\{(.*?)\}/g, (match, p1, offset) => {
      chords.push(p1);
      indices.push(offset);
    });

    console.log(chords);
    console.log(indices);

    // Create a line with chords in their original positions
    if (chords.length > 0) {
      let offset = 0;
      let chordLine = '';
      for(let i=0; i<chords.length; i++)
      {
        indices[i] = indices[i] - offset;
        offset += chords[i].length + 2; //Bracket LR
      }
      let charCount=0;
      let chordCount=0;
      for(let i=0; i < indices.length; i++)
      {
        let charCountOnEntry = charCount;
        while(charCount < indices[i])
        {
          chordLine += ' ';
          charCount++;
        }
        if((indices[i] != 0) && ((charCount - charCountOnEntry) == 0))
        {
          chordLine += ' ';
          charCount++;
        }
        charCount += chords[chordCount].length;
        chordLine += chords[chordCount++];
      }
      result.push(chordLine);
    }

    // Remove chord markers from the current line
    newLine = line.replace(/\{.*?\}/g, '');
    result.push(newLine);
  }

  return result.join('\n');
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

function removeBlankLinesInContent(content) {
    // Split the lyrics into lines
    let lines = content.split('\n');

    let result = [];
    let n=0;
    while (n < lines.length) {
      let line_n_match = lines[n].match(/^\s*$/);
      if(line_n_match && ((n + 1) < lines.length) && lines[n+1].match(/^\s*$/))
      {
        result.push("");
        n++;
      }
      else if(!line_n_match)
      {
        result.push(lines[n]);
      }
      n++
    }

    // Join the lines into a single string with newlines and return the result
    return result.join('\n');
}
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
  markChordsInContent,
  unMarkChordsInContent,
  nestChordsInContent,
  unNestChordsInContent,
  transposeInContent,
  removeBlankLinesInContent,
  loadExample
};
