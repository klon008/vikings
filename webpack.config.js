const path = require('path');
const webpack = require('webpack');
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'public');
const UglifyJsPlugin = require('webpack-uglify-js-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const exclude_tmpl = /(node_modules|bower_components|cached_uglify|undr|my_sources|js\/libs)/;
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
const devMode = !isProduction;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = [];

const config = {
    mode: 'development',
    entry: [srcDir + '/js/app.js'],

    output: {
        path: outDir,
        filename: 'js/build.js',
        library: "vikings"
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 100,
        ignored: /node_modules/,
    },
    devServer: {
        port: 3000,
        compress: true,
        hot: true,
    },
    devtool: "cheap-inline-module-source-map",
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js",
            "window.jQuery": "jquery/dist/jquery.min.js",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.pug')
        }),
        new FaviconsWebpackPlugin({
            logo: './src/img/logo.png',
            prefix: 'icons-',
            statsFilename: 'iconstats.json',
        }),
        new CopyPlugin([
            { from: './src/img/icons', to: './img/icons' },
        ]),
    ],
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: exclude_tmpl,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.pug$/,
                exclude: exclude_tmpl,
                loader: "pug-loader",
                options: {
                    pretty: true
                }
            },
            {
                test: [/\.scss$/, /\.sass$/],
                include: [
                    path.resolve(__dirname, 'node_modules/bootstrap/scss/'),
                    path.resolve(__dirname, 'node_modules/flag-icon-css/'),
                    path.resolve(__dirname, 'node_modules/material-design-icons/'),
                    path.resolve(__dirname, 'src/scss/'),
                ],
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "resolve-url-loader",
                        options: {
                            outputPath: 'assets',
                            publicPath: '../public'
                        },
                    },
                    "sass-loader",
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources: [
                                path.resolve(__dirname, 'node_modules/compass-mixins/lib/_animate.scss')
                            ],

                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../public',
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                exclude: [],
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets',
                            publicPath: './assets'
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            // webp: {
                            //     quality: 75
                            // }
                        }
                    }
                ]
            }
        ]
    }
};

if (devMode) {
    config.devtool = 'cheap-inline-module-source-map';
}

if (process.env.NODE_ENV === 'production') {

    config.devtool = false;
    config.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                cacheFolder: path.resolve(__dirname, 'cached_uglify/'),
                comments: false,
                minimize: true,
                compress: {
                    sequences: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    warnings: false,
                    drop_console: true,
                    unsafe: true
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}

module.exports.push( config );

const img_config = {
    context: path.join(__dirname, 'src', 'img', 'users'),
}