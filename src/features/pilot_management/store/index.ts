import { defineStore } from 'pinia'
import { SetItem, RemoveItem, GetAll, saveAll } from '@/io/Storage'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotGroup } from './PilotGroup'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { PortraitController } from '@/classes/components/portrait/PortraitController'
import { SaveController } from '@/classes/components/save/SaveController'
import * as _ from 'lodash-es'
import { NavStore } from '@/stores/nav'
import type { IndexItem } from '@/stores/nav'
import logger from '@/user/logger'
import { PilotSheetStore } from './PilotSheetStore'

export { PilotSheetStore } from './PilotSheetStore'

export const PilotStore = defineStore('pilot', {
  state: () => ({
    PilotGroups: [] as PilotGroup[],
    Pilots: [] as Pilot[],
  }),
  getters: {
    getPilotGroups: state => (showDeleted?: boolean) => {
      let out = _.orderBy(state.PilotGroups, 'SortIndex', 'asc')
      if (!showDeleted) out = out.filter(x => !x.SaveController.IsDeleted)
      return out
    },
    getPilotByID: state => (id: string) => {
      return state.Pilots.find(p => p.ID === id)
    },
    getGroupByID: state => (id: string) => {
      return state.PilotGroups.find(p => p.ID === id)
    },
    getPilots:
      state =>
      (groupID: string, showDeleted?: boolean): Pilot[] => {
        if (!state.Pilots.length) return []
        const group = state.PilotGroups.find(x => x.ID === groupID)
        if (!group) return []
        let out = state.Pilots.filter(p => group.Pilots.some(x => x?.id === p.ID))
        if (!showDeleted) out = out.filter(x => !x.SaveController.IsDeleted)
        return out
      },
    getUngroupedPilots: state => {
      const groupedIds = state.PilotGroups.flatMap(x => x.Pilots)
      return state.Pilots.filter(p => !groupedIds.some(g => g.id === p.ID))
    },
    getGroupByPilotID: state => (pilotID: string) => {
      return state.PilotGroups.find(x => x.Pilots.map(x => x.id).includes(pilotID))
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
      const pilotGroupData = await GetAll('pilot_groups')
      this.PilotGroups = pilotGroupData.map(x => PilotGroup.Deserialize(x))

      const pilotData = await GetAll('pilots')
      this.Pilots = pilotData.map(x => Pilot.Deserialize(x))

      if (!this.PilotGroups.some(x => x.ID === 'no_group')) {
        this.PilotGroups.push(
          new PilotGroup({
            id: 'no_group',
            name: 'No Group',
            pilots: [],
            description: '',
            history: '',
            sortIndex: -1,
            img: PortraitController.NewPortraitData(),
            save: SaveController.NewSaveData(),
            expanded: true,
          })
        )
      }

      await this.RebuildGroups()
      await this.ImportUngroupedPilots()
      await PilotSheetStore().LoadPilotSheets()
    },
    async RebuildGroups(): Promise<void> {
      const seen = new Set<string>()
      let dirty = false

      const ordered = [
        ...this.PilotGroups.filter((g: PilotGroup) => g.ID !== 'no_group'),
        ...this.PilotGroups.filter((g: PilotGroup) => g.ID === 'no_group'),
      ]

      for (const group of ordered) {
        const deduped = group.Pilots.filter(p => !seen.has(p.id))
        if (deduped.length !== group.Pilots.length) {
          group.Pilots = deduped
          dirty = true
        }
        deduped.forEach(p => seen.add(p.id))
      }

      if (dirty) await this.SaveGroupData()
    },
    async ImportUngroupedPilots(): Promise<void> {
      const groupedIds = this.PilotGroups.flatMap(x => x.Pilots).map(x => x.id)
      const ungroupedPilots = (this.Pilots as Pilot[]).filter(
        (p: Pilot) => !groupedIds.includes(p.ID)
      )

      for (const p of ungroupedPilots) {
        await this.TransferPilot(p as Pilot)
      }
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
        const existingGroup = this.PilotGroups.find(
          g => g.ID !== 'no_group' && g.Pilots.some(x => x.id === pilot.ID)
        )
        if (existingGroup) groupID = existingGroup.ID
      }

      await this.TransferPilot(pilot, groupID)
      await this.SavePilotData()
    },
    async SetPilot(index: number, pilot: Pilot): Promise<void> {
      if (!this.Pilots[index]) return
      this.Pilots.splice(index, 1, pilot)
      await this.SavePilotData()
    },
    async AddGroup(group: PilotGroup): Promise<void> {
      const noGroup = this.PilotGroups.find(x => x.ID === 'no_group')
      if (noGroup && group.Pilots.length) {
        const groupPilotIds = new Set(group.Pilots.map(p => p.id))
        noGroup.Pilots = noGroup.Pilots.filter(p => !groupPilotIds.has(p.id))
      }

      const existing = this.PilotGroups.findIndex(x => x.ID === group.ID)
      if (existing !== -1) {
        this.PilotGroups.splice(existing, 1, group)
      } else {
        this.PilotGroups.unshift(group)
      }
      await this.SavePilotData()
    },
    async DeleteGroup(group: PilotGroup, deletePilots: boolean): Promise<void> {
      const pilotIDs = group.Pilots.map(p => p.id)
      const noGroup = this.PilotGroups.find(x => x.ID === 'no_group')

      for (const id of pilotIDs) {
        for (const g of this.PilotGroups) {
          if (g.ID === 'no_group') continue
          if (g.Pilots.some(x => x.id === id)) {
            g.Pilots = g.Pilots.filter(x => x.id !== id)
          }
        }
        if (noGroup && !deletePilots && !noGroup.Pilots.some(x => x.id === id)) {
          noGroup.Pilots.push({ id, index: -1 })
        }
      }

      if (deletePilots) {
        for (const id of pilotIDs) {
          this.getPilotByID(id)?.SaveController.Delete()
        }
      }

      group.SaveController.Delete()
      await this.SavePilotData()
    },
    async DeleteGroupPermanent(group: PilotGroup): Promise<void> {
      this.PilotGroups.splice(this.PilotGroups.indexOf(group), 1)
      await RemoveItem('pilot_groups', group.ID || (group as any)._id)
    },
    async SavePilotData(pilotIds?: string[]): Promise<void> {
      try {
        this.PilotGroups.forEach(group => {
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
          ...this.PilotGroups.map(x =>
            SetItem('pilot_groups', PilotGroup.Serialize(x as PilotGroup))
          ),
        ])
        logger.info('Pilot data saved')
      } catch (err) {
        logger.error('Error while saving Pilot data', this, err)
      }
    },
    async SaveGroupData(): Promise<void> {
      this.PilotGroups.forEach((group, idx) => {
        group.SortIndex = idx
      })
      await saveAll('pilot_groups', this.PilotGroups, x => PilotGroup.Serialize(x as PilotGroup), 'Pilot group data')
    },

    async ClonePilot(payload: Pilot): Promise<void> {
      await this.AddPilot(payload.Clone(), this.getGroupByPilotID(payload.ID)?.ID)
    },
    async DeletePilotPermanent(pilot: Pilot): Promise<void> {
      const id = pilot.ID || (pilot as any)._id
      const groupIndex = this.PilotGroups.findIndex(x => x.Pilots.map(x => x.id).includes(id))

      if (groupIndex > -1) {
        this.PilotGroups[groupIndex].Pilots.splice(
          this.PilotGroups[groupIndex].Pilots.findIndex(p => p.id === id),
          1
        )
      }

      const pilotIndex = this.Pilots.findIndex(x => x.ID === id)

      if (pilotIndex === -1) return

      this.Pilots.splice(pilotIndex, 1)

      if (pilot.PortraitController.LocalImage) {
        await RemoveItem('images', pilot.PortraitController.LocalImage)
      }

      await RemoveItem('pilots', id)

      if (pilot.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(pilot.CloudController.Metadata)
      }
    },
    async TransferPilot(p: Pilot, destinationID?: string): Promise<void> {
      const dest = destinationID ?? 'no_group'
      const destinationIndex = this.PilotGroups.findIndex(x => x.ID === dest)

      for (const group of this.PilotGroups) {
        if (group.ID === dest) continue
        if (group.Pilots.some(x => x.id === p.ID)) {
          group.Pilots = group.Pilots.filter(x => x.id !== p.ID)
        }
      }

      if (
        destinationIndex > -1 &&
        !this.PilotGroups[destinationIndex].Pilots.some(x => x.id === p.ID)
      ) {
        this.PilotGroups[destinationIndex].Pilots.push({ id: p.ID, index: -1 })
      }

      p.SaveController.save()
      await this.SaveGroupData()
    },
    movePilotIndex(group: PilotGroup, from: number, to: number): void {
      this._moveItemInArray(group.Pilots, from, to)
    },
    moveGroupIndex(from: number, to: number): void {
      this._moveItemInArray(this.PilotGroups, from, to)
    },
    _moveItemInArray<T>(array: T[], from: number, to: number): void {
      const item = array.splice(from, 1)[0]
      array.splice(to, 0, item)
    },
    ReorderPilot(pilot: Pilot, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const group = this.getGroupByPilotID(pilot.ID)
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
    ReorderGroup(group: PilotGroup, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const index = this.PilotGroups.findIndex(x => x.ID === group.ID)

      if (dir === 'top') {
        this.moveGroupIndex(index, 0)
      } else if (dir === 'up') {
        this.moveGroupIndex(index, index - 1)
      } else if (dir === 'down') {
        this.moveGroupIndex(index, index + 1)
      } else if (dir === 'bottom') {
        this.moveGroupIndex(index, this.PilotGroups.length - 1)
      }
      this.SaveGroupData()
    },
    ReorderPilotByIndex(pilot: Pilot, toIndex: number): void {
      const group = this.getGroupByPilotID(pilot.ID)
      if (!group) return
      const fromIdx = (group as PilotGroup).Pilots.findIndex(p => p.id === pilot.ID)
      if (fromIdx === -1) return
      this.movePilotIndex(group as PilotGroup, fromIdx, toIndex)
      this.SaveGroupData()
    },
    ReorderGroupByIndex(group: PilotGroup, toIndex: number): void {
      const fromIndex = this.PilotGroups.findIndex(x => x.ID === group.ID)
      if (fromIndex === -1) return
      this.moveGroupIndex(fromIndex, toIndex)
      this.SaveGroupData()
    },
  },
})
