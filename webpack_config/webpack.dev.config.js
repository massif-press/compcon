const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
    plugins: [
        new HotModuleReplacementPlugin()
    ]
}