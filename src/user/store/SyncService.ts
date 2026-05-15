import logger from '@/user/logger'
import { UserStore } from '@/stores'

let _syncTimerId: ReturnType<typeof setInterval> | null = null

export function setSyncTimer(frequencyStr: string, callback: () => Promise<void>): void {
  if (_syncTimerId !== null) {
    clearInterval(_syncTimerId)
    _syncTimerId = null
  }

  const frequency = frequencyStr.toLowerCase()
  if (!frequency.includes('minutes')) return

  const minutes = parseInt(frequency.split('_').pop() || '0')
  if (!minutes || isNaN(minutes)) return

  logger.info(`SyncService: setting sync timer to ${minutes} minutes`)
  const ms = minutes * 60 * 1000

  _syncTimerId = setInterval(async () => {
    if (UserStore().User.PatreonTierValue < 1) {
      logger.info('SyncService: Patreon tier insufficient, clearing timer and resetting frequency')
      clearSyncTimer()
      if (UserStore().SyncSettings) UserStore().SyncSettings.frequency = 'manual'
      return
    }
    logger.info('SyncService: AutoSync timer triggered')
    await callback()
  }, ms)
}

export function clearSyncTimer(): void {
  if (_syncTimerId !== null) {
    clearInterval(_syncTimerId)
    _syncTimerId = null
  }
}

export interface SyncFailure {
  item: unknown
  error: unknown
}
