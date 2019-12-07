const { IgnorePlugin, NormalModuleReplacementPlugin } = require('webpack');
const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // new IgnorePlugin(/^(fs|electron)$/),
        new IgnorePlugin(/^(fs)$/),
        new NormalModuleReplacementPlugin(
            /(data_io$|ImageManagement$|^electron$)/,
            path.resolve('src/stub.ts')
        )
    ]
}