const fs = require('fs').promises;
const path = require('path');
const { ipcMain } = require('electron');

async function getExample() {
  try {
    const exampleFilePath = path.join(__dirname, 'example.txt');
    const data = await fs.readFile(exampleFilePath, 'utf8');
    // Replace newline characters with <br> and spaces with &nbsp;
    const formattedData = data.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    return formattedData;
  } catch (error) {
    console.error('Error loading example.txt:', error);
    throw error; // Ensure error is propagated back to caller
  }
}

// IPC handler for 'get-example-txt'
ipcMain.handle('get-example-txt', async (event, args) => {
  try {
    const formattedData = await getExample();
    return formattedData;
  } catch (error) {
    console.error('Error getting example text:', error);
    throw error; // Ensure error is propagated back to renderer process
  }
});
