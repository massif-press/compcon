import { Tag } from '@/class'

export enum NpcFeatureType {
  Trait = 'Trait',
  System = 'System',
  Reaction = 'Reaction',
  Weapon = 'Weapon',
  Tech = 'Tech',
}

export interface IOriginData {
  type: string
  name: string
  base: boolean
}

export interface INpcFeatureData {
  id: string
  name: string
  origin: IOriginData
  locked: boolean
  effect?: string
  bonus?: object
  override?: object
  tags: ITagData[]
  brew: string
  hide_active: boolean
  type: NpcFeatureType
}

export abstract class NpcFeature {
  private _id: string
  private _name: string
  private _origin: IOriginData
  private _effect: string
  private _bonus: object
  private _override: object
  private _locked: boolean
  private _tags: ITagData[]
  private _hide_active: boolean
  protected type: NpcFeatureType
  public IsHidden: boolean
  public readonly Brew: string
  public readonly LcpName: string
  public readonly InLcp: boolean

  public constructor(data: INpcFeatureData, packName?: string) {
    this._id = data.id
    this._name = data.name
    this._origin = data.origin
    this._effect = data.effect || ''
    this._bonus = data.bonus || null
    this._override = data.override || null
    this._locked = data.locked || false
    this._tags = data.tags
    this.Brew = data.brew || 'Core'
    this._hide_active = data.hide_active || false
    this.LcpName = packName || 'Lancer CORE NPCs'
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Origin(): string {
    return `${this._origin.name} ${this._origin.type} - ${
      this._origin.base ? 'Base' : 'Optional'
    } ${this.FeatureType}`
  }

  public get OriginClass(): string {
    return this._origin.name
  }

  public get OriginSet(): string {
    return this._origin.base ? 'Base' : 'Optional'
  }

  public get IsBase(): boolean {
    return this._origin.base
  }

  public get Bonus(): object {
    return this._bonus
  }

  public get Override(): object {
    return this._override
  }

  abstract generateSummary(tier: number): string

  public get Effect(): string {
    if (!this._effect) return ''
    const perTier = /(\{.*?\})/
    const m = this._effect.match(perTier)
    if (m) {
      return this._effect.replace(
        perTier,
        m[0].replace('{', '<b class="accent--text">').replace('}', '</b>')
      )
    }
    return this._effect
  }

  public EffectByTier(tier: number): string {
    if (!this._effect) return ''
    let fmt = this._effect
    const perTier = /(\{.*?\})/g
    const m = this._effect.match(perTier)
    if (m) {
      m.forEach(x => {
        const tArr = x.replace('{', '').replace('}', '').split('/')
        fmt = fmt.replace(x, `<b class="accent--text">${tArr[tier - 1]}</b>`)
      })
    }
    return fmt
  }

  public get IsLocked(): boolean {
    return this._locked
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get HideActive(): boolean {
    return this._hide_active
  }

  public get FeatureType(): NpcFeatureType {
    return this.type
  }

  // Used for cc-item-card subcomponent selection
  public get ItemType(): string {
    return `Npc${this.type}`
  }

  public get Source(): string {
    return ''
    // return this._origin.name
  }
}
