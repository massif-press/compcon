import { ItemType } from '@/classes/enums'
import { NpcFeature, INpcFeatureData, NpcFeatureType } from '../NpcFeature'
import { ContentPack } from '../../../ContentPack'

export class NpcTrait extends NpcFeature {
  public override ItemType: ItemType = ItemType.NpcTrait
  public override FeatureType = NpcFeatureType.Trait

  public constructor(data: INpcFeatureData, pack?: ContentPack) {
    super(data, pack)
  }

  public override get Color(): string {
    return this.Actions.length || this.Deployables.length ? 'npc--action' : 'npc--passive'
  }

  public override get Icon(): string {
    return 'cc:trait'
  }
}
