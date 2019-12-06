import path from 'path'
import Vue from 'vue'
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'
import { writeFile, readFile, exists, USER_DATA_PATH } from './Data'

console.log(USER_DATA_PATH)

const LOG_FILE_NAME = 'compcon.log'
const LOG_FILE_PATH = path.join(USER_DATA_PATH, LOG_FILE_NAME)

const logErrorMsg = err =>
  `Critical Error: COMP/CON unable to create error log at ${LOG_FILE_PATH}: \n ${err}`

async function ExtLog(s: string) {
  const store = getModule(CompendiumStore)

  if (!exists(LOG_FILE_NAME)) {
    try {
      await writeFile(LOG_FILE_NAME, '[]')
      await ExtLog('Created error log')
    } catch (err) {
      alert(logErrorMsg(err))
      return
    }
  }

  let log = await readFile(LOG_FILE_NAME)

  log += `\n${Vue.prototype.version} - ${new Date().toLocaleString()}: ${s}`

  try {
    await writeFile(LOG_FILE_NAME, log)
  } catch (err) {
    alert(logErrorMsg(err))
    return
  }
}

export default ExtLog
