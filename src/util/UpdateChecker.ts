import { EventEmitter } from 'events'
import Vue from 'vue'

const TIMEOUT = 10_000

function promiseTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout: Promise<never> = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error('TimeOut'))
    }, ms)
  })

  return Promise.race([promise, timeout])
}

export class UpdateChecker extends EventEmitter {
  private _updateAvailable = false
  get updateAvailable(): boolean {
    return this._updateAvailable
  }
  set updateAvailable(val) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    if (val === true && this.updateAvailable !== true) {
      this.emit('updatefound')
      Vue.prototype.$notify('Update found! Refresh to update your version of COMP/CON', null, () => {
        self.getUpdate()
      })
    }
    this._updateAvailable = val
  }

  private async _checkUpdates(): Promise<void> {
    // console.log('UpdateChecker is checking...')

    const swReg = await navigator.serviceWorker.ready

    swReg.addEventListener('updatefound', () => (this.updateAvailable = true), {
      once: true,
    })

    await swReg.update()
  }

  async checkUpdates(): Promise<void> {
    try {
      await promiseTimeout(this._checkUpdates(), TIMEOUT)
    } catch (err) {
      // console.error(`Failed to check for update with error: ${err}`)
    }
  }

  getUpdate(): void {
    window.location.reload()
  }
}

export default new UpdateChecker()
