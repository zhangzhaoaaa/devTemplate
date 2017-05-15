/*
 * 生成 map 文件 以文件名 '-' 后的字符串作为 hash 值记录
 * options.path : map 文件夹路径
 * options.rotate : 保留 map 文件数
 */
const fs = require('fs');
const path = require('path');
var joinPath = require('path.join');
const fsExtra = require('fs-extra');
const rd = require('rd');

let configFun = require('../common.conf.js');
let configProject = require('../../buildEnv.json');

function HashMapPlugin(options) {
	this.options = options || {};
	if (!options.path) {
		throw 'options.path is required!';
	}
	this.options.path = options.path || 'hash-map';
	this.options.rotate = this.options.rotate || 10;
}

HashMapPlugin.prototype.apply = function(compiler) {

    let port = (process.env.NODE_ENV == 'feature' && process.argv.length > 2 ) ? process.argv[2]: '';
    const config  = configFun(port);
	compiler.plugin('emit', (compilation, callback) => {

		// 修正静态资源 plublicPath
		let publicPath = '';
		switch(process.env.NODE_ENV) {
			case 'dev':
				publicPath = config.publicPath.dev;
				break;
			case 'pre':
				publicPath = config.publicPath.pre;
				break;
			case 'production':
				publicPath = config.publicPath.production;
				break;
            case 'feature':
                publicPath = config.publicPath.feature;
                break;
		}

		let resultMap = {};

		let localHash = {};

		localHash.publicPath = publicPath;
		localHash.page = {};

		fsExtra.ensureDirSync(joinPath(this.options.path));

		let vendorDir = '';
		let vendorKey = '';
		let vendorHash = '';

		Object.keys(compilation.assets).forEach(item => {
			// console.log(item);
			let basename = path.basename(item);
			let extname = path.extname(item);
			let dirname = path.dirname(item);
			if (extname === '.css' || extname === '.js') {
				let hash = basename.match(/.*-(.*)/)[1].replace(extname, '');
				let key = basename.replace('-' + hash, '').replace(extname, '');

				if (key === 'vendor') {
					vendorDir = dirname;
					vendorKey = key;
					vendorHash = hash;
				}

				if (!resultMap[key] && key !== 'vendor') {
					resultMap[key] = { css: [], js: [] };
				};
				if (!localHash.page[key] && key !== 'vendor') {
					localHash.page[key] = { css: [], js: [] };
				};

				if (key !== 'vendor') {
					let resultMapCurArray = resultMap[key][extname.replace('.', '')];
					let localHashCurArray = localHash.page[key][extname.replace('.', '')];
					resultMapCurArray.push(`${publicPath}/${joinPath(dirname, key)}-${hash}${extname}`);
					localHashCurArray.push({
						path: path.join(dirname, key),
						hash: hash,
						extname: extname
					});

					if (vendorKey) {
						let vendorPath = `${publicPath}/${joinPath(vendorDir, vendorKey)}-${vendorHash}.js`;
						if (resultMap[key]['js'].indexOf(vendorPath) === -1) resultMap[key]['js'].unshift(vendorPath);
						if (localHash.page[key]['js'].indexOf(vendorPath) === -1) localHash.page[key]['js'].unshift({
							path: joinPath(vendorDir, vendorKey),
							hash: vendorHash,
							extname: '.js'
						});
					}
				}

				this.addFileToAssets(compilation, path.join(dirname, key + extname), compilation.assets[item]._value);
			};
		});

		let now = Date.now();

		let mapTarget = `${formatDate(now, 'yyyy-MM-dd_hh-mm-ss')}.json`;

		// 生成版本记录
		this.addFileToAssets(compilation, `${path.relative(compiler.options.output.path, this.options.path)}/${mapTarget}`, JSON.stringify(localHash, null, 4));

		// 生成 flame/version.php
		// this.addFileToAssets(compilation, `${path.relative(compiler.options.output.path, path.join(__dirname, '../'))}/flame/h5/v-${process.env.NODE_ENV === 'production' ? 'pro' : process.env.NODE_ENV}.php`, `<?php\n\nreturn '${JSON.stringify(resultMap, null, 4)}';`)
		// this.addFileToAssets(compilation, `${path.relative(compiler.options.output.path, path.join(__dirname, '../'))}/flame/m/v-${process.env.NODE_ENV === 'production' ? 'pro' : process.env.NODE_ENV}.php`, `<?php\n\nreturn '${JSON.stringify(resultMap, null, 4)}';`)
		this.addFileToAssets(compilation, `${path.relative(compiler.options.output.path, path.join(__dirname, '../'))}/flame/${configProject.project}/v-${process.env.NODE_ENV === 'production' ? 'pro' : process.env.NODE_ENV}.php`, `<?php\n\nreturn '${JSON.stringify(resultMap, null, 4)}';`)

		callback();
	});

	compiler.plugin('after-emit', (compilation, callback) => {

		// 获取所有的版本记录
		const allRecodHashFiles = rd.readFileSync(this.options.path);
		allRecodHashFiles.forEach(function(dir, index, arr) {
		    if (dir.indexOf('.DS_Store') !== -1) { // 过滤隐藏文件
		        allRecodHashFiles.splice(index, 1);
		    }
		});

		// 删除超出版本记录数的版本文件
		let shouldDeleteHashFiles = allRecodHashFiles.reverse().splice(this.options.rotate);
		shouldDeleteHashFiles.forEach(item => {
			fs.unlinkSync(item);
		});

		// 获取所有不用删除的文件列表
		let allRetainFiles = [];
		allRecodHashFiles.forEach(item => {
			let mapJson = fsExtra.readJsonSync(item);
			Object.keys(mapJson.page).forEach(page => {
				mapJson.page[page].css.forEach(item => {
					let filePath = item.path + '-' + item.hash + item.extname;
					if (allRetainFiles.indexOf(filePath) === -1) {
						allRetainFiles.push(filePath);
						allRetainFiles.push(item.path + item.extname);
					};
				});
				mapJson.page[page].js.forEach(item => {
					let filePath = item.path + '-' + item.hash + item.extname;
					if (allRetainFiles.indexOf(filePath) === -1) {
						allRetainFiles.push(filePath);
						allRetainFiles.push(item.path + item.extname);
					};
				});
			});
		});
		allRetainFiles = allRetainFiles.map(item => path.join(compiler.options.output.path, item));

		// 获取所有文件列表
		let allFiles = rd.readFileSync(path.join(compiler.options.output.path, 'js')).concat(rd.readFileSync(path.join(compiler.options.output.path, 'css')));
		// 不匹配的全部删除
		allFiles.forEach(item => {
			if (allRetainFiles.indexOf(item) === -1) {
				fs.unlinkSync(item);
			}
		});

		callback();
	})
};

HashMapPlugin.prototype.addFileToAssets = function(compilation, path, content) {
	compilation.assets[path] = {
		source: () => content,
		size: () => content.length
	};
};

function formatDate(value, format) {
	let curDate = new Date(value);
	const o = {
		'M+': curDate.getMonth() + 1, // 月份
		'd+': curDate.getDate(), // 日
		'h+': curDate.getHours(), // 小时
		'm+': curDate.getMinutes(), // 分
		's+': curDate.getSeconds(), // 秒
		'q+': Math.floor((curDate.getMonth() + 3) / 3), // 季度
		'S': curDate.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (curDate.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	}
	return format;
};

module.exports = HashMapPlugin;
