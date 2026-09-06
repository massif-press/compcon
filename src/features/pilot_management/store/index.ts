import { defineStore } from 'pinia'
import { SetItem, RemoveItem, GetAll } from '@/io/Storage'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotLogbook } from '@/classes/pilot/PilotLogbook'
import { PilotGroup } from './PilotGroup'
import { CloudController } from '@/classes/components/cloud/CloudController'
import type { ILogStream } from '@/classes/components/combat/log/events'
import * as _ from 'lodash-es'
import { NavStore } from '@/stores/nav'
import type { IndexItem } from '@/stores/nav'
import logger from '@/user/logger'
import { PilotSheetStore } from './PilotSheetStore'
import { PilotGroupStore } from './PilotGroupStore'

export { PilotSheetStore } from './PilotSheetStore'
export { PilotGroupStore } from './PilotGroupStore'

export const PilotStore = defineStore('pilot', {
  state: () => ({
    Pilots: [] as Pilot[],
    PilotLogbooks: [] as PilotLogbook[],
  }),
  getters: {
    getLogbookByPilotID: state => (pilotId: string) => {
      return state.PilotLogbooks.find(l => l.PilotID === pilotId) as PilotLogbook | undefined
    },
    getPilotByID:
      state =>
      (id: string): Pilot | undefined => {
        return state.Pilots.find(p => p.ID === id) as Pilot | undefined
      },
    getPilots:
      state =>
      (groupID: string, showDeleted?: boolean): Pilot[] => {
        if (!state.Pilots.length) return []
        const group = PilotGroupStore().PilotGroups.find(x => x.ID === groupID)
        if (!group) return []
        let out = state.Pilots.filter(p => group.Pilots.some(x => x?.id === p.ID))
        if (!showDeleted) out = out.filter(x => !x.SaveController.IsDeleted)
        return out as Pilot[]
      },
    getUngroupedPilots: state => {
      const groupedIds = PilotGroupStore().PilotGroups.flatMap(x => x.Pilots)
      return state.Pilots.filter(p => !groupedIds.some(g => g.id === p.ID))
    },
    getMissingDataPilots: state => {
      return state.Pilots.filter(x => x.BrewController.MissingContent)
    },
    pilotIndexes: (state): IndexItem[] => {
      const pilots = state.Pilots.filter(x => !x.SaveController.IsDeleted)
      return pilots.map(x => ({
        id: x.ID,
        title: `${x.Callsign} (${x.Name})`,
        type: 'Pilot',
        pack: '',
        path: `/pilot/${x.ID}`,
        icon: 'cc:pilot',
      }))
    },
    mechIndexes: (state): IndexItem[] => {
      const pilots = state.Pilots.filter(x => !x.SaveController.IsDeleted)
      return pilots.flatMap(x =>
        x.Mechs.map(m => ({
          id: m.ID,
          title: m.Name,
          type: `Mech (${x.Callsign} // ${x.Name})`,
          pack: '',
          path: `/pilot/${x.ID}/mech/${m.ID}`,
          icon: 'cc:mech',
        }))
      )
    },
  },
  actions: {
    async LoadPilots(): Promise<void> {
      await PilotGroupStore().LoadGroups()

      const pilotData = await GetAll('pilots')
      this.Pilots = pilotData.map(x => Pilot.Deserialize(x))

      await PilotGroupStore().RebuildGroups()
      await PilotGroupStore().ImportUngroupedPilots()
      await PilotSheetStore().LoadPilotSheets()
      await this.LoadPilotLogbooks()
    },
    async AddPilot(pilot: Pilot, groupID?: string): Promise<void> {
      if (this.Pilots.some(x => x.ID === pilot.ID)) {
        logger.info(`Pilot ${pilot.Callsign} already exists`)
        this.SetPilot(
          this.Pilots.findIndex(x => x.ID === pilot.ID),
          pilot
        )
        return
      }

      this.Pilots.push(pilot)
      NavStore().updatePilotEntry(pilot)

      if (!groupID) {
        const existingGroup = PilotGroupStore().PilotGroups.find(
          g => g.ID !== 'no_group' && g.Pilots.some(x => x.id === pilot.ID)
        )
        if (existingGroup) groupID = existingGroup.ID
      }

      await PilotGroupStore().TransferPilot(pilot, groupID)
      await this.SavePilotData()
    },
    async SetPilot(index: number, pilot: Pilot): Promise<void> {
      if (!this.Pilots[index]) return
      this.Pilots.splice(index, 1, pilot)
      await this.SavePilotData()
    },
    async ClonePilot(payload: Pilot): Promise<void> {
      await this.AddPilot(payload.Clone(), PilotGroupStore().getGroupByPilotID(payload.ID)?.ID)
    },
    async DeletePilotPermanent(pilot: Pilot): Promise<void> {
      const id = pilot.ID || (pilot as any)._id
      const groups = PilotGroupStore().PilotGroups
      const groupIndex = groups.findIndex(x => x.Pilots.map(x => x.id).includes(id))

      if (groupIndex > -1) {
        groups[groupIndex].Pilots.splice(
          groups[groupIndex].Pilots.findIndex(p => p.id === id),
          1
        )
      }

      const pilotIndex = this.Pilots.findIndex(x => x.ID === id)

      if (pilotIndex === -1) return

      this.Pilots.splice(pilotIndex, 1)

      const logbook = this.PilotLogbooks.find(l => l.PilotID === id)
      if (logbook) await this.RemovePilotLogbook(logbook as PilotLogbook)

      if (pilot.PortraitController.LocalImage) {
        await RemoveItem('images', pilot.PortraitController.LocalImage)
      }

      await RemoveItem('pilots', id)

      if (pilot.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(pilot.CloudController.Metadata)
      }
    },
    async SavePilotData(pilotIds?: string[]): Promise<void> {
      try {
        const groups = PilotGroupStore().PilotGroups
        groups.forEach(group => {
          group.Pilots.forEach((pi, idx) => {
            const p = this.Pilots.find(p => p.ID === pi.id)
            if (p) p.SortIndex = idx
          })
        })

        const pilotsToSave = pilotIds
          ? this.Pilots.filter(p => pilotIds.includes(p.ID))
          : this.Pilots

        await Promise.all([
          ...pilotsToSave.map(y => SetItem('pilots', Pilot.Serialize(y as Pilot))),
          ...groups.map(x => SetItem('pilot_groups', PilotGroup.Serialize(x as PilotGroup))),
        ])
        logger.info('Pilot data saved')
      } catch (err) {
        logger.error('Error while saving Pilot data', this, err)
      }
    },
    async SaveGroupData(): Promise<void> {
      await PilotGroupStore().SaveGroupData()
    },
    movePilotIndex(group: PilotGroup, from: number, to: number): void {
      const item = group.Pilots.splice(from, 1)[0]
      group.Pilots.splice(to, 0, item)
    },
    ReorderPilot(pilot: Pilot, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const group = PilotGroupStore().getGroupByPilotID(pilot.ID)
      if (!group) return
      const fromIdx = (group as PilotGroup).Pilots.findIndex(p => p.id === pilot.ID)
      if (fromIdx === -1) return

      if (dir === 'top') {
        this.movePilotIndex(group as PilotGroup, fromIdx, 0)
      } else if (dir === 'up') {
        this.movePilotIndex(group as PilotGroup, fromIdx, fromIdx - 1)
      } else if (dir === 'down') {
        this.movePilotIndex(group as PilotGroup, fromIdx, fromIdx + 1)
      } else if (dir === 'bottom') {
        this.movePilotIndex(group as PilotGroup, fromIdx, (group as PilotGroup).Pilots.length - 1)
      }

      this.SaveGroupData()
    },
    ReorderPilotByIndex(pilot: Pilot, toIndex: number): void {
      const group = PilotGroupStore().getGroupByPilotID(pilot.ID)
      if (!group) return
      const fromIdx = (group as PilotGroup).Pilots.findIndex(p => p.id === pilot.ID)
      if (fromIdx === -1) return
      this.movePilotIndex(group as PilotGroup, fromIdx, toIndex)
      this.SaveGroupData()
    },
    async LoadPilotLogbooks(): Promise<void> {
      this.PilotLogbooks = await GetAll('pilot_logbooks').then(data =>
        data.map(x => PilotLogbook.Deserialize(x))
      )
    },

    // logbooks are created on first recorded encounter
    async LogbookForPilot(pilotId: string): Promise<PilotLogbook> {
      const existing = this.PilotLogbooks.find(l => l.PilotID === pilotId)
      if (existing) return existing as PilotLogbook

      const logbook = new PilotLogbook({ pilotId })
      this.PilotLogbooks.push(logbook)
      await this.SaveLogbook(logbook)
      return this.PilotLogbooks.find(l => l.ID === logbook.ID) as PilotLogbook
    },

    async RecordStream(stream: ILogStream, pilotId: string, actorId: string): Promise<void> {
      const logbook = await this.LogbookForPilot(pilotId)
      const plan = logbook.PlanImport(stream)
      logbook.Import(stream, actorId, plan.action === 'replace' ? plan.targetIndex : -1)
      await this.SaveLogbook(logbook)
    },

    async SaveLogbook(logbook: PilotLogbook): Promise<void> {
      await SetItem('pilot_logbooks', PilotLogbook.Serialize(logbook))
    },

    async ImportPilotLogbook(logbook: PilotLogbook): Promise<void> {
      const idx = this.PilotLogbooks.findIndex(x => x.ID === logbook.ID)
      if (idx !== -1) {
        logger.info(`Pilot logbook ${logbook.ID} already exists`)
        this.PilotLogbooks.splice(idx, 1, logbook)
      } else {
        this.PilotLogbooks.push(logbook)
      }
      await this.SaveLogbook(logbook)
    },

    async RemovePilotLogbook(logbook: PilotLogbook): Promise<void> {
      const id = logbook.ID || (logbook as any)._id
      const idx = this.PilotLogbooks.findIndex(x => x.ID === id)
      if (idx === -1) return
      this.PilotLogbooks.splice(idx, 1)
      await RemoveItem('pilot_logbooks', id)
      if (logbook.CloudController?.ShareCode) {
        await CloudController.MarkCloudDeleted(logbook.CloudController.Metadata)
      }
    },
  },
})
