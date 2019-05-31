const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = (env, options) => {
    const webpackConfig = baseConfig(env, options);
    
    return merge.smart(webpackConfig, {
        output: {
            path: __dirname + '/build',
            publicPath: './build',
            filename: 'bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': '"electron"'
                }
            })
        ],
        target: 'electron-main'
    });
};

