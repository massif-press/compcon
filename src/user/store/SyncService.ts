import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'

let _syncLock: Promise<void> | null = null

export function isSyncLocked(): boolean {
  return _syncLock !== null
}

export async function withSyncLock<T>(fn: () => Promise<T>): Promise<T> {
  if (_syncLock) {
    logger.warn('SyncService: sync already in progress — skipping duplicate request')
    await _syncLock
    return undefined as unknown as T
  }

  let resolve: () => void
  _syncLock = new Promise<void>(r => (resolve = r))

  try {
    return await fn()
  } finally {
    _syncLock = null
    resolve!()
  }
}

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

  _syncTimerId = setInterval(() => {
    logger.info('SyncService: AutoSync timer triggered')
    callback()
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

export async function syncItems(
  items: readonly any[],
  overrideTo?: 'cloud' | 'local' | 'newest'
): Promise<SyncFailure[]> {
  const failures: SyncFailure[] = []

  for (const item of items) {
    try {
      if (overrideTo) {
        if (overrideTo === 'cloud') await CloudController.SyncToCloud(item)
        else if (overrideTo === 'local') await CloudController.SyncToLocal(item)
        else await CloudController.SyncToNewest(item)
      } else {
        await CloudController.AutoSync(item)
      }
    } catch (e) {
      logger.error('SyncService: sync error:', e)
      failures.push({ item, error: e })
    }
  }

  return failures
}

export async function syncRemoteItems(items: readonly any[]): Promise<SyncFailure[]> {
  const failures: SyncFailure[] = []

  for (const item of items) {
    try {
      await CloudController.UpdateRemote(item)
    } catch (e) {
      logger.error('SyncService: remote sync error:', e)
      failures.push({ item, error: e })
    }
  }

  return failures
}
