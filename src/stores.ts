import { defineStore } from 'pinia';
import { UserStore } from './user/store';
import { CompendiumStore } from './features/compendium/store';
import { PilotStore } from './features/pilot_management/store';
import { NpcStore } from './features/gm/store/npc_store';
import { EncounterStore } from './features/gm/store/encounter_store';
import { NarrativeStore } from './features/gm/store/narrative_store';
import { CampaignStore } from './features/gm/store/campaign_store';

import * as CompendiumRoutes from './features/compendium/routes';
import * as GmRoutes from './features/gm/routes';

type IndexItem = {
  id: string;
  title: string;
  type: string;
  pack: string;
  path: string;
  icon: string;
};

const NavStore = defineStore('nav', {
  state: () => ({
    _srdTab: 0,
    _language: 'en',
    _searchHistory: [] as IndexItem[],
    Index: [] as IndexItem[],
  }),
  getters: {
    SrdTab: (state) => state._srdTab,
    Language: (state) => state._language,
    SearchHistory: (state) => state._searchHistory,
  },
  actions: {
    loadSearchHistory() {
      const history = localStorage.getItem('cc_searchdata');
      if (history) this._searchHistory = JSON.parse(history);
    },
    setSearchHistory(payload: IndexItem) {
      this._searchHistory.push(payload);
      if (this._searchHistory.length > 5) this._searchHistory.shift();
      localStorage.setItem('cc_searchdata', JSON.stringify(this._searchHistory));
    },
    setSrdTab(tab: number) {
      this._srdTab = tab;
    },
    setLanguage(lang: string) {
      this._language = lang;
    },
    async CreateIndex(): Promise<void> {
      console.log('Creating Index');
      const index: IndexItem[] = [];

      index.push(
        ...CompendiumRoutes.default
          .filter((x) => !!x.searchData)
          .map((route) => ({
            id: route.path,
            title: route.searchData.title,
            type: 'Compendium Page',
            pack: '',
            path: route.path,
            icon: route.searchData.icon,
          }))
      );

      index.push(
        ...GmRoutes.default[0].children
          .filter((x: any) => !!x.searchData)
          .map((route: any) => ({
            id: route.path,
            title: route.searchData.title,
            type: 'GM Tool',
            pack: '',
            path: '/gm/' + route.path,
            icon: route.searchData.icon,
          }))
      );

      index.push({
        id: '/pilot-roster',
        title: 'Pilot Roster',
        type: 'Roster View',
        pack: '',
        path: '/pilot-roster',
        icon: 'mdi-account-group',
      });

      index.push(...CompendiumStore().itemIndexes);
      index.push(...PilotStore().pilotIndexes);
      index.push(...PilotStore().mechIndexes);
      index.push(...NpcStore().unitIndexes);
      index.push(...NpcStore().doodadIndexes);
      index.push(...NpcStore().eidolonIndexes);
      index.push(...NarrativeStore().narrativeIndexes);
      index.push(...EncounterStore().encounterIndexes);
      index.push(...CampaignStore().editableCampaignIndexes);
      index.push(...CampaignStore().publishedCampaignIndexes);

      this.Index = index;
      this.loadSearchHistory();
    },
    async AddItemToIndex(payload: any): Promise<void> {},
    async RemoveItemFromIndex(payload: any): Promise<void> {},
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
  EncounterStore,
};

export type { IndexItem };
