const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: [
        'babel-polyfill',
        './src/main/client/index.js',
        './src/main/client/styles/styles.scss'
    ],
    cache: true,
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/'),
        filename: 'bundle.js',
        publicPath: '/dhis-integration/'
    },
    plugins: [
        new ExtractTextPlugin('styles.css', {allChunks: true}),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, './src/main/client/styles/fonts'),
                to: path.join(__dirname, './src/main/resources/static/dhis-integration/fonts'),
            },
            {
                from: path.join(__dirname, './src/main/client/styles/images'),
                to: path.join(__dirname, './src/main/resources/static/dhis-integration/images'),
            }
        ], { copyUnmodified: true }
        )
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash].[ext]',
                            emitFile: false
                        }
                    }
                ]
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract([
                    {loader: 'css-loader'},
                    {loader: 'resolve-url-loader'},
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            includePaths: [
                                './node_modules',
                                './src/main/client'
                            ]
                        }
                    }
                ])
            }

        ]
    }
};
