import { DamageType, Mech, Pilot, RangeType, WeaponSize, WeaponType } from '@/class'
import dict from '@/assets/bonus_dictionary.json'

interface IBonusData {
  id: string
  val: string | number | string[]
  damage_types?: DamageType[]
  range_types?: RangeType[]
  weapon_types?: WeaponType[]
  weapon_sizes?: WeaponSize[]
  overwrite?: boolean
  replace?: boolean
}

class Bonus {
  public readonly ID: string
  public readonly Value: string | number | string[]
  public readonly Title: string | number
  public readonly Detail: string | number
  public readonly DamageTypes: DamageType[]
  public readonly RangeTypes: RangeType[]
  public readonly WeaponTypes: WeaponType[]
  public readonly WeaponSizes: WeaponSize[]
  public readonly Overwrite: boolean
  public readonly Replace: boolean

  public constructor(data: IBonusData) {
    const entry = dict.find(x => x.id === data.id)
    this.ID = data.id
    this.Value = data.val
    this.DamageTypes = data.damage_types || []
    this.RangeTypes = data.range_types || []
    this.WeaponTypes = data.weapon_types || []
    this.WeaponSizes = data.weapon_sizes || []
    this.Title = entry ? entry.title : 'UNKNOWN BONUS'
    this.Detail = entry ? this.parseDetail(entry.detail) : 'UNKNOWN BONUS'
    this.Overwrite = data.overwrite
    this.Replace = data.replace
  }

  private parseDetail(detail): string {
    let str = detail.slice()
    str = str.replace(/{VAL}/g, this.Value)
    str = str.replace(/{INC_DEC}/g, this.Value > -1 ? 'Increases' : 'Decreases')
    str = str.replace(
      /{RANGE_TYPES}/g,
      ` ${this.RangeTypes.length ? this.RangeTypes.join('/').toUpperCase() : ''}`
    )
    str = str.replace(
      /{DAMAGE_TYPES}/g,
      ` ${this.DamageTypes.length ? this.DamageTypes.join('/').toUpperCase() : ''}`
    )
    str = str.replace(
      /{WEAPON_TYPES}/g,
      ` ${this.WeaponTypes.length ? this.WeaponTypes.join('/').toUpperCase() : ''}`
    )
    str = str.replace(
      /{WEAPON_SIZES}/g,
      ` ${this.WeaponSizes.length ? this.WeaponSizes.join('/').toUpperCase() : ''}`
    )

    return str
  }

  public static SumStatic(item: any, id: string): string {
    if (item.bonuses) {
      const bArr = item.bonuses.filter(x => x.id === id).map(y => y.val)
      const uncompVal = bArr.filter(x => !isNaN(parseInt(x)))
      const compVal = bArr.filter(x => isNaN(parseInt(x)))
      let str = `${uncompVal.reduce((a, b) => +a + +b, 0)}`
      if (compVal.length) str += ` (${compVal.join(', ')})`
      return str
    }
    return ''
  }

  public static IntPilot(base: number, id: string, pilot: Pilot): number {
    const replace = pilot.Bonuses.filter(x => x.ID === id && x.Replace)
    let val = base
    if (replace.length) val = replace.reduce((sum, bonus) => sum + this.Evaluate(bonus, pilot), 0)
    return val + this.getPilot(id, pilot)
  }

  public static Int(base: number, id: string, mech: Mech): number {
    const replace = mech.Bonuses.filter(x => x.ID === id && x.Replace)
    let val = base
    if (replace.length)
      val = replace.reduce((sum, bonus) => sum + this.Evaluate(bonus, mech.Pilot), 0)
    return val + this.get(id, mech)
  }

