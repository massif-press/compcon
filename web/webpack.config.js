const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { HotModuleReplacementPlugin, DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/renderer/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
    },
    devServer: {
        port: 1000,
        hot: true,
        open: true,
        // historyApiFallback: true
    },
    module: {
        rules: [
            {
                // Test for a polyfill (or any file) and it won't be included in your
                // bundle
                test: path.resolve(__dirname, 'node_modules/library/polyfill.js'),
                use: 'null-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true
                        }
                    }
                ],
            },
            // Need babel-loader to transpile for iOS compatibility, doesn't seem like ts-loader can achieve this on its own...?
            // Should investigate
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                [
                                    "@babel/preset-env",
                                    {
                                        useBuiltIns: "entry"
                                    }
                                ],
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'font',
                    name: '[hash].[ext]',
                    esModule: false,
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    outputPath: 'img',
                    name: '[name].[ext]?[hash]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.vue', '.js'],
        alias: {
            '@': path.resolve('src/renderer'),
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin([
            { from: 'static', to: 'static' },
            { from: 'web/public/_redirects', to: '.' }
        ]),
        new HTMLWebpackPlugin({
            showErrors: true,
            cache: false,
            title: 'COMP/CON',
            favicon: './icons/icon.ico',
            template: './web/public/index.html'
        }),
        new WebpackPwaManifest({
            name: 'COMP/CON',
            short_name: 'C/C',
            start_url: '/index.html',
            scope: '.',
            description: 'Digital toolkit for the LANCER RPG',
            background_color: '#ffffff',
            theme_color: '#ffffff',
            display: 'fullscreen',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve('icons/256x256.png'),
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                }
            ]
        }),
        new GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true,
            navigateFallback: '/index.html',
            exclude: ['_redirects']
        }),
        new FaviconsWebpackPlugin({
            logo: './icons/256x256.png', // svg works too!
            favicons: {
                appName: 'COMP/CON',
                appDescription: 'A digital toolset for the LANCER TTRPG',
                background: '#fff',
                theme_color: '#fff',
                appleStatusBarStyle: "black",
            }
        }),
        new DefinePlugin({
            ELECTRON: JSON.stringify(false)
        }),
        new NormalModuleReplacementPlugin(
            /^electron$/,
            path.resolve('src/stubs/electron.ts')
        ),
        new NormalModuleReplacementPlugin(
            /^imgur$/,
            path.resolve('src/stubs/imgur_api.ts')
        ),
        // new NormalModuleReplacementPlugin(
        //     /data_io$/,
        //     path.resolve('src/stubs/data_io.ts')
        // ),
    ]
}