const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, '..', 'electron/app'),
  },
  target: "electron-main",
  node: {
    fs: 'empty',
    __dirname: false
  },
}