const path = require('path');
const webpack = require('webpack');
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'public');
const UglifyJsPlugin = require('webpack-uglify-js-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const exclude_tmpl = /(node_modules|bower_components|cached_uglify|undr|my_sources)/;
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
        aggregateTimeout: 300,
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 3000,
        compress: true,
        disableHostCheck: true,
        hot: true,
        lazy: true
    },
    devtool: "cheap-inline-module-source-map",
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js",
            "window.jQuery": "jquery/dist/jquery.min.js"
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        }),
        new HtmlWebpackPlugin({
            template: './src/index.pug'
        }),
        new HtmlBeautifyPlugin({
            config: {
                html: {
                    end_with_newline: true,
                    indent_size: 2,
                    indent_with_tabs: true,
                    indent_inner_html: true,
                    preserve_newlines: true,
                    unformatted: ['p', 'i', 'b', 'span']
                }
            },
            replace: [' type="text/javascript"']
        }),
        // new CopyPlugin([
        //     { from: 'src/favicons/', to: 'public' },
        //   ]),
        new FaviconsWebpackPlugin({
            logo:'./src/img/logo.png',
            prefix: 'icons-',
            statsFilename: 'iconstats.json',
        })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/, exclude: exclude_tmpl, use: {
                    loader: 'babel-loader', options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {test: /\.pug$/, exclude: exclude_tmpl, use: ["pug-loader"]},
            {
                test: [/\.scss$/, /\.sass$/],
                include: [
                    path.resolve(__dirname, 'node_modules/bootstrap/scss/'),
                    path.resolve(__dirname, 'node_modules/flag-icon-css/'),
                    path.resolve(__dirname, 'node_modules/material-design-icons/'),
                    path.resolve(__dirname, 'src/scss/'),
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    /*
                    "style-loader", 
                    для стайлоладера я неправильно загружаю
                    */
                    "css-loader",
                    {
                        loader: "resolve-url-loader",
                        options: {
                            outputPath: 'assets',
                            publicPath: 'assets'
                        },
                    },
                    "sass-loader",
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources:
                                [
                                    path.resolve(__dirname, 'node_modules/compass-mixins/lib/_compass.scss'),
                                    path.resolve(__dirname, 'node_modules/compass-mixins/lib/scss.scss'),
                                ],

                        }
                    }]
            },
            {
                test: /\.css$/, use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '/src/css/',
                        }
                    },
                    {loader: 'css-loader', options: {}}
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                exclude: [],
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets',
                        publicPath: '../assets'
                    },
                },
            },
        ]
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'cheap-inline-module-source-map';
    }

    if (argv.mode === 'production') {

        config.devtool = false;
        config.optimization = {
            minimizer: [new UglifyJsPlugin({
                cacheFolder: path.resolve(__dirname, 'cached_uglify/'),
                debug: true,
                minimize: true,
                sourceMap: false,
                output: {
                    comments: false
                },
                compressor: {
                    warnings: false
                }
            })]
        }
    }

    return config;
};