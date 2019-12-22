enum NpcFeatureType {
  Trait,
  System,
  Reaction,
  Weapon,
  Tech,
}

interface INpcFeatureData {
  id: string
  name: string
  effect?: string
  brew: string
}

abstract class NpcFeature {
  private _id: string
  private _name: string
  private _effect: string
  private _brew: string
  protected type: NpcFeatureType

  public constructor(data: INpcFeatureData) {
    this._id = data.id
    this._name = data.name
    this._effect = data.effect || ''
    this._brew = data.brew || 'CORE'
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Effect(): string {
    if (!this._effect) return ''
    const perTier = /(\{.*?\})/
    const match = this._effect.match(perTier)[0]
    if (match) {
      this._effect.replace(perTier, match.replace('{', '').replace('}', ''))
    }
    return this._effect
  }

  public EffectByTier(tier: number): string {
    if (!this._effect) return ''
    const perTier = /(\{.*?\})/
    const match = this._effect.match(perTier)[0]
    if (match) {
      const tArr = match
        .replace('{', '')
        .replace('}', '')
        .split('/')
      this._effect.replace(perTier, tArr[tier - 1])
    }
    return this._effect
  }

  public get Type(): NpcFeatureType {
    return this.type
  }
}

export { NpcFeatureType, INpcFeatureData, NpcFeature }
