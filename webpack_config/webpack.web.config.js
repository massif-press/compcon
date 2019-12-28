const { IgnorePlugin } = require('webpack');
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
  },
  plugins: [
    new IgnorePlugin(/^(fs|electron)$/)
  ]
}