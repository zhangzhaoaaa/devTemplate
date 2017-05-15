/* 移除模板文件 */
const fs = require('fs');
const path = require('path');

const fsExtra = require('fs-extra');
const rd = require('rd');
const inquirer = require('inquirer');
const chalk = require('chalk');

const logger = require('./logger.js');
const paths = require('../paths');
const { renderAll } = require('./view.js');

const jsPageTargetDir = paths.page;
const cssPageTargetDir = path.join(__dirname, '../../src/css/page/');
const htmlPageTargetDir = path.join(__dirname, '../../view/ejs/page/');

let dirs = rd.readDirSync(jsPageTargetDir);
dirs.shift();
dirs = dirs.map(item => item.match(/.*\/(.*)/)[1]);

inquirer
	.prompt([{
		type: 'list',
		message: 'Which module you want to delete',
		name: 'moduleName',
		choices: dirs
	}])
	.then(answer => {
		const target = answer.moduleName;
		const jsTarget = path.join(jsPageTargetDir, target, `index.js`);
		const cssTarget = path.join(cssPageTargetDir, target, `index.scss`);
		const htmlTarget = path.join(htmlPageTargetDir, target, `index.ejs`);

		fs.unlinkSync(jsTarget);
		fs.unlinkSync(cssTarget);
		fs.unlinkSync(htmlTarget);
		fsExtra.removeSync(path.join(jsPageTargetDir, target));
		fsExtra.removeSync(path.join(cssPageTargetDir, target));
		fsExtra.removeSync(path.join(htmlPageTargetDir, target));
		renderAll();

		logger.success(`${chalk.green.bold(jsTarget)} is deleted`);
		logger.success(`${chalk.green.bold(cssTarget)} is deleted`);
		logger.success(`${chalk.green.bold(htmlTarget)} is deleted`);
		logger.success(`Delete ${chalk.green.bold(target)} module succeed.`);
	})