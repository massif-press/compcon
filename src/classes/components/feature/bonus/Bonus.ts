import { DamageType, Mech, Pilot, RangeType, WeaponSize, WeaponType } from '@/class';
import { IFeatureController } from '../IFeatureController';
import dict from './bonus_dictionary';
import { IBonusDataContainer } from './IBonusDataContainer';

interface IBonusData {
  id: string;
  val: string | number | string[];
  damage_types?: DamageType[];
  range_types?: RangeType[];
  weapon_types?: WeaponType[];
  weapon_sizes?: WeaponSize[];
  overwrite?: boolean;
  replace?: boolean;
}

class Bonus {
  public readonly ID: string;
  public readonly Source: string;
  public readonly Value: string | number | string[];
  public readonly Title: string | number;
  public readonly Detail: string | number;
  public readonly DamageTypes: DamageType[];
  public readonly RangeTypes: RangeType[];
  public readonly WeaponTypes: WeaponType[];
  public readonly WeaponSizes: WeaponSize[];
  public readonly Overwrite: boolean;
  public readonly Replace: boolean;

  public constructor(data: IBonusData, source: string) {
    const entry = dict.find((x) => x.id === data.id);
    this.ID = data.id;
    this.Source = source;
    this.Value = data.val;
    this.DamageTypes = data.damage_types || [];
    this.RangeTypes = data.range_types || [];
    this.WeaponTypes = data.weapon_types || [];
    this.WeaponSizes = data.weapon_sizes || [];
    this.Overwrite = data.overwrite || false;
    this.Replace = data.replace || false;
    this.Title = entry ? entry.title : 'UNKNOWN BONUS';
    this.Detail = entry ? this.parseDetail(entry.detail) : 'UNKNOWN BONUS';
  }

  private parseDetail(detail): string {
    let str = detail.slice();
    const v = Array.isArray(this.Value) ? this.Value.join(', ') : this.Value;
    str = str.replace(/{VAL}/g, v);
    if (this.Overwrite) str = str.replace(/{INC_DEC}/g, 'Sets').replace('by', 'to');

    str = str.replace(
      /{INC_DEC}/g,
      !isNaN(v as number) && (v as number) > -1 ? 'Increases' : 'Decreases'
    );
    str = str.replace(
      /{RANGE_TYPES}/g,
      ` ${this.RangeTypes.length ? this.RangeTypes.join('/').toUpperCase() : ''}`
    );
    str = str.replace(
      /{DAMAGE_TYPES}/g,
      ` ${this.DamageTypes.length ? this.DamageTypes.join('/').toUpperCase() : ''}`
    );
    str = str.replace(
      /{WEAPON_TYPES}/g,
      ` ${this.WeaponTypes.length ? this.WeaponTypes.join('/').toUpperCase() : ''}`
    );
    str = str.replace(
      /{WEAPON_SIZES}/g,
      ` ${this.WeaponSizes.length ? this.WeaponSizes.join('/').toUpperCase() : ''}`
    );

    return str;
  }

  public get Icon(): string {
    if (this.Overwrite || this.Replace) return 'mdi-tooltip-edit-outline';
    if (isNaN(this.Value as number)) return 'mdi-tooltip-check-outline';
    if ((this.Value as number) > -1) return 'mdi-tooltip-plus-outline';
    if ((this.Value as number) < 0) return 'mdi-tooltip-minus-outline';
    return 'mdi-tooltip-check-outline';
  }

  public static SumStatic(item: IBonusDataContainer, bonusId: string): string {
    const bArr = item.bonuses?.filter((x) => x.id === bonusId).map((y) => y.val) || [];
    const uncompVal = bArr.filter((x) => !isNaN(parseInt(x as any)));
    const compVal = bArr.filter((x) => isNaN(parseInt(x as any)));
    let str = `${uncompVal.reduce((a, b) => +a + +b, 0)}`;
    if (compVal.length) str += ` (${compVal.join(', ')})`;
    return str;
  }

  public static Int(base: number, id: string, source?: IFeatureController): number {
    let val = base;
    if (!source) return base;
    const replace = source.FeatureController.Bonuses.filter((x) => x.ID === id && x.Replace);
    if (replace.length) val = replace.reduce((sum, bonus) => sum + this.Evaluate(bonus, source), 0);
    return val + this.get(id, source);
  }

  public static get(id: string, source: IFeatureController): number {
    let bArr = source.FeatureController.Bonuses.filter((x) => x.ID === id && !x.Replace);
    if (bArr.some((b) => b.Overwrite)) {
      bArr = bArr.filter((x) => x.Overwrite);
      return (bArr as any[]).reduce((prev, current) =>
        +prev.Value > +current.Value ? prev : current
      ).Value;
    }
    return bArr.reduce((sum, bonus) => sum + this.Evaluate(bonus, source), 0);
  }

  public static getUneval(id: string, source: IFeatureController): any {
    return source.FeatureController.Bonuses.filter((x) => x.ID === id);
  }

  public static Evaluate(bonus: Bonus, source: IFeatureController): number {
    if (Array.isArray(bonus.Value)) return 0;
    if (typeof bonus.Value === 'number') return Math.ceil(bonus.Value);
    let valStr = bonus.Value;
    const ll = source.FeatureController.getRootProperty('Level')?.toString() || '0';
    const grit = source.FeatureController.getRootProperty('Grit')?.toString() || '0';
    valStr = valStr.replace(/{ll}/g, ll);
    valStr = valStr.replace(/{grit}/g, grit);
    valStr = valStr.replace(/[^-()\d/*+.]/g, '');
    return Math.ceil(eval(valStr));
  }

  public static Contributors(
    id: string,
    controller: IFeatureController
  ): { name: string; val: number }[] {
    return controller.FeatureController.Bonuses.filter((x) => x.ID === id).map((b) => ({
      name: b.Source,
      val: Bonus.Evaluate(b, controller),
    }));
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
      replace: bonus.Replace,
    };
  }
}

export { Bonus };
export type { IBonusData };
