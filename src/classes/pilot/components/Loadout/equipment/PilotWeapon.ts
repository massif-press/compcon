import { PilotEquipment, Range, Damage, ItemType, DamageType } from '@/class'
import { IPilotEquipmentData, IRangeData, IDamageData, ITagCompendiumData } from '@/interface'

interface IPilotWeaponData extends IPilotEquipmentData {
  range: IRangeData[]
  damage: IDamageData[]
}

class PilotWeapon extends PilotEquipment {
  public readonly Range: Range[]
  public readonly Damage: Damage[]

  public constructor(data: IPilotWeaponData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.Range = data.range.map(x => new Range(x))
    this.Damage = data.damage.map(x => new Damage(x))
    this.ItemType = ItemType.PilotWeapon
  }

  public get DamageTypeOverride(): string {
    return this._custom_damage_type || null
  }

  public set DamageTypeOverride(val: string) {
    this._custom_damage_type = val
    this.save()
  }

  public get DefaultDamageType(): DamageType {
    if (0 === this.Damage.length) {
      return DamageType.Variable
    } else {
      return this.Damage[0].Type
    }
  }

  public get MaxDamage(): number {
    if (0 === this.Damage.length) {
      return 0
    } else {
      return this.Damage[0].Max
    }
  }

  public get Icon(): string {
    return 'cci-pilot'
  }
}

export { PilotWeapon, IPilotWeaponData }
