import {
  markChordsInContent,
  unMarkChordsInContent,
  nestChordsInContent,
  unNestChordsInContent,
  transposeInContent,
  removeBlankLinesInContent,
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
      try{ await window.ipcRender.invoke('generate-docx', editor.innerText);}
      catch { console.log("Failed to render docx!"); }

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

    document.getElementById('configBtn').addEventListener('click', () => {
      window.electron.ipcRenderer.send('open-config-window');
    }); */

