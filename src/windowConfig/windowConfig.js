document.addEventListener('DOMContentLoaded', () => {
    let configurations = [];
    if (window.ipcRender) {
  
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

            <label for="enable-${index}">Enable:</label>
            <input type="checkbox" id="enable-${index}" name="enable" ${config.enable ? 'checked' : ''} required><br>
  
            <button class="delete-config" data-index="${index}">Delete</button>
        `;
  
        return configElement;
      }

      async function saveConfigurationsToFile() {
        console.log("Saving configs to file");
        try {
            await window.ipcRender.invoke('save-config', configurations);
          } catch {
            console.log("Failed to save configs");
          }
      }

      async function loadConfigurationsFromFile() {
        console.log("Loading configs from file");
        try {
            configurations = await window.ipcRender.invoke('load-config', 'config.json');
          } catch {
            console.log("Failed to load configs");
          }
          loadConfigurationsToHTML(configurations);
      }

      async function loadDefaultsFromFile() {
        console.log("Loading defaults from file");
        try {
            configurations = await window.ipcRender.invoke('load-config', 'default_configs.json');
          } catch {
            console.log("Failed to load configs");
          }
          loadConfigurationsToHTML(configurations);
      }
  
      function loadConfigurationsToHTML() {
        console.log("loading configs to html");
        const configContainer = document.getElementById('configurations');
        configContainer.innerHTML = '';
        configurations.forEach((config, index) => {
          const configElement = createConfigElement(config, index);
          configContainer.appendChild(configElement);
        });
  
        // Attach delete event listeners after elements are added to the DOM
        document.querySelectorAll('.delete-config').forEach(button => {
          button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            deleteConfig(index);
          });
        });
      }

      function saveConfigurationsFromHTML()
      {
        console.log("saving configs from html");
        configurations = configurations.map((config, index) => {
            return {
              fontSize: document.getElementById(`font-size-${index}`).value,
              fontWeight: document.getElementById(`font-weight-${index}`).value,
              transpose: document.getElementById(`transpose-${index}`).value,
              name: document.getElementById(`name-${index}`).value,
              enable: document.getElementById(`enable-${index}`).checked,
            };
        });
        console.log("Configurations: ");
        console.log(configurations);
      }
  
      document.getElementById('add-config').addEventListener('click', () => {
        console.log("ADD Clicked");
        saveConfigurationsFromHTML();
        const newConfig = {
          fontSize: '12',
          fontWeight: 'normal',
          transpose: '0',
          name: '',
          enable: true,
        };
  
        configurations.push(newConfig);
        loadConfigurationsToHTML();
      });
  
      document.getElementById('save-configurations').addEventListener('click', async () => {
        saveConfigurationsFromHTML();
        saveConfigurationsToFile();
        window.close(); // Close the configuration window after saving
      });

      document.getElementById('default-configurations').addEventListener('click', async () => {
        loadDefaultsFromFile();
      });
  
      function deleteConfig(index) {
        configurations.splice(index, 1);
        loadConfigurationsToHTML();
      }

      loadConfigurationsFromFile();
  
    } else {
      console.error('Electron IPC Renderer not available yet.');
    }
  });
  