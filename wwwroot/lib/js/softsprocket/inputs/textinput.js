import Input from './input.js';

export default class TextInput extends Input {
	constructor () {
		super('text');
        this.addClass('base-text-input');
    }
   
    setPlaceholder (value) {
        this.setAttribute("placeholder", value);
    }
}
