import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';

import { Campaign, CampaignStatus, ICampaignData } from '@/classes/campaign/Campaign';

export const CampaignStore = defineStore('campaign', {
  state: () => ({
    EditCampaign: null as unknown as Campaign,
    Campaigns: [] as Campaign[],
  }),
  getters: {
    getCampaigns: (state: any) => state.Campaigns,
    getEditCampaign: (state: any) => state.EditCampaign,
    getUnpublishedCampaigns: (state: any) =>
      state.Campaigns.filter((x: Campaign) => x.Status === CampaignStatus.Unpublished),
    getPublishedCampaigns: (state: any) =>
      state.Campaigns.filter((x: Campaign) => x.Status === CampaignStatus.Published),
  },
  actions: {
    async LoadCampaigns(): Promise<void> {
      let campaignData = await GetAll('campaigns');
      this.Campaigns = campaignData.map((x) => Campaign.Deserialize(x));
    },
    SetEditCampaign(payload: Campaign): void {
      this.EditCampaign = payload;
    },
    SaveCampaigns(): void {
      Promise.all([this.Campaigns.map((y) => SetItem('pilots', Campaign.Serialize(y as Campaign)))])
        .then(() => console.info('Campaign data saved'))
        .catch((err) => console.error('Error while saving Campaign data', err));
    },
    AddCampaign(payload: Campaign): void {
      this.Campaigns.push(payload);
      this.SaveCampaigns();
    },
    CloneCampaign(payload: Campaign): void {
      this.Campaigns.push(payload.Clone());
      this.SaveCampaigns();
    },
    async DeleteCampaign(payload: Campaign): Promise<void> {
      const idx = this.Campaigns.findIndex((x: any) => x.ID === payload.ID);
      if (idx === -1) {
        throw new Error('Campaign not found');
      }
      this.Campaigns.splice(idx, 1);
      await RemoveItem('campaigns', payload.ID);
    },
  },
});
