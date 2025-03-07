import {
  markChordsInContent,
  unMarkChordsInContent,
  nestChordsInContent,
  unNestChordsInContent,
  transposeInContent,
  removeBlankLinesInContent,
  autoBreakContent
} from '../chordProcessing/chordContentProcessor.js';


document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  if (window.ipcRender)
  {
    // Assuming 'loadExampleBtn' is a button to trigger fetching example text
    document.getElementById('loadExampleBtn').addEventListener('click', async () => {
          let result = "";
          try{ result = await window.ipcRender.invoke('get-example-txt', {});}
          finally{editor.innerHTML = result;}
    });

    document.getElementById('markBtn').addEventListener('click', () => {
      editor.innerText = markChordsInContent(editor.innerText);
    });

    document.getElementById('unMarkBtn').addEventListener('click', () => {
      editor.innerText = unMarkChordsInContent(editor.innerText);
    });

    document.getElementById('nestBtn').addEventListener('click', () => {
      editor.innerText = nestChordsInContent(editor.innerText);
    });

    document.getElementById('unNestBtn').addEventListener('click', () => {
      editor.innerText = unNestChordsInContent(editor.innerText);
    });

    document.getElementById('rmEmptyBtn').addEventListener('click', () => {
      editor.innerText = removeBlankLinesInContent(editor.innerText);
    });

    document.getElementById('transUpBtn').addEventListener('click', () => {
      editor.innerText = transposeInContent(editor.innerText, 1);
    });

    document.getElementById('transDownBtn').addEventListener('click', () => {
      editor.innerText = transposeInContent(editor.innerText, -1);
    });

    document.getElementById('generateButton').addEventListener('click', async () => {
      
        console.log("Loading configs from file");
        let selectedDirectory = "";
        try {
          selectedDirectory = await window.ipcRender.invoke('get-output-dir', {});
        }
        catch (error)
        {
          console.log("Failed to get output dir", error);
        }
        if(selectedDirectory == ""){return;}
        try {
          let configurations = await window.ipcRender.invoke('load-config', 'config.json');
          let fileName = document.getElementById('filename').value;
          console.log("Filename: %s", fileName);

          for (const config of configurations) {
            console.log("PROCESSING DOCX CONFIG: ");
            console.log(config);
            if (config.enable) {
              let outputContent = transposeInContent(editor.innerText, parseInt(config.transpose));
              if(document.getElementById('autoBreak').value)
              {
                outputContent = autoBreakContent(outputContent, parseInt(config.fontSize), config.a3);
              }
              //outputContent = lineSplit...
              await window.ipcRender.invoke('generate-docx', [
                config.fontSize,
                config.fontWeight,
                config.name,
                config.a3,
                outputContent,
                selectedDirectory,
                fileName
              ]);
            }
          } 
          await window.ipcRender.invoke('docx-result-prompt', true);
        } catch (error) {
          await window.ipcRender.invoke('docx-result-prompt', false);
          console.log("Failed to load or process configurations", error);
        }

    });

    document.getElementById('configBtn').addEventListener('click', async () => {
      try{ await window.ipcRender.invoke('open-config-window', editor.innerText);}
      catch { console.log("Failed to open config window"); }
    }); 

}
else {
  console.error('Electron IPC Renderer not available yet.');
}
});

    /*




    window.electron.ipcRenderer.on('docx-saved', (event, filePath) => {
      document.getElementById('status').textContent = `Document saved to: ${filePath}`;
    });

    window.electron.ipcRenderer.on('docx-error', (event, error) => {
      document.getElementById('status').textContent = `Error: ${error}`;
    });

*/

