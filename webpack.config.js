const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const merge = require('webpack-merge')

const baseConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/main.ts',
  output: {
    filename: 'bundle.js',
    publicPath: '',
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  module: {
    rules: [
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
                    corejs: 3,
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
        test: /\.(ts|js|vue)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader'
          }
        ],
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
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
        options: {
          esModule: false,
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.vue', '.js'],
    alias: {
      '@': path.resolve('src/renderer'),
      '@assets': path.resolve('src/renderer/assets')
    }
  },
  plugins: [
    new CopyPlugin([
      { from: 'static', to: 'static' },
    ]),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HTMLWebpackPlugin({
      showErrors: true,
      cache: false,
      title: 'COMP/CON',
      favicon: path.resolve(__dirname, './icons/icon.ico'),
      template: path.resolve(__dirname, 'public/index.html')
    }),
  ]
}

function requireIfExists(filePath) {
  console.log(filePath)
  try {
    return require(filePath)
  } catch (err) {
    return {}
  }
}

module.exports = function (env) {

  const target = env.prod ? 'prod' : 'dev'

  const out = merge(
    baseConfig,
    requireIfExists(`./webpack_config/webpack.${target}.config`),
    requireIfExists(`./webpack_config/webpack.${env.platform}.config`),
    requireIfExists(`./webpack_config/webpack.${env.platform}.${target}.config`),
  )
  return out
}