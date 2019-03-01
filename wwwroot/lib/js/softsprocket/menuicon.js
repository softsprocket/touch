
import Element from './element.js';
import FontAwesome from './fontawesome.js';

export default class MenuIcon extends Element {
	
	constructor () {
		super('div');
		this.addClass('base-menu-icon');
		this.icon = new FontAwesome('fa-bars');
		this.appendChild(this.icon);
	}
}
