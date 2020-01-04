import { store } from '@/store'
import { NpcFeature } from './'

export interface INpcTemplateData {
  id: string
  name: string
  description: string
  base_features: string[]
  optional_features: string[]
  power: number
  brew: string
}

export class NpcTemplate {
  private _id: string
  private _name: string
  private _description: string
  private _base_features: NpcFeature[]
  private _optional_features: NpcFeature[]
  private _power: number
  private _brew: string

  public constructor(data: INpcTemplateData) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
    this._base_features = this._base_features = data.base_features.map(x =>
      store.getters.referenceByID('NpcFeatures', x)
    )
    this._optional_features = data.optional_features.map(x =>
      store.getters.referenceByID('NpcFeatures', x)
    )
    this._power = data.power
    this._brew = data.brew || 'CORE'
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Power(): number {
    return this._power
  }

  public get Description(): string {
    return this._description
  }

  public get BaseFeatures(): NpcFeature[] {
    return this._base_features
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this._optional_features
  }
}
