import { readFile, writeFile } from './Data'
import PromisifyFileReader from 'promisify-file-reader'
import Extlog from './ExtLog'
import Startup from './Startup'
import Vue from 'vue'
import { store } from '@/store'

const files = [
  'user.config',
  'active_missions_v2.json',
  'missions_v2.json',
  'encounters_v2.json',
  'pilots_v2.json',
  'npcs_v2.json',
]

const exportV1Pilots = async function(): Promise<string> {
  return readFile('pilots.json')
}

const exportAll = async function(): Promise<string> {
  const promises = files.map(file => readFile(file))
  let result = [] as { filename: string; data: string }[]

  await Promise.all(promises).then(res => {
    result = res.map((x, i) => ({ filename: files[i], data: x }))
  })

  return JSON.stringify(result)
}

const importAll = async function(file): Promise<void> {
  const text = await PromisifyFileReader.readAsText(file)
  const arr = JSON.parse(text)
  const promises = arr.map(o => writeFile(o.filename, o.data))
  Promise.all(promises).then(() => {
    Extlog('Loading import data...')
    Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
    Extlog('Import data loaded!')
  })
}

const clearAllData = async function(): Promise<void> {
  const promises = files.map(file => writeFile(file, ''))
  Promise.all(promises).then(() => {
    Extlog('Erasing all COMP/CON data...')
    Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
    Extlog('All data erased!')
  })
}

export { exportV1Pilots, exportAll, importAll, clearAllData }
