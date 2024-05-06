import { ContentPack, ItemType } from '@/class';
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';

interface INpcReactionData extends INpcFeatureData {
  trigger: string;
  detail: string;
  type: NpcFeatureType.Reaction;
}

class NpcReaction extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcReaction;

  public constructor(data: INpcReactionData, pack?: ContentPack) {
    super(data, pack);
    this.FeatureType = NpcFeatureType.Reaction;
  }

  public get Color(): string {
    return 'reaction';
  }

  public get Icon(): string {
    return 'cc:reaction';
  }
}

export { NpcReaction };
export type { INpcReactionData };
