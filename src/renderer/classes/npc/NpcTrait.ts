import { NpcFeature, INpcFeatureData, NpcFeatureType } from './'

class NpcTrait extends NpcFeature {
  public constructor(data: INpcFeatureData) {
    super(data)
    this.type = NpcFeatureType.Trait
  }
}

export default NpcTrait
