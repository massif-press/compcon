import { store } from '@/store'
import { INpcClassStats, NpcClassStats } from './NpcClassStats'
import { NpcFeature } from './'

export interface INpcClassData {
  id: string
  name: string
  role: string
  info: { flavor: string; tactics: string }
  stats: INpcClassStats
  base_features: string[]
  optional_features: string[]
  power: number
  brew: string
}

export class NpcClass {
  private _id: string
  private _name: string
  private _role: string
  private _info: {
    flavor: string
    tactics: string
  }
  private _stats: NpcClassStats
  private _base_features: string[]
  private _optional_features: string[]
  private _power: number
  private _brew: string

  public constructor(data: INpcClassData) {
    this._id = data.id
    this._name = data.name
    this._role = data.role
    this._info = data.info
    this._stats = new NpcClassStats(data.stats)
    this._power = data.power
    this._base_features = data.base_features
    this._optional_features = data.optional_features
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

  public get Role(): string {
    return this._role
  }

  public get RoleIcon(): string {
    if (this._role.toLowerCase() === 'biological') return 'mdi-heart-pulse'
    return `cci-role-${this._role}`
  }

  public get Color(): string {
    return `role--${this._role}`
  }

  public get Flavor(): string {
    return this._info.flavor
  }

  public get Tactics(): string {
    return this._info.tactics
  }

  public get BaseFeatures(): NpcFeature[] {
    return this._base_features.map(x => store.getters.referenceByID('NpcFeatures', x))
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this._optional_features.map(x => store.getters.referenceByID('NpcFeatures', x))
  }

  public get Stats(): NpcClassStats {
    return this._stats
  }

  public get ItemType(): string {
    return 'NPC Class'
  }
}
