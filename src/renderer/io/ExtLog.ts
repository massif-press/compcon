import fs from 'fs'
import path from 'path'
import Vue from 'vue'
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

function ExtLog(s: string): void {
  const store = getModule(CompendiumStore)
  const logfile = path.join(store.UserDataPath, 'compcon.log')

  if (!fs.existsSync(logfile)) {
    try {
      fs.writeFileSync(logfile, '[]')
      ExtLog('Created error log')
    } catch (err) {
      alert(`Critical Error: COMP/CON unable to create error log at ${logfile}: \n ${err}`)
      return
    }
  }

  let log = fs.readFileSync(logfile, 'utf-8') as string

  log += `\n${Vue.prototype.version} - ${new Date().toLocaleString()}: ${s}`

  fs.writeFile(logfile, log, function(err) {
    if (err) {
      alert(`Critical Error: COMP/CON unable to write to error log at ${logfile}: \n ${err}`)
      return
    }
  })
}

export default ExtLog
