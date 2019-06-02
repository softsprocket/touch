

import Element from '../element.js';

export default class Paragraph extends Element {
    constructor (cls) {
        super ('p');
        this.addClass(cls);
    }
    
}