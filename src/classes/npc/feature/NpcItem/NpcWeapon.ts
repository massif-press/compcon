import { IRangeData } from '@/interface';
import { INpcFeatureData, NpcFeature, NpcFeatureType } from '../NpcFeature';
import { Damage, DamageType, ItemType, Range } from '@/class';

export interface INpcDamageData {
  type: string;
  damage: number[];
}

export interface INpcWeaponData extends INpcFeatureData {
  weapon_type: string;
  damage: INpcDamageData[];
  range: IRangeData[];
  on_hit?: string;
  on_crit?: string;
  accuracy?: number[];
  attack_bonus?: number[];
  attacks: number | number[];
  tags: ITagData[];
}

export class NpcWeapon extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcWeapon;
  public FeatureType = NpcFeatureType.Weapon;

  private _weapon_type: string;
  private _damage_data: INpcDamageData[];
  private _range: Range[];
  private _accuracy: number[];
  private _attack_bonus: number[];
  public readonly OnHit: string;
  public readonly OnCrit: string;
  public readonly Attacks: number[];

  public constructor(data: INpcWeaponData, packName?: string) {
    super(data, packName);
    this.OnHit = data.on_hit || '';
    this.OnCrit = data.on_crit || '';
    this._weapon_type = data.weapon_type;
    this._damage_data = data.damage;
    this.Attacks = this._expand(data.attacks);
    this._accuracy = this._expand(data.accuracy);
    this._attack_bonus = this._expand(data.attack_bonus);
    this._range = data.range.map((x) => new Range(x));
  }

  private _expand(x: any) {
    if (!x) return [0, 0, 0];
    if (Array.isArray(x)) return x;
    return [x, x, x];
  }

  public get WeaponType(): string {
    return this._weapon_type;
  }

  // public get IsLimited(): boolean {
  //   return this.Tags.some((x) => x.IsLimited);
  // }

  // public get IsRecharging(): boolean {
  //   return this.Tags.some((x) => x.IsRecharging);
  // }

  // public get ChargeRoll(): string {
  //   const rechargingTag = this.Tags.find((x) => x.IsRecharging);
  //   return rechargingTag ? rechargingTag.Value.toString() : '';
  // }

  public get Range(): Range[] {
    return this._range;
  }

  public Damage(tier: number): Damage[] {
    if (!this._damage_data) return [];
    return this._damage_data.map((x: INpcDamageData) => {
      let d = x.damage;
      if (!Array.isArray(d)) d = Array(3).fill(d);

      return new Damage({
        type: x.type as DamageType,
        val: d[tier - 1],
      });
    });
  }

  public get HasAccuracy(): boolean {
    return this._accuracy.some((x) => x > 0);
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1];
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1];
  }

  public get Color(): string {
    return 'weapon';
  }

  public get Icon(): string {
    return 'cc:weapon';
  }
}
