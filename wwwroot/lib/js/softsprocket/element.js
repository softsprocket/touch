/*
 * creates an html element and provides methods 
 * to mofify it
*/


export default class Element {
	constructor (type) {
		this.el = document.createElement(type);
	}

	getEl () {
		return this.el;
	}

	getStyle () {
		return this.el.style;
	}

	getClassName () {
		return this.el.className;
	}

	addClass (cls) {
		this.el.classList.add(cls);
	}

	removeClass (cls) {
		this.el.classList.remove(cls);
	}

	containsClass (cls) {
		this.el.classList.contains(cls);
	}

	toggleClass (cls) {
		this.el.classList.toggle(cls);
	}

	addEventListener (ev, listener, options) {
		this.el.addEventListener(ev, listener, options);
	}

	removeEventListener (ev, listener, options) {
		this.el.removeEventListener(ev, listener, options);
	}

	dispatchEvent (ev) {
		this.el.dispatchEvent(ev);
	}

	setInnerHTML (html) {
		this.el.innerHTML = html;
	}

	appendChild (cls) {
		this.el.appendChild(cls.el);
	}


	setStyleValue (type, value) {
		this.el.style[type] = value;	
	}

	setWidth (width) {
		this.setStyleValue('width', width);
	}
	
	setHeight (height) {
		this.setStyleValue('height', height);
	}

	setMaxHeight (height) {
		this.setStyleValue('maxHeight', height);
	}

	setAttribute (key, value) {
		this.el.setAttribute(key, value);
	}

	getHeight () {
		var positionInfo = this.el.getBoundingClientRect();
		return positionInfo.height;
	}

	getWidth () {
		var positionInfo = this.el.getBoundingClientRect();
		return positionInfo.width;
	}
}


