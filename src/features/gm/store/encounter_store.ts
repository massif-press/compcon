import { GetAll, SetItem, RemoveItem, SetValue, GetValue } from '@/io/Storage'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { Encounter, IEncounterData } from '@/classes/encounter/Encounter'
import { IndexItem } from '@/stores'
import { CloudController } from '@/classes/components'
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
    getEncounterByID: (state: any) => (id: string) => {
      return state.Encounters.find(x => x.ID === id)
    },
    getAllLabels: (state: any) => {
      return _.uniqBy(
        state.Encounters.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      )
    },
    getFolders: (state: any): string[] =>
      _.uniq(
        state.Folders.concat(
          state.Encounters.filter(x => !x.SaveController.IsDeleted).flatMap(
            (x: any) => x.FolderController.Folder
          )
        ).filter(x => !!x)
      ) as string[],
    encounterIndexes: (state: any): IndexItem[] => {
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
      this.Encounters = all.map(x => Encounter.Deserialize(x as IEncounterData))
      await this.LoadActiveEncounters()
      await this.LoadArchivedEncounters()
    },

    async LoadActiveEncounters(): Promise<void> {
      const all = await GetAll('active_encounters')
      this.ActiveEncounters = all.map(x => EncounterInstance.Deserialize(x))
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
      if (idx >= 0) this.Folders[idx] = payload.newName
    },

    RemoveFolder(payload: string): void {
      this.Encounters.filter(x => x.FolderController.Folder === payload).forEach(
        x => (x.FolderController.Folder = '')
      )

      const idx = this.Folders.findIndex(x => x === payload)
      if (idx >= 0) this.Folders.splice(idx, 1)
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
      this.SaveEncounterData()
    },

    async SetEncounter(index: number, payload: Encounter): Promise<void> {
      if (!this.Encounters[index]) return
      this.Encounters.splice(index, 1, payload)
    },

    async AddEncounterInstance(payload: EncounterInstance): Promise<void> {
      if (this.ActiveEncounters.some(x => x.ID === payload.ID)) {
        logger.warn(
          `EncounterInstance with ID ${payload.ID} already exists, updating instead.`,
          this
        )
        this.SetActiveEncounter(payload.ID)
        return
      }
      this.ActiveEncounters.push(payload)
      this.SaveActiveEncounterData()
    },

    async RemoveEncounterInstance(payload: EncounterInstance): Promise<void> {
      this.ActiveEncounters.forEach(x => (x.IsActive = false))
      const idx = this.ActiveEncounters.findIndex(x => x.ID === payload.ID)
      if (idx >= 0) {
        this.ActiveEncounters.splice(idx, 1)
        await RemoveItem('active_encounters', payload.ID)
        this.SaveActiveEncounterData()
      }
    },

    async ArchiveEncounterInstance(payload: EncounterInstance, report: string): Promise<void> {
      const archive = EncounterArchive.FromInstance(payload, report)
      await this.AddEncounterArchive(archive)
      await this.RemoveEncounterInstance(payload)
      if (this.CurrentActiveID === payload.ID) {
        this.CurrentActiveID = ''
        await SetValue('current_active_encounter_id', '')
      }
    },

    async AddEncounterArchive(payload: EncounterArchive): Promise<void> {
      if (this.ArchivedEncounters.some(x => x.ID === payload.ID)) {
        logger.warn(
          `EncounterArchive with ID ${payload.ID} already exists, updating instead.`,
          this
        )
        return
      }
      this.ArchivedEncounters.push(payload)
      await SetItem('encounter_archives', payload.Serialize())
    },

    async RemoveEncounterArchive(payload: EncounterArchive): Promise<void> {
      const idx = this.ArchivedEncounters.findIndex(x => x.ID === payload.ID)
      if (idx >= 0) {
        this.ArchivedEncounters.splice(idx, 1)
        await RemoveItem('encounter_archives', payload.ID)
      }
    },

    async SetActiveEncounter(id: string): Promise<void> {
      this.CurrentActiveID = id
      SetValue('current_active_encounter_id', id)
    },

    async AssignActiveEncounter(payload: EncounterInstance): Promise<void> {
      this.CurrentActiveID = payload.ID
      SetValue('current_active_encounter_id', payload.ID)
    },

    async CloneEncounter(payload: Encounter): Promise<void> {
      this.Encounters.push(payload.Clone())

      this.SaveEncounterData()
    },

    async DeleteEncounterPermanent(payload: Encounter): Promise<void> {
      const idx = this.Encounters.findIndex(x => x.ID === payload.ID)
      if (idx >= 0) this.Encounters.splice(idx, 1)
      await RemoveItem('Encounters', payload.ID)
      this.SaveEncounterData()
      if (payload.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(payload.CloudController.Metadata)
      }
    },

    async SaveEncounterData(): Promise<void> {
      Promise.all((this.Encounters as any).map(y => SetItem('encounters', y.Serialize())))
        .then(() => logger.info('Encounter data saved'))
        .catch(err => logger.error('Error while saving Encounter data', this, err))
    },

    async SaveActiveEncounterData(): Promise<void> {
      Promise.all(
        (this.ActiveEncounters as any).map(y => SetItem('active_encounters', y.Serialize()))
      )
        .then(() => logger.info('Active Encounter data saved'))
        .catch(err => logger.error('Error while saving Active Encounter data', this, err))
    },
  },
})
