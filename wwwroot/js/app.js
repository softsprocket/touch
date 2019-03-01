import SoftSprocket from '../lib/js/softsprocket.js'

onload = function () {
	var header = new SoftSprocket.Header ();
	document.body.appendChild (header.getEl());

	var footer = new SoftSprocket.Footer ();
	document.body.appendChild (footer.getEl());

	footer.appendChild(new SoftSprocket.Copyright('SoftSprocket'));

	var title = new SoftSprocket.Title("Hello, World");
	header.appendChild(title);

	var menuIcon = new SoftSprocket.MenuIcon();
	header.appendChild(menuIcon);

	var menuPopup = new SoftSprocket.MenuPopup ();
	document.body.appendChild(menuPopup.getEl());

	var configured = false;

	menuIcon.addEventListener ('click', function (ev) {
		console.log (ev);

		if (!menuPopup.showing) {
			if(!configured) {		
				menuPopup.setWidth ('200px');
				menuPopup.setMaxHeight ('300px');
				menuPopup.setRight ('50px');
				menuPopup.setTop ('100px');

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
						text: "hello",
						action: function (ev) {
							console.log (ev);
						}
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
