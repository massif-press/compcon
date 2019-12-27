import { INpcFeatureData, NpcFeature, NpcFeatureType } from './'

interface INpcReactionData extends INpcFeatureData {
  trigger: string
}

class NpcReaction extends NpcFeature {
  private _trigger: string

  public constructor(data: INpcReactionData) {
    super(data)
    this._trigger = data.trigger
    this.type = NpcFeatureType.Reaction
  }

  public get Trigger(): string {
    return this._trigger
  }

  public get Color(): string {
    return 'action--reaction'
  }
}

export { INpcReactionData, NpcReaction }
