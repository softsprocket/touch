
import Input from './input.js';

export default class ButtonInput extends Input {
	constructor (value) {
        super ('button');
        this.setValue (value);
        this.addClass ('base-button-input');
    }
}
