/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/element.js
/*
 * creates an html element and provides methods 
 * to mofify it
*/


class Element {
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



// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/footer.js



class footer_Footer extends Element {
	constructor () {
		super('footer');
		this.addClass('base-footer');
	}
}

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/header.js



class header_Header extends Element {
	constructor () {
		super('header');
		this.addClass('base-header');
	}
}

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/title.js



class title_Title extends Element {
	constructor (html) {
		super('div');
		this.addClass('base-title');
		this.setInnerHTML(html);
	}
}

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/fontawesome.js




class fontawesome_FontAwesome extends Element {
	constructor(cls) {
		super('i');

		if (!fontawesome_FontAwesome.hasBeenLoaded) {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", "https://use.fontawesome.com/releases/v5.7.2/css/all.css");
			fileref.setAttribute("integrity", "sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"); 
			fileref.setAttribute("crossorigin", "anonymous");

			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			fontawesome_FontAwesome.hasBeenLoaded = true;
		}

		this.addClass('fas');
		this.addClass(cls);
		this.addClass('base-menu-icon-style');
	}

}


fontawesome_FontAwesome.hasBeenLoaded = false;

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/menuicon.js




class menuicon_MenuIcon extends Element {
	
	constructor () {
		super('div');
		this.addClass('base-menu-icon');
		this.icon = new fontawesome_FontAwesome('fa-bars');
		this.appendChild(this.icon);
	}
}

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/popup.js


class popup_Popup extends Element {
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
}


// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/menupopup.js




class menupopup_MenuPopup extends popup_Popup {
	constructor () {
		super();
		this.header = new Element('header');
		this.header.addClass('base-menu-header');
		this.appendChild(this.header);

		this.headerText = new Element('span');
		this.headerText.addClass('base-menu-header-text');
		this.headerText.setInnerHTML('Menu');

		this.header.appendChild(this.headerText);

		this.body = new Element('div');
		this.body.addClass('base-menu-body');
		this.appendChild(this.body);

	}

	setMenuItems (config) {
		for (var i = 0; i < config.length; ++i) {
			var item = new menupopup_MenuPopup.MenuItem(this.body);
			this.body.appendChild(item);
			item.configure(config[i], 'base-menuitem-top');
		}
	}

	setMaxHeight (height) {
		this.body.setMaxHeight(height);
	}	
}

menupopup_MenuPopup.MenuItem = class extends Element {
	constructor(menu) {
		super('div');
		this.menu = menu;
		this.addClass('base-menuitem');
		this.contentElement = new Element('div');
		this.contentElement.addClass('base-menuitem-container');
		this.appendChild(this.contentElement);
	}

	configure (config, cls) {
		this.addClass(cls);
		this.text = new Element('span');
		this.text.setInnerHTML(config.text);
		this.contentElement.appendChild(this.text);

		if (config.menuItems) {
			this.addExpander();	
			this.subElementContainer = new Element('div');
			this.subElementContainer.addClass('base-menuitem-subcontainer');
			this.menu.appendChild(this.subElementContainer);

			for (var i = 0; i < config.menuItems.length; ++i) {
				var item = new menupopup_MenuPopup.MenuItem(this.menu);
				this.subElementContainer.appendChild(item);
				item.configure(config.menuItems[i],'base-menuitem-subitem');
			}
		} else if (config.action) {
			this.addEventListener('click', config.action);
			this.setStyleValue('cursor', 'pointer');
		}
	}

	addExpander () {
		this.expanded = false;
		this.expander = new Element('span');
		this.expander.addClass('base-menuitem-expander');
		this.angle = new Element('i');
		this.angle.addClass('fas');
		this.angle.addClass('fa-angle-down');
		this.expander.appendChild(this.angle);
		this.contentElement.appendChild(this.expander);
		this.expander.addEventListener('click', function (ev) {
			if (this.expanded) {
				this.angle.removeClass('fa-angle-up');
				this.angle.addClass('fa-angle-down');
				this.subElementContainer.addClass('base-menuitem-subcontainer');
				this.expanded = false;
			} else {
				this.angle.removeClass('fa-angle-down');
				this.angle.addClass('fa-angle-up');
				this.subElementContainer.removeClass('base-menuitem-subcontainer');

				this.expanded = true;
			}
		}.bind(this));
	}
}

// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/copyright.js


class copyright_Copyright extends Element {
	constructor(str) {
		super('span');
		this.addClass('base-copyright');
		var dt = new Date();
		this.setInnerHTML('&copy; ' + str + ' ' + dt.getFullYear());
	}
}


// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket/responsive.js



class Responsive {
	constructor () {
		var metaTags = document.getElementsByTagName("meta");
		for (var i = 0; i < metaTags.Length; ++i) {
			var name = metaTags[i].getAttribute("name");
			if (name && name == "viewport") {
				this.viewportMeta = metaTags[i];
			}
		}
	}

