import { NpcFeature, NpcFeatureType } from './'
import { INpcFeatureData } from './interfaces'

export interface INpcReactionData extends INpcFeatureData {
  trigger: string
  type: NpcFeatureType.Reaction
}

export class NpcReaction extends NpcFeature {
  private _trigger: string

  public constructor(data: INpcReactionData) {
    super(data)
    this._trigger = data.trigger || ''
    this.type = NpcFeatureType.Reaction
  }

  public get Trigger(): string {
    return this._trigger
  }

  public get Color(): string {
    return 'npc--reaction'
  }

  public get Icon(): string {
    return 'cci-reaction'
  }
}
