import { ItemType } from '@/classes/enums'
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature'
import { ContentPack } from '../../../ContentPack'
export interface INpcTechData extends INpcFeatureData {
  tech_type: string
  accuracy?: number[]
  attack_bonus?: number[]
  type: NpcFeatureType.Tech
}

export class NpcTech extends NpcFeature {
  public override ItemType: ItemType = ItemType.NpcTech

  public constructor(data: INpcTechData, pack?: ContentPack) {
    super(data, pack)
    this.FeatureType = NpcFeatureType.Tech
  }

  public override get Color(): string {
    return 'npc--tech'
  }

  public override get Icon(): string {
    return 'mdi-chart-donut-variant'
  }
}
