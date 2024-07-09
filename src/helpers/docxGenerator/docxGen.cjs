const { Document, Packer, Paragraph, TextRun, AlignmentType, LineRuleType } = require('docx');
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to replace leading spaces with a non-breaking space character
function preserveLeadingSpaces(line) {
    const leadingSpaces = /^ +/.exec(line);
    if (leadingSpaces) {
      const spaces = leadingSpaces[0];
      const nonBreakingSpaces = '\u00A0'.repeat(spaces.length); // Using non-breaking space character
      return nonBreakingSpaces + line.substring(spaces.length);
    }
    return line;
  }

// Handle generate-docx IPC event
ipcMain.on('generate-docx', async (event, content) => {
    try {
      console.log("CONTENT: %s", content);
  
      // Split content into lines
      const lines = content.split(/\n/);
  
      // Initialize an array to store paragraphs
      const paragraphs = [];
  
      // Process each line to create paragraphs with appropriate formatting
      lines.forEach(line => {
        // Preserve leading spaces
        const preservedLine = preserveLeadingSpaces(line);
  
        if (preservedLine.trim() === "") {
          // Skip empty lines (after preserving leading spaces)
          return;
        }
  
        // Check if line starts with a square bracket (indicating section like [Chorus], [Verse], etc.)
        if (preservedLine.trim().startsWith("[")) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: preservedLine.trim(),
                  font: 'Courier New',
                  bold: true,  // Make section headers bold
                  size: 24,//Set in half points - 24/2 = 12pt
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {
                line: 240, //12pt converted to twips (12*20)
                lineRule: LineRuleType.EXACT,
              },
            })
          );
        } else {
          // Regular line of lyrics or chords
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: preservedLine,
                  font: 'Courier New',
                  bold: false,
                  size: 24,//Set in half points - 24/2 = 12pt
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {
                line: 240, //12pt converted to twips (12*20)
                lineRule: LineRuleType.EXACT,
              },
            })
          );
        }
      });
  
      // Create the Document with the prepared paragraphs
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 568 * 1.27, //568 is a magic number found through trial and error..... the docs for docx are bad :(
                  right: 568 * 1.27,
                  bottom: 568 * 1.27,
                  left: 568 * 1.27,
                },
              },
            },
            children: paragraphs,
          },
        ],
      });
  
  
  
      // Generate the Word document and save it to the filesystem
      const buffer = await Packer.toBuffer(doc);
      const filePath = path.join(app.getPath('desktop'), 'output.docx');
      fs.writeFileSync(filePath, buffer);
  
      // Notify the renderer process that the file has been saved
      event.reply('docx-saved', filePath);
    } catch (error) {
      console.error('Error generating document:', error);
      event.reply('docx-error', error.message);
    }
  });