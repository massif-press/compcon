import { ContentPack } from '../../../ContentPack'
import { ItemType } from '../../../enums'
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature'

interface INpcReactionData extends INpcFeatureData {
  trigger: string
  detail: string
  type: NpcFeatureType.Reaction
}

class NpcReaction extends NpcFeature {
  public override ItemType: ItemType = ItemType.NpcReaction
  private _trigger: string

  public constructor(data: INpcReactionData, pack?: ContentPack) {
    super(data, pack)
    this._trigger = data.trigger
    this.FeatureType = NpcFeatureType.Reaction
  }

  // for v2 data or v3 data that has not offloaded this into action data
  public override get Trigger(): string {
    return this._trigger || ''
  }

  public override get Color(): string {
    return 'npc--reaction'
  }

  public override get Icon(): string {
    return 'cc:reaction'
  }
}

export { NpcReaction }
export type { INpcReactionData }
