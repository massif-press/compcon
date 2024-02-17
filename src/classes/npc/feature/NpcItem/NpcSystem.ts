import { ItemType } from '@/classes/enums';
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';

export interface INpcSystemData extends INpcFeatureData {
  type: NpcFeatureType.System;
}

export class NpcSystem extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcSystem;
  public FeatureType = NpcFeatureType.System;

  public constructor(data: INpcSystemData, packName?: string) {
    super(data, packName);
  }

  public get Icon(): string {
    return 'cc:system';
  }

  // public get IsLimited(): boolean {
  //   return this.Tags.some((x) => x.IsLimited);
  // }

  // public get ChargeRoll(): string {
  //   const rechargingTag = this.Tags.find((x) => x.IsRecharging);
  //   return rechargingTag ? rechargingTag.Value.toString() : '';
  // }
}