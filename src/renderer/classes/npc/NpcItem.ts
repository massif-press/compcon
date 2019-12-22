// Wrapper class for items assigned to an NPC

import { NpcFeature } from './'
import { store } from '@/store'

interface INpcItemSaveData {
  itemID: string
  tier: number
  flavorName: string
  description: string
}

class NpcItem {
  private _item: NpcFeature
  private _tier: number
  private flavor_name: string
  private flavor_description: string

  public constructor(feature: NpcFeature, tier: number) {
    this._item = feature
    this._tier = tier
    this.flavor_name = this.flavor_description = ''
  }

  public get Item(): NpcFeature {
    return this._item
  }

  public get Name(): string {
    return this.flavor_name || this.Item.Name
  }

  public set Name(val: string) {
    this.flavor_name = val
  }

  public get Tier(): number {
    return this._tier
  }

  public set Tier(val: number) {
    this._tier = val
  }

  public get Description(): string {
    return this.flavor_description || ''
  }

  public set Description(val: string) {
    this.flavor_description = val
  }

  public static Serialize(item: NpcItem): INpcItemSaveData {
    return {
      itemID: item.Item.ID,
      tier: item.Tier,
      flavorName: item.flavor_name,
      description: item.Description,
    }
  }

  public static Deserialize(data: INpcItemSaveData): NpcItem {
    const item = new NpcItem(store.getters.referenceByID('NpcFeatures', data.itemID), data.tier)
    item.flavor_description = data.description
    item.flavor_name = data.flavorName
    return item
  }
}

export { NpcItem, INpcItemSaveData }
