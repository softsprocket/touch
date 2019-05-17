import Element from './element.js';

export default class Panel extends Element {
    constructor() {
        super('panel');
        this.addClass('base-panel');
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
