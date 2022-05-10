import keyData from './key-data';
import './css/style.css';

const DESTINATION = 'body';

let [lang,
  shiftPressed,
  capsPressed,
  langPressed,
  copySelection,
  pasteSelection,
  tabPressed,
  undoPressed,
  cutSelection,
  selectAll,
  altPressed,
  ctrlPressed,
] = [''];

const root = document.querySelector(DESTINATION);

// NEW ELEMENT CREATING
const newElement = (destination, tagName, className, inner) => {
  const varName = document.createElement(tagName);
  destination.appendChild(varName);
  if (className) {
    varName.classList.add(className);
  }
  if (inner) {
    varName.innerHTML = inner;
  }
  return varName;
};

// MAKE KEYBOARD
const keyboardPattern = {
  firstRow: 14,
  secondRow: 15,
  thirdRow: 13,
  fourthRow: 14,
  fifthRow: 9,
};
const soloKeys = ['Backspace', 'Tab', 'Shift', 'Caps', 'Del', 'Enter', 'Ctrl', 'Alt', 'Win', '↑', '←', '↓', '→', ' '];
const wrapper = newElement(root, 'section', 'keyboard-wrapper');
const container = newElement(wrapper, 'div', 'container');
const textarea = newElement(container, 'textarea', 'textarea');
const keyboardContainer = newElement(container, 'div', 'keyboard-container');
const firstRow = newElement(keyboardContainer, 'div', 'keyboard-row');
firstRow.classList.add('first-row');
const secondRow = newElement(keyboardContainer, 'div', 'keyboard-row');
secondRow.classList.add('second-row');
const thirdRow = newElement(keyboardContainer, 'div', 'keyboard-row');
thirdRow.classList.add('third-row');
const fourthRow = newElement(keyboardContainer, 'div', 'keyboard-row');
fourthRow.classList.add('fourth-row');
const fifthRow = newElement(keyboardContainer, 'div', 'keyboard-row');
fifthRow.classList.add('fifth-row');
const extras = newElement(container, 'div', 'extras');
extras.innerHTML = 'Change language: Alt + Shift | OS: Windows';
let keyCounter = 0;
let rowCounter = 0;
if (localStorage.getItem('lang')) {
  lang = localStorage.getItem('lang');
} else {
  lang = 'en';
}
Object.keys(keyboardPattern).forEach((keys) => {
  const dist = keyboardContainer.children[rowCounter];
  rowCounter += 1;
  for (let i = 0; i < keyboardPattern[keys]; i += 1) {
    const newKey = newElement(dist, 'div', 'key');
    newKey.classList.add(`id-${keyCounter}`);
    if (!keyData[lang][`id-${keyCounter}`]['display-shift'].match(/[A-Za-zА-Яа-я]/) && keyData[lang][`id-${keyCounter}`]['display-shift'] !== '') {
      newKey.innerHTML = `<span class="disp-extra">${keyData[lang][`id-${keyCounter}`]['display-shift']}</span>${keyData[lang][`id-${keyCounter}`].display}`;
    } else if (keyData[lang][`id-${keyCounter}`].display === '') {
      newKey.innerHTML = `<span class="disp-extra">${keyData[lang][`id-${keyCounter}`]['display-shift']}</span>`;
    } else {
      newKey.innerHTML = keyData[lang][`id-${keyCounter}`].display;
    }
    newKey.style.width = `${(100 - 0.5 * keyboardPattern[keys]) / keyboardPattern[keys]}%`;
    keyCounter += 1;
  }
});

// KEY LETTERS CHANGE FUNCTION
const lettersChange = (mode) => {
  let mainChar = '';
  let secondaryChar = '';
  if (keyData[lang]['id-0']['display-shift'] === document.querySelector('.id-0').firstChild.textContent) {
    mainChar = 'display-shift';
    secondaryChar = 'display';
  } else {
    mainChar = 'display';
    secondaryChar = 'display-shift';
  }
  Object.keys(keyData[lang]).forEach((keys) => {
    if (mode) {
      if (!keyData[lang][keys].display.match(/[A-Za-zА-Яа-я]/)) {
        return;
      }
    }
    if (!keyData[lang][keys][mainChar].match(/[A-Za-zА-Яа-я]/) && !soloKeys.includes(keyData[lang][keys].display)) {
      if (!document.querySelector(`.${keys}`).children.length) {
        document.querySelector(`.${keys}`).innerHTML = `<span class="disp-extra">${keyData[lang][keys][secondaryChar]}</span>${keyData[lang][keys][mainChar]}`;
      }
    }
    if (keyData[lang][keys]['display-shift'] !== '' && !soloKeys.includes(document.querySelector(`.${keys}`).textContent)) {
      if (document.querySelector(`.${keys}`).children.length) {
        document.querySelector(`.${keys}`).innerHTML = `<span class="disp-extra">${keyData[lang][keys][secondaryChar]}</span>${keyData[lang][keys][mainChar]}`;
      } else if (document.querySelector(`.${keys}`).textContent.match(/[A-ZА-Я]/)) {
        document.querySelector(`.${keys}`).innerHTML = keyData[lang][keys].display;
      } else if (document.querySelector(`.${keys}`).textContent.match(/[a-zа-я]/)) {
        document.querySelector(`.${keys}`).innerHTML = keyData[lang][keys]['display-shift'];
      }
    }
  });
};

