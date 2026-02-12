import {
  PilotEquipment,
  Range,
  Damage,
  ItemType,
  DamageType,
  RangeType,
  ContentPack,
  Pilot,
} from '@/class'
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect'
import { IPilotEquipmentData, IRangeData, IDamageData } from '@/interface'

interface IPilotWeaponData extends IPilotEquipmentData {
  range: IRangeData[]
  damage: IDamageData[]

  on_miss?: string | IActiveEffectData
  on_attack?: string | IActiveEffectData
  on_hit?: string | IActiveEffectData
  on_crit?: string | IActiveEffectData
}

class PilotWeapon extends PilotEquipment {
  public readonly Range: Range[]
  public readonly Damage: Damage[]

  public OnMiss?: ActiveEffect
  public OnAttack?: ActiveEffect
  public OnHit?: ActiveEffect
  public OnCrit?: ActiveEffect

  public constructor(data: IPilotWeaponData, pack?: ContentPack) {
    super(data, pack)
    this.Range = data.range.map(x => new Range(x))
    this.Damage = data.damage.map(x => new Damage(x))
    if (this.Damage && this.Damage.length) this.Damage.forEach(d => d.setDamageAttributes(this))

    this.ItemType = ItemType.PilotWeapon
  }

  public get IsSidearm(): boolean {
    return this.Tags.some(x => x.ID == 'tg_sidearm')
  }

  public get DamageTypeOverride(): string {
    return this._custom_damage_type || ''
  }

  public set DamageTypeOverride(val: string) {
    this._custom_damage_type = val
    // this.save();
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

  public DamageSum(type?: DamageType) {
    if (!this.Damage) return 0
    return this.Damage.reduce((a, b) => a + b.ToNumber(type), 0)
  }

  public RangeSum(type?: RangeType) {
    if (!this.Range) return 0
    if (!type) return Math.max(...this.Range.map(r => r.Max))
    return this.Range.find(x => x.Type === type)?.Max || 0
  }

  // for scatter and comparators
  public get StatsByProfile() {
    return {
      Name: this.Name,
      Source: '',
      LcpName: this.LcpName,
      ID: this.ID,
      Stats: this.Stats,
    }
  }

  public get Stats() {
    return {
      range: this.RangeSum(),
      damage: this.DamageSum(),
    }
  }

  public GetAttack(): 'ranged' | 'melee' | 'tech' {
    if (this.Tags.some(x => x.IsSmart)) return 'tech'
    if (this.Range[0]) {
      if (this.Range[0].Type === RangeType.Threat) return 'melee'
      return 'ranged'
    }
    return 'melee'
  }

  public toActiveEffectData(actor: Pilot): IActiveEffectData {
    return {
      id: this.ID,
      name: `${this.Name}`,
      detail: this.Effect || '',
      damage: this.Damage.map(d => Damage.Serialize(d)),
      range: this.Range.map(r => Range.Serialize(r)),
      attack: this.GetAttack(),
      can_crit: true,
    }
  }

  public get Icon(): string {
    return 'cc:pilot'
  }

  public get Color(): string {
    return this.IsExotic ? 'exotic' : 'pilot'
  }
}

export { PilotWeapon }
export type { IPilotWeaponData }
