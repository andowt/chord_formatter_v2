const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld(
    'ipcRender', {
        // Invoke a function in the main process
        invoke: (channel, args) => {
            return ipcRenderer.invoke(channel, args);
        }
    }
);