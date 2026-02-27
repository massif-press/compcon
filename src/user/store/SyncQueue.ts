import logger from '@/user/logger'

// If sync fails mid-way (network drop, tab close), the queue survives.
// On next startup the store can resume pending items.

const DB_NAME = 'compcon-sync-queue'
const DB_VERSION = 1
const STORE_NAME = 'pending'

export interface SyncQueueEntry {
  id: string // sortkey
  itemType: string
  name: string
  direction: 'upload' | 'download'
  enqueuedAt: number
  retries: number
  lastError?: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export class SyncQueue {
  private static _instance: SyncQueue | null = null
  private db: IDBDatabase | null = null

  static async getInstance(): Promise<SyncQueue> {
    if (!SyncQueue._instance) {
      SyncQueue._instance = new SyncQueue()
      await SyncQueue._instance.init()
    }
    return SyncQueue._instance
  }

  private async init(): Promise<void> {
    try {
      this.db = await openDb()
    } catch (e) {
      logger.error('SyncQueue: failed to open IndexedDB', e)
    }
  }

  async enqueue(entry: SyncQueueEntry): Promise<void> {
    if (!this.db) return
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(entry)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async dequeue(id: string): Promise<void> {
    if (!this.db) return
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async getAll(): Promise<SyncQueueEntry[]> {
    if (!this.db) return []
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  }

  async count(): Promise<number> {
    if (!this.db) return 0
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).count()
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }

  async clear(): Promise<void> {
    if (!this.db) return
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async recordFailure(id: string, error: string): Promise<void> {
    if (!this.db) return
    const all = await this.getAll()
    const entry = all.find(e => e.id === id)
    if (!entry) return
    entry.retries++
    entry.lastError = error
    await this.enqueue(entry)
  }
}
