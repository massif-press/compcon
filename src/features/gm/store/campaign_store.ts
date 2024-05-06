import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';

import { Campaign, ICampaignData } from '@/classes/campaign/Campaign';

export const CampaignStore = defineStore('campaign', {
  state: () => ({
    Campaigns: [] as Campaign[],
    CampaignCollection: [] as ICampaignData[],
  }),
  actions: {
    async LoadCampaigns(): Promise<void> {
      let campaignData = await GetAll('campaigns');
      this.Campaigns = campaignData.map((x) => Campaign.Deserialize(x));
      this.CampaignCollection = await GetAll('campaign_collection');
    },
    async SaveCampaigns(): Promise<void> {
      Promise.all([
        this.Campaigns.map((y) => SetItem('campaigns', Campaign.Serialize(y as Campaign))),
      ])
        .then(() => console.info('Campaign data saved'))
        .catch((err) => console.error('Error while saving Campaign data', err));
    },
    async AddCampaign(payload: Campaign): Promise<void> {
      const sameId = this.Campaigns.find((x) => x.ID === payload.ID) as Campaign;
      if (sameId) {
        await this.DeleteCampaign(sameId);
      }
      this.Campaigns.push(payload);
      await this.SaveCampaigns();
    },
    async AddCollectionCampaign(payload: ICampaignData): Promise<void> {
      if (this.CampaignCollection.find((x) => x.id === payload.id)) {
        await this.DeleteCollectionCampaign(payload);
      }

      this.CampaignCollection.push(payload);
      await SetItem('campaign_collection', payload);
    },
    async CloneCampaign(payload: Campaign): Promise<void> {
      this.Campaigns.push(payload.Clone());
      await this.SaveCampaigns();
    },
    async DeleteCampaign(payload: Campaign): Promise<void> {
      const idx = this.Campaigns.findIndex((x) => x.ID === payload.ID);
      if (idx >= 0) this.Campaigns.splice(idx, 1);
      await RemoveItem('Campaigns', payload.ID);
      this.SaveCampaigns();
    },
    async DeleteCollectionCampaign(payload: ICampaignData): Promise<void> {
      const idx = this.CampaignCollection.findIndex((x) => x.id === payload.id);
      if (idx >= 0) this.CampaignCollection.splice(idx, 1);
      await RemoveItem('campaign_collection', payload.id);
    },
  },
});
