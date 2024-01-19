import { Character, CharacterData } from '@/classes/narrative/Character';
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { Faction, FactionData } from '@/classes/narrative/Faction';
import { Location, LocationData } from '@/classes/narrative/Location';
import { GetAll, SetItem } from '@/io/Storage';
import _ from 'lodash';
import { defineStore } from 'pinia';

export const NarrativeStore = defineStore('narrative', {
  state: () => ({
    CollectionItems: [] as any[],
  }),
  getters: {
    getItemByID: (state: any) => (id: string) => {
      return state.CollectionItems.find((x) => x.ID === id);
    },
    getCharacters: (state: any) => state.CollectionItems.filter((x) => x instanceof Character),
    getLocations: (state: any) => state.CollectionItems.filter((x) => x instanceof Location),
    getFactions: (state: any) => state.CollectionItems.filter((x) => x instanceof Faction),
    getItemRelationships: (state: any) => (id: string) => {
      return state.CollectionItems.flatMap(
        (x: CollectionItem) => x.NarrativeController.Relationships
      ).filter((x) => x.id === id);
    },
    getAllLabels: (state: any) => {
      return _.uniqBy(
        state.CollectionItems.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      );
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

      console.log(this.CollectionItems);
    },

    AddItem(payload: Character | Location | Faction): void {
      this.CollectionItems.push(payload);
      this.SaveItemData();
    },

    CloneItem(payload: Character | Location | Faction): void {
      this.CollectionItems.push(payload.Clone());

      this.SaveItemData();
    },

    DeleteItemPermanent(payload: Character | Location | Faction): void {
      const idx = this.CollectionItems.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.CollectionItems.splice(idx, 1);
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
