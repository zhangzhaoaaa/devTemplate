const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.conf.js');

let devWebpackConfig = merge(baseWebpackConfig, {
	devtool: 'source-map',
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new FriendlyErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'css/[name].css'
		})
	]
});

module.exports = devWebpackConfig;
