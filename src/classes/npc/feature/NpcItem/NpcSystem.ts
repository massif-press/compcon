import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';

export interface INpcSystemData {
  //} extends INpcFeatureData {
  type: NpcFeatureType.System;
}

export class NpcSystem {
  //extends NpcFeature {
  public constructor(data: INpcSystemData, packName?: string) {
    // super(data, packName);
    // this.type = NpcFeatureType.System;
  }

  // public get IsLimited(): boolean {
  //   return this.Tags.some((x) => x.IsLimited);
  // }

  // public get ChargeRoll(): string {
  //   const rechargingTag = this.Tags.find((x) => x.IsRecharging);
  //   return rechargingTag ? rechargingTag.Value.toString() : '';
  // }
}
