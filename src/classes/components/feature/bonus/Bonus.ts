import { DamageType, RangeType, WeaponSize, WeaponType } from '@/class'
import { IFeatureController } from '../IFeatureController'
import { getBonusDictionary } from './bonus_dictionary'
import { IBonusDataContainer } from './IBonusDataContainer'

interface IBonusData {
  id: string
  val: string | number | string[] | boolean
  accuracy?: number
  damage_types?: DamageType[]
  range_types?: RangeType[]
  weapon_types?: WeaponType[]
  weapon_sizes?: WeaponSize[]
  overwrite?: boolean
  replace?: boolean
  type?: 'flag'
  condition?: string
}

class Bonus {
  public readonly ID: string
  public readonly Source: string
  public readonly Value: string | number | string[]
  public readonly Accuracy: number
  public readonly Title: string | number
  public readonly Detail: string | number
  public readonly DamageTypes: DamageType[]
  public readonly RangeTypes: RangeType[]
  public readonly WeaponTypes: WeaponType[]
  public readonly WeaponSizes: WeaponSize[]
  public readonly Overwrite: boolean
  public readonly Replace: boolean
  public readonly PerPc: boolean = false
  public readonly IsFlag: boolean
  public readonly Condition: string | undefined

  public constructor(data: IBonusData, source: string) {
    const entry = getBonusDictionary().find(x => x.id === data.id)
    this.ID = data.id
    this.Source = source
    this.PerPc = data.id.includes('_pct') || false

    this.Value = data.val
    this.Accuracy = data.accuracy || 0
    this.DamageTypes = data.damage_types || []
    this.RangeTypes = data.range_types || []
    this.WeaponTypes = data.weapon_types || []
    this.WeaponSizes = data.weapon_sizes || []
    this.Overwrite = data.overwrite || false
    this.Replace = data.replace || false
    this.IsFlag = data.type === 'flag' || data.val === true
    this.Condition = data.condition

    this.Title = entry ? entry.title : 'UNKNOWN BONUS'
    this.Detail = entry ? this.parseDetail(entry.detail) : 'UNKNOWN BONUS'
  }

