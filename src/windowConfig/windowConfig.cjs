const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');



ipcMain.handle('open-config-window', async (event, args) => {
    console.log("Opening configuration window!");
    const configWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload.cjs'),
        contextIsolation: true,
        enableRemoteModule: false
      }
    });
  
    configWindow.loadFile(path.join(__dirname, 'windowConfig.html'));
  });
  
  ipcMain.handle('save-config', async (event, args) => {
    const configFilePath = path.join(__dirname, 'config.json');
    try {
      fs.writeFileSync(configFilePath, JSON.stringify(args, null, 2));
      console.log("Configuration saved to file");
    } catch (error) {
      console.error("Failed to save configuration", error);
    }
  });
  
  ipcMain.handle('load-config', async (event, args) => {
    const configFilePath = path.join(__dirname, args);
    console.log("running load-config handler");
    try {
      if (fs.existsSync(configFilePath)) {
        const data = fs.readFileSync(configFilePath, 'utf-8');
        const configurations = JSON.parse(data);
        return configurations;
      } else {
        console.log("Config file does not exist, returning empty array");
        return [];
      }
    } catch (error) {
      console.error("Failed to load configuration", error);
      return [];
    }
  });