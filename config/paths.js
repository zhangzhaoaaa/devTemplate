const join = require('path').join;

const contentBase = process.cwd();

const dist = join(contentBase, 'dist');
const src = join(contentBase, 'src');
const view = join(contentBase, 'view');

const js = join(src, 'js');
const page = join(js, 'page');
const io = join(js, 'io');
const plugin = join(js, 'plugin');
const common = join(js, 'common');
const components = join(js, 'components');
const widgets = join(js, 'widgets');
const css = join(src, 'css');
const util = join(js, 'util');
const vendor = join(js, 'vendor');
module.exports = {
	base: contentBase,
	src: src,
	dist: dist,
	view: view,
	js: js,
	page: page,
	common: common,
	components: components,
	css: css,
	io: io,
	widgets: widgets,
	util: util,
	vendor: vendor,
    plugin: plugin
};