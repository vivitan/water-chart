/**
 * Created by tanxiaowei on 18/3/25.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        hot: true

    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("main.css"),

    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                                // modules: true,
                                // localIdentName: '[path][name]__[local]--[hash:base64:5]'
                            }
                        }
                    ]
                }))
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            context: path.resolve(__dirname, "src/css"),
                            name: '[path][name].[ext]'
                        }
                    },
                    { loader: 'svg-fill-loader'}
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            context: path.resolve(__dirname, "src/css"),
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }],
            },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
