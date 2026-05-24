import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import {
  GetFromCode,
  DownloadViaCode,
  NotFoundError,
} from '@/io/apis/account'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { UserMetadataStore } from './UserMetadataStore'
import { CloudDataStore } from './CloudDataStore'
import { NotificationStore } from './NotificationStore'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import logger from '../logger'

export const RemoteItemStore = defineStore('remoteItems', {
  state: () => ({
    BrokenRemoteCodes: [] as string[],
  }),
  actions: {
    addRemoteItem(code: string): void {
      logger.info(`addRemoteItem: tracking code ${code}`, new Error().stack)
      UserMetadataStore().UserMetadata.RemoteItems.push(code)
      UserMetadataStore().setUserMetadata()
    },
    deleteRemoteItem(code: string): void {
      const meta = UserMetadataStore().UserMetadata
      const idx = meta.RemoteItems.findIndex(x => x === code)
      if (idx === -1) return
      meta.RemoteItems.splice(idx, 1)
      UserMetadataStore().setUserMetadata()
    },
    addBrokenRemote(code: string): void {
      if (!this.BrokenRemoteCodes.includes(code)) this.BrokenRemoteCodes.push(code)
    },
    removeBrokenRemote(code: string): void {
      const idx = this.BrokenRemoteCodes.indexOf(code)
      if (idx > -1) this.BrokenRemoteCodes.splice(idx, 1)
    },
    async retryBrokenRemote(code: string): Promise<boolean> {
      try {
        const item = await GetFromCode(code)
        if (!item || !item.code) return false
        this.removeBrokenRemote(code)
        await this.setMetadataForRemotes()
        return true
      } catch {
        return false
      }
    },
    convertBrokenRemoteToLocal(code: string): void {
      const allLocalItems: any[] = [
        ...PilotStore().Pilots,
        ...PilotStore().PilotGroups,
        ...NpcStore().Npcs,
        ...NarrativeStore().CollectionItems,
        ...EncounterStore().Encounters,
        ...EncounterStore().ActiveEncounters,
        ...EncounterStore().ArchivedEncounters,
        ...PilotStore().PilotSheets,
        ...CampaignStore().Campaigns,
      ]
      const localItem = allLocalItems.find(x => x.SaveController?.RemoteCode === code)
      if (localItem) {
        toRaw(localItem).SaveController?.ClearRemote()
      }
      this.removeBrokenRemote(code)
      this.deleteRemoteItem(code)
    },
    async setMetadataForRemotes(): Promise<void> {
      const umStore = UserMetadataStore()
      const cloudDataStore = CloudDataStore()
      const notifStore = NotificationStore()
      const remotes = umStore.UserMetadata.RemoteItems
      if (!remotes || remotes.length === 0) return

      const { UserStore } = await import('./index')
      const uStore = UserStore()

      const storedBroken = uStore.User.View('brokenRemoteCodes', null) as {
        codes: string[]
        expires: number
      } | null
      if (storedBroken && storedBroken.expires > Date.now()) {
        for (const code of storedBroken.codes) {
          if (!this.BrokenRemoteCodes.includes(code)) this.BrokenRemoteCodes.push(code)
        }
      }

      const requestedCodes = new Set(remotes)
      let data: any[] = []

      const BATCH_SIZE = 50
      const chunks: string[][] = []
      for (let i = 0; i < remotes.length; i += BATCH_SIZE) {
        chunks.push(remotes.slice(i, i + BATCH_SIZE))
      }

      for (const chunk of chunks) {
        try {
          const result = await GetFromCode(chunk)
          const items = (Array.isArray(result) ? result : [result]).filter((item: any) => {
            if (!requestedCodes.has(item.code)) {
              logger.warn(`setMetadataForRemotes: received unrequested code ${item.code}, skipping`)
              return false
            }
            return true
          })
          data = data.concat(items)
        } catch (e) {
          logger.error('Failed to batch-fetch remote item metadata:', e)
          for (const code of chunk) {
            try {
              const item = await GetFromCode(code)
              if (item && requestedCodes.has(item.code)) {
                data.push(item)
              }
            } catch (e) {
              if (e instanceof NotFoundError) {
                logger.info(`Remote code ${code} not found (404), marking as broken link`)
                if (!this.BrokenRemoteCodes.includes(code)) {
                  this.BrokenRemoteCodes.push(code)
                }
              } else {
                logger.warn(
                  `Remote code ${code} temporarily unreachable (${e}), will retry next session`
                )
              }
            }
          }
        }
      }

      const toDownload: typeof data = []
      for (const item of data) {
        if (item.deleted) continue
        const localItem = cloudDataStore.getLocalItem(item.sortkey)
        if (localItem) {
          const isOwnCloudItem = cloudDataStore.CloudItems.some(ci => ci.sortkey === item.sortkey)
          if (!isOwnCloudItem) {
            toRaw(localItem).CloudController.Metadata = item
          }
        } else {
          toDownload.push(item)
        }
      }

      for (const item of toDownload) {
        try {
          const itemData = await DownloadViaCode(item.code)
          const itemType = item.sortkey.split('_')[1]
          const newItem = CloudController.NewByType(itemType, itemData)
          newItem.CloudController.setRemoteMetadata(item)
          await CloudController.AddByType(itemType, newItem)
          if (item.item_modified) {
            toRaw(newItem).SaveController.LastModified = item.item_modified
            toRaw(newItem).SaveController.saveSilent?.()
          }
        } catch (e) {
          logger.error(`Failed to download remote item ${item.code}:`, e)
        }
      }

      const codeToExpectedId = new Map<string, string>()
      for (const item of data) {
        codeToExpectedId.set(item.code, item.sortkey.split('_')[2])
      }

      const { SyncStore } = await import('./SyncStore')
      const syncStore = SyncStore()
      for (const localItem of syncStore.AllItems as any[]) {
        const rc = localItem.SaveController?.RemoteCode
        if (!rc) continue
        const expectedId = codeToExpectedId.get(rc)
        if (!expectedId) continue
        if (localItem.ID !== expectedId) {
          logger.warn(
            `Detaching orphaned extra import: ${localItem.Name} (${localItem.ID}) was tracking code ${rc}, expected ID ${expectedId}`
          )
          toRaw(localItem).SaveController.ClearRemote()
        }
      }

      const trackedCodes = new Set(
        syncStore.AllItems.map((x: any) => x.SaveController?.RemoteCode).filter(Boolean)
      )
      const orphaned = umStore.UserMetadata.RemoteItems.filter(code => !trackedCodes.has(code))
      if (orphaned.length > 0) {
        orphaned.forEach(code => this.deleteRemoteItem(code))
      }

      if (this.BrokenRemoteCodes.length > 0) {
        uStore.User.SetView('brokenRemoteCodes', {
          codes: this.BrokenRemoteCodes,
          expires: Date.now() + 24 * 60 * 60 * 1000,
        })
      }
    },
  },
})
