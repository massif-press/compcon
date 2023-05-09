import { defineStore } from 'pinia';
import { UserStore } from './user/store';
import { CompendiumStore } from './features/compendium/store';
import { PilotStore } from './features/pilot_management/store';
import { NpcStore } from './features/gm/store/npc_store';
import { NarrativeStore } from './features/gm/store/narrative_store';
import { CampaignStore } from './features/gm/store';

const NavStore = defineStore('nav', {
  state: () => ({
    _srdTab: 0,
  }),
  getters: {
    SrdTab: (state) => state._srdTab,
  },
  actions: {
    setSrdTab(tab: number) {
      this._srdTab = tab;
    },
  },
});

export {
  NavStore,
  UserStore,
  CompendiumStore,
  CampaignStore,
  PilotStore,
  NpcStore,
  NarrativeStore,
};
