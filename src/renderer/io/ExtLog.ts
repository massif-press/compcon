import path from 'path'
import Vue from 'vue'
import { writeFile, readFile, exists, USER_DATA_PATH, ensureDataDir } from './Data'
import { Capacitor } from '@capacitor/core'
import theme from '@/ui/theme'

const LOG_FILE_NAME = 'compcon.log'
const LOG_FILE_PATH = path.join(USER_DATA_PATH, LOG_FILE_NAME)

const logErrorMsg = err =>
  `Critical Error: COMP/CON unable to create error log at ${LOG_FILE_PATH}: \n ${err}`

const logPrefixStyles = [
  `background: ${theme.theme.themes.light.primary}`,
  `border-radius: 0.5em`,
  `color: white`,
  `font-weight: bold`,
  `padding: 2px 0.5em`,
]

async function ExtLog(s: string): Promise<void> {
  if (Capacitor.platform != 'web') {
    ensureDataDir()
    if (!(await exists(LOG_FILE_NAME))) {
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

  console.log('%cCOMP/CON', logPrefixStyles.join(';'), s)
}

export default ExtLog
