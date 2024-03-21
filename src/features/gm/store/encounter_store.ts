import { GetAll, SetItem, RemoveItem } from '@/io/Storage';
import { defineStore } from 'pinia';
import _ from 'lodash';
import { Encounter, IEncounterData } from '@/classes/encounter/Encounter';

export const EncounterStore = defineStore('encounter', {
  state: () => ({
    Encounters: [] as Encounter[],
    Folders: [] as string[],
  }),
  getters: {
    getEncounterByID: (state: any) => (id: string) => {
      return state.Encounters.find((x) => x.ID === id);
    },
    getAllLabels: (state: any) => {
      return _.uniqBy(
        state.Encounters.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      );
    },
    getFolders: (state: any): string[] =>
      _.uniq(
        state.Folders.concat(
          state.Encounters.filter((x) => !x.SaveController.IsDeleted).flatMap(
            (x: any) => x.FolderController.Folder
          )
        ).filter((x) => !!x)
      ) as string[],
  },
  actions: {
    async LoadEncounters(): Promise<void> {
      const all = await GetAll('encounters');
      this.Encounters = all.map((x) => Encounter.Deserialize(x as IEncounterData));
    },

    AddFolder(payload: string): void {
      this.Folders.push(payload);
    },

    EditFolder(payload: { old: string; newName: string }): void {
      this.Encounters.filter((x) => x.FolderController.Folder === payload.old).forEach(
        (x) => (x.FolderController.Folder = payload.newName)
      );

      const idx = this.Folders.findIndex((x) => x === payload.old);
      if (idx >= 0) this.Folders[idx] = payload.newName;
    },

    RemoveFolder(payload: string): void {
      this.Encounters.filter((x) => x.FolderController.Folder === payload).forEach(
        (x) => (x.FolderController.Folder = '')
      );

      const idx = this.Folders.findIndex((x) => x === payload);
      if (idx >= 0) this.Folders.splice(idx, 1);
    },

    AddEncounter(payload: Encounter): void {
      this.Encounters.push(payload);
      this.SaveIEncounterData();
    },

    CloneEncounter(payload: Encounter): void {
      this.Encounters.push(payload.Clone());

      this.SaveIEncounterData();
    },

    async DeleteEncounterPermanent(payload: Encounter): Promise<void> {
      const idx = this.Encounters.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.Encounters.splice(idx, 1);
      await RemoveItem('Encounters', payload.ID);
      this.SaveIEncounterData();
    },

    SetEncounter(payload: Encounter): void {
      console.error('SetEncounter not implemented');
    },

    async SaveIEncounterData(): Promise<void> {
      Promise.all((this.Encounters as any).map((y) => SetItem('npcs', y.Serialize())))
        .then(() => console.info('NPC data saved'))
        .catch((err) => console.error('Error while saving NPC data', err));
    },
  },
});
