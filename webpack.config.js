const path = require('path');
const webpack = require('webpack');
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'public');
const UglifyJsPlugin = require('webpack-uglify-js-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const exclude_tmpl = /(node_modules|bower_components|cached_uglify|undr)/;
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    mode: 'development',
    entry: [srcDir + '/js/app.js'],

    output: {
        path: outDir,
        filename: 'js/build.js',
        library: "vikings"
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 3000,
    },
    devtool: "cheap-inline-module-source-map",
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js",
            "window.jQuery": "jquery/dist/jquery.min.js"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
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
        new CopyPlugin([
            {
                from: 'src/img',
                to: 'img'
            },
            {
                from: 'src/fonts',
                to: 'fonts'
            },
        ])
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
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'node_modules/bootstrap/scss/'),
                    path.resolve(__dirname, 'node_modules/flag-icon-css/'),
                    path.resolve(__dirname, 'src/scss/'),
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                    { loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources: 
                            [
                            path.resolve(__dirname, 'node_modules/compass-mixins/lib/_compass.scss'),
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
                            //publicPath: '/src/css/',
                            }
                    }, 
                    {   loader:'css-loader', options:{} }
                ]
            },
            {   test: /\.(woff2?|ttf|eot|svg)$/, 
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {name: 'assets/[name].[ext]'}},
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            }
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