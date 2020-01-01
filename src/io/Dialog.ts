import { Capacitor } from '@capacitor/core'

const PLATFORM = Capacitor.platform
const platformNotSupportedMessage = `ERROR - PLATFORM NOT SUPPORTED: "${PLATFORM}" `

let electron: typeof import('electron')
if (PLATFORM == 'electron') {
  electron = require('electron')
}

const saveFile = function(filename, data, label = 'Save') {
  switch (PLATFORM) {
    case 'web':
      var blob = new Blob([data], { type: 'text/csv' })
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = filename
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
      }
      return
    case 'electron':
      const { dialog } = electron.remote
      dialog.showSaveDialog({
        defaultPath: filename,
        buttonLabel: label,
      })
      return
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

export { saveFile }
