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

  public constructor(data: INpcTechData) {
    super(data)
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

  public get Color(): string {
    return 'npc--tech'
  }

  public get Icon(): string {
    return 'mdi-chart-donut-variant'
  }
}
