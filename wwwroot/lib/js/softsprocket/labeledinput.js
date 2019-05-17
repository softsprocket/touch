import Element from './element.js';

export default class LabeledInput extends Element {
    constructor (label, input) {
        super('div');

        this.addClass('base-labeled-input');        
        this.appendChild(label);
        this.appendChild(input);
    }   
} 