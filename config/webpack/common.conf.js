const paths = require('../paths');
const buildEnv = require('../buildEnv.json');

module.exports = function (port) {
    return {
        assetsRoot: paths.dist,
        port: port,
        lcdev: 'http://localhost:' + port,
        // dev: 'http://js.dev.meixincdn.com',
        // pre: 'http://js.pre.meixincdn.com',
        dev: `http://js.dev.meixincdn.com:${port}`, //分支开发时,改新的地址,后续需要考虑flame本身的分支策略
        pre: 'http://js.pre.meixincdn.com',
        production: 'https://js.meixincdn.com',
        publicPath: {
            lcdev: `http://localhost:${port}${buildEnv.cdnenv}dist`,
            // dev: `http://js.dev.meixincdn.com${buildEnv.cdnenv}dist`,
            dev: `http://js.pre.meixincdn.com${buildEnv.cdnenv}dist`,
            // pre: `http://js.pre.meixincdn.com${buildEnv.cdnenv}dist`,
            pre: `http://js.pre.meixincdn.com${buildEnv.cdnenv}dist`,
            production: `https://js.meixincdn.com${buildEnv.cdnenv}dist`, // https://js.meixincdn.com
            feature: `http://js.pre.meixincdn.com/CDN${port}/dist`
        }
    }
};
