import { Tag } from '@/class'
import { NpcFeature, NpcFeatureType } from '.'
import { INpcFeatureData } from './interfaces'

export interface INpcTechData extends INpcFeatureData {
  tags: ITagData[]
  tech_type: string
  accuracy: number[]
  type: NpcFeatureType.Tech
}

export class NpcTech extends NpcFeature {
  private _tags: ITagData[]
  private _tech_type: string
  private _accuracy: number[]

  public constructor(data: INpcTechData) {
    super(data)
    this._tags = data.tags
    this._tech_type = data.tech_type
    this._accuracy = data.accuracy
    this.type = NpcFeatureType.Tech
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get TechType(): string {
    return this._tech_type
  }

  public Accuracy(tier: number): number {
    return this._accuracy[tier - 1]
  }

  public get Color(): string {
    return 'frame'
  }
}
