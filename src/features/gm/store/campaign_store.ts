import { defineStore } from 'pinia';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';

import { Campaign, ICampaignData } from '@/classes/campaign/Campaign';
import { cloudDelete } from '@/io/apis/account';
import { UserStore } from '@/stores';
import { CloudController } from '@/classes/components';
import logger from '@/user/logger';

export const CampaignStore = defineStore('campaign', {
  state: () => ({
    Campaigns: [] as Campaign[],
    CampaignCollection: [] as ICampaignData[],
  }),
  getters: {
    editableCampaignIndexes: (state: any) => {
      return state.Campaigns.map((x: Campaign) => ({
        id: x.ID,
        title: x.Title,
        type: 'Campaign (Unpublished)',
        pack: '',
        path: `/gm/campaigns/edit/${x.ID}`,
        icon: 'mdi-pencil-circle-outline',
      }));
    },
    publishedCampaignIndexes: (state: any) => {
      return state.CampaignCollection.map((x: ICampaignData) => ({
        id: x.id,
        title: x.title,
        type: 'Campaign (Published)',
        pack: '',
        path: `/srd/campaign/${x.id}`,
        icon: 'cc:campaign',
      }));
    },
  },
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
        .then(() => logger.info('Campaign data saved'))
        .catch((err) => logger.error('Error while saving Campaign data', err));
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
      if (payload.CloudController.ShareCode) {
        await CloudController.MarkCloudDeleted(payload.CloudController.Metadata);
      }
    },
    async DeleteCollectionCampaign(payload: ICampaignData): Promise<void> {
      const idx = this.CampaignCollection.findIndex((x) => x.id === payload.id);
      if (idx >= 0) this.CampaignCollection.splice(idx, 1);
      await RemoveItem('campaign_collection', payload.id);
    },
  },
});
