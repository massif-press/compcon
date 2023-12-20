import { INpcFeatureData, NpcFeatureType, NpcFeature } from '../NpcFeature';

interface INpcReactionData extends INpcFeatureData {
  trigger: string;
  type: NpcFeatureType.Reaction;
}

class NpcReaction {
  // extends NpcFeature {
  private _trigger: string;

  public constructor(data: INpcReactionData, packName?: string) {
    // super(data, packName);
    this._trigger = data.trigger || '';
    // this.type = NpcFeatureType.Reaction;
  }

  public get Trigger(): string {
    return this._trigger;
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
