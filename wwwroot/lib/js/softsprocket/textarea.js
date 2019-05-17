
import Element from './element.js';

export default class TextArea extends Element {
	constructor () {
		super('textarea');
        this.addClass('base-textarea');
    }
    
    setName (name) {
        this.setAttribute("name", name);
    }
   
    setPlaceholder (value) {
        this.setAttribute("placeholder", value);
    }

    getValue () {
        return this.el.value;
    }

    setValue (value) {
        this.el.value = value;
    }
}
