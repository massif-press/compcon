import { ItemType } from '@/classes/enums';
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';
import { ContentPack } from '@/class';

export interface INpcTechData extends INpcFeatureData {
  tech_type: string;
  accuracy?: number[];
  attack_bonus?: number[];
  type: NpcFeatureType.Tech;
}

export class NpcTech extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcTech;

  private _accuracy: number[];
  private _attack_bonus: number[];

  public constructor(data: INpcTechData, pack?: ContentPack) {
    super(data, pack);
    this._accuracy = this._expand(data.accuracy);
    this._attack_bonus = this._expand(data.attack_bonus);
    this.FeatureType = NpcFeatureType.Tech;
  }

  private _expand(x: any) {
    if (!x) return [0, 0, 0];
    if (Array.isArray(x)) return x;
    return [x, x, x];
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

  public get HasAccuracy(): boolean {
    return this._accuracy.some((x) => x > 0);
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1];
  }

  public get HasAttackBonus(): boolean {
    return this._attack_bonus.some((x) => x > 0);
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1];
  }

  public get Color(): string {
    return 'npc--tech';
  }

  public get Icon(): string {
    return 'mdi-chart-donut-variant';
  }
}
