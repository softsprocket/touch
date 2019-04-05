import Element from './element.js';

export default class Copyright extends Element {
	constructor(str) {
		super('span');
		this.addClass('base-copyright');
		var dt = new Date();
		this.setInnerHTML('&copy; ' + str + ' ' + dt.getFullYear());
	}
}

