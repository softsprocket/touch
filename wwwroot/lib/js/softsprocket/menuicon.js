
import Element from './element.js';
import FontAwesome from './fontawesome.js';

export default class MenuIcon extends Element {
	
	constructor () {
		super('div');
		this.addClass('base-menu-icon');
		this.icon = new FontAwesome('fa-bars');
		this.icon.addClass('base-menu-icon-style');
		this.appendChild(this.icon);
	}
}
