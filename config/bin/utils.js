const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.cssLoaders = function(options) {
    options = options || {};

    function generateLoaders(loaders) {
        let sourceLoader = loaders.map(function(loader) {
            let extraParamChar;
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?');
                extraParamChar = '&';
            } else {
                loader = loader + '-loader';
                extraParamChar = '?';
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '');
        });
        if (options.extract) {
            // 生成 extract-text-webpack-plugin 格式 loader
            return ExtractTextPlugin.extract({
                use: sourceLoader,
                fallback: 'style-loader'
            });
        } else {
            return ['style-loader', sourceLoader].join('!');
        }
    }

    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    }
}

// 生成 css 方言 loader
exports.styleLoaders = function(options) {
    let output = [];
    let loaders = exports.cssLoaders(options);
    for (let extension in loaders) {
        let loader = loaders[extension];
        loader.push({
            loader: 'postcss-loader',
            options: {
                plugins: function() {
                    return [
                        require('autoprefixer')
                    ];
                }
            }
        })
        console.log(loader);
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader
        });
    }
    return output;
}
