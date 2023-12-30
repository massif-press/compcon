import { NpcFeature, NpcFeatureType } from './'
import { INpcFeatureData } from './interfaces'

export interface INpcReactionData extends INpcFeatureData {
  trigger: string
  type: NpcFeatureType.Reaction
}

export class NpcReaction extends NpcFeature {
  private _trigger: string

  public constructor(data: INpcReactionData, packName?: string) {
    super(data, packName)
    this._trigger = data.trigger || ''
    this.type = NpcFeatureType.Reaction
  }

  public get Trigger(): string {
    return this._trigger
  }

  public generateSummary(tier: number): string {
    let output: string = ''
    if(this.Tags.length){
      output += this.Tags.map(
        (item) => 
          `${item.GetName()}`
      ).join(', ')
      output += '\n    '
    }
    
    output += `Trigger: ${this.Trigger}\n    `
    output += `Effect: ${this.EffectByTier(tier)}`
    return output
  }

  public get Color(): string {
    return 'npc--reaction'
  }

  public get Icon(): string {
    return 'cci-reaction'
  }
}
