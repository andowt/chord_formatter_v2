const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation
      enableRemoteModule: true, // Enable remote module (required for Electron >= 12)
    },
  });

  mainWindow.loadFile('index.html');
}

// Wait for electron app to be ready
app.whenReady().then(() => {
  createWindow()
  // MacOs specific - create window if non exists
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// App window close handling for windows and linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})