const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const HashMapPlugin = require('./plugin/hash-map.js');

const baseWebpackConfig = require('./webpack.base.conf.js');

let webpackConfig = merge(baseWebpackConfig, {
	output: {
		filename: 'js/[name]-[chunkhash:7].js'
	},
	plugins: [
		new WebpackMd5Hash(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor-[chunkhash:7].js',
			minChunks: Infinity
		}),
		new webpack.DefinePlugin({
		  	'process.env': {
		    	NODE_ENV: JSON.stringify('production')
		  	}
		}),
		// 压缩 js
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		// 压缩 css
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: false
		}),
		// 抽离 css 到单独文件
		new ExtractTextPlugin({
			filename: 'css/[name]-[contenthash:7].css'
		}),
		// 生成 hash map
		new HashMapPlugin({
			path: path.join(__dirname, '../hash-map'), // map 文件夹路径
			rotate: 10 // 保留版本记录数
		})
	]
});

module.exports = webpackConfig;
