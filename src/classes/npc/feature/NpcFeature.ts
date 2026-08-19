import { CompendiumItem, type ICompendiumItemData } from '../../CompendiumItem'
import { ActivationType } from '../../enums'
import type { ContentPack } from '../../ContentPack'
import { Action } from '../../Action'
import { NpcTemplate } from '../template/NpcTemplate'
import { CompendiumStore } from '@/features/compendium/store'
import { ITagData } from '@/classes/Tag'
import { NpcClass } from '../class/NpcClass'
import { ByTierLoose } from '@/util/tierFormat'

export enum NpcFeatureType {
  Trait = 'Trait',
  System = 'System',
  Reaction = 'Reaction',
  Weapon = 'Weapon',
  Tech = 'Tech',
}

interface INpcFeatureData extends ICompendiumItemData {
  id: string
  name: string
  origin: string
  base?: boolean
  kit?: string
  effect?: string
  detail?: string
  bonus?: object
  mod?: string
  tags: ITagData[]
  hide_active: boolean
  accuracy?: number | number[]
  attack_bonus?: number | number[]
  type: string
  deprecated?: boolean
  build_feature?: boolean
}

abstract class NpcFeature extends CompendiumItem {
  public override InLcp: boolean = true
  // this needs to be public (for now) to support v2 style NPC data
  public _originID: string
  private _effect: string
  private _hide_active: boolean
  public FeatureType: NpcFeatureType = NpcFeatureType.Trait
  public override IsHidden: boolean = false
  public Recharge: number = 0
  public override Used: boolean = false
  public IsLoading: boolean = false
  public readonly Base: boolean
  public readonly Deprecated: boolean = false
  public readonly BuildFeature: boolean = false
  public readonly Kit?: string
  public readonly Mod?: string
  protected _accuracy: number[]
  protected _attack_bonus: number[]

  public constructor(data: INpcFeatureData, pack?: ContentPack) {
    super(data as ICompendiumItemData, pack)
    this._originID = data.origin
    this._effect = data.effect || data.detail || ''
    this._accuracy = this._expand(data.accuracy)
    this._attack_bonus = this._expand(data.attack_bonus)

    if (this.Tags.some(x => x.IsRecharging)) {
      this.Recharge = Number(this.Tags.find(x => x.IsRecharging)?.Value) || 0
    }
    this.IsLoading = this.Tags.some(x => x.IsLoading)

    this._hide_active = data.hide_active || false
    this.Base = data.base || false
    this.Deprecated = data.deprecated || false
    if (data.kit) this.Kit = data.kit
    if (data.mod) this.Mod = data.mod

    this.BuildFeature = data.build_feature || false

    // if pack is v2, auto generate action based on tag:
    if (pack && !pack.v3) {
      const tagActivation = this.getActivationFromTags(data.tags)
      if (!tagActivation) return
      this.Actions.push(
        new Action({
          id: this.ID,
          name: this.Name,
          activation: tagActivation,
          description: this.Description,
          detail: this.Description,
          trigger: (data as any).trigger,
          effect: this.Effect,
          hide_active: this.HideActive,
          heat_cost: this.HeatCost,
          hidden: this.IsHidden,
        })
      )
    }
  }

  private getActivationFromTags(tags: ITagData[]): ActivationType | null {
    if (!tags || !tags.length) return null
    const ids = tags.map(t => t.id?.replace('tg_', '')).filter(Boolean)
    if (ids.includes('none')) return ActivationType.None
    if (ids.includes('free')) return ActivationType.Free
    if (ids.includes('protocol')) return ActivationType.Protocol
    if (ids.includes('quick_tech')) return ActivationType.QuickTech
    if (ids.includes('full_tech')) return ActivationType.FullTech
    if (ids.includes('quick')) return ActivationType.Quick
    if (ids.includes('full')) return ActivationType.Full
    if (ids.includes('invade')) return ActivationType.Invade
    if (ids.includes('jockey')) return ActivationType.Jockey
    if (ids.includes('reaction')) return ActivationType.Reaction
    return null
  }

  public get Origin() {
    if (CompendiumStore().has('NpcClasses', this._originID))
      return CompendiumStore().referenceByID('NpcClasses', this._originID) as unknown as NpcClass
    if (CompendiumStore().has('NpcTemplates', this._originID))
      return CompendiumStore().referenceByID(
        'NpcTemplates',
        this._originID
      ) as unknown as NpcTemplate
    return { ID: 'not_loaded' }
  }

  public get Effect(): string {
    return ByTierLoose(this._effect)
  }

  public EffectByTier(tier: number): string {
    return ByTierLoose(this._effect, tier)
  }

  // tier triples arrive as a bare number, a 3-entry array, or not at all
  protected _expand(x: any): number[] {
    if (!x) return [0, 0, 0]
    if (Array.isArray(x)) return x
    return [x, x, x]
  }

  public get HasAccuracy(): boolean {
    return this._accuracy.some(x => !!x)
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1] ?? 0
  }

  public get HasAttackBonus(): boolean {
    return this._attack_bonus.some(x => !!x)
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1] ?? 0
  }

  public get Trigger(): string {
    return ''
  }

  public TriggerByTier(tier: number): string {
    return ByTierLoose(this.Trigger, tier)
  }

  public get HideActive(): boolean {
    return this._hide_active
  }

  public get Passive(): boolean {
    return this.BuildFeature || this.Deprecated || !!this.Mod || this.HideActive
  }

  public get IsCombatPassive(): boolean {
    return (
      (this.FeatureType === NpcFeatureType.Trait || this.FeatureType === NpcFeatureType.Reaction) &&
      !(
        this.Actions.length > 0 ||
        this.Deployables.length > 0 ||
        this.Recharge > 0 ||
        this.Tags.some(x => x.UsageCost > 0) ||
        !!(this as any).Damage
      )
    )
  }

  public get ModTarget(): NpcFeature | null {
    return CompendiumStore().NpcFeatures.find(x => x.ID === this.Mod) || null
  }
}
export { NpcFeature }
export type { INpcFeatureData }
