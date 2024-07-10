const { app, BrowserWindow} = require('electron');
const path = require('path');

require('./exampleLoader/exampleTxtHelper.cjs')
require('./docxGenerator/docxGen.cjs')
require('./windowConfig/windowConfig.cjs')

app.on('ready', () => {
  console.log('Electron app is ready');
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true,
    },
  });

  mainWindow.loadFile('src/windowMain/windowMain.html');
  console.log("Main Process Running");

});

// macOS specific - create window if none exists
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// App window close handling for Windows and Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


