import { ActivationType, CompendiumItem, ContentPack } from '@/class'
import { Action, ICompendiumItemData, ITagData } from '@/interface'
import { NpcClass } from '../class/NpcClass'
import { NpcTemplate } from '../template/NpcTemplate'
import { CompendiumStore } from '@/stores'

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
  type: string
  deprecated?: boolean
  build_feature?: boolean
}

abstract class NpcFeature extends CompendiumItem {
  public InLcp: boolean = true
  // this needs to be public (for now) to support v2 style NPC data
  public _originID: string
  private _effect: string
  private _hide_active: boolean
  public FeatureType: NpcFeatureType = NpcFeatureType.Trait
  public IsHidden: boolean = false
  public Recharge: number = 0
  public Used: boolean = false
  public readonly Base: boolean
  public readonly Deprecated: boolean = false
  public readonly BuildFeature: boolean = false
  public readonly Kit?: string
  public readonly Mod?: string

  public constructor(data: INpcFeatureData, pack?: ContentPack) {
    super(data as ICompendiumItemData, pack)
    this._originID = data.origin
    this._effect = data.effect || data.detail || ''

    if (this.Tags.some(x => x.IsRecharging)) {
      this.Recharge = Number(this.Tags.find(x => x.IsRecharging)?.Value) || 0
    }

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

  public get Name(): string {
    return this._name
  }

  public set Name(v: string) {
    this._name = v
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
    if (!this._effect) return ''
    let out = this._effect
    const perTier = /(\{.*?\})/gi
    const matches = out.match(perTier)
    if (matches) {
      matches.forEach(m => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'))
      })
    }
    return out
  }

  public EffectByTier(tier: number): string {
    if (!this._effect) return ''
    let fmt = this._effect
    const perTier = /(?:\{)?(\d+)\/(\d+)\/(\d+)(?:\})?/g
    const m = this._effect.match(perTier)
    if (m) {
      m.forEach(x => {
        if (tier) {
          const tArr = x.replace('{', '').replace('}', '').split('/')
          fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`)
        } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'))
      })
    }
    return fmt
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
