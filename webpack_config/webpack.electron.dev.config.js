const WriteFilePlugin = require('write-file-webpack-plugin')
const childProcess = require('child_process')
const path = require('path')

const subprocessPlugin = {
  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'ElectronSubprocess',
      (compilation, callback) => {
        if (!this.electronChildProcessRunning) {
          const platform = require('os').platform()
          const childArgs = platform === 'win32' ?
            ['cmd', ['/C', path.resolve('node_modules/.bin/electron.cmd'), path.resolve('electron/index.js')]]
            : [path.resolve('electron/node_modules/.bin/electron'), ['./']]

          const child = childProcess.spawn(...childArgs)

          child.stdout.on('data', function (data) {
            console.log(data.toString());
          });
          child.stderr.on('data', function (data) {
            console.log(data.toString());
          });

          child.on('exit', () => {
            require('process').exit()
            this.electronChildProcessRunning = false
          });
        }

        this.electronChildProcessRunning = true

        callback()
      }
    )
  }
}

module.exports = {
  devServer: {
    // hot: false,
    open: false
  },
  plugins: [
    new WriteFilePlugin(),
    subprocessPlugin
  ]
}