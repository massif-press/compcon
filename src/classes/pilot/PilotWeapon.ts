import { PilotEquipment, Range, Damage, ItemType } from '@/class'
import { IPilotEquipmentData, IRangeData, IDamageData } from '@/interface'

interface IPilotWeaponData extends IPilotEquipmentData {
  range: IRangeData[]
  damage: IDamageData[]
  effect?: string
}

class PilotWeapon extends PilotEquipment {
  private range: Range[]
  private damage: Damage[]
  private effect: string

  public constructor(data: IPilotWeaponData) {
    super(data)
    this.range = data.range.map(x => new Range(x))
    this.damage = data.damage.map(x => new Damage(x))
    this.effect = data.effect || ''
    this._item_type = ItemType.PilotWeapon
  }

  public get Range(): Range[] {
    return this.range
  }

  public get DamageTypeOverride(): string {
    return this._custom_damage_type || null
  }

  public set DamageTypeOverride(val: string) {
    this._custom_damage_type = val
    this.save()
  }

  public get Damage(): Damage[] {
    return this.damage
  }

  public get Effect(): string {
    return this.effect
  }
}

export { PilotWeapon, IPilotWeaponData }
