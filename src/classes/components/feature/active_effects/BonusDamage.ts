type IBonusDamageData = {
  detail: string;
  val: string | number;
  weapon_types: string[];
  weapon_sizes: string[];
  hit_type: 'hit' | 'crit' | 'miss' | 'attack';
};

class BonusDamage {
  public readonly Detail: string;
  public readonly Value: string | number;
  public readonly HitType: 'hit' | 'crit' | 'miss' | 'attack';
  public readonly WeaponTypes: string[];
  public readonly WeaponSizes: string[];
  public readonly Origin: string;

  public constructor(data: IBonusDamageData, origin: string) {
    this.Origin = origin || 'UNKNOWN ORIGIN';

    this.Detail = data.detail;
    this.Value = data.val;
    this.HitType = data.hit_type;
    this.WeaponTypes = data.weapon_types || [];
    this.WeaponSizes = data.weapon_sizes || [];
  }
}

export { BonusDamage };
export type { IBonusDamageData };
