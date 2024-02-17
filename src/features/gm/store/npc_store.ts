import { Eidolon, EidolonData } from '@/classes/npc/eidolon/Eidolon';
import { GetAll, SetItem } from '@/io/Storage';
import { defineStore } from 'pinia';
import { Doodad, DoodadData } from '@/classes/npc/doodad/Doodad';
import { Unit, UnitData } from '@/classes/npc/unit/Unit';
import _ from 'lodash';

export const NpcStore = defineStore('npc', {
  state: () => ({
    Npcs: [] as any[],
  }),
  getters: {
    getNpcByID: (state: any) => (id: string) => {
      return state.AllNpcs.find((x) => x.ID === id);
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

    AddNpc(payload: Unit | Doodad | Eidolon): void {
      this.Npcs.push(payload);
      this.SaveNpcData();
    },

    CloneNpc(payload: Unit | Doodad | Eidolon): void {
      this.Npcs.push(payload.Clone());

      this.SaveNpcData();
    },

    DeleteNpcPermanent(payload: Unit | Doodad | Eidolon): void {
      const idx = this.Npcs.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.Npcs.splice(idx, 1);
      this.SaveNpcData();
    },

    SetNpc(payload: Unit | Doodad | Eidolon): void {
      console.error('SetNpc not implemented');
    },

    async SaveNpcData(): Promise<void> {
      Promise.all((this.Npcs as any).map((y) => SetItem('npcs', y.Serialize())))
        .then(() => console.info('NPC data saved'))
        .catch((err) => console.error('Error while saving NPC data', err));
    },
  },
});