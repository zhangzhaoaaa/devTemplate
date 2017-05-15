/* 新建 page */

const fs = require('fs');
const path = require('path');

const fsExtra = require('fs-extra');
const rd = require('rd');
const inquirer = require('inquirer');
const chalk = require('chalk');

const logger = require('./logger.js');
const paths = require('../paths');
const buildEnv = require('../buildEnv.json');
const jsPageTargetDir = paths.page;
const cssPageTargetDir = path.join(__dirname, '../../src/css/page/');
const htmlPageTargetDir = path.join(__dirname, '../../view/ejs/page/');

inquirer
	.prompt([{
		type: 'input',
		message: 'Please input new module name',
		name: 'moduleName'
	}])
	.then(answers => {
		if (!answers.moduleName) {
			logger.fatal('Module name is must!');
			return process.exit(0);
		}
		let dirs = rd.readDirSync(jsPageTargetDir);
		if (isExitsModule(answers.moduleName, dirs, jsPageTargetDir)) {
			logger.fatal('Module name is existential!');
			return process.exit(0);
		}
		let target = answers.moduleName;
		const jsTpl = 
`/* css */
import 'css/page/${target}/index.scss';


`;
		const cssTpl = 
`/* ${target} */
@import "../../base/public.scss";
`;
		const htmlTpl = 
`<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>title</title>
	<meta name="keywords" content="title" />
	<meta name="description" content="" />
	<meta name="format-detection" content="telephone=no">
	<meta name="x5-page-mode" content="no-title"/>
	<link rel="stylesheet" type="text/css" href="<%=devenv%>dist/css/${target}.css">
</head>
<body>
	<%- include('../../common/head.ejs')%>
	<!-- main -->
	<div class="wrap">
	
	</div>
	<!-- main -->
	<%- include('../../common/footer.ejs')%>
	<script src="<%=devenv%>dist/js/vendor.js"></script>
	<script src="<%=devenv%>dist/js/${target}.js"></script>
</body>
</html>`;
		const jsTarget = path.join(jsPageTargetDir, target, `index.js`);
		const cssTarget = path.join(cssPageTargetDir, target, `index.scss`);
		const htmlTarget = path.join(htmlPageTargetDir, target, `index.ejs`);
		fsExtra.ensureFileSync(jsTarget);
		fsExtra.ensureFileSync(cssTarget);
		fsExtra.ensureFileSync(htmlTarget);
		fs.writeFileSync(jsTarget, jsTpl);
		fs.writeFileSync(cssTarget, cssTpl);
		fs.writeFileSync(htmlTarget, htmlTpl);

		logger.success(`${chalk.green.bold(jsTarget)} is created`);
		logger.success(`${chalk.green.bold(cssTarget)} is created`);
		logger.success(`${chalk.green.bold(htmlTarget)} is created`);
		logger.success(`Create ${chalk.green.bold(target)} module succeed.`);
	});

function isExitsModule(target, list, prefix) {
	let cur = [];
	return list.indexOf(path.join(prefix, target)) !== -1;
}
