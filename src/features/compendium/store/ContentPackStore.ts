import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import semver from 'semver'
import { ContentPack, IContentPack } from '@/classes/ContentPack'
import { GetItem, GetKeys, RemoveItem, SetItem } from '@/io/Storage'
import { NavStore } from '@/stores/nav'
import logger from '@/user/logger'

export const ContentPackStore = defineStore('content_packs', {
  state: () => ({
    ContentPacks: [] as ContentPack[],
    packData: [] as IContentPack[],
  }),
  actions: {
    async saveUserData(): Promise<void> {
      try {
        await Promise.all(this.ContentPacks.map(y => SetItem('content', y.Serialize())))
        logger.info('LCP data saved')
      } catch (err) {
        logger.error('Error while saving LCP data', err)
      }
    },
    async loadExtraContent(): Promise<void> {
      const keys = await GetKeys('content')
      for (const key of keys) {
        let c: IContentPack | null
        try {
          c = await GetItem('content', key as string)
        } catch (err) {
          logger.error(`Error reading content pack key ${key}: ${err}`, this, err)
          await new Promise(r => setTimeout(r, 0))
          continue
        }

        if (!c) {
          await new Promise(r => setTimeout(r, 0))
          continue
        }

        try {
          this.ContentPacks.push(markRaw(new ContentPack(c)))
        } catch (err) {
          logger.error(
            `Error loading content pack ${c?.manifest?.name || c?.id}: ${err}`,
            this,
            err
          )
        }

        await new Promise(r => setTimeout(r, 0))
      }
    },
    async installContentPack(packData: IContentPack): Promise<void> {
      if (this.packAlreadyInstalled(packData.id)) {
        logger.info(
          `pack ${packData.manifest.name} [${packData.id}] already exists, deleting original...`,
          this
        )
        await this.deleteContentPack(packData.id)
      }
      try {
        const pack = markRaw(new ContentPack(packData))
        this.ContentPacks = [...this.ContentPacks, pack]
      } catch (err) {
        logger.error(
          `Error installing content pack ${packData?.manifest?.name || packData?.id}: ${err}`,
          this,
          err
        )
        return
      }
      await this.saveUserData()
      const { CompendiumStore } = await import('./index')
      await CompendiumStore().refreshExtraContent()
    },
    async installContentPacks(packs: IContentPack[]): Promise<void> {
      for (const packData of packs) {
        try {
          if (this.packAlreadyInstalled(packData.id)) {
            logger.info(
              `pack ${packData.manifest.name} [${packData.id}] already exists, deleting original...`,
              this
            )
            await this.deleteContentPack(packData.id, true)
          }
          const pack = markRaw(new ContentPack(packData))
          pack.SetActive(true)
          this.ContentPacks.push(pack)
          NavStore().addToIndex(pack.GetIndexItems())
        } catch (err) {
          logger.error(
            `Error installing content pack ${packData?.manifest?.name || packData?.id}: ${err}`,
            this,
            err
          )
        }
      }
      await this.saveUserData()
    },
    async deleteContentPack(packID: string, skipSave = false): Promise<void> {
      this.ContentPacks = this.ContentPacks.filter(pack => pack.ID !== packID)
      await RemoveItem('content', packID)
      if (skipSave) return
      await this.saveUserData()
      const { CompendiumStore } = await import('./index')
      await CompendiumStore().refreshExtraContent()
    },
    async deleteAllContentPacks(): Promise<void> {
      for (const pack of this.ContentPacks) {
        await RemoveItem('content', pack.ID)
      }
      this.ContentPacks = []
      await this.saveUserData()
      const { CompendiumStore } = await import('./index')
      await CompendiumStore().refreshExtraContent()
    },
    async togglePackActive(payload: string): Promise<void> {
      const pack = this.ContentPacks.find(pack => pack.ID === payload)
      if (pack) pack.SetActive(!pack.Active)
      this.ContentPacks = [...this.ContentPacks]
      await this.saveUserData()
    },
    async setPackActive(payload: { packID: string; active: boolean }): Promise<void> {
      const pack = this.ContentPacks.find(pack => pack.ID === payload.packID)
      if (pack) pack.SetActive(payload.active)
      await this.saveUserData()
    },
    packAlreadyInstalled(packId: string, version?: string, searchOnName = false): boolean {
      let candidate

      if (searchOnName)
        candidate = this.ContentPacks.find(
          pack => pack.Name.toLowerCase() === packId.toLowerCase()
        )
      else candidate = this.ContentPacks.find(pack => pack.ID === packId)

      if (!candidate) return false

      if (!version || version === '*') return !!candidate

      if (version.startsWith('=')) return candidate.Version === version.slice(1)

      return semver.gte(semver.coerce(candidate.Version), semver.coerce(version))
    },
  },
})
