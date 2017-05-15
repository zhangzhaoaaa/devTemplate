const path = require('path');
const opn = require('opn');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chokidar = require('chokidar');

const paths = require('../paths');
const configFun = require('../webpack/common.conf.js');
const env = require('../webpack/env.conf');
const webpackConfig = require('../webpack/webpack.dev.conf.js');
const { renderAll } = require('./view.js');


const compiler = webpack(webpackConfig);

let port = process.argv.length > 3 ? process.argv[3] : 80;

if (env === 'production') {
    port = 443;
}
if (env === 'lcdev' && port === 80) {
    port = 8080;
}

const config = configFun(port);

const server = new WebpackDevServer(compiler, {
	stats: 'none',
	https:env === 'production',
	contentBase: process.cwd(),
	publicPath: config['publicPath'][env],
	compress: true, // 开启gzip压缩
	headers: {
		'Access-Control-Allow-Origin': '*'
	},
	proxy: {
        '^/m/vpc/dist/**/**': {
            target: config[env], // 'http://js.pre.meixincdn.com'
            secure: false,
            pathRewrite: function(p, req){
            	var r = /(.*\/.*)(-.*)(\.(?:js|css))/;
                var rimg = /(.*\/.*)(\.(?:png|gif|jpe?g))/;

               // console.log(p);
            	if (r.test(p)) {
            		/*console.log(p.replace(r, function(input, $1, $2, $3){
            			console.log(input, $1, $2, $3);
                        return $1 + $3;
                    }).replace(/\/m\/vpc/, ''))*/

                    return p.replace(r, function(input, $1, $2, $3){
                        return $1 + $3;
                    }).replace(/\/m\/vpc/, '');
				} else if (rimg.test(p)) {
            		//console.log(p, p.replace(/\/m\/vpc/, ''));
                    return p.replace(/\/m\/vpc/, '');
				} else {
            		return p;
				}
            }
        },
        '^/CDN*/dist/**/**': {
            target: config[env], // 'http://js.pre.meixincdn.com'
            secure: false,
            pathRewrite: function(p, req){
                var r = /(.*\/.*)(-.*)(\.(?:js|css))/;
                var rimg = /(.*\/.*)(\.(?:png|gif|jpe?g))/;

                // console.log(p);
                if (r.test(p)) {
                    /*console.log(p.replace(r, function(input, $1, $2, $3){
                        console.log(input, $1, $2, $3);
                        return $1 + $3;
                    }).replace(/\/CDN\d{4,5}/, ''))*/

                    /*return p.replace(r, function(input, $1, $2, $3){
                        return $1 + $3;
                    }).replace(/\/CDN\d{4,5}/, '');*/
                    return p.replace(r, function(input, $1, $2, $3){
                        return $1 + $3;
                    });
                } else if (rimg.test(p)) {
                   // console.log(p, p.replace(/CDN\d{4,5}/, ''));
                    return p.replace(/\/CDN\d{4,5}/, '');
                } else {
                    return p;
                }
            }
        }
	}
});

const viewPath = path.join(paths.view, 'ejs');

if (env === 'lcdev') {
	let ck = chokidar.watch(viewPath);
    ck.on('add', filePath => renderAll())
        .on('change', filePath => renderAll())
        .on('unlink', filePath => renderAll());
    renderAll();
}

server.listen(config.port, "0.0.0.0", function() {
	console.log(`Starting server on http://localhost:${config.port}`);
	// opn(`http://localhost:${config.port}`);
});
