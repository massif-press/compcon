import { GetAll, SetItem, RemoveItem } from '@/io/Storage';
import { defineStore } from 'pinia';
import _ from 'lodash';
import { Encounter, IEncounterData } from '@/classes/encounter/Encounter';
import { IndexItem } from '@/stores';
import { cloudDelete } from '@/io/apis/account';
import { CloudController } from '@/classes/components';
import logger from '@/user/logger';

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
    encounterIndexes: (state: any): IndexItem[] => {
      const encounters = state.Encounters.filter((x: any) => x && !x.SaveController.IsDeleted);
      return encounters.map((x: any) => ({
        id: x.ID,
        title: x.Name,
        type: 'Encounter',
        pack: '',
        path: `/gm/encounters/${x.ID}`,
        icon: x.Icon || 'cc:encounter',
      }));
    },
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

    async AddEncounter(payload: Encounter): Promise<void> {
      if (this.Encounters.some((x) => x.ID === payload.ID)) {
        logger.warn(`Encounter with ID ${payload.ID} already exists, updating instead.`, this);
        this.SetEncounter(
          this.Encounters.findIndex((x) => x.ID === payload.ID),
          payload
        );
        return;
      }

      this.Encounters.push(payload);
      this.SaveEncounterData();
    },

    async SetEncounter(index: number, payload: Encounter): Promise<void> {
      if (!this.Encounters[index]) return;
      this.Encounters.splice(index, 1, payload);
      await this.SaveEncounterData();
    },

    async CloneEncounter(payload: Encounter): Promise<void> {
      this.Encounters.push(payload.Clone());

      this.SaveEncounterData();
    },

    async DeleteEncounterPermanent(payload: Encounter): Promise<void> {
      const idx = this.Encounters.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.Encounters.splice(idx, 1);
      await RemoveItem('Encounters', payload.ID);
      this.SaveEncounterData();
      if (payload.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(payload.CloudController.Metadata);
      }
    },

    async SaveEncounterData(): Promise<void> {
      Promise.all((this.Encounters as any).map((y) => SetItem('encounters', y.Serialize())))
        .then(() => logger.info('Encounter data saved'))
        .catch((err) => logger.error('Error while saving Encounter data', err));
    },
  },
});
