import { ItemType } from '@/class';
import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';

interface INpcReactionData extends INpcFeatureData {
  trigger: string;
  detail: string;
  type: NpcFeatureType.Reaction;
}

class NpcReaction extends NpcFeature {
  public ItemType: ItemType = ItemType.NpcReaction;
  public FeatureType = NpcFeatureType.Reaction;

  public constructor(data: INpcReactionData, packName?: string) {
    super(data, packName);
  }

  public get Color(): string {
    return 'npc--reaction';
  }

  public get Icon(): string {
    return 'cc:reaction';
  }
}

export { NpcReaction };
export type { INpcReactionData };