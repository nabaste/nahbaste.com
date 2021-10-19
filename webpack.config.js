const path = require('path')

module.exports = {

    mode: 'production',

    entry: ['./src/main.js', './src/scene11.js'],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public')
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    },

    // devtool: 'source-map',
    devtool: false,
}