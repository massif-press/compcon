import { ItemType } from '@/classes/enums';
import { NpcFeature, INpcFeatureData, NpcFeatureType } from '../NpcFeature';

export class NpcTrait extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcTrait;
  public FeatureType = NpcFeatureType.Trait;

  public constructor(data: INpcFeatureData, packName?: string) {
    super(data, packName);
  }

  public get Color(): string {
    return 'npc--trait';
  }

  public get Icon(): string {
    return 'cc:trait';
  }

  // public get IsRecharging(): boolean {
  //   return this.Tags.some((x) => x.IsRecharging);
  // }

  // public get ChargeRoll(): string {
  //   const rechargingTag = this.Tags.find((x) => x.IsRecharging);
  //   return rechargingTag ? rechargingTag.Value.toString() : '';
  // }
}

export default NpcTrait;
