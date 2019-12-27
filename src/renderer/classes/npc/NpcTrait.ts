import { NpcFeature, INpcFeatureData, NpcFeatureType } from './'

class NpcTrait extends NpcFeature {
  public constructor(data: INpcFeatureData) {
    super(data)
    this.type = NpcFeatureType.Trait
  }

  public get Color(): string {
    return 'primary'
  }
}

export default NpcTrait
