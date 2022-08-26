/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { deleteDataById, loadData, saveDelta } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Campaign, CampaignStatus, ICampaignData } from '@/classes/campaign/Campaign'
import { storeSaveDelta } from '@/util/storeUtils'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_CAMPAIGN = 'ADD_CAMPAIGN'
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN'
export const CLONE_CAMPAIGN = 'CLONE_CAMPAIGN'
export const LOAD_CAMPAIGNS = 'LOAD_CAMPAIGNS'

export const SET_EDIT_CAMPAIGN = 'SET_EDIT_CAMPAIGN'

@Module({
  name: 'campaign',
})
export class CampaignStore extends VuexModule {
  EditCampaign: Campaign = null
  Campaigns: Campaign[] = []
  public Dirty = false

  @Mutation
  private [LOAD_CAMPAIGNS](payload: ICampaignData[]): void {
    this.Campaigns = [...payload.map(x => Campaign.Deserialize(x))]
  }

  @Mutation
  private [SET_EDIT_CAMPAIGN](payload: Campaign): void {
    this.EditCampaign = payload
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      storeSaveDelta(this.Campaigns)
      this.Dirty = false
    }
  }

  @Mutation
  private [SET_DIRTY](): void {
    this.Dirty = true
  }

  @Mutation
  private [ADD_CAMPAIGN](payload: Campaign): void {
    payload.SaveController.IsDirty = true
    this.Campaigns.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_CAMPAIGN](payload: Campaign): void {
    this.Campaigns.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_CAMPAIGN](payload: Campaign): void {
    const idx = this.Campaigns.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Campaigns.splice(idx, 1)
    } else {
      throw console.error('CAMPAIGN not loaded!')
    }
    this.Dirty = true
  }

  @Action
  public setEditCampaign(id: string): void {
    this.context.commit(
      SET_EDIT_CAMPAIGN,
      this.Campaigns.find(x => x.ID === id)
    )
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
    const campaignData = await loadData<ICampaignData>('campaigns')
    this.context.commit(LOAD_CAMPAIGNS, campaignData)
  }

  get Unpublished(): Campaign[] {
    return this.Campaigns.filter(x => x.Status === CampaignStatus.Unpublished)
  }

  get Active(): Campaign[] {
    return this.Campaigns.filter(x => x.Status === CampaignStatus.Active)
  }
}
