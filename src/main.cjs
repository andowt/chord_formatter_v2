const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

require('./helpers/exampleLoader/exampleTxtHelper.cjs')
require('./helpers/docxGenerator/docxGen.cjs')

let configurations = [];

/*
function createConfigWindow() {
  const configWindow = new BrowserWindow({
      width: 600,
      height: 400,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          enableRemoteModule: false
      }
  });

  configWindow.loadFile('windowConfig/windowConfig.html');

  configWindow.webContents.on('did-finish-load', () => {
      configWindow.webContents.send('load-configurations', configurations);
  });
}
*/

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

ipcMain.on('open-config-window', () => {
  createConfigWindow();
});

ipcMain.on('save-config', (event, updatedConfigurations) => {
  configurations = updatedConfigurations;
});

