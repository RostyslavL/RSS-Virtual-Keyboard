/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
import * as storage from './Storage.js';
import create from './utils/create.js';
import language from './layouts/index.js'; // languages export :  { ru, en }
import Key from './Key.js';

const main = create('main', '', 
    [create('h1', 'title', 'RSS Virtual Keyboard'),
    create('p', 'hint', 'Use left <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language. Last language saves in localStorage')
  ]);

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keysPressed = {};
    this.isCaps = false;
  }

  init(code) {
    this.keyBase = language[code];
    this.output = create('textarea', 'output', null, main,
      ['placeholder', 'Start typing...)'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);
    this.container = create('div', 'keyboard', null, main, ['language', code]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create('div', 'keyboard__row', null, this.container, ['row', i + 1]);
      rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });
    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
  }

  handleEvent = (e) => {
    if(e.stopPropagation) e.stopPropagation();
    const {code, type}  = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if(!keyObj) return;
    this.output.focus();

    if(type.match(/keydown|mousedown/)) {
      if(type.match(/key/)) e.preventDefault();
      keyObj.div.classList.add('active');
  }else if(type.match(/keyup|mouseup/)) { 
      keyObj.div.classList.add('active');
  }

  
} 
