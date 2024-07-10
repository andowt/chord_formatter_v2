document.addEventListener('DOMContentLoaded', () => {
    let configurations = [];

    function createConfigElement(config, index) {
        const configElement = document.createElement('div');
        configElement.classList.add('config-item');

        configElement.innerHTML = `
            <label for="font-size-${index}">Font Size:</label>
            <input type="number" id="font-size-${index}" name="fontSize" value="${config.fontSize}" required><br>

            <label for="font-weight-${index}">Font Weight:</label>
            <select id="font-weight-${index}" name="fontWeight" required>
                <option value="normal" ${config.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="bold" ${config.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
            </select><br>

            <label for="transpose-${index}">Transpose:</label>
            <input type="number" id="transpose-${index}" name="transpose" value="${config.transpose}" required><br>

            <label for="name-${index}">Name:</label>
            <input type="text" id="name-${index}" name="name" value="${config.name}" required><br>

            <button onclick="deleteConfig(${index})">Delete</button>
        `;

        return configElement;
    }

    function loadConfigurations(configurations) {
        const configContainer = document.getElementById('configurations');
        configContainer.innerHTML = '';
        configurations.forEach((config, index) => {
            const configElement = createConfigElement(config, index);
            configContainer.appendChild(configElement);
        });
    }

    document.getElementById('add-config').addEventListener('click', () => {
        const newConfig = {
            fontSize: '',
            fontWeight: 'normal',
            transpose: '',
            name: ''
        };

        configurations.push(newConfig);
        loadConfigurations(configurations);
    });

    document.getElementById('save-configurations').addEventListener('click', () => {
        configurations = configurations.map((config, index) => {
            return {
                fontSize: document.getElementById(`font-size-${index}`).value,
                fontWeight: document.getElementById(`font-weight-${index}`).value,
                transpose: document.getElementById(`transpose-${index}`).value,
                name: document.getElementById(`name-${index}`).value
            };
    });

    window.electron.ipcRenderer.send('save-config', configurations);
    window.close(); // Close the configuration window after saving
    });

    function deleteConfig(index) {
        configurations.splice(index, 1);
        loadConfigurations(configurations);
    }

    window.electron.ipcRenderer.on('load-configurations', (event, loadedConfigurations) => {
        configurations = loadedConfigurations;
        loadConfigurations(configurations);
    });
});
