import Popup from './popup.js';
import Header from './header.js';
import Element from './element.js';

export default class MenuPopup extends Popup {
	constructor () {
		super();
		this.addClass('base-menu-popup');
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
			var item = new MenuPopup.MenuItem(this.body);
			this.body.appendChild(item);
			item.configure(config[i], 'base-menuitem-top');
		}
	}

	setMaxHeight (height) {
		this.body.setMaxHeight(height);
	}	
}

MenuPopup.MenuItem = class extends Element {
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
				var item = new MenuPopup.MenuItem(this.menu);
				this.subElementContainer.appendChild(item);
				item.configure(config.menuItems[i],'base-menuitem-subitem');
			}
		} else if (config.action) {
			this.addEventListener('click', config.action);
			this.setStyleValue('cursor', 'pointer');
		}
	}

	expandAction (ev) {
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
	}

	addExpander () {
		this.expanded = false;
		this.expander = new Element('span');
		this.expander.addClass('base-menuitem-expander');
		this.angle = new Element('i');
		this.angle.addClass('fas');
		this.angle.addClass('fa-angle-down');
		this.angle.addEventListener('click', this.expandAction.bind(this));
		this.expander.appendChild(this.angle);
		this.contentElement.appendChild(this.expander);
		this.contentElement.addEventListener('click', this.expandAction.bind(this));
		this.expander.addEventListener('click', this.expandAction.bind(this));
	}
}
