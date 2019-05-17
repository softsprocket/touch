const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [{
	entry: './wwwroot/softsprocket-com/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/js')
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
			}
    	]
	},
	plugins: [
			new MiniCssExtractPlugin({
			filename: 'base.css',
		})
	]
},{
	entry: './wwwroot/softsprocket-com/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/softsprocket-com/js')
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
			}
    	]
	},
	plugins: [
			new MiniCssExtractPlugin({
			filename: 'base.css',
		})
	]
},{
	entry: './wwwroot/softsprocket-info/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/softsprocket-info/js')
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
			}
    	]
	},
	plugins: [
			new MiniCssExtractPlugin({
			filename: 'base.css',
		})
	]
},{
	entry: './wwwroot/gregmartin-name/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/gregmartin-name/js')
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
			}
    	]
	},
	plugins: [
			new MiniCssExtractPlugin({
			filename: 'base.css',
		})
	]
},{
	entry: './wwwroot/gmartin-name/js/app.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './wwwroot/gmartin-name/js')
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
			}
    	]
	},
	plugins: [
			new MiniCssExtractPlugin({
			filename: 'base.css',
		})
	]
}];

