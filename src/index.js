// Import Electron Modules
const { app, BrowserWindow } = require('electron/main')
const path = require('path');

// Create the html window
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })

  win.loadFile('index.html')
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