import { GetAll, SetItem, RemoveItem, SetValue, GetValue } from '@/io/Storage'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import * as _ from 'lodash-es'
import { Encounter, IEncounterData } from '@/classes/encounter/Encounter'
import { NavStore } from '@/stores/nav'
import type { IndexItem } from '@/stores/nav'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'

export const EncounterStore = defineStore('encounter', {
  state: () => ({
    Encounters: [] as Encounter[],
    ActiveEncounters: [] as EncounterInstance[],
    ArchivedEncounters: [] as EncounterArchive[],
    Folders: [] as string[],
    CurrentActiveID: '' as string,
  }),
  getters: {
    getEncounterByID: state => (id: string) => {
      return state.Encounters.find(x => x.ID === id)
    },
    getAllLabels: state => {
      return _.uniqBy(
        state.Encounters.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      )
    },
    getFolders: (state): string[] =>
      _.uniq(
        state.Folders.concat(
          state.Encounters.filter(x => !x.SaveController.IsDeleted).flatMap(
            (x: any) => x.FolderController.Folder
          )
        ).filter(x => !!x)
      ) as string[],
    encounterIndexes: (state): IndexItem[] => {
      const encounters = state.Encounters.filter((x: any) => x && !x.SaveController.IsDeleted)
      return encounters.map((x: any) => ({
        id: x.ID,
        title: x.Name,
        type: 'Encounter',
        pack: '',
        path: `/gm/encounters/${x.ID}`,
        icon: x.Icon || 'cc:encounter',
      }))
    },
  },
  actions: {
    getActiveEncounter(id: string): EncounterInstance | undefined {
      return this.ActiveEncounters.find(x => x.ID === id) as EncounterInstance
    },
    async LoadEncounters(): Promise<void> {
      const all = await GetAll('encounters')
      this.Encounters = all.map(x => {
        const enc = Encounter.Deserialize(x as IEncounterData)
        return enc
      })
      await this.LoadActiveEncounters()
      await this.LoadArchivedEncounters()
    },

    async LoadActiveEncounters(): Promise<void> {
      const all = await GetAll('active_encounters')
      this.ActiveEncounters = all.reduce((acc, x) => {
        try {
          acc.push(EncounterInstance.Deserialize(x))
        } catch (err) {
          logger.error('Failed to deserialize active encounter, skipping', this, err)
        }
        return acc
      }, [] as EncounterInstance[])
      await this.LoadActiveEncounterID()
    },

    async LoadArchivedEncounters(): Promise<void> {
      const all = await GetAll('encounter_archives')
      this.ArchivedEncounters = all.map(x => EncounterArchive.Deserialize(x))
    },

    async LoadActiveEncounterID(): Promise<void> {
      const id = await GetValue('current_active_encounter_id')
      if (id) this.CurrentActiveID = id
    },

    AddFolder(payload: string): void {
      this.Folders.push(payload)
    },

    EditFolder(payload: { old: string; newName: string }): void {
      this.Encounters.filter(x => x.FolderController.Folder === payload.old).forEach(
        x => (x.FolderController.Folder = payload.newName)
      )

      const idx = this.Folders.findIndex(x => x === payload.old)
      if (idx >= -1) this.Folders[idx] = payload.newName
    },

    RemoveFolder(payload: string): void {
      this.Encounters.filter(x => x.FolderController.Folder === payload).forEach(
        x => (x.FolderController.Folder = '')
      )

      const idx = this.Folders.findIndex(x => x === payload)
      if (idx >= -1) this.Folders.splice(idx, 1)
    },

    async AddEncounter(payload: Encounter): Promise<void> {
      if (this.Encounters.some(x => x.ID === payload.ID)) {
        logger.warn(`Encounter with ID ${payload.ID} already exists, updating instead.`, this)
        this.SetEncounter(
          this.Encounters.findIndex(x => x.ID === payload.ID),
          payload
        )
        return
      }

      this.Encounters.push(payload)
      NavStore().updateEncounterEntry(payload)
      await SetItem('encounters', payload.Serialize())
    },

    async SetEncounter(index: number, payload: Encounter): Promise<void> {
      if (!this.Encounters[index]) return
      this.Encounters.splice(index, 1, payload)
    },

    async AddEncounterInstance(payload: EncounterInstance): Promise<void> {
      const idx = this.ActiveEncounters.findIndex(x => x.ID === payload.ID)
      if (idx !== -1) {
        logger.warn(
          `EncounterInstance with ID ${payload.ID} already exists, updating instead.`,
          this
        )
        this.ActiveEncounters.splice(idx, 1, payload)
      } else {
        this.ActiveEncounters.push(payload)
      }
      this.SaveActiveEncounterData()
    },

    async RemoveEncounterInstance(payload: EncounterInstance): Promise<void> {
      this.ActiveEncounters.forEach(x => (x.IsActive = false))
      const id = payload.ID || (payload as any)._id
      const idx = this.ActiveEncounters.findIndex(x => x.ID === id)
      if (idx >= -1) {
        this.ActiveEncounters.splice(idx, 1)
        await RemoveItem('active_encounters', id)
        this.SaveActiveEncounterData()
      }
    },

    async ArchiveEncounterInstance(
      payload: EncounterInstance,
      report: string,
      result: string
    ): Promise<void> {
      const archive = EncounterArchive.FromInstance(payload, report, result)
      await this.AddEncounterArchive(archive)
      await this.RemoveEncounterInstance(payload)
      if (this.CurrentActiveID === payload.ID) {
        this.CurrentActiveID = ''
        await SetValue('current_active_encounter_id', '')
      }
    },

    async AddEncounterArchive(payload: EncounterArchive): Promise<void> {
      const idx = this.ArchivedEncounters.findIndex(x => x.ID === payload.ID)
      if (idx !== -1) {
        logger.warn(
          `EncounterArchive with ID ${payload.ID} already exists, updating instead.`,
          this
        )
        this.ArchivedEncounters.splice(idx, 1, payload)
      } else {
        this.ArchivedEncounters.push(payload)
      }
      await SetItem('encounter_archives', payload.Serialize())
    },

    async RemoveEncounterArchive(payload: EncounterArchive): Promise<void> {
      const id = payload.ID || (payload as any)._id
      const idx = this.ArchivedEncounters.findIndex(x => x.ID === id)
      if (idx >= -1) {
        this.ArchivedEncounters.splice(idx, 1)
        await RemoveItem('encounter_archives', id)
      }
    },

    async SetActiveEncounter(id: string): Promise<void> {
      this.CurrentActiveID = id
      await SetValue('current_active_encounter_id', id)
    },

    async AssignActiveEncounter(payload: EncounterInstance): Promise<void> {
      this.CurrentActiveID = payload.ID
      await SetValue('current_active_encounter_id', payload.ID)
    },

    async CloneEncounter(payload: Encounter): Promise<void> {
      const clone = toRaw(payload).Clone()
      this.Encounters.push(clone)
      await SetItem('encounters', clone.Serialize())
    },

    async DeleteEncounterPermanent(payload: Encounter): Promise<void> {
      const id = payload.ID || (payload as any)._id
      const idx = this.Encounters.findIndex(x => x.ID === id)
      if (idx >= -1) this.Encounters.splice(idx, 1)
      NavStore().removeEncounterEntry(id)
      await RemoveItem('Encounters', id)
      this.SaveEncounterData()
      if (payload.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(payload.CloudController.Metadata)
      }
    },

    async SaveEncounterData(): Promise<void> {
      try {
        await Promise.all(
          (this.Encounters as any).map(y => SetItem('encounters', toRaw(y).Serialize()))
        )
        logger.info('Encounter data saved')
      } catch (err) {
        logger.error('Error while saving Encounter data', this, err)
      }
    },

    async SaveActiveEncounterData(): Promise<void> {
      try {
        await Promise.all(
          (this.ActiveEncounters as any).map(y =>
            SetItem('active_encounters', toRaw(y).Serialize())
          )
        )
        logger.info('Active Encounter data saved')
      } catch (err) {
        logger.error('Error while saving Active Encounter data', this, err)
      }
    },
  },
})
