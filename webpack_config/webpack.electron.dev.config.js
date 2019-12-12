const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  devServer: {
    hot: false,
    open: false
  },
  plugins: [
    new WriteFilePlugin()
  ]
}