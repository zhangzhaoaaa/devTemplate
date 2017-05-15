const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = require('./env.conf.js');
const entry = require('./entry');
const paths = require('../paths');

let webpackConfig = {
	entry: entry,
	output: {
		path: paths.dist,
		filename: 'js/[name].js'
	},
	resolve: {
        extensions: ['.js', '.jsx'],
		alias: {
			'css': paths.css,
			'io': paths.io,
			'common': paths.common,
			'components': paths.components,
			'widgets': paths.widgets,
			'plugin': paths.plugin,
			'util': paths.util
		}
	},
	module: {
		rules: [{
			test: /\.scss$/,
			include: [paths.css],
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader'
				}, {
					loader: 'postcss-loader',
					options: {
						plugins: function() {
							return [
								require('autoprefixer')({
									browsers: ['Android >= 4.4', '> 1%'],
									remove: false
								})
							];
						}
					}
				}, {
					loader: 'sass-loader'
				}]
			})
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			include: [paths.js]
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				context: 'src/imgs',
				
				publicPath: '../',
				name: 'imgs/[path][name]-[hash:7].[ext]'
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				context: 'src/fonts',
				publicPath: '../',
				name: 'fonts/[path][name]-[hash:7].[ext]'
			}
		}]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor.js',
			minChunks: Infinity
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};

module.exports = webpackConfig;