import Element from './element.js';
import Panel from './panel.js';
import FontAwesome from './fontawesome.js';
import { timingSafeEqual } from 'crypto';

export default class Select extends Element {
    constructor(options) {
        super ('div');
        this.addClass("base-select");

        this.displayText = new SelectTextDisplay();
        this.appendChild (this.displayText);

        this.selectArrow = new SelectArrow();
        this.appendChild (this.selectArrow);
        
        this.panel = new Panel ();       

        for (var i = 0; i < options.length; ++i) {
            var option = new Option (options[i].value, options[i].text); 
            this.panel.appendChild (option);

            option.addEventListener('click', function (n) {
                if (this.itemSelectedCallback) {
                    this.itemSelectedCallback(n);
                }
            }.bind(this, options[i].value));
        }

        this.panel.hide();
        this.panel.hidden = true;
        this.appendChild(this.panel);

        this.addEventListener('click', this.clickHandler.bind(this));

    }

    clickHandler () {
        console.log ("in clickHandler");
        if (this.panel.hidden) {
            var bb = this.getBoundingClientRect();
            var pb = this.getParent ().getBoundingClientRect();
            var top = 0; 
            var left = 0;     
            this.panel.setTop(`${top}px`);
            this.panel.setLeft(`${left}px`);
            this.panel.setWidth (`${this.getWidth()}px`);
            

            this.panel.show();
            this.selectArrow.opened();
            this.panel.hidden = false;
        } else {
            this.panel.hide();
            this.selectArrow.closed();
            this.panel.hidden = true;
        }           
        
    }

    onSelect (fn) {
        this.itemSelectedCallback = fn;
    }

    setDisplayText (txt) {
        this.initDisplayText = txt;
        this.displayText.setText (txt);
    }   
    
    addOptionsPanelClass (cls) {
        this.panel.addClass(cls);
    }
} 

class Option extends Element {
    constructor(value, text) {
        super('div');
        this.addClass('base-option')
        this.el.value = value;
        this.setInnerHTML (text);
    }
}

class SelectTextDisplay extends Element {
    constructor() {
        super('span');
        this.addClass('base-select-text-display');
    }

    setText (txt) {
        this.setInnerHTML(txt);
    }
}

class SelectArrow extends Element {
    constructor() {
        super ('span');
        this.addClass ('base-select-arrow');
        this.up = new FontAwesome('fa-caret-up');
        this.down = new FontAwesome('fa-caret-down');
        this.appendChild(this.down)

        this.isClosed = true; 
    }

    opened () {
        if (this.isClosed) { 
            this.removeChild(this.down);
            this.appendChild(this.up);

            this.isClosed = false;
        }
    }

    closed () {
        if (!this.isClosed) {
            this.removeChild(this.up);
            this.appendChild(this.down);

            this.isClosed = true;
        }
    }
}