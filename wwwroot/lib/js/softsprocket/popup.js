import Element from './element.js'

export default class Popup extends Element {
	constructor() {
		super('div');
		this.addClass('base-popup');
		this.showing = false; 
	}	

	show () {
		this.addClass('show');
		this.showing = true;
	}

	hide () {
		this.removeClass('show');
		this.showing = false;
	}

	setTop (pos) {
		this.setStyleValue('top', pos)
	}

	setBottom (pos) {
		this.setStyleValue('bottom', pos)
	}

	setLeft (pos) {
		this.setStyleValue('left', pos)
	}

	setRight (pos) {
		this.setStyleValue('right', pos)
	}

	setZIndex (value) {
		this.setStyleValue('z-index', value);
	}
}

