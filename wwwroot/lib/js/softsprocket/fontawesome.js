
import Element from './element.js';


export default class FontAwesome extends Element {
	constructor(cls) {
		super('i');

		if (!FontAwesome.hasBeenLoaded) {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", "https://use.fontawesome.com/releases/v5.7.2/css/all.css");
			fileref.setAttribute("integrity", "sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"); 
			fileref.setAttribute("crossorigin", "anonymous");

			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			FontAwesome.hasBeenLoaded = true;
		}

		this.addClass('fas');
		this.addClass(cls);
		this.addClass('base-menu-icon-style');
	}

}


FontAwesome.hasBeenLoaded = false;
