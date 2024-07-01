document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
  
    fontFamily.addEventListener('change', (event) => {
      editor.style.fontFamily = event.target.value;
    });
  
    fontSize.addEventListener('change', (event) => {
      editor.style.fontSize = event.target.value;
    });
  
    boldBtn.addEventListener('click', () => {
      if (editor.style.fontWeight === 'bold') {
        editor.style.fontWeight = 'normal';
      } else {
        editor.style.fontWeight = 'bold';
      }
    });
  
    italicBtn.addEventListener('click', () => {
      if (editor.style.fontStyle === 'italic') {
        editor.style.fontStyle = 'normal';
      } else {
        editor.style.fontStyle = 'italic';
      }
    });
  
    underlineBtn.addEventListener('click', () => {
      if (editor.style.textDecoration === 'underline') {
        editor.style.textDecoration = 'none';
      } else {
        editor.style.textDecoration = 'underline';
      }
    });
  });
  