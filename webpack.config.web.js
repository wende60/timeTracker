const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = (env, options) => {
    const webpackConfig = baseConfig(env, options);

    return merge.smart(webpackConfig, {
        output: {
            path: __dirname + '/build',
            publicPath: 'http://localhost:4080/build',
            filename: 'bundle.js'
        },
        optimization: {
            nodeEnv: 'web'
        },
        node: {
            fs: 'empty'
        },
        target: 'web',
        devServer: {
            inline: true,
            port: 4000
        }    
    });
};