  private parseDetail(detail): string {
    let str = detail.slice()
    let rep

    if (this.Value) {
      const v = Array.isArray(this.Value) ? this.Value.join(', ') : this.Value
      str = str.replace(/{VAL}/g, v)
      rep = v
    }

    if (this.Accuracy) {
      str = str.replace(/{INC_DEC}/g, '')
      str = str.replace(
        /by {VAL}/g,
        `take ${Math.abs(this.Accuracy)} ${this.Accuracy > 0 ? 'Accuracy' : 'Difficulty'}`
      )
      return str
    }

    if (this.Overwrite) str = str.replace(/{INC_DEC}/g, 'Sets').replace('by', 'to')

    const repNum = Array.isArray(this.Value)
      ? Number(this.Value[0])
      : typeof rep === 'string' && rep.includes('/')
        ? Number(rep.split('/')[0])
        : Number(rep)
    str = str.replace(/{INC_DEC}/g, !isNaN(repNum) && repNum > -1 ? 'Increases' : 'Decreases')
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

  public get Icon(): string {
    if (this.Overwrite || this.Replace) return 'mdi-tooltip-edit-outline'
    if (!isNaN(Number(this.Value)) || !isNaN(Number(this.Accuracy))) {
      if (this.Accuracy !== 0) {
        if (this.Accuracy > 0) return 'mdi-tooltip-plus-outline'
        return 'mdi-tooltip-minus-outline'
      }
      if (Number(this.Value) > 0) return 'mdi-tooltip-plus-outline'
      return 'mdi-tooltip-minus-outline'
    }
    return 'mdi-tooltip-check-outline'
  }

  public get Symbol(): string {
    if (this.Overwrite || this.Replace) return '='
    if (isNaN(this.Value as number)) return ''
    if ((this.Value as number) > -1) return '+'
    if ((this.Value as number) < 0) return '-'
    return '±'
  }

  public static SumStatic(item: IBonusDataContainer, bonusId: string): string {
    const bArr = item.bonuses?.filter(x => x.id === bonusId).map(y => y.val) || []
    const uncompVal = bArr.filter(x => !isNaN(parseInt(x as any)))
    const compVal = bArr.filter(x => isNaN(parseInt(x as any)))
    let str = `${uncompVal.reduce((a, b) => +a + +b, 0)}`
    if (compVal.length) str += ` (${compVal.join(', ')})`
    return str
  }

  public static Int(base: number, id: string, source?: IFeatureController): number {
    if (!source) return base

    const all = source.FeatureController.Bonuses.filter(x => x.ID === id)

    // overwrite: ignore base and all other bonuses; take the highest overwrite value
    const overwrites = all.filter(b => b.Overwrite && !b.Replace)
    if (overwrites.length) {
      return Math.max(...overwrites.map(b => this.Evaluate(b, source)))
    }

    // replace: sum of replace bonuses becomes the new base
    const replaces = all.filter(b => b.Replace)
    let val = replaces.length
      ? replaces.reduce((sum, b) => sum + this.Evaluate(b, source), 0)
      : base

    // additive: sum remaining bonuses
    return (
      val +
      all
        .filter(b => !b.Overwrite && !b.Replace)
        .reduce((sum, b) => sum + this.Evaluate(b, source), 0)
    )
  }

  public static get(id: string, source: IFeatureController): number {
    let bArr = source.FeatureController.Bonuses.filter(x => x.ID === id && !x.Replace)
    if (bArr.some(b => b.Overwrite)) {
      bArr = bArr.filter(x => x.Overwrite)
      return (bArr as any[]).reduce((prev, current) =>
        +prev.Value > +current.Value ? prev : current
      ).Value
    }
    return bArr.reduce((sum, bonus) => sum + this.Evaluate(bonus, source), 0)
  }

  public static getUneval(id: string, source: IFeatureController): any {
    return source.FeatureController.Bonuses.filter(x => x.ID === id)
  }

  public static Evaluate(bonus: Bonus, source: IFeatureController): number {
    if (!bonus.Value) return 0

    if (Array.isArray(bonus.Value)) {
      const tier: number = (source as any).CombatController?.Tier ?? 1
      const val = bonus.Value[Math.min(tier - 1, bonus.Value.length - 1)]
      return Math.ceil(Number(val))
    }

    let value: string | number = bonus.Value
    if (typeof value === 'string' && value.includes('/')) {
      const tier: number = (source as any).CombatController?.Tier ?? 1
      const parts = value.split('/')
      value = parts[Math.min(tier - 1, parts.length - 1)]
    }

    if (typeof value === 'number') return Math.ceil(value)
    return source.FeatureController.EvaluateSpecial(value as string) as number
  }

  public static Contributors(
    id: string,
    controller: IFeatureController
  ): { name: string; val: number }[] {
    return controller.FeatureController.Bonuses.filter(x => x.ID === id).map(b => ({
      name: b.Source,
      val: Bonus.Evaluate(b, controller),
    }))
  }

  public static Serialize(bonus: Bonus): IBonusData {
    const data: IBonusData = {
      id: bonus.ID,
      val: bonus.Value,
      damage_types: bonus.DamageTypes,
      range_types: bonus.RangeTypes,
      weapon_types: bonus.WeaponTypes,
      weapon_sizes: bonus.WeaponSizes,
      overwrite: bonus.Overwrite,
      replace: bonus.Replace,
    }
    if (bonus.Condition) data.condition = bonus.Condition
    return data
  }
}

export { Bonus }
export type { IBonusData }
export { BonusId } from './bonus_dictionary'
export type { BonusIdType } from './bonus_dictionary'
