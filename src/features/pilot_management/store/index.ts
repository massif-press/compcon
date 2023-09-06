import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { Pilot } from '@/class';
import { PilotData } from '@/interface';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { PilotGroup, PilotGroupData } from './PilotGroup';
import { PortraitController, SaveController } from '@/classes/components';

// async function save() {
//   // TODO: reactivate dirty
//   // const dirty = pilots.filter((x) => x.SaveController.IsDirty);

//   Promise.all(pilots.map((x) => SetItem('pilots', Pilot.Serialize(x))))
//     .then(() => console.info('Pilot data saved'))
//     .catch((err) => console.error('Error while saving Pilot data', err));
//   // await saveDelta('pilots_v2.json', serialized)
// }

async function delete_pilot(pilot: Pilot) {
  RemoveItem('pilots', pilot.ID)
    .then(() => console.info('Pilot permanently deleted'))
    .catch((err) => console.error('Error while deleting Pilot data', err));
}

export const PilotStore = defineStore('pilot', {
  state: () => ({
    PilotGroups: [] as PilotGroup[],
    LoadedMechID: '',
    ActivePilot: null as Pilot | null,
    printOptions: null as PrintOptions | null,
  }),
  getters: {
    Pilots: (state: any) => state.PilotGroups.flatMap((x: PilotGroup) => x.Pilots),
    GetPilotGroups: (state: any) => state.PilotGroups,
    getPilotByID: (state: any) => (id: string) => {
      return state.Pilots.find((p: Pilot) => p.ID === id);
    },
  },
  actions: {
    async LoadPilots(): Promise<void> {
      let pilotGroupData = await GetAll('pilots');

      this.PilotGroups = pilotGroupData.map((x) => PilotGroup.Deserialize(x));

      if (!this.PilotGroups.some((x) => x.ID === 'no_group')) {
        this.PilotGroups.push(
          new PilotGroup({
            id: 'no_group',
            name: 'No Group',
            pilots: [],
            description: '',
            history: '',
            img: PortraitController.NewPortraitData(),
            save: SaveController.NewSaveData(),
          })
        );
      }

      // TODO: evaluate items with/missing LCP
      // this._loadPilots({
      //   pilotData: ItemsWithLcp(pilotData),
      // });
      // this.SetMissingPilots(ItemsMissingLcp(pilotData));

      this.ImportUngroupedPilots();
    },
    ImportUngroupedPilots(): void {
      // TODO: import ungrouped pilots
      // import v2 pilots
      // const localData = localStorage.getItem('pilots_v2');
      // console.log('localData', localData);
      // if (localData) {
      //   const localPilots = JSON.parse(localData);
      //   console.log('localPilots', localPilots);
      // }
    },
    AddPilot(payload: Pilot, groupID?: string): void {
      // payload.SaveController.IsDirty = true;
      // if (!this.Pilots) this.Pilots = [];

      const gID = groupID ? groupID : 'no_group';

      let gIndex = this.PilotGroups.findIndex((x) => x.ID === gID);

      this.PilotGroups[gIndex].Pilots.push(payload);

      this.SavePilotData();
    },
    async SavePilotData(): Promise<void> {
      // TODO: reactivate dirty

      Promise.all(
        this.PilotGroups.map((x) => SetItem('pilots', PilotGroup.Serialize(x as PilotGroup)))
      )
        .then(() => console.info('Pilot data saved'))
        .catch((err) => console.error('Error while saving Pilot data', err));
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
    DeletePilotPermanent(payload: Pilot): void {
      const groupIndex = this.PilotGroups.findIndex((x) =>
        x.Pilots.some((p) => p.ID === payload.ID)
      );

      if (groupIndex > -1) {
        this.PilotGroups[groupIndex].Pilots.splice(
          this.PilotGroups[groupIndex].Pilots.findIndex((x) => x.ID === payload.ID),
          1
        );
      } else {
        console.error('Pilot not found in any group');
      }
    },
    setLoadedMech(payload: string): void {
      this.LoadedMechID = payload;
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
