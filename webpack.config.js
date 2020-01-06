const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const path = require('path');
const merge = require('webpack-merge')

const baseConfig = {
  entry: {
    app: './src/main.ts',
  },
  output: {
    filename: '[name].bundle.js',
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
        test: /\.s(c|a)ss$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      },
      // commenting eslint loader out until we fix some of the issues cause it's annoying
      // {
      //   test: /\.(ts|js|vue)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'eslint-loader'
      //     }
      //   ],
      // },
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
      '@': path.resolve('src'),
      '@assets': path.resolve('src/assets')
    }
  },
  plugins: [
    new CopyPlugin([
      { from: 'static', to: 'static' },
    ]),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new MiniCssExtractPlugin(),
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
  try {
    return require(filePath)
  } catch (err) {
    if (err.message.includes('Cannot find module'))
      return {}
    else throw err
  }
}

module.exports = function (env, argv) {

  const target = env.prod ? 'prod' : 'dev'

  let out = merge(
    baseConfig,
    requireIfExists(`./webpack_config/webpack.${target}.config`),
    requireIfExists(`./webpack_config/webpack.${env.platform}.config`),
    requireIfExists(`./webpack_config/webpack.${env.platform}.${target}.config`),
    { mode: env.prod ? 'production' : 'development' },
  )

  if (argv['analyze']) {
    out = merge(out, {
      plugins: [new BundleAnalyzerPlugin()]
    })
  }

  return out
}