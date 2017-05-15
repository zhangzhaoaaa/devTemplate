const fs = require('fs');
const path = require('path');
const paths = require('../paths');

const pagePath = paths.page;

let entrys = {
	vendor: ['jquery', 'react', 'react-dom', 'GMP'],
};
let pages = fs.readdirSync(pagePath);
pages.forEach(function(dir, index, arr) {
    if (dir.indexOf('.') !== 0) { // 过滤隐藏文件
        entrys[dir] = path.join(pagePath, dir, 'index.js');
    }
});

module.exports = entrys;
