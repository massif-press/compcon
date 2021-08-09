import { Mech, MechWeapon, RangeType } from '@/class'
import { Bonus } from './Bonus'

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IRangeData {
  type: RangeType
  val: number
  override?: boolean
  bonus?: number
}

class Range {
  private _range_type: RangeType
  private _value: number
  private _override: boolean
  private _bonus: number

  public constructor(range: IRangeData) {
    this._range_type = range.type as RangeType
    this._value = range.val
    this._override = range.override || false
    this._bonus = range.bonus || 0
  }

  public get Override(): boolean {
    return this._override
  }

  public get Type(): RangeType {
    return this._range_type
  }

  public get Value(): string {
    if (this._bonus) return (this._value + this._bonus).toString()
    return this._value.toString()
  }

  public get Max(): number {
    return this._value + this._bonus
  }

  public get Icon(): string {
    return `cci-${this._range_type.toLowerCase()}`
  }

  public get DiscordEmoji(): string {
    switch (this._range_type) {
      case RangeType.Range:
      case RangeType.Threat:
      case RangeType.Thrown:
        return `:cc_${this._range_type.toLowerCase()}:`
    }
    return `:cc_aoe_${this._range_type.toLowerCase()}:`
  }

  public get Text(): string {
    if (this._override) return this.Value.toString()
    if (this._bonus) return `${this._range_type} ${this.Value} (+${this._bonus})`
    return `${this._range_type} ${this.Value}`
  }

  public static CalculateRange(item: MechWeapon, mech: Mech, addedRange?: Range[]): Range[] {
    if (!item || !mech) return []
    if (item.NoBonuses) return item.Range

    if (!addedRange || !addedRange.length) addedRange = []

    const output = []

    item.Range.forEach(r => {
      if (r.Override) return
      let bonus = 0
      addedRange.forEach(added => {
        if (added._range_type === r._range_type) bonus += added._value
      })
      output.push(
        new Range({
          type: r.Type,
          val: r._value,
          override: r._override,
          bonus: bonus,
        })
      )
    })

    if (!Bonus.get('range', mech) || item.NoCoreBonus) return output
    const bonuses = mech.Bonuses.filter(x => x.ID === 'range')
    output.forEach(r => {
      if (r.Override) return
      bonuses.forEach(b => {
        if (b.WeaponTypes.length && !b.WeaponTypes.some(wt => item.WeaponType === wt)) return
        if (b.WeaponSizes.length && !b.WeaponSizes.some(ws => item.Size === ws)) return
        if (b.DamageTypes.length && !b.DamageTypes.some(dt => item.DamageType.some(x => x === dt)))
          return
        if (!b.RangeTypes.length || b.RangeTypes.some(rt => r.Type === rt)) {
          r._bonus += Bonus.Evaluate(b, mech.Pilot)
        }
      })
    })
    return output
  }

  private static ci(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase()
  }

  public static Serialize(range: Range): IRangeData {
    return {
      type: range._range_type,
      val: range._value,
      override: range._override,
      bonus: range._bonus
    }
  }
}

export { Range, IRangeData }
