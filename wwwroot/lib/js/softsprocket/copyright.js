import Element from './element.js';

export default class Copyright extends Element {
	constructor(str) {
		super('span');
		var dt = new Date();
		this.setInnerHTML('&copy; ' + str + ' ' + dt.getFullYear());
	}
}

