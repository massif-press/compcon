import { CompendiumStore } from '@/stores';
import { NpcClass } from '@/classes/npc/class/NpcClass';
import * as _ from 'lodash-es';

export const keymap: Record<string, string> = {
  hull: 'Hull',
  agi: 'Agi',
  sys: 'Sys',
  eng: 'Eng',
  armor: 'Armor',
  hp: 'HP',
  heat: 'HeatCap',
  evasion: 'Evade',
  edef: 'E-Def',
  speed: 'Speed',
  sensorRange: 'Sensor',
  saveTarget: 'Save',
};

export const npcClassSelectorMixin = {
  data: () => ({
    selectedTier: 1,
    tieredView: false,
    options: {
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['lcp', 'role', 'none'],
      initialGroup: 'role',
    },
  }),
  computed: {
    classes(this: any): NpcClass[] {
      return _.orderBy(CompendiumStore().NpcClasses, ['Role', 'Name']);
    },
    headers(this: any) {
      const h = [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Role', key: 'Icon' },
        { title: 'Name', key: 'Name' },
      ] as any[];
      for (const key in keymap) {
        h.push({
          title: keymap[key],
          key,
          tier: this.selectedTier,
          sortRaw: (a: NpcClass, b: NpcClass) =>
            Number(a.Stats.Stat(key, this.selectedTier)) -
            Number(b.Stats.Stat(key, this.selectedTier)),
          align: 'center',
        });
      }
      return h;
    },
  },
  methods: {
    toggleTieredView(this: any, evt: string) {
      this.tieredView = evt === 'table' || evt === 'scatter' || evt === 'bar' || evt === 'compare';
    },
  },
};