	viewportTagSet () {
		return this.viewportMeta != undefined;
	}
}




// CONCATENATED MODULE: ./wwwroot/lib/js/softsprocket.js










var SoftSprocket = {
	Element: Object.assign(Element),
	Footer: Object.assign(footer_Footer),
	Header: Object.assign(header_Header),
	Title: Object.assign(title_Title),
	MenuIcon: Object.assign(menuicon_MenuIcon),
	Popup: Object.assign(popup_Popup),
	MenuPopup: Object.assign(menupopup_MenuPopup),
	Copyright: Object.assign(copyright_Copyright),
	Responsive: Object.assign(Responsive)
};


/* harmony default export */ var softsprocket = (SoftSprocket);

// CONCATENATED MODULE: ./wwwroot/gmartin-name/js/app.js


onload = function () {
	var responsive = new softsprocket.Responsive ();

	var header = new softsprocket.Header ();
	document.body.appendChild (header.getEl());

	var footer = new softsprocket.Footer ();
	document.body.appendChild (footer.getEl());

	footer.appendChild(new softsprocket.Copyright('SoftSprocket'));

	var title = new softsprocket.Title("GMartin");
	header.appendChild(title);

	var menuIcon = new softsprocket.MenuIcon();
	header.appendChild(menuIcon);

	var menuPopup = new softsprocket.MenuPopup ();
	document.body.appendChild(menuPopup.getEl());

	var configured = false;

	menuIcon.addEventListener ('click', function (ev) {
		console.log (ev);

		if (!menuPopup.showing) {
			if(!configured) {		
				menuPopup.setWidth ('300px');
				menuPopup.setRight ('0px');
				menuPopup.setTop (`${header.getHeight()}px`);
				menuPopup.setBottom (`${footer.getHeight()}px`);

				menuPopup.setMenuItems ([
					{
						text: "hello",
						menuItems:[
							{
								text: "world",
								action: function (ev) {
									console.log (ev);
								}
							},
							{
								text: "monde",
								action: function (ev) {
									console.log (ev);
								}
							}
						]
					},
					{
						text: "hello",
						menuItems:[
							{
								text: "world",
								action: function (ev) {
									console.log (ev);
								}
							},
							{
								text: "monde",
								action: function (ev) {
									console.log (ev);
								}
							}
						]
					},
					{
						text: "Links",
						menuItems:[
							{
								text: "SoftSprocket",
								action: function (ev) {
									window.location.href = "https://www.softsprocket.com";
								}
							},
							{
								text: "SoftSprocket Info",
								action: function (ev) {
									window.location.href = "https://www.softsprocket.info";
								}
							},
							{
								text: "Greg Martin",
								action: function (ev) {
									window.location.href = "https://www.gregmartin.name";
								}
							}
						]
					}
				]);
				configured = true;
			}
			menuPopup.show ();
		} else {
			menuPopup.hide ();
		}

	});
}


/***/ })
/******/ ]);