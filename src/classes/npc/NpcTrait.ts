import { NpcFeature, NpcFeatureType } from './'
import { INpcFeatureData } from './interfaces'

export class NpcTrait extends NpcFeature {
  public constructor(data: INpcFeatureData, packName?: string) {
    super(data, packName)
    this.type = NpcFeatureType.Trait
  }

  public get Color(): string {
    return 'npc--trait'
  }

  public get Icon(): string {
    return 'cci-trait'
  }

  public get IsRecharging(): boolean {
    return this.Tags.some(x => x.IsRecharging)
  }

  public get ChargeRoll(): string {
    return this.Tags.find(x => x.IsRecharging).Value.toString()
  }

}

export default NpcTrait
