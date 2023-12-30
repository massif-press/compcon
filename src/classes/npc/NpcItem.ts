// Wrapper class for items assigned to an NPC

import { NpcFeature } from './'
import { store } from '@/store'
import { Npc } from './Npc'

export interface INpcItemSaveData {
  itemID: string
  tier: number
  flavorName: string
  description: string
  destroyed: boolean
  charged: boolean
  uses: number
}

export class NpcItem {
  public readonly Parent: Npc
  private _feature: NpcFeature
  private _tier: number
  private _flavor_name: string
  private _flavor_description: string
  private _destroyed: boolean
  private _charged: boolean
  private _uses: number
  private _max_uses: number
  private _statblock: string

  public constructor(feature: NpcFeature, tier: number, parent: Npc) {
    this.Parent = parent
    this._feature = feature
    this._tier = tier
    this._flavor_name = this._flavor_description = ''
    this._destroyed = false
    this._charged = true
    this._uses = 0
    this._statblock = this.generateStatblock()
    const f = feature as any
    if (f.IsLimited) {
      const ltd = f.Tags.find(x => x.IsLimited)
      this._max_uses = ltd && typeof ltd.Value === 'number' ? ltd.Value : 0
    } else {
      this._max_uses = 0
    }
  }

  private save(): void {
    this.Parent.SaveController.save()
  }

  public get Feature(): NpcFeature {
    return this._feature
  }

  public get Name(): string {
    return this._flavor_name || this._feature.Name
  }

  public set Name(val: string) {
    this._flavor_name = val
    this.save()
  }

  public get Tier(): number {
    return this._tier
  }

  public set Tier(val: number) {
    this._tier = val
    this.save()
  }

  public get Description(): string {
    return this._flavor_description || ''
  }

  public set Description(val: string) {
    this._flavor_description = val
    this.save()
  }

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(val: boolean) {
    this._destroyed = val
  }

  public get IsCharged(): boolean {
    return this._charged
  }

  public set IsCharged(val: boolean) {
    this._charged = val
    this.save()
  }

  public get IsChargable(): boolean {
    return this._feature.Tags.some(x => x.IsRecharging)
  }

  public get ChargeRoll(): number {
    const rt = this._feature.Tags.find(x => x.IsRecharging)
    return rt ? parseInt(rt.Value.toString()) : 0
  }

  public get Uses(): number {
    return this._uses
  }

  public set Uses(val: number) {
    this._uses = val
    this.save()
  }

  public get MaxUses(): number {
    return this._max_uses
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.MaxUses + b
  }

  public Repair(): void {
    this.Destroyed = false
    this.IsCharged = true
    this.Uses = 0
  }

  private generateStatblock(): string {
    let output = '  '
    output += `${this.Name} (${'I'.repeat(this.Tier)})\n    `
    output += `${this.Feature.Origin}\n    `
    output += `${this.Feature.generateSummary(this.Tier)}\n`
    
    output = output.replaceAll('<b class="accent--text">','')
    output = output.replaceAll('</b>','')
    output = output.replaceAll('<br>','\n    ')
    
    return output
  }

  public get Statblock(): string {
    return this._statblock
  }

  public set Statblock(val: string) {
    this._statblock = val
    this.save()
  }

  public static Serialize(item: NpcItem): INpcItemSaveData {
    return {
      itemID: item._feature.ID,
      tier: item.Tier,
      flavorName: item._flavor_name,
      description: item.Description,
      destroyed: item.Destroyed,
      charged: item.IsCharged,
      uses: item.Uses,
    }
  }

  public static Deserialize(data: INpcItemSaveData, parent: Npc): NpcItem {
    const item = new NpcItem(store.getters.referenceByID('NpcFeatures', data.itemID), data.tier, parent)
    item._flavor_description = data.description
    item._flavor_name = data.flavorName
    item._destroyed = data.destroyed
    item._charged = data.charged
    item._uses = data.uses || 0
    return item
  }
}
