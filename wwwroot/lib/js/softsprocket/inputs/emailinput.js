import Input from './input.js';

export default class EmailInput extends Input {
	constructor () {
		super('email');
        this.addClass('base-email-input');
    }
    
    setPlaceholder (value) {
        this.setAttribute("placeholder", value);
    }
}
