import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'

type IBonusDamageData = {
  detail: string;
  val: string | number;
  weapon_types: string[];
  weapon_sizes: string[];
  hit_type: 'hit' | 'crit' | 'miss' | 'attack';
};

class BonusDamage {
  private readonly _detail: string;
  private readonly _lkey?: string;
  public readonly Value: string | number;
  public readonly HitType: 'hit' | 'crit' | 'miss' | 'attack';
  public readonly WeaponTypes: string[];
  public readonly WeaponSizes: string[];
  public readonly Origin: string;

  public constructor(data: IBonusDamageData, origin: string) {
    this.Origin = origin || 'UNKNOWN ORIGIN';

    this._detail = data.detail;
    this._lkey = keyPrefixes.get(data as object);
    this.Value = data.val;
    this.HitType = data.hit_type;
    this.WeaponTypes = data.weapon_types || [];
    this.WeaponSizes = data.weapon_sizes || [];
  }

  public get Detail(): string {
    return this._lkey ? localize(this._lkey, 'detail', this._detail) : this._detail;
  }
}

export { BonusDamage };
export type { IBonusDamageData };
