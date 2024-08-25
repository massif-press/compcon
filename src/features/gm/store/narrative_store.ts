import { Character, CharacterData } from '@/classes/narrative/Character';
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { Faction, FactionData } from '@/classes/narrative/Faction';
import { Location, LocationData } from '@/classes/narrative/Location';
import { GetAll, RemoveItem, SetItem } from '@/io/Storage';
import { IndexItem } from '@/stores';
import _ from 'lodash';
import { defineStore } from 'pinia';

export const NarrativeStore = defineStore('narrative', {
  state: () => ({
    CollectionItems: [] as any[],
    Folders: [] as string[],
  }),
  getters: {
    getItemByID: (state: any) => (id: string) => {
      return state.CollectionItems.find((x) => x.ID === id);
    },
    getCharacters: (state: any) => state.CollectionItems.filter((x) => x instanceof Character),
    getLocations: (state: any) => state.CollectionItems.filter((x) => x instanceof Location),
    getFactions: (state: any) => state.CollectionItems.filter((x) => x instanceof Faction),
    getItemRelationships: (state: any) => (id: string) => {
      return state.CollectionItems.filter((x) =>
        x.NarrativeController.Relationships.some((y) => id === y.id)
      );
    },
    getAllLabels: (state: any) => {
      return _.uniqBy(
        state.CollectionItems.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      );
    },
    getFolders: (state: any): string[] =>
      _.uniq(
        state.Folders.concat(
          state.CollectionItems.flatMap((x: any) => x.FolderController.Folder)
        ).filter((x) => !!x)
      ),
    narrativeIndexes: (state: any): IndexItem[] => {
      const units = state.CollectionItems.filter((x: any) => x && !x.SaveController.IsDeleted);
      return units.map((x: any) => ({
        id: x.ID,
        title: x.Name,
        type: x.ItemType,
        pack: '',
        path: `/gm/narrative/${x.ItemType.toLowerCase()}/${x.ID}`,
        icon: x.Icon || 'cc:generic_item',
      }));
    },
  },
  actions: {
    async LoadCollectionItems(): Promise<void> {
      const all = await GetAll('narrative');
      this.CollectionItems = all
        .filter((x) => x.collectionItemType === 'character')
        .map((x) => Character.Deserialize(x as CharacterData))
        .concat(
          all
            .filter((x) => x.collectionItemType === 'location')
            .map((x) => Location.Deserialize(x as LocationData)) as any[]
        )
        .concat(
          all
            .filter((x) => x.collectionItemType === 'faction')
            .map((x) => Faction.Deserialize(x as FactionData)) as any[]
        );
    },

    AddFolder(payload: string): void {
      this.Folders.push(payload);
    },

    EditFolder(payload: { old: string; newName: string }): void {
      this.CollectionItems.filter((x) => x.FolderController.Folder === payload.old).forEach(
        (x) => (x.FolderController.Folder = payload.newName)
      );

      const idx = this.Folders.findIndex((x) => x === payload.old);
      if (idx >= 0) this.Folders[idx] = payload.newName;
    },

    RemoveFolder(payload: string): void {
      this.CollectionItems.filter((x) => x.FolderController.Folder === payload).forEach(
        (x) => (x.FolderController.Folder = '')
      );

      const idx = this.Folders.findIndex((x) => x === payload);
      if (idx >= 0) this.Folders.splice(idx, 1);
    },

    async AddItem(payload: Character | Location | Faction): Promise<void> {
      this.CollectionItems.push(payload);
      await this.SaveItemData();
    },

    CloneItem(payload: Character | Location | Faction): void {
      this.CollectionItems.push(payload.Clone());

      this.SaveItemData();
    },

    async DeleteItemPermanent(payload: Character | Location | Faction): Promise<void> {
      const idx = this.CollectionItems.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.CollectionItems.splice(idx, 1);
      await RemoveItem('narrative', payload.ID);
      this.SaveItemData();
    },

    SetItem(payload: Character | Location | Faction): void {
      console.error('SetItem not implemented');
    },

    async SaveItemData(): Promise<void> {
      Promise.all((this.CollectionItems as any).map((y) => SetItem('narrative', y.Serialize())))
        .then(() => console.info('Narrative data saved'))
        .catch((err) => console.error('Error while saving NPC data', err));
    },
  },
});
