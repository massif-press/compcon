import { EventEmitter } from "events";
import { Capacitor } from "@capacitor/core"
import Vue from 'vue'
import ExtLog from '@/io/ExtLog';

const TIMEOUT = 10_000

const nodeProcess: typeof import('process') = require('process')

const ELECTRON_ITCH_CHANNELS = {
  'linux': 'linux',
  'darwin': 'osx',
  'win32': 'win'
}


function promiseTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout: Promise<never> = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('TimeOut'))
    }, ms)
  })

  return Promise.race([
    promise,
    timeout
  ])
}

export class UpdateChecker extends EventEmitter {
  
  private _updateAvailable = false;
  get updateAvailable() { return this._updateAvailable }
  set updateAvailable(val) {
    if (val === true && this.updateAvailable !== true) {
      this.emit('updatefound',)
      Vue.prototype.$notify('Update found! Click <b>here</b> to download it.', null, () => this.getUpdate())
    }
    this._updateAvailable = val;
  }

  private async _checkUpdates() {
    console.log('UpdateChecker is checking...');
    switch (Capacitor.platform) {
      case 'web':
        {
          const swReg = await navigator.serviceWorker.ready
          
          swReg.addEventListener('updatefound', () => this.updateAvailable = true, {
            once: true,
          })

          await swReg.update()
        }
        break;
      case 'electron':
        {
          const channel = ELECTRON_ITCH_CHANNELS[nodeProcess.platform]
          const response = await fetch(`https://itch.io/api/1/x/wharf/latest?target=massif-press/compcon&channel_name=${channel}-beta`)
          const { latest } = await response.json()
          const version = process.env.PACKAGE_VERSION

          if (latest !== version) this.updateAvailable = true

        }
        break;
      default:
        throw new Error(`Platform ${Capacitor.platform} not supported by UpdateChecker`)
    }
    
  }

  async checkUpdates() {
    try {
      await promiseTimeout(this._checkUpdates(), TIMEOUT)
    } catch (err) {
      ExtLog(`Failed to check for update with error: ${err}`)
    }
  }

  getUpdate() {
    switch (Capacitor.platform) {
      case 'web':
        window.location.reload(true)
        break
      case 'electron':
        require('electron').shell.openExternal('https://massif-press.itch.io/compcon')
        break
      default:
        throw new Error(`Platform ${Capacitor.platform} not supported by UpdateChecker`)
    }
  }

}

export default new UpdateChecker()