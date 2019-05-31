const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
    const devMode = options.mode !== 'production';

    return {
        /* +++++ entry +++++ */
        entry: __dirname + '/src/index.js',       

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react', 'stage-0'],
                            plugins: ["transform-class-properties"]
                        }
                    }],                
                },
                {
                    test: /\.s?css$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader },
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' },                       
                    ]
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'raw-loader'
                    }]
                }
            ]
        },
    
        /* +++++ plugins +++++ */
        plugins: [
            new MiniCssExtractPlugin()
        ]
    };
};
