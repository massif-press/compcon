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
  'extra_content.json',
  'pilot_groups.json',
]

const exportV1Pilots = async function(): Promise<string> {
  return readFile('pilots.json')
}

interface IBulkExport {
  filename: string
  data: string
}

const exportAll = async function(): Promise<IBulkExport[]> {
  const promises = files.map(file => readFile(file))

  const res = await Promise.all(promises)

  return res.map((data, i) => ({ filename: files[i], data }))
}

const importAll = async function(file): Promise<void> {
  const text = await PromisifyFileReader.readAsText(file)
  const arr = JSON.parse(text)
  Extlog('Loading import data...')
  const promises = arr.map(o => writeFile(o.filename, o.data))
  await Promise.all(promises)
  Extlog('Import data loaded! Running startup...')
  Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
}

const clearAllData = async function(): Promise<void> {
  Extlog('Erasing all COMP/CON data...')
  const promises = files.map(file => writeFile(file, ''))
  await promises
  Extlog('All data erased! Running startup...')
  Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
}

export { exportV1Pilots, exportAll, importAll, clearAllData }
