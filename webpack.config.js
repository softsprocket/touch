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
},{
	entry: './wwwroot/softsprocket-com/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/softsprocket-com/js')
	},
	optimization: {
		minimize: false
	}
}];

