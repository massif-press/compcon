const { HotModuleReplacementPlugin } = require('webpack')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new HotModuleReplacementPlugin(),
  ]
}