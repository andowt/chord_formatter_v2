const { app, BrowserWindow } = require('electron');
const path = require('path');

// Squirrel.Windows event handling function
const handleSquirrelEvent = () => {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = (command, args) => {
    let spawnedProcess;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {
      return;
    }

    spawnedProcess.on('close', () => {
      app.quit();
    });
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Install desktop and start menu shortcuts
      spawn(updateDotExe, ['--createShortcut', exeName]);
      return true;

    case '--squirrel-uninstall':
      // Remove desktop and start menu shortcuts
      spawn(updateDotExe, ['--removeShortcut', exeName]);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of the app before
      // we update to the new version - it's the opposite of --squirrel-updated
      app.quit();
      return true;
  }

  return false;
};

// Handle Squirrel.Windows events
if (handleSquirrelEvent()) {
  return;
}

require('./exampleLoader/exampleTxtHelper.cjs');
require('./docxGenerator/docxGen.cjs');
require('./windowConfig/windowConfig.cjs');

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true,
    },
  });

  mainWindow.loadFile('src/windowMain/windowMain.html');
  console.log("Main Process Running");
};

app.on('ready', () => {
  console.log('Electron app is ready');
  createMainWindow();
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
