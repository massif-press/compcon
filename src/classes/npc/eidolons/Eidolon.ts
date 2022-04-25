import { EidolonLayer } from './EidolonLayer'
import { EidolonShard } from './EidolonShard'

class EidolonData {}

class Eidolon {
  public Layers: EidolonLayer[]
  public ActiveLayerIndex: 0
  public ActiveShards: EidolonShard[]

  public get ActiveLayer(): EidolonLayer {
    return this.Layers[this.ActiveLayerIndex]
  }
}

export { Eidolon, EidolonData }
