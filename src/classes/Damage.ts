import { DamageType } from '@/class'

//TODO: getDamage(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IDamageData {
  type: DamageType
  val: string | number
  override?: boolean
}

class Damage {
  public readonly Type: DamageType
  public readonly Value: string
  public readonly Override: boolean
  private _raw_value: string | number

  public constructor(damage: IDamageData) {
    this.Type = this.getDamageType(damage.type)
    this.Value = typeof damage.val === 'number' ? damage.val.toString() : damage.val
    this.Override = damage.override || false
    this._raw_value = damage.val
  }

  private getDamageType(str?: string): DamageType {
    switch (str?.toLowerCase()) {
      case 'kinetic':
        return DamageType.Kinetic
      case 'energy':
        return DamageType.Energy
      case 'explosive':
        return DamageType.Explosive
      case 'heat':
        return DamageType.Heat
      case 'burn':
        return DamageType.Burn
    }
    return DamageType.Variable
  }

  //TODO: replace with dicemath
  public get Max(): number {
    if (typeof this._raw_value === 'number') return this._raw_value
    else {
      let bonus = 0
      if (this._raw_value.split('+').length === 2) bonus = parseInt(this._raw_value.split('+')[1])
      const split = this._raw_value.split('d')
      // (qty * size) + bonus
      return parseInt(split[0]) * parseInt(split[1]) + bonus
    }
  }

  public get Icon(): string {
    return `cci-${this.Type.toLowerCase()}`
  }

  public get DiscordEmoji(): string {
    return `:cc_damage_${this.Type.toLowerCase()}:`
  }

  public get Color(): string {
    return `damage--${this.Type.toLowerCase()}`
  }

  public get Text(): string {
    if (this.Override) return this.Value
    return `${this.Value} ${this.Type} Damage`
  }
}

export { Damage, IDamageData }
