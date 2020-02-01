import { Tag } from '@/class'
import { NpcFeature, NpcFeatureType } from './'
import { INpcFeatureData } from './interfaces'

export interface INpcSystemData extends INpcFeatureData {
  tags: ITagData[]
  type: NpcFeatureType.System
}

export class NpcSystem extends NpcFeature {
  private _tags: ITagData[]

  public constructor(data: INpcSystemData) {
    super(data)
    this._tags = data.tags
    this.type = NpcFeatureType.System
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
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

  public get Color(): string {
    return 'system'
  }
}
