import { Tag, Range } from '@/class'
import { IRangeData } from '@/interface'
import { INpcFeatureData, NpcFeature, NpcFeatureType } from '.'

interface INpcDamageData {
  type: string
  damage: number[]
  accuracy: number[]
  advantage: number[]
}

interface INpcWeaponData extends INpcFeatureData {
  weapon_type: string
  damage: INpcDamageData
  range: IRangeData[]
  on_hit: string
  tags: ITagData[]
}

class NpcWeapon extends NpcFeature {
  private _tags: ITagData[]
  private _weapon_type: string
  private _damage_data: INpcDamageData
  private _range: Range[]
  private _on_hit?: string

  public constructor(data: INpcWeaponData) {
    super(data)
    this._on_hit = data.on_hit || ''
    this._weapon_type = data.weapon_type
    this._damage_data = data.damage
    this._range = data.range.map(x => new Range(x))
    this._tags = data.tags
    this.type = NpcFeatureType.Weapon
  }

  public get WeaponType(): string {
    return this._weapon_type
  }

  public get OnHit(): string {
    return this._on_hit
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get Range(): Range[] {
    return this._range
  }

  public get DamageType(): string {
    return this._damage_data.type
  }

  public Damage(tier: number): number {
    return this._damage_data.damage[tier]
  }

  public Accuracy(tier: number): number {
    return this._damage_data.accuracy[tier]
  }

  public Advantage(tier: number): number {
    return this._damage_data.advantage[tier]
  }
}

export { INpcDamageData, INpcWeaponData, NpcWeapon }