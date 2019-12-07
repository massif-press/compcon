import { Capacitor } from '@capacitor/core'
import path from 'path'

const PLATFORM = Capacitor.platform
const platformNotSupportedMessage = `ERROR - PLATFORM NOT SUPPORTED: "${PLATFORM}" `

// variables used by electron
let fs: typeof import('fs')
let promisify: typeof import('util').promisify
let electron: typeof import('electron')

let userDataPath: string

if (PLATFORM == 'electron') {
  fs = require('fs')
  promisify = require('util').promisify

  electron = require('electron')
  userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'data')
}

const writeFile = async function(name: string, data: string): Promise<void> {
  switch (PLATFORM) {
    case 'web':
      localStorage.setItem(name, data)
      break
    case 'electron':
      await promisify(fs.writeFile)(path.resolve(userDataPath, name), data)
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const readFile = async function(name: string): Promise<string> {
  switch (PLATFORM) {
    case 'web':
      return localStorage.getItem(name)
    case 'electron':
      return await promisify(fs.readFile)(path.resolve(userDataPath, name), 'utf-8')
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const saveFile = function(filename, data) {
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
        buttonLabel: 'Save Pilot',
      })
      return
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const exists = async function(name: string): Promise<boolean> {
  switch (PLATFORM) {
    case 'web':
      return Boolean(localStorage.getItem(name))
    case 'electron':
      return await promisify(fs.exists)(path.resolve(userDataPath, name))
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const saveData = async function<T>(fileName: string, data: T) {
  return writeFile(fileName, JSON.stringify(data))
}

const loadData = async function<T>(fileName: string) {
  const dataText = await readFile(fileName)
  return JSON.parse(dataText) as T
}

const staticPath = function(pathEnd: string) {
  let pathBase
  switch (PLATFORM) {
    case 'web':
      pathBase = '/static'
      break
    case 'electron':
      pathBase = path.join(path.dirname(__dirname), 'app', 'static')
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
  return path.join(pathBase, pathEnd)
}

const dataPathMap = {
  web: 'localStorage',
  electron: userDataPath,
}

const USER_DATA_PATH = dataPathMap[PLATFORM]

export { writeFile, readFile, saveFile, saveData, loadData, exists, staticPath, USER_DATA_PATH }
