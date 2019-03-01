
import Element from './element.js';

export default class Title extends Element {
	constructor (html) {
		super('div');
		this.addClass('base-title');
		this.setInnerHTML(html);
	}
}
