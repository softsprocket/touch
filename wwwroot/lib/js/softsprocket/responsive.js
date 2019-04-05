import Element from "./element.js";


export default class Responsive {
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