// CHECK EXTRA SPAN
const removeExtraSpan = () => {
  Object.keys(keyData[lang]).forEach((keys) => {
    if (keyData.ru[keys].display.match(/[A-Za-zА-Яа-я]/) && document.querySelector(`.${keys}`).firstChild.className) {
      document.querySelector(`.${keys}`).querySelector('span').innerHTML = '';
    }
  });
};

// KEY HIGHLIGHT & ANIMATION
const addHighlight = (keyName) => {
  Object.keys(keyData[lang]).forEach((keys) => {
    if (keyData[lang][keys]['key-code'] === keyName) {
      document.querySelector(`.${keys}`).classList.add('pressed');
    }
  });
};

const removeHighlight = (keyName) => {
  Object.keys(keyData[lang]).forEach((keys) => {
    if (keyData[lang][keys]['key-code'] === keyName) {
      document.querySelector(`.${keys}`).classList.remove('pressed');
    }
  });
};

// TYPE FUNCTION
const typeSymbol = (keyCode) => {
  Object.keys(keyData[lang]).forEach((keys) => {
    if (!soloKeys.includes(keyData[lang][keys]['display-shift']) && !soloKeys.includes(keyData[lang][keys].display)) {
      if (keyData[lang][keys]['key-code'] === keyCode) {
        textarea.setAttribute('readonly', 'readonly');
        setTimeout(() => {
          textarea.setRangeText(document.querySelector(`.${keys}`).textContent.slice(-1), textarea.selectionStart, textarea.selectionEnd, 'end');
          textarea.removeAttribute('readonly');
        });
      }
      if (copySelection) {
        copySelection = 0;
      }
      if (pasteSelection) {
        pasteSelection = 0;
      }
      if (undoPressed) {
        undoPressed = 0;
      }
      if (cutSelection) {
        cutSelection = 0;
      }
      if (selectAll) {
        selectAll = 0;
      }
      if (tabPressed) {
        tabPressed = 0;
        textarea.value += '\t';
      }
    }
  });
};

