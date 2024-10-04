import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { Pilot } from '@/class';
import { PilotGroup, PilotGroupData } from './PilotGroup';
import { PortraitController, SaveController } from '@/classes/components';
import _ from 'lodash';
import { IndexItem } from '@/stores';

export const PilotStore = defineStore('pilot', {
  state: () => ({
    PilotGroups: [] as PilotGroup[],
    Pilots: [] as Pilot[],
  }),
  getters: {
    getPilotGroups: (state: any) => (showDeleted?: boolean) => {
      let out = _.orderBy(state.PilotGroups, 'SortIndex', 'asc');
      if (!showDeleted) out = out.filter((x: PilotGroup) => !x.SaveController.IsDeleted);
      return out;
    },
    getPilotByID: (state: any) => (id: string) => {
      return state.Pilots.find((p: Pilot) => p.ID === id);
    },
    getGroupByID: (state: any) => (id: string) => {
      return state.PilotGroups.find((p: PilotGroup) => p.ID === id);
    },
    getPilots: (state: any) => (groupID: string, showDeleted?: boolean) => {
      if (!state.Pilots.length) return [];
      const group = state.PilotGroups.find((x: PilotGroup) => x.ID === groupID);

      let out = state.Pilots.filter((p) => group.Pilots.map((x) => x.id).includes(p.ID));

      // group.Pilots.forEach((pi, idx) => {
      //   const found = state.Pilots.find((p) => p.ID === pi.id);
      //   if (found) found.SortIndex = pi.index;
      //   else group.Pilots.splice(idx, 1);
      // });

      // out = _.sortBy(out, 'SortIndex', 'asc');

      if (!showDeleted) out = out.filter((x: Pilot) => !x.SaveController.IsDeleted);
      return out;
    },
    getUngroupedPilots: (state: any) => {
      const groupedIds = state.PilotGroups.flatMap((x: PilotGroup) => x.Pilots);
      return state.Pilots.filter((p: Pilot) => !groupedIds.includes(p.ID));
    },
    getGroupByPilotID: (state: any) => (pilotID: string) => {
      return state.PilotGroups.find((x: PilotGroup) => x.Pilots.map((x) => x.id).includes(pilotID));
    },
    getMissingDataPilots: (state: any) => {
      return state.Pilots.filter((x: Pilot) => x.BrewController.MissingContent);
    },
    pilotIndexes: (state: any): IndexItem[] => {
      const pilots = state.Pilots.filter((x: Pilot) => !x.SaveController.IsDeleted);
      return pilots.map((x: Pilot) => ({
        id: x.ID,
        title: `${x.Callsign} (${x.Name})`,
        type: 'Pilot',
        pack: '',
        path: `/pilot/${x.ID}`,
        icon: 'cc:pilot',
      }));
    },
    mechIndexes: (state: any): IndexItem[] => {
      const pilots = state.Pilots.filter((x: Pilot) => !x.SaveController.IsDeleted);
      return pilots.flatMap((x: Pilot) =>
        x.Mechs.map((m) => ({
          id: m.ID,
          title: m.Name,
          type: `Mech (${x.Callsign} // ${x.Name})`,
          pack: '',
          path: `/pilot/${x.ID}/mech/${m.ID}`,
          icon: 'cc:mech',
        }))
      );
    },
  },
  actions: {
    async LoadPilots(): Promise<void> {
      let pilotGroupData = await GetAll('pilot_groups');
      this.PilotGroups = pilotGroupData.map((x) => PilotGroup.Deserialize(x));

      let pilotData = await GetAll('pilots');
      this.Pilots = pilotData.map((x) => Pilot.Deserialize(x));

      if (!this.PilotGroups.some((x) => x.ID === 'no_group')) {
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
        );
      }

      this.ImportUngroupedPilots();
    },
    ImportUngroupedPilots(): void {
      // import v2 pilots
      // const localData = localStorage.getItem('pilots_v2');
      // if (localData) {
      //   const localPilots = JSON.parse(localData);
      // }

      const groupedIds = this.PilotGroups.flatMap((x) => x.Pilots);
      const ungroupedPilots = this.Pilots.filter(
        (x) => !groupedIds.map((x) => x.id).includes(x.ID)
      );

      ungroupedPilots.forEach((p) => {
        this.TransferPilot(p as Pilot);
      });
    },
    async AddPilot(pilot: Pilot, groupID?: string): Promise<void> {
      console.log('Adding pilot', pilot);
      // pilot.SaveController.IsDirty = true;
      // if (!this.Pilots) this.Pilots = [];

      if (this.Pilots.some((x) => x.ID === pilot.ID)) {
        console.log('Pilot already exists');
        // also saves
        this.SetPilot(
          this.Pilots.findIndex((x) => x.ID === pilot.ID),
          pilot
        );
        return;
      }

      this.Pilots.push(pilot);

      await this.TransferPilot(pilot, groupID);
      await this.SavePilotData();
    },
    async SetPilot(index: number, pilot: Pilot): Promise<void> {
      if (!this.Pilots[index]) return;
      this.Pilots.splice(index, 1, pilot);
      await this.SavePilotData();
    },
    async AddGroup(group: PilotGroup): Promise<void> {
      this.PilotGroups.push(group);
      await this.SavePilotData();
    },
    async DeleteGroup(group: PilotGroup, deletePilots: boolean): Promise<void> {
      for (const p of group.Pilots) {
        await this.TransferPilot(this.getPilotByID(p.id));
      }

      if (deletePilots) {
        for (const p of group.Pilots) {
          this.getPilotByID(p.id).SaveController.Delete();
        }
      }

      group.SaveController.Delete();
      await this.SavePilotData();
    },
    async DeleteGroupPermanent(group: PilotGroup): Promise<void> {
      this.PilotGroups.splice(this.PilotGroups.indexOf(group), 1);
      await RemoveItem('pilot_groups', group.ID);
    },
    async SavePilotData(): Promise<void> {
      // TODO: reactivate dirty

      Promise.all(this.Pilots.map((y) => SetItem('pilots', Pilot.Serialize(y as Pilot))))
        .then(() => this.SaveGroupData())
        .then(() => console.info('Pilot data saved'))
        .catch((err) => console.error('Error while saving Pilot data', err));
    },
    async SaveGroupData(): Promise<void> {
      // TODO: reactivate dirty

      Promise.all([
        this.PilotGroups.map((x) => SetItem('pilot_groups', PilotGroup.Serialize(x as PilotGroup))),
      ])
        .then(() => console.info('Pilot group data saved'))
        .catch((err) => console.error('Error while saving Pilot data', err));
    },

    ClonePilot(payload: Pilot): void {
      //TODO: add group setting

      this.AddPilot(payload.Clone(), this.getGroupByPilotID(payload.ID));
    },
    async DeletePilotPermanent(pilot: Pilot): Promise<void> {
      const groupIndex = this.PilotGroups.findIndex((x) =>
        x.Pilots.map((x) => x.id).includes(pilot.ID)
      );

      if (groupIndex > -1) {
        this.PilotGroups[groupIndex].Pilots.splice(
          this.PilotGroups[groupIndex].Pilots.findIndex((p) => p.id === pilot.ID),
          1
        );
      }

      this.Pilots.splice(this.Pilots.indexOf(pilot), 1);

      RemoveItem('pilots', pilot.ID);
    },
    async TransferPilot(p: Pilot, destinationID?: string): Promise<void> {
      const dest = destinationID ? destinationID : 'no_group';
      const destinationIndex = this.PilotGroups.findIndex((x) => x.ID === dest);
      const sourceIndex = this.PilotGroups.findIndex((x) =>
        x.Pilots.map((x) => x.id).includes(p.ID)
      );

      if (destinationIndex > -1) {
        this.PilotGroups[destinationIndex].Pilots.push({ id: p.ID, index: -1 });
      }

      if (sourceIndex > -1) {
        const pilotIndex = this.PilotGroups[sourceIndex].Pilots.findIndex((p) => p.id === p.id);
        if (pilotIndex > -1) this.PilotGroups[sourceIndex].Pilots.splice(pilotIndex, 1);
      }

      await this.SaveGroupData();
    },
    movePilotIndex(group: PilotGroup, from: number, to: number): void {
      this._moveItemInArray(group.Pilots, from, to);
    },
    moveGroupIndex(from: number, to: number): void {
      this._moveItemInArray(this.PilotGroups, from, to);
    },
    _moveItemInArray<T>(array: T[], from: number, to: number): void {
      const item = array.splice(from, 1)[0];
      array.splice(to, 0, item);
      array.forEach((x: any, i) => (x.SortIndex = i));
    },
    ReorderPilot(pilot: Pilot, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const group = this.getGroupByPilotID(pilot.ID);

      if (dir === 'top') {
        this.movePilotIndex(group, pilot.SortIndex, 0);
      } else if (dir === 'up') {
        this.movePilotIndex(group, pilot.SortIndex, pilot.SortIndex - 1);
      } else if (dir === 'down') {
        this.movePilotIndex(group, pilot.SortIndex, pilot.SortIndex + 1);
      } else if (dir === 'bottom') {
        this.movePilotIndex(group, pilot.SortIndex, group.Pilots.length - 1);
      }

      group.Pilots.forEach((pItem, idx) => {
        const pilot = this.getPilotByID(pItem.id);
        if (pilot) pilot.SortIndex = idx;
      });
      this.SavePilotData();
      this.SaveGroupData();
    },
    ReorderGroup(group: PilotGroup, dir: 'top' | 'up' | 'down' | 'bottom'): void {
      const index = this.PilotGroups.findIndex((x) => x.ID === group.ID);

      if (dir === 'top') {
        this.moveGroupIndex(index, 0);
      } else if (dir === 'up') {
        this.moveGroupIndex(index, index - 1);
      } else if (dir === 'down') {
        this.moveGroupIndex(index, index + 1);
      } else if (dir === 'bottom') {
        this.moveGroupIndex(index, this.PilotGroups.length - 1);
      }
      this.SavePilotData();
      this.SaveGroupData();
    },
  },
});
