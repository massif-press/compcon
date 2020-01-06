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
  brew: string
  type: NpcFeatureType
}

export abstract class NpcFeature {
  private _id: string
  private _name: string
  private _origin: IOriginData
  private _effect: string
  private _bonus: object
  private _locked: boolean
  private _brew: string
  protected type: NpcFeatureType

  public constructor(data: INpcFeatureData) {
    this._id = data.id
    this._name = data.name
    this._origin = data.origin
    this._effect = data.effect || ''
    this._bonus = data.bonus || null
    this._locked = data.locked || false
    this._brew = data.brew || 'CORE'
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

  public get IsBase(): boolean {
    return this._origin.base
  }

  public get Bonus(): object {
    return this._bonus
  }

  public get Effect(): string {
    if (!this._effect) return ''
    const perTier = /(\{.*?\})/
    const m = this._effect.match(perTier)
    if (m) {
      return this._effect.replace(
        perTier,
        m[0].replace('{', '<b class="primary--text">').replace('}', '</b>')
      )
    }
    return this._effect
  }

  public EffectByTier(tier: number): string {
    if (!this._effect) return ''
    const perTier = /(\{.*?\})/
    const m = this._effect.match(perTier)
    if (m) {
      const tArr = m[0]
        .replace('{', '')
        .replace('}', '')
        .split('/')
      return this._effect.replace(perTier, `<b class="primary--text">${tArr[tier - 1]}</b>`)
    }
    return this._effect
  }

  public get IsLocked(): boolean {
    return this._locked
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
