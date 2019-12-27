import { Tag } from '@/class'
import { INpcFeatureData, NpcFeature, NpcFeatureType } from './'

interface INpcSystemData extends INpcFeatureData {
  tags: ITagData[]
}

class NpcSystem extends NpcFeature {
  private _tags: ITagData[]

  public constructor(data: INpcSystemData) {
    super(data)
    this._tags = data.tags
    this.type = NpcFeatureType.System
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get Color(): string {
    return 'system'
  }
}

export { INpcSystemData, NpcSystem }
