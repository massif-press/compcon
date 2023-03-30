import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { Pilot } from '@/class';
import { PilotData } from '@/interface';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';

async function savePilots(pilots: Pilot[]) {
  const dirty = pilots.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('pilots', Pilot.Serialize(x))))
    .then(() => console.info('Pilot data saved'))
    .catch((err) => console.error('Error while saving Pilot data', err));
  // await saveDelta('pilots_v2.json', serialized)
}

async function delete_pilot(pilot: Pilot) {
  RemoveItem('pilots', pilot.ID)
    .then(() => console.info('Pilot permanently deleted'))
    .catch((err) => console.error('Error while deleting Pilot data', err));
}

export interface PilotGroup {
  name: string;
  pilotIDs: string[];
  hidden: boolean;
}

export const PilotStore = defineStore('pilot', {
  state: () => ({
    Pilots: [] as Pilot[],
    DeletedPilots: [] as Pilot[],
    PilotGroups: [] as PilotGroup[],
    MissingPilots: [] as PilotData[],
    LoadedMechID: '',
    ActivePilot: null as Pilot | null,
    printOptions: null as PrintOptions | null,
  }),
  getters: {
    AllPilots: (state: any) => state.Pilots.concat(state.DeletedPilots),
    getPilots: (state: any) => state.Pilots,
    unsavedCloudPilots: (state: any) =>
      state.Pilots.filter((p: Pilot) => p.SaveController.IsDirty),
    getActivePilot: (state: any) => state.ActivePilot,
    getPrintOptions: (state: any) => state.printOptions,
  },
  actions: {
    _loadPilots(payload: {
      pilotData: PilotData[];
      groupData: PilotGroup[];
    }): void {
      const all = payload.pilotData.map((x) => Pilot.Deserialize(x));
      this.Pilots = all.filter((x) => !x.SaveController.IsDeleted);
      this.DeletedPilots = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Pilot[];
      (this.DeletedPilots as Pilot[]).forEach((dp: Pilot) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} pilots marked for deletion`);

        Promise.all(del.map((p) => deletePermanent(p)))
          .then(() =>
            storeSaveDelta(
              (this.Pilots as Pilot[]).concat(this.DeletedPilots as Pilot[])
            )
          )
          .then(() => console.info('Done'))
          .catch((err) =>
            console.error('Error in permanently deleting pilots:', err)
          );
      }
    },
    AddPilot(payload: Pilot): void {
      payload.SaveController.IsDirty = true;
      this.Pilots.push(payload);
      savePilots(
        (this.Pilots as Pilot[]).concat(this.DeletedPilots as Pilot[])
      );
    },
    ClonePilot(payload: { pilot: Pilot; quirk: boolean }): void {
      const pilotData = Pilot.Serialize(payload.pilot);
      const newPilot = Pilot.Deserialize(pilotData);
      newPilot.RenewID();
      newPilot.Name += ' (CLONE)';
      newPilot.Callsign += '*';
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      this.Pilots.push(newPilot);
    },
    DeletePilot(payload: Pilot): void {
      const pilotIndex = (this.Pilots as Pilot[]).findIndex(
        (x: Pilot) => x.ID === payload.ID
      );

      if (pilotIndex > -1) {
        this.Pilots.splice(pilotIndex, 1);
        this.DeletedPilots.push(payload);
      } else {
        throw console.error('Pilot not loaded!');
      }
    },
    DeletePilotPermanent(payload: Pilot): void {
      const dpIdx = (this.DeletedPilots as Pilot[]).findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        this.DeletedPilots.splice(dpIdx, 1);
        deletePermanent(payload);
      }
    },
    DeleteMissingPilot(payload: any): void {
      const idx = (this.MissingPilots as any[]).findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (idx > -1) {
        this.MissingPilots.splice(idx, 1);
        deletePermanent(payload);
      }
    },
    restorePilot(payload: Pilot): void {
      const pilotIndex = (this.DeletedPilots as Pilot[]).findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (pilotIndex > -1) {
        this.DeletedPilots.splice(pilotIndex, 1);
        this.Pilots.push(payload);
      } else {
        throw console.error('Pilot not loaded!');
      }
    },
    setLoadedMech(payload: string): void {
      this.LoadedMechID = payload;
    },

    SetMissingPilots(payload: PilotData[]): void {
      this.MissingPilots = payload;
    },

    savePilotData(): void {
      savePilots(
        (this.Pilots as Pilot[]).concat(this.DeletedPilots as Pilot[])
      );
    },

    async LoadPilots() {
      const pilotData = await GetAll('pilots');
      this._loadPilots({
        pilotData: ItemsWithLcp(pilotData),
        groupData: [],
      });
      this.SetMissingPilots(ItemsMissingLcp(pilotData));
    },

    async loadCloudPilots(payload: PilotData) {
      this._loadPilots({ pilotData: [payload], groupData: [] });
    },

    delete_pilot(payload: Pilot): void {
      this.DeletePilot(payload);
    },

    deletePilotPermanent(payload: Pilot): void {
      if (!payload.SaveController.IsDeleted) this.DeletePilot(payload);
      this.deletePilotPermanent(payload);
    },

    restore_pilot(payload: Pilot): void {
      this.restorePilot(payload);
    },
  },
});
