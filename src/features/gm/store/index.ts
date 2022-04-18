/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Campaign, CampaignStatus, ICampaignData } from '@/classes/campaign/Campaign'
import { store } from '@/store'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_CAMPAIGN = 'ADD_CAMPAIGN'
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN'
export const CLONE_CAMPAIGN = 'CLONE_CAMPAIGN'
export const LOAD_CAMPAIGNS = 'LOAD_CAMPAIGNS'

export const SET_EDIT_CAMPAIGN = 'SET_EDIT_CAMPAIGN'

async function saveCampaignData(campaigns: Campaign[]) {
  const serialized = campaigns.map(x => Campaign.Serialize(x))
  await saveData('campaigns.json', serialized)
}

@Module({
  store: store,
  namespaced: true,
})
export class CampaignStore extends VuexModule {
  EditCampaign: Campaign
  Campaigns: Campaign[] = []

  @Mutation
  private [LOAD_CAMPAIGNS](payload: ICampaignData[]): void {
    this.Campaigns = [...payload.map(x => Campaign.Deserialize(x))]
    saveCampaignData(this.Campaigns)
  }

  @Mutation
  private [SET_EDIT_CAMPAIGN](payload: Campaign): void {
    this.EditCampaign = payload
    // saveCampaignData(this.Campaigns)
  }

  @Mutation
  private [SAVE_DATA](): void {
    console.log('saving all campaign data')
    if (this.EditCampaign) {
      const editIndex = this.Campaigns.findIndex(x => x.ID === this.EditCampaign.ID)
      if (editIndex > -1) this.Campaigns[editIndex] = this.EditCampaign
    }
    if (this.Campaigns.length) _.debounce(saveCampaignData, 1000)(this.Campaigns)
  }

  @Mutation
  private [ADD_CAMPAIGN](payload: Campaign): void {
    console.log('adding campaign to store')
    this.Campaigns.push(payload)
    saveCampaignData(this.Campaigns)
  }

  @Mutation
  private [CLONE_CAMPAIGN](payload: Campaign): void {
    const campaignData = Campaign.Serialize(payload)
    campaignData.id = ''
    const newCampaign = Campaign.Deserialize(campaignData)
    newCampaign.Name += ' (COPY)'
    this.Campaigns.push(newCampaign)
    saveCampaignData(this.Campaigns)
  }

  @Mutation
  private [DELETE_CAMPAIGN](payload: Campaign): void {
    const idx = this.Campaigns.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Campaigns.splice(idx, 1)
    } else {
      throw console.error('CAMPAIGN not loaded!')
    }
    saveCampaignData(this.Campaigns)
  }

  @Action
  public setEditCampaign(payload: Campaign): void {
    this.context.commit(SET_EDIT_CAMPAIGN, payload)
  }

  @Action({ rawError: true })
  public saveCampaignData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneCampaign(payload: Campaign): void {
    this.context.commit(CLONE_CAMPAIGN, payload)
  }

  @Action
  public addCampaign(payload: Campaign): void {
    this.context.commit(ADD_CAMPAIGN, payload)
  }

  @Action
  public deleteCampaign(payload: Campaign): void {
    this.context.commit(DELETE_CAMPAIGN, payload)
  }

  @Action({ rawError: true })
  public async loadCampaigns() {
    const campaignData = await loadData<ICampaignData>('campaigns.json')
    this.context.commit(LOAD_CAMPAIGNS, campaignData)
  }

  get getCampaigns(): Campaign[] {
    return this.Campaigns
  }

  get getUnpublished(): Campaign[] {
    return this.Campaigns.filter(x => x.Status === CampaignStatus.Unpublished)
  }

  get getActive(): Campaign[] {
    return this.Campaigns.filter(x => x.Status === CampaignStatus.Active)
  }

  get getCampaign() {
    return this.EditCampaign
  }
}
