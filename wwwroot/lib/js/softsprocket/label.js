

import Element from './element.js';

export default class Label extends Element {
	constructor (name, value) {
        super('label');
        this.setAttribute("name", name);
        this.setInnerHTML(value);
        this.addClass('base-label');
    }
    
}
