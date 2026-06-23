import { defineStore } from 'pinia'
import { RemoveItem, saveAll } from '@/io/Storage'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotGroup } from './PilotGroup'
import { PortraitController } from '@/classes/components/portrait/PortraitController'
import { SaveController } from '@/classes/components/save/SaveController'
import { GetAll } from '@/io/Storage'
import * as _ from 'lodash-es'
import { ICloudData } from '@/classes/components/cloud/CloudTypes'

function moveItemInArray<T>(array: T[], from: number, to: number): void {
  const item = array.splice(from, 1)[0]
  array.splice(to, 0, item)
}

export const PilotGroupStore = defineStore('pilot_group', {
  state: () => ({
    PilotGroups: [] as PilotGroup[],
  }),
  getters: {
    getPilotGroups:
      state =>
      (showDeleted?: boolean): PilotGroup[] => {
        let out = _.orderBy(state.PilotGroups, 'SortIndex', 'asc')
        if (!showDeleted) out = out.filter(x => !x.SaveController.IsDeleted)
        return out as PilotGroup[]
      },
    getGroupByID:
      state =>
      (id: string): PilotGroup => {
        return state.PilotGroups.find(p => p.ID === id) as PilotGroup
      },
    getGroupByPilotID:
      state =>
      (pilotID: string): PilotGroup => {
        return state.PilotGroups.find(x => x.Pilots.map(x => x.id).includes(pilotID)) as PilotGroup
      },
  },
  actions: {
    async LoadGroups(): Promise<void> {
      const pilotGroupData = await GetAll('pilot_groups')
      this.PilotGroups = pilotGroupData.map(x => PilotGroup.Deserialize(x))

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
            cloud: {} as ICloudData,
          })
        )
      }

      this.PilotGroups.sort((a, b) => a.SortIndex - b.SortIndex)
    },
    async RebuildGroups(): Promise<void> {
      const seen = new Set<string>()
      let dirty = false

      const ordered = [
        ...this.PilotGroups.filter(g => g.ID !== 'no_group'),
        ...this.PilotGroups.filter(g => g.ID === 'no_group'),
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
      const { PilotStore } = await import('./index')
      const groupedIds = this.PilotGroups.flatMap(x => x.Pilots).map(x => x.id)
      const ungroupedPilots = (PilotStore().Pilots as Pilot[]).filter(
        (p: Pilot) => !groupedIds.includes(p.ID)
      )
      for (const p of ungroupedPilots) {
        await this.TransferPilot(p as Pilot)
      }
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
      await this.SaveGroupData()
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
        const { PilotStore } = await import('./index')
        for (const id of pilotIDs) {
          PilotStore().getPilotByID(id)?.SaveController.Delete()
        }
      }

      group.SaveController.Delete()
      await this.SaveGroupData()
    },
    async DeleteGroupPermanent(group: PilotGroup): Promise<void> {
      this.PilotGroups.splice(this.PilotGroups.indexOf(group), 1)
      await RemoveItem('pilot_groups', group.ID)
    },
    async SaveGroupData(): Promise<void> {
      this.PilotGroups.forEach((group, idx) => {
        group.SortIndex = idx
      })
      await saveAll(
        'pilot_groups',
        this.PilotGroups,
        x => PilotGroup.Serialize(x as PilotGroup),
        'Pilot group data'
      )
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
    moveGroupIndex(from: number, to: number): void {
      moveItemInArray(this.PilotGroups, from, to)
    },
    ReorderGroup(group: PilotGroup, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const visual = this.PilotGroups
        .filter(g => g.ID !== 'no_group' && !g.SaveController.IsDeleted)
        .sort((a, b) => a.SortIndex - b.SortIndex)
      const rest = this.PilotGroups.filter(g => g.ID === 'no_group' || g.SaveController.IsDeleted)
      const index = visual.findIndex(x => x.ID === group.ID)
      if (index === -1) return
      if (dir === 'top') moveItemInArray(visual, index, 0)
      else if (dir === 'up' && index > 0) moveItemInArray(visual, index, index - 1)
      else if (dir === 'down' && index < visual.length - 1) moveItemInArray(visual, index, index + 1)
      else if (dir === 'bottom') moveItemInArray(visual, index, visual.length - 1)
      else return
      this.PilotGroups = [...visual, ...rest]
      this.SaveGroupData()
    },
    ReorderGroupByIndex(group: PilotGroup, toIndex: number): void {
      const visual = this.PilotGroups
        .filter(g => g.ID !== 'no_group' && !g.SaveController.IsDeleted)
        .sort((a, b) => a.SortIndex - b.SortIndex)
      const rest = this.PilotGroups.filter(g => g.ID === 'no_group' || g.SaveController.IsDeleted)
      const fromIndex = visual.findIndex(x => x.ID === group.ID)
      if (fromIndex === -1) return
      moveItemInArray(visual, fromIndex, toIndex)
      this.PilotGroups = [...visual, ...rest]
      this.SaveGroupData()
    },
  },
})
