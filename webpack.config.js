var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: __dirname + '/src',
    entry: './index.js',

    output: {
        filename: 'bundle.js',
        path: __dirname + '/build',
        publicPath: 'http://localhost:8080/build/'
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
    ]
};




