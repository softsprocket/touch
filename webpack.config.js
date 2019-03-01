const path = require('path');

module.exports = [{
	entry: './wwwroot/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/js')
	},
	optimization: {
		minimize: false
	}
}];

