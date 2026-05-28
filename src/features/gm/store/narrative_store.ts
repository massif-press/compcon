import { Character, CharacterData } from '@/classes/narrative/Character'
import { Faction, FactionData } from '@/classes/narrative/Faction'
import { Location, LocationData } from '@/classes/narrative/Location'
import { GetAll, RemoveItem, saveAll } from '@/io/Storage'
import { NavStore } from '@/stores/nav'
import type { IndexItem } from '@/stores/nav'
import logger from '@/user/logger'
import * as _ from 'lodash-es'
import { defineStore } from 'pinia'
import { useFolderManagement } from '@/composables/useFolderManagement'

export const NarrativeStore = defineStore('narrative', {
  state: () => ({
    CollectionItems: [] as any[],
    Folders: [] as string[],
  }),
  getters: {
    getItemByID: state => (id: string) => {
      return state.CollectionItems.find(x => x.ID === id)
    },
    getCharacters: state => state.CollectionItems.filter(x => x instanceof Character),
    getLocations: state => state.CollectionItems.filter(x => x instanceof Location),
    getFactions: state => state.CollectionItems.filter(x => x instanceof Faction),
    getItemRelationships: state => (id: string) => {
      return state.CollectionItems.filter(x =>
        x.NarrativeController.Relationships.some(y => id === y.id)
      )
    },
    getAllLabels: state => {
      return _.uniqBy(
        state.CollectionItems.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      )
    },
    getFolders: (state): string[] =>
      _.uniq(
        state.Folders.concat(
          state.CollectionItems.flatMap((x: any) => x.FolderController.Folder)
        ).filter(x => !!x)
      ),
    narrativeIndexes: (state): IndexItem[] => {
      const units = state.CollectionItems.filter((x: any) => x && !x.SaveController.IsDeleted)
      return units.map((x: any) => ({
        id: x.ID,
        title: x.Name,
        type: x.ItemType,
        pack: '',
        path: `/gm/narrative/${x.ItemType.toLowerCase()}/${x.ID}`,
        icon: x.Icon || 'cc:generic_item',
      }))
    },
  },
  actions: {
    async LoadCollectionItems(): Promise<void> {
      const all = await GetAll('narrative')
      this.CollectionItems = all
        .filter(x => x.collectionItemType === 'character')
        .map(x => Character.Deserialize(x as CharacterData))
        .concat(
          all
            .filter(x => x.collectionItemType === 'location')
            .map(x => Location.Deserialize(x as LocationData)) as any[]
        )
        .concat(
          all
            .filter(x => x.collectionItemType === 'faction')
            .map(x => Faction.Deserialize(x as FactionData)) as any[]
        )
    },

    AddFolder(payload: string): void {
      useFolderManagement(this.CollectionItems, this.Folders).AddFolder(payload)
    },

    EditFolder(payload: { old: string; newName: string }): void {
      useFolderManagement(this.CollectionItems, this.Folders).EditFolder(payload)
    },

    RemoveFolder(payload: string): void {
      useFolderManagement(this.CollectionItems, this.Folders).RemoveFolder(payload)
    },

    async AddItem(payload: Character | Location | Faction): Promise<void> {
      if (this.CollectionItems.some(x => x.ID === payload.ID)) {
        logger.info(`Item with ID ${payload.ID} already exists, updating instead.`, this)
        this.SetItem(
          this.CollectionItems.findIndex(x => x.ID === payload.ID),
          payload
        )
        return
      }

      this.CollectionItems.push(payload)
      NavStore().updateNarrativeEntry(payload)

      await this.SaveItemData()
    },

    async SetItem(index: number, payload: Character | Location | Faction): Promise<void> {
      if (!this.CollectionItems[index]) return
      this.CollectionItems.splice(index, 1, payload)
      await this.SaveItemData()
    },

    async CloneItem(payload: Character | Location | Faction): Promise<void> {
      this.CollectionItems.push(payload.Clone())

      await this.SaveItemData()
    },

    async DeleteItemPermanent(payload: Character | Location | Faction): Promise<void> {
      const id = payload.ID || (payload as any)._id
      const idx = this.CollectionItems.findIndex(x => x.ID === id)
      if (idx >= -1) this.CollectionItems.splice(idx, 1)
      NavStore().removeNarrativeEntry(id)
      await RemoveItem('narrative', id)
      this.SaveItemData()
    },

    async SaveItemData(): Promise<void> {
      await saveAll('narrative', this.CollectionItems, y => y.Serialize(), 'Narrative data')
    },
  },
})
