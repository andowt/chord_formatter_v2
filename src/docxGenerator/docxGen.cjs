const { Document, Packer, Paragraph, TextRun, AlignmentType, LineRuleType, PageOrientation, Header } = require('docx');
const { ipcMain, dialog } = require('electron');
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

ipcMain.handle('get-output-dir', async (event, args) => {
  console.log("Get output directory")
  let selectedDirectory = "";
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: 'Select Output Directory'
    });
    
    if (!result.canceled) {
      selectedDirectory = result.filePaths[0];
      // Now you have the selectedDirectory, you can proceed with your logic
      console.log('Selected output directory:', selectedDirectory);
      // Pass this selectedDirectory to your load-config function or store it for later use
    }
  } catch (error) {
    console.error('Error selecting output directory:', error);
  }
  return selectedDirectory
});

// Handle generate-docx IPC event
ipcMain.handle('generate-docx', async (event, args) => {
    const fontSize = parseInt(args[0]);
    const fontWeight = args[1];
    const config_name = args[2];
    const a3 = args[3]
    const content = args[4];
    const outputDir = args[5];
    const fileName = args[6];

    const pageWidth = (a3) ? "297mm" : "210mm";
    const pageHeight = (a3) ? "420mm" : "297mm"

    try {
       
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
                  size: fontSize*2,//Set in half points - 24/2 = 12pt
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {
                line: fontSize*20, //12pt converted to twips (12*20)
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
                  bold: (fontWeight == "bold" ),
                  size: fontSize*2,//Set in half points - 24/2 = 12pt
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {
                line: fontSize*20, //12pt converted to twips (12*20)
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
                size: {
                  width: pageWidth,
                  height: pageHeight,
                  orientation: PageOrientation.PORTRAIT,
                }
              },
            },
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: fileName.toUpperCase() + "  /  " + config_name.toUpperCase() + "\n",
                        bold: true,
                        font:"Courier New",
                        size: fontSize*2,//Set in half points - 24/2 = 12pt
                      }),
                    ],
                    alignment: "center",
                  }),
                ],
              }),
            },
            children: paragraphs,
          },
        ],
      });
  
  
  
      // Generate the Word document and save it to the filesystem
      const buffer = await Packer.toBuffer(doc);
      const filePath = path.join(outputDir, fileName.replace(/\s+/g, '_') + '_' + config_name + '.docx');
      fs.writeFileSync(filePath, buffer);
  
      // Notify the renderer process that the file has been saved
      //event.reply('docx-saved', filePath);
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
      //event.reply('docx-error', error.message);
    }
  });