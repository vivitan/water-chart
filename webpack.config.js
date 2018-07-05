var webpack = require('webpack')

module.exports = {

    entry: {
        waterChart: './src/waterChart.js'
    },

    output: {
        path: __dirname + '/lib',
        filename: '[name].js',
        libraryTarget: 'var',
        library: '[name]'
    },

    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
}