  public static Evaluate(bonus: Bonus, pilot: Pilot): number {
    if (Array.isArray(bonus.Value)) return
    if (typeof bonus.Value === 'number') return Math.ceil(bonus.Value)
    let valStr = bonus.Value
    valStr = valStr.replaceAll(`{ll}`, pilot.Level.toString())
    valStr = valStr.replaceAll(`{grit}`, pilot.Grit.toString())
    valStr = valStr.replace(/[^-()\d/*+.]/g, '')
    return Math.ceil(eval(valStr))
  }

  public static get(id: string, mech: Mech): number {
    let bArr = mech.Bonuses.filter(x => x.ID === id && !x.Replace)
    if (bArr.some(b => b.Overwrite)) {
      bArr = bArr.filter(x => x.Overwrite)
      return (bArr as any[]).reduce((prev, current) =>
        +prev.Value > +current.Value ? prev : current
      ).Value
    }
    return bArr.reduce((sum, bonus) => sum + this.Evaluate(bonus, mech.Pilot), 0)
  }

  public static getUneval(id: string, mech: Mech): any {
    return mech.Bonuses.filter(x => x.ID === id)
  }

  public static getPilot(id: string, pilot: Pilot): number {
    let bArr = pilot.Bonuses.filter(x => x.ID === id && !x.Replace)
    if (bArr.some(b => b.Overwrite)) {
      bArr = bArr.filter(x => x.Overwrite)
      return (bArr as any[]).reduce((prev, current) =>
        +prev.Value > +current.Value ? prev : current
      ).Value
    }
    return bArr.reduce((sum, bonus) => sum + this.Evaluate(bonus, pilot), 0)
  }

  private static MechContributors(m: Mech, id: string): { name: string; val: number }[] {
    const output = []
    if (m.ActiveLoadout && m.ActiveLoadout.Equipment) {
      m.ActiveLoadout.Equipment.filter(x => x && !x.Destroyed && !x.IsCascading).forEach(e => {
        e.Bonuses.forEach(b => {
          if (b.ID === id)
            output.push({
              name: `${e.Source} ${e.Name} (${m.ActiveLoadout.Name} Loadout)`,
              val: Bonus.Evaluate(b, m.Pilot),
            })
        })
      })
    }

    m.Frame.Traits.forEach(t => {
      t.Bonuses.forEach(b => {
        if (b.ID === id)
          output.push({
            name: `${t.Name} (${m.Frame.Source} ${m.Frame.Name} Trait)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    })

    m.Frame.CoreSystem.PassiveBonuses.forEach(b => {
      if (b.ID === id)
        output.push({
          name: `${m.Frame.CoreSystem.PassiveName} (${m.Frame.Source} ${m.Frame.Name} CORE System Passive)`,
          val: Bonus.Evaluate(b, m.Pilot),
        })
    })

    if (m.IsCoreActive) {
      m.Frame.CoreSystem.ActiveBonuses.forEach(b => {
        if (b.ID === id)
          output.push({
            name: `${m.Frame.CoreSystem.ActiveName} (${m.Frame.Source} ${m.Frame.Name} CORE System Active)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    }
    return output
  }

  public static Contributors(id: string, m: Mech): { name: string; val: number }[] {
    const output = Bonus.MechContributors(m, id)
    m.Pilot.Loadout.Items.forEach(i => {
      if (!i) return
      i.Bonuses.forEach(b => {
        if (b.ID === id)
          output.push({
            name: `${i.Name} (Pilot Equipment)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    })

    m.Pilot.CoreBonuses.forEach(cb => {
      cb.Bonuses.forEach(b => {
        if (b.ID === id)
          output.push({
            name: `${cb.Name} (${cb.Source} CORE Bonus)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    })

    m.Pilot.Reserves.forEach(r => {
      r.Bonuses.forEach(b => {
        if (b.ID === id && !r.Used)
          output.push({
            name: `${r.Name} (Reserve)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    })

    m.Pilot.Talents.flatMap(x => x.UnlockedRanks).forEach(t => {
      t.Bonuses.forEach(b => {
        if (b.ID === id)
          output.push({
            name: `${t.Name} (Pilot Talent)`,
            val: Bonus.Evaluate(b, m.Pilot),
          })
      })
    })
    return output
  }

  public static Serialize(bonus: Bonus): IBonusData {
    return {
      id: bonus.ID,
      val: bonus.Value,
      damage_types: bonus.DamageTypes,
      range_types: bonus.RangeTypes,
      weapon_types: bonus.WeaponTypes,
      weapon_sizes: bonus.WeaponSizes,
      overwrite: bonus.Overwrite,
      replace: bonus.Replace
    }
  }
}

export { Bonus, IBonusData }
