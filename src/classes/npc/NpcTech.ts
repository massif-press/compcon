import { NpcFeature, NpcFeatureType } from '.'
import { INpcFeatureData } from './interfaces'

export interface INpcTechData extends INpcFeatureData {
  tags: ITagData[]
  tech_type: string
  accuracy?: number[]
  attack_bonus?: number[]
  type: NpcFeatureType.Tech
}

export class NpcTech extends NpcFeature {
  private _tech_type: string
  private _accuracy: number[]
  private _attack_bonus: number[]

  public constructor(data: INpcTechData, packName?: string) {
    super(data, packName)
    this._tech_type = data.tech_type
    this._accuracy = data.accuracy || [0, 0, 0]
    this._attack_bonus = data.attack_bonus || [0, 0, 0]
    this.type = NpcFeatureType.Tech
  }

  public get IsLimited(): boolean {
    return this.Tags.some(x => x.IsLimited)
  }

  public get IsRecharging(): boolean {
    return this.Tags.some(x => x.IsRecharging)
  }

  public get ChargeRoll(): string {
    return this.Tags.find(x => x.IsRecharging).Value.toString()
  }

  public get TechType(): string {
    return this._tech_type
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1]
  }

  public AttackBonus(tier: number): number {
    return this._attack_bonus[tier - 1]
  }
  
  public AttackSummary(tier: number): String {
    let output: String = ''
    if(this.AttackBonus(tier)<=0) {
      output += `${this.AttackBonus(tier)}`
    } else {
      output += `+${this.AttackBonus(tier)}`
    }
    if(this.Accuracy(tier)<0) {
      output += `, ${this.Accuracy(tier)} DIF`
    } else if(this.Accuracy(tier)>0) {
      output += `, ${this.Accuracy(tier)} ACC`
    }
    return output
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

    output += `Attack Bonus: ${this.AttackSummary(tier)}`

    if(this.EffectByTier(tier)){
      output += `\n    ${this.EffectByTier(tier)}`
    }
    return output
  }
  
  public get Color(): string {
    return 'npc--tech'
  }

  public get Icon(): string {
    return 'mdi-chart-donut-variant'
  }
}
