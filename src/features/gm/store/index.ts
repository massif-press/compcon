import { defineStore } from 'pinia';
import { loadData } from '@/io/Data';

import {
  Campaign,
  CampaignStatus,
  ICampaignData,
} from '@/classes/campaign/Campaign';
import { storeSaveDelta } from '@/util/storeUtils';

export const CampaignStore = defineStore('campaign', {
  state: () => ({
    EditCampaign: null as unknown as Campaign,
    Campaigns: [] as Campaign[],
    Dirty: false,
  }),
  getters: {
    getCampaigns: (state: any) => state.Campaigns,
    getEditCampaign: (state: any) => state.EditCampaign,
    getUnpublishedCampaigns: (state: any) =>
      state.Campaigns.filter(
        (x: Campaign) => x.Status === CampaignStatus.Unpublished
      ),
    getActiveCampaigns: (state: any) =>
      state.Campaigns.filter(
        (x: Campaign) => x.Status === CampaignStatus.Active
      ),
    getPublishedCampaigns: (state: any) =>
      state.Campaigns.filter(
        (x: Campaign) => x.Status === CampaignStatus.Published
      ),
    getArchivedCampaigns: (state: any) =>
      state.Campaigns.filter(
        (x: Campaign) => x.Status === CampaignStatus.Archived
      ),
  },
  actions: {
    LOAD_CAMPAIGNS(state: any, payload: ICampaignData[]): void {
      state.Campaigns = [...payload.map((x) => Campaign.Deserialize(x))];
    },

    SET_EDIT_CAMPAIGN(state: any, payload: Campaign): void {
      state.EditCampaign = payload;
    },

    SAVE_DATA(state: any): void {
      if (state.Dirty) {
        storeSaveDelta(state.Campaigns);
        state.Dirty = false;
      }
    },

    SET_DIRTY(state: any): void {
      state.Dirty = true;
    },

    ADD_CAMPAIGN(state: any, payload: Campaign): void {
      payload.SaveController.IsDirty = true;
      state.Campaigns.push(payload);
      state.Dirty = true;
    },

    CLONE_CAMPAIGN(state: any, payload: Campaign): void {
      state.Campaigns.push(payload.Clone());
      state.Dirty = true;
    },

    DELETE_CAMPAIGN(state: any, payload: Campaign): void {
      const idx = state.Campaigns.findIndex(
        (x: Campaign) => x.ID === payload.ID
      );
      if (idx > -1) {
        state.Campaigns.splice(idx, 1);
      } else {
        throw console.error('CAMPAIGN not loaded!');
      }
      state.Dirty = true;
    },
    setEditCampaign({ state, commit }: any, id: string): void {
      commit(
        'SET_EDIT_CAMPAIGN',
        state.Campaigns.find((x: Campaign) => x.ID === id)
      );
    },

    saveCampaignData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    cloneCampaign({ commit }: any, payload: Campaign): void {
      commit('CLONE_CAMPAIGN', payload);
    },

    addCampaign({ commit }: any, payload: Campaign): void {
      commit('ADD_CAMPAIGN', payload);
    },

    deleteCampaign({ commit }: any, payload: Campaign): void {
      commit('DELETE_CAMPAIGN', payload);
    },

    async loadCampaigns({ commit }: any) {
      const campaignData = await loadData<ICampaignData>('campaigns');
      commit('LOAD_CAMPAIGNS', campaignData);
    },
  },
});
