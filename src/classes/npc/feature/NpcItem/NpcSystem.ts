import { ItemType } from '@/classes/enums'
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature'
import { ContentPack } from '../../../ContentPack'

export interface INpcSystemData extends INpcFeatureData {
  type: NpcFeatureType.System
}

export class NpcSystem extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcSystem

  public constructor(data: INpcSystemData, pack?: ContentPack) {
    super(data, pack)
    this.FeatureType = NpcFeatureType.System
  }

  public get Color(): string {
    return this.Actions.length || this.Deployables.length ? 'npc--action' : 'npc--passive'
  }

  public get Icon(): string {
    return 'cc:system'
  }
}
