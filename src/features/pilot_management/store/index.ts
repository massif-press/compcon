import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { Pilot } from '@/class';
import { PilotGroup, PilotGroupData } from './PilotGroup';
import { PortraitController, SaveController } from '@/classes/components';
import _ from 'lodash';

export const PilotStore = defineStore('pilot', {
  state: () => ({
    PilotGroups: [] as PilotGroup[],
    Pilots: [] as Pilot[],
    printOptions: null as PrintOptions | null,
  }),
  getters: {
    getPilotGroups: (state: any) => (showDeleted?: boolean) => {
      let out = _.sortBy(state.PilotGroups, 'SortIndex', 'asc');
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

      group.Pilots.forEach((pi, idx) => {
        const found = state.Pilots.find((p) => p.ID === pi.id);
        if (found) found.SortIndex = pi.index;
        else group.Pilots.splice(idx, 1);
      });

      out = _.sortBy(out, 'SortIndex', 'asc');

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

      // TODO: evaluate items with/missing LCP
      // this._loadPilots({
      //   pilotData: ItemsWithLcp(pilotData),
      // });

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
    AddPilot(pilot: Pilot, groupID?: string): void {
      // pilot.SaveController.IsDirty = true;
      // if (!this.Pilots) this.Pilots = [];

      this.Pilots.push(pilot);

      this.TransferPilot(pilot, groupID);

      this.SavePilotData();
    },
    SetPilot(index: number, pilot: Pilot): void {
      if (!this.Pilots[index]) return;
      this.Pilots.splice(index, 1, pilot);
      this.SavePilotData();
    },
    AddGroup(group: PilotGroup): void {
      this.PilotGroups.push(group);
      this.SavePilotData();
    },
    DeleteGroup(group: PilotGroup, deletePilots: boolean): void {
      for (const p of group.Pilots) {
        this.TransferPilot(this.getPilotByID(p.id));
      }

      if (deletePilots) {
        for (const p of group.Pilots) {
          this.getPilotByID(p.id).SaveController.Delete();
        }
      }

      group.SaveController.Delete();
      this.SavePilotData();
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
    DeletePilotPermanent(pilot: Pilot): void {
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
    TransferPilot(p: Pilot, destinationID?: string): void {
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

      this.SaveGroupData();
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
      this.SavePilotData();
    },
    Reorder(): void {
      this.PilotGroups = _.orderBy(this.PilotGroups, 'SortIndex', 'asc');
      this.PilotGroups.forEach((group) => {
        group.Pilots = _.orderBy(group.Pilots, 'index', 'asc');
      });
      this.SavePilotData();
    },

    // savePilotData(): void {
    //   if (!this.Pilots) this.Pilots = [];
    //   if (!this.DeletedPilots) this.DeletedPilots = [];

    //   savePilots((this.Pilots as Pilot[]).concat(this.DeletedPilots as Pilot[]));
    // },

    // async loadCloudPilots(payload: PilotData) {
    //   this._loadPilots({ pilotData: [payload] });
    // },

    // delete_pilot(payload: Pilot): void {
    //   this.DeletePilot(payload);
    // },

    // deletePilotPermanent(payload: Pilot): void {
    //   if (!payload.SaveController.IsDeleted) this.DeletePilot(payload);
    //   this.deletePilotPermanent(payload);
    // },

    // restore_pilot(payload: Pilot): void {
    //   this.restorePilot(payload);
    // },
  },
});
