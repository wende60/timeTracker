
const path = require('path');
const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let argv = require('minimist')(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const output = (isWeb ? 'build/web' : 'build/electron');
const publicPath = (isWeb ? 'http://localhost:8080/build/' : path.join(__dirname, 'src'));

let options = {
    context: __dirname + '/src',
    entry: './index.js',

    output: {
        path: __dirname + '/build',
        publicPath: publicPath,
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            __dirname + '/build',
            'node_modules',
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                        plugins: ["transform-class-properties"]
                    }
                }],

            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("style.css")
    ],

    node: {
        fs: 'empty'
    }
};

options.target = webpackTargetElectronRenderer(options);
module.exports = options;




