import { Eidolon, EidolonData } from '@/classes/npc/eidolon/Eidolon';
import { GetAll, SetItem, RemoveItem } from '@/io/Storage';
import { defineStore } from 'pinia';
import { Doodad, DoodadData } from '@/classes/npc/doodad/Doodad';
import { Unit, UnitData } from '@/classes/npc/unit/Unit';
import _ from 'lodash';
import { Npc } from '@/classes/npc/Npc';
import { IndexItem } from '@/stores';
import path from 'path';

export const NpcStore = defineStore('npc', {
  state: () => ({
    Npcs: [] as Npc[],
    Folders: [] as string[],
  }),
  getters: {
    getNpcByID: (state: any) => (id: string) => {
      return state.Npcs.find((x) => x.ID === id);
    },
    getUnits: (state: any) => state.Npcs.filter((x) => x instanceof Unit),
    getDoodads: (state: any) => state.Npcs.filter((x) => x instanceof Doodad),
    getEidolons: (state: any) => state.Npcs.filter((x) => x instanceof Eidolon),
    getAllLabels: (state: any) => {
      return _.uniqBy(
        state.Npcs.flatMap((x: any) => x.NarrativeController.Labels),
        'title'
      );
    },
    getFolders: (state: any): string[] =>
      _.uniq(
        state.Folders.concat(
          state.Npcs.filter((x) => !x.SaveController.IsDeleted).flatMap(
            (x: any) => x.FolderController.Folder
          )
        ).filter((x) => !!x)
      ) as string[],
    getMissingDataNpcs: (state: any) => {
      return state.Npcs.filter((x: Npc) => x.BrewController.MissingContent);
    },
    unitIndexes: (state: any): IndexItem[] => {
      const units = state.Npcs.filter((x: any) => x instanceof Unit && !x.SaveController.IsDeleted);
      return units.map((x: Unit) => ({
        id: x.ID,
        title: `${x.Name} ${
          x.NpcClassController.HasClass
            ? `(T${x.NpcClassController.Tier} ${x.NpcClassController.Class?.Name || ''})`
            : ''
        }`,
        type: 'Unit',
        pack: x.BrewController.Brews.map((x) => x.LcpName).join(', '),
        path: `/gm/npcs/unit/${x.ID}`,
        icon: x.Icon || 'cc:encounter',
      }));
    },
    doodadIndexes: (state: any): IndexItem[] => {
      const doodads = state.Npcs.filter(
        (x: any) => x instanceof Doodad && !x.SaveController.IsDeleted
      );
      return doodads.map((x: Doodad) => ({
        id: x.ID,
        title: x.Name,
        type: 'Doodad',
        pack: '',
        path: `/gm/npcs/doodad/${x.ID}`,
        icon: x.Icon || 'cc:generic_item',
      }));
    },
    eidolonIndexes: (state: any): IndexItem[] => {
      const eidolons = state.Npcs.filter(
        (x: any) => x instanceof Eidolon && !x.SaveController.IsDeleted
      );
      return eidolons.map((x: Eidolon) => ({
        id: x.ID,
        title: x.Name,
        type: 'Eidolon',
        pack: x.BrewController.Brews.map((x) => x.LcpName).join(', '),
        path: `/gm/npcs/eidolon/${x.ID}`,
        icon: x.Icon || 'cc:monist',
      }));
    },
  },
  actions: {
    async LoadNpcs(): Promise<void> {
      const all = await GetAll('npcs');
      this.Npcs = all
        .filter((x) => x.npcType === 'unit')
        .map((x) => Unit.Deserialize(x as UnitData))
        .concat(
          all
            .filter((x) => x.npcType === 'doodad')
            .map((x) => Doodad.Deserialize(x as DoodadData)) as any[]
        )
        .concat(
          all
            .filter((x) => x.npcType === 'eidolon')
            .map((x) => Eidolon.Deserialize(x as EidolonData)) as any[]
        );
    },

    AddFolder(payload: string): void {
      this.Folders.push(payload);
    },

    EditFolder(payload: { old: string; newName: string }): void {
      this.Npcs.filter((x) => x.FolderController.Folder === payload.old).forEach(
        (x) => (x.FolderController.Folder = payload.newName)
      );

      const idx = this.Folders.findIndex((x) => x === payload.old);
      if (idx >= 0) this.Folders[idx] = payload.newName;
    },

    RemoveFolder(payload: string): void {
      this.Npcs.filter((x) => x.FolderController.Folder === payload).forEach(
        (x) => (x.FolderController.Folder = '')
      );

      const idx = this.Folders.findIndex((x) => x === payload);
      if (idx >= 0) this.Folders.splice(idx, 1);
    },

    async AddNpc(payload: Unit | Doodad | Eidolon): Promise<void> {
      if (this.Npcs.some((x) => x.ID === payload.ID)) {
        console.log('NPC already exists');
        this.SetNpc(
          this.Npcs.findIndex((x) => x.ID === payload.ID),
          payload
        );
        return;
      }

      this.Npcs.push(payload);

      await this.SaveNpcData();
    },
    async SetNpc(index: number, payload: Unit | Doodad | Eidolon): Promise<void> {
      if (!this.Npcs[index]) return;
      this.Npcs.splice(index, 1, payload);
      await this.SaveNpcData();
    },

    async CloneNpc(payload: Unit | Doodad | Eidolon): Promise<void> {
      this.Npcs.push(payload.Clone());

      await this.SaveNpcData();
    },

    async DeleteNpcPermanent(payload: Unit | Doodad | Eidolon): Promise<void> {
      const idx = this.Npcs.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.Npcs.splice(idx, 1);
      await RemoveItem('npcs', payload.ID);
      await this.SaveNpcData();
    },

    async SaveNpcData(): Promise<void> {
      Promise.all((this.Npcs as any).map((y) => SetItem('npcs', y.Serialize())))
        .then(() => console.info('NPC data saved'))
        .catch((err) => console.error('Error while saving NPC data', err));
    },
  },
});
