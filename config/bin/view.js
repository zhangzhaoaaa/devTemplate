/* 编译模版 */
const fs = require('fs');
const path = require('path');

const fsExtra = require('fs-extra')
const rd = require('rd');
const ejs = require('ejs');
const paths = require('../paths');
const buildEnv = require('../buildEnv.json');
const viewSrcPath = path.join(paths.view, 'ejs');
const viewDistPath = path.join(paths.view, 'html');

function renderAll() {
	const viewDirs = rd.readDirSync(path.join(viewSrcPath, 'page'));
	viewDirs.shift();
//	fsExtra.removeSync(viewDistPath);
	viewDirs.forEach(item => {
		render(item);
	});
}

function render(item) {
	let ejsFrom = /index\.ejs$/.test(item) ? item : path.join(item, 'index.ejs');
	let key = ejsFrom.replace(path.sep + 'index.ejs', '').match(/.*[\/|\\](.*)/)[1];
	if (fs.existsSync(ejsFrom)) {
		ejs.renderFile(ejsFrom, buildEnv, {}, function(err, str) {
			if (err) throw err;
			let target = path.join(ejsFrom.replace(path.sep + 'index.ejs', ''), '../../../html', key, 'index.html');
			fsExtra.ensureFileSync(target);
			fs.writeFileSync(target, str);
		});
	}
}

// renderAll();

exports.render = render;

exports.renderAll = renderAll;