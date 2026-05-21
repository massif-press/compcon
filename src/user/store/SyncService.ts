import logger from '@/user/logger'
import { UserMetadataStore } from './UserMetadataStore'

let _syncTimerId: ReturnType<typeof setInterval> | null = null

function _getPatreonTierValue(): number {
  const title =
    UserMetadataStore().UserMetadata?.PatreonData?.profile?.tierData?.title?.toLowerCase() ?? ''
  const tiers = ['diasporan', 'cosmopolitan', 'lancer', 'nhp', 'monist']
  const idx = tiers.indexOf(title)
  return idx === -1 ? 0 : idx + 1
}

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
    if (_getPatreonTierValue() < 1) {
      logger.info('SyncService: Patreon tier insufficient, clearing timer and resetting frequency')
      clearSyncTimer()
      const settings = UserMetadataStore().SyncSettings
      if (settings) settings.frequency = 'manual'
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
