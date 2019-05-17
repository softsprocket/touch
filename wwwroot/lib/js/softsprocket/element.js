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

	setInnerHTML (txt) {
		this.el.innerHTML = txt;
	}

	getInnerHTML () {
		return this.el.innerHTML;
	}

	appendInnerHTML (txt) {
		this.el.innerHTML += txt;
	}

	appendChild (obj) {
		this.parent = obj;
		this.el.appendChild(obj.el);
	}

	getParent () {
		return this.parent;
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

	getAttribute (key) {
		this.el.getAttribute(key);
	}

	removeAttribute (key) {
		this.el.removeAttribute (key);
	}	

	getHeight () {
		var positionInfo = this.el.getBoundingClientRect();
		return positionInfo.height;
	}

	getWidth () {
		var positionInfo = this.el.getBoundingClientRect();
		return positionInfo.width;
	}

	removeChildren () {
		while (this.el.firstChild) {
			this.el.removeChild(this.el.firstChild);
		}
	}
	
	removeChild (child) {
		this.el.removeChild(child.el);
	}


	getBoundingClientRect () {
		return this.el.getBoundingClientRect();
	}

	focus () {
		this.el.focus();
	}

	getTagName () {
		return this.el.tagName;
	}
}


