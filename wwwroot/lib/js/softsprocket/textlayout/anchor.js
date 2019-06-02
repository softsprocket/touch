
import Element from '../element.js';

export default class Anchor extends Element {
    constructor (cls) {
        super ('a');
        this.addClass(cls);
    }
    
}
