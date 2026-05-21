import { defineStore } from 'pinia'
import { downloadFromS3 } from '@/io/apis/account'
import { ImportStagedData, StageImport } from '@/io/Importer'
import { GetFromCode } from '@/io/apis/account'
import { UserMetadataStore } from './UserMetadataStore'
import { CloudDataStore } from './CloudDataStore'
import { NotificationStore } from './NotificationStore'
import logger from '../logger'

export const CollectionStore = defineStore('collections', {
  actions: {
    async getRemoteCollectionMetadata(startup = false): Promise<void> {
      const umStore = UserMetadataStore()
      const collectionSettings = umStore.UserMetadata.CollectionSubscriptionSettings
      if (!collectionSettings?.items?.length) return

      const uniqueCodes = [...new Set(collectionSettings.items.map((i: any) => i.code))]

      let data: any[]
      try {
        const result = await GetFromCode(uniqueCodes)
        data = Array.isArray(result) ? result : [result]
      } catch (e) {
        logger.error('Unable to batch-fetch remote collection metadata', e)
        return
      }

      CloudDataStore().RemoteCollections = data

      if (startup && collectionSettings.updateOn === 'startup') {
        for (const item of data) {
          try {
            await this.updateRemoteCollection(item)
          } catch (e) {
            logger.error(`Unable to update remote collection ${item.code}`, e)
          }
        }
      }
    },
    async updateRemoteCollection(collection: any): Promise<string[]> {
      const uri = collection.uri
      if (!uri) {
        throw new Error('Collection has no uri:', collection)
      }

      const data = await downloadFromS3(uri)
      const staged = await StageImport(data)
      const errors = await ImportStagedData(staged, collection)
      await UserMetadataStore().refreshV2BackupIds()

      const umStore = UserMetadataStore()
      const settingsIndex = umStore.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        (item: any) => item.code === collection.code
      )
      if (settingsIndex > -1) {
        umStore.UserMetadata.CollectionSubscriptionSettings.items[settingsIndex].metadata =
          collection
        await umStore.setUserMetadata()
      }
      NotificationStore().addCloudNotification(
        `Updated Collection: ${collection.name} to version ${collection.version}`
      )
      return errors
    },
    updateAllRemoteCollections(): void {
      const umStore = UserMetadataStore()
      for (const item of umStore.UserMetadata.CollectionSubscriptionSettings.items) {
        const localSubscription =
          umStore.UserMetadata.CollectionSubscriptionSettings.items.find(
            (x: any) => x.metadata.id === item.metadata.id
          )
        if (localSubscription && localSubscription.metadata.version === item.metadata.version) {
          logger.info('Collection is up to date:', item)
        } else {
          this.updateRemoteCollection(item)
        }
      }
    },
    async addContentSubscription(metadata: any): Promise<void> {
      const umStore = UserMetadataStore()
      umStore.UserMetadata.CollectionSubscriptionSettings.items.push({
        code: metadata.code,
        metadata,
      })
      CloudDataStore().RemoteCollections.push(metadata)
      await umStore.setUserMetadata()
    },
    async removeContentSubscription(collection: any): Promise<void> {
      const umStore = UserMetadataStore()
      const idx = umStore.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        (x: any) => x.code === collection.code
      )
      if (idx === -1) return
      umStore.UserMetadata.CollectionSubscriptionSettings.items.splice(idx, 1)
      const cdStore = CloudDataStore()
      cdStore.RemoteCollections = cdStore.RemoteCollections.filter(
        (x: any) => x.code !== collection.code
      )
      await umStore.setUserMetadata()
    },
  },
})
