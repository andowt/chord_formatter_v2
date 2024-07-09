const { ipcRenderer } = require('electron');

document.getElementById('config-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const config = {
        fontSize: document.getElementById('font-size').value,
        fontWeight: document.getElementById('font-weight').value,
        transpose: document.getElementById('transpose').value,
        name: document.getElementById('name').value
    };

    ipcRenderer.send('save-config', config);
    window.close(); // Close the configuration window after saving
});
