
import Element from '../element.js';

export default class Preformatted extends Element {
    constructor (cls) {
        super ('pre');
        this.addClass(cls);
    }
    
}