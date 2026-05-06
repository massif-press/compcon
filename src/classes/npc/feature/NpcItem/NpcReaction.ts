import { ContentPack, ItemType } from '@/class'
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature'

interface INpcReactionData extends INpcFeatureData {
  trigger: string
  detail: string
  type: NpcFeatureType.Reaction
}

class NpcReaction extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcReaction
  public Trigger: string

  public constructor(data: INpcReactionData, pack?: ContentPack) {
    super(data, pack)
    this.Trigger = data.trigger
    this.FeatureType = NpcFeatureType.Reaction
  }

  // for v2 data or v3 data that has not offloaded this into action data
  public TriggerByTier(tier: number): string {
    if (!this.Trigger) return ''
    let fmt = this.Trigger
    const perTier = /(?:\{)?(\d+)\/(\d+)\/(\d+)(?:\})?/g
    const m = this.Trigger.match(perTier)
    if (m) {
      m.forEach(x => {
        if (tier) {
          const tArr = x.replace('{', '').replace('}', '').split('/')
          fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`)
        } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'))
      })
    }
    return fmt
  }

  public get Color(): string {
    return 'npc--reaction'
  }

  public get Icon(): string {
    return 'cc:reaction'
  }
}

export { NpcReaction }
export type { INpcReactionData }