// EVENTLISTENERS
window.addEventListener('keydown', (event) => {
  textarea.focus();
  addHighlight(event.code);
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (!shiftPressed) {
      lettersChange(0);
      shiftPressed = 1;
      if (lang === 'ru') {
        removeExtraSpan();
      }
    }
  }
  if (event.code === 'CapsLock') {
    if (!capsPressed) {
      lettersChange(1);
      capsPressed = 1;
      if (lang === 'ru') {
        removeExtraSpan();
      }
    } else {
      capsPressed = 0;
      lettersChange(1);
      if (lang === 'ru') {
        removeExtraSpan();
      }
      removeHighlight(event.code);
    }
  }
  if (event.getModifierState('Alt')) {
    event.preventDefault();
  }
  if (event.getModifierState('Shift') && event.getModifierState('Alt') && !langPressed) {
    if (lang === 'en') {
      lang = 'ru';
      localStorage.setItem('lang', 'ru');
      removeExtraSpan();
    } else if (lang === 'ru') {
      lang = 'en';
      localStorage.setItem('lang', 'en');
    }
    langPressed = 1;
  }
  if (event.getModifierState('Control') && event.code === 'KeyC') {
    copySelection = 1;
  }
  if (event.getModifierState('Control') && event.code === 'KeyV') {
    pasteSelection = 1;
  }
  if (event.getModifierState('Control') && event.code === 'KeyZ') {
    undoPressed = 1;
  }
  if (event.getModifierState('Control') && event.code === 'KeyX') {
    cutSelection = 1;
  }
  if (event.getModifierState('Control') && event.code === 'KeyA') {
    selectAll = 1;
  }
  if (event.code === 'Tab') {
    event.preventDefault();
    tabPressed = 1;
  }
  typeSymbol(event.code);
});
window.addEventListener('keyup', (event) => {
  if (event.code !== 'CapsLock') {
    removeHighlight(event.code);
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    lettersChange(0);
    shiftPressed = 0;
    if (lang === 'ru') {
      removeExtraSpan();
    }
  }
  if (!event.getModifierState('Shift') && !event.getModifierState('Alt')) {
    if (lang === 'ru') {
      removeExtraSpan();
    }
    langPressed = 0;
  }
});
window.addEventListener('mousedown', (event) => {
  textarea.focus();
  let keyClicked;
  try {
    if (event.target.closest('div').className.includes(' pressed')) {
      keyClicked = keyData[lang][event.target.closest('div').className.slice(4).replace(' pressed', '')]['key-code'];
    } else {
      keyClicked = keyData[lang][event.target.closest('div').className.slice(4)]['key-code'];
    }
  } catch (e) {
    // continue regardless of error
  }
  if (keyClicked === 'Tab') {
    tabPressed = 1;
  }
  addHighlight(keyClicked);
  if ((keyClicked === 'ShiftLeft' || keyClicked === 'ShiftRight') && !altPressed) {
    if (!shiftPressed) {
      shiftPressed = 1;
    } else {
      shiftPressed = 0;
      removeHighlight(keyClicked);
    }
    lettersChange(0);
    if (lang === 'ru') {
      removeExtraSpan();
    }
  } else if ((keyClicked === 'ShiftLeft' || keyClicked === 'ShiftRight') && altPressed) {
    shiftPressed = 1;
  } else if (keyClicked === 'AltLeft' || keyClicked === 'AltRight') {
    if (!altPressed) {
      altPressed = 1;
    } else {
      altPressed = 0;
      removeHighlight(keyClicked);
    }
  } else if (!soloKeys.includes(keyClicked) && shiftPressed) {
    typeSymbol(keyClicked);
    setTimeout(() => {
      lettersChange(0);
      shiftPressed = 0;
      if (lang === 'ru') {
        removeExtraSpan();
      }
      removeHighlight(keyClicked);
      removeHighlight('ShiftLeft');
      removeHighlight('ShiftRight');
    }, 150);
  } else if (keyClicked === 'CapsLock') {
    if (!capsPressed) {
      capsPressed = 1;
      lettersChange(1);
      if (lang === 'ru') {
        removeExtraSpan();
      }
    } else {
      capsPressed = 0;
      lettersChange(1);
      if (lang === 'ru') {
        removeExtraSpan();
      }
      removeHighlight(keyClicked);
    }
  } else if (keyClicked === 'ControlLeft' || keyClicked === 'ControlRight') {
    if (!ctrlPressed) {
      ctrlPressed = 1;
    } else {
      ctrlPressed = 0;
      removeHighlight('ControlRight');
      removeHighlight('ControlLeft');
    }
  } else if (keyClicked === 'Enter') {
    textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'Delete') {
    textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd + 1, 'end');
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'Backspace') {
    textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'ArrowLeft') {
    textarea.selectionStart -= 1;
    textarea.selectionEnd = textarea.selectionStart;
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'ArrowRight') {
    textarea.selectionStart += 1;
    textarea.selectionEnd = textarea.selectionStart;
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'ArrowUp') {
    textarea.setRangeText(keyData[lang]['id-54'].display, textarea.selectionStart, textarea.selectionEnd, 'end');
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else if (keyClicked === 'ArrowDown') {
    textarea.setRangeText(keyData[lang]['id-63'].display, textarea.selectionStart, textarea.selectionEnd, 'end');
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  } else {
    if (!ctrlPressed) {
      typeSymbol(keyClicked);
    }
    setTimeout(() => {
      removeHighlight(keyClicked);
    }, 150);
  }
  if (shiftPressed && keyClicked === 'AltLeft') {
    lettersChange(0);
  }
  if (ctrlPressed && (keyClicked === 'KeyC' || keyClicked === 'KeyX')) {
    navigator.clipboard.writeText(window.document.getSelection());
    if (keyClicked === 'KeyX') {
      textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
    }
    ctrlPressed = 0;
    removeHighlight('ControlLeft');
    removeHighlight('ControlRight');
  }
  if (ctrlPressed && keyClicked === 'KeyV') {
    navigator.clipboard.readText().then(
      (clipText) => textarea.setRangeText(clipText, textarea.selectionStart, textarea.selectionEnd, 'end'),
    );
    ctrlPressed = 0;
    removeHighlight('ControlLeft');
    removeHighlight('ControlRight');
  }
  if (ctrlPressed && keyClicked === 'KeyA') {
    textarea.select();
    ctrlPressed = 0;
    removeHighlight('ControlLeft');
    removeHighlight('ControlRight');
  }
  if (shiftPressed && altPressed) {
    shiftPressed = 0;
    altPressed = 0;
    langPressed = 1;
    lettersChange(0);
    if (lang === 'en') {
      lang = 'ru';
      removeExtraSpan();
    } else if (lang === 'ru') {
      lang = 'en';
    }
    setTimeout(() => {
      removeHighlight('ShiftLeft');
      removeHighlight('ShiftRight');
      removeHighlight('AltLeft');
      removeHighlight('AltRight');
    }, 150);
  }
  if (langPressed) {
    lettersChange(0);
    langPressed = 0;
    if (lang === 'ru') {
      removeExtraSpan();
    }
  }
});
window.addEventListener('mouseup', () => {
  textarea.focus();
});
