import { ContentPack } from '../../ContentPack'
import { ItemType } from '../../enums'
import { applyLcpTracking, type ILcpTracked } from '@/classes/LcpItemMixin'
import { NpcClassStats } from '../class/NpcClassStats'
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature'
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory'
import { EidolonShard, IEidolonShardData } from './EidolonShard'
import logger from '@/user/logger'
import { ByTier } from '@/util/tierFormat'
import { localize } from '@/i18n/localize'
import { eidolonTraitId } from '@/i18n/contentKeys'
import PersistentTraitData from './persistent_traits.json'

interface IEidolonLayerData {
  id: string
  name: string
  appearance: string
  hints: string
  rules: string
  features: INpcFeatureData[]
  shards: IEidolonShardData
}

const layer_stats = {
  hull: [1, 2, 3],
  agility: [1, 2, 3],
  systems: [1, 2, 3],
  engineering: [1, 2, 3],
  hp: [10, 15, 20],
  armor: 0,
  size: 2,
  heatcap: 10,
  evade: [10, 12, 14],
  edef: [10, 12, 14],
  save: [12, 14, 16],
  speed: 5,
  sensor: 20,
  activations: 1,
}

class EidolonLayer implements ILcpTracked {
  public readonly ItemType: ItemType = ItemType.EidolonLayer
  public readonly Data: IEidolonLayerData
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly HpPerPlayer: number = 5

  public readonly Features: NpcFeature[]
  public readonly Shards?: EidolonShard

  public readonly Color: string = 'deep-purple'

  private _id: string
  private _name: string
  private _rules: string
  private _appearance: string
  private _hints: string

  private _stats: NpcClassStats

  public static EidolonLayerBaseStats = layer_stats

  public constructor(data: IEidolonLayerData, pack?: ContentPack) {
    this._id = data.id
    this.Data = data
    this._name = data.name
    this._stats = new NpcClassStats(layer_stats)
    this._rules = data.rules
    applyLcpTracking(this, pack)

    this._appearance = data.appearance
    this._hints = data.hints

    if (!data.features || !Array.isArray(data.features)) {
      logger.error('EidolonLayer: Features data missing')
      data.features = []
    }

    this.Features = data.features.map(f => NpcFeatureFactory.Build(f, pack))
    if (data.shards) this.Shards = new EidolonShard(data.shards, pack, undefined, this._id)
    this.InLcp = true
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return localize(this._id, 'name', this._name)
  }

  public get Appearance(): string {
    return localize(this._id, 'appearance', this._appearance)
  }

  public get Hints(): string {
    return localize(this._id, 'hints', this._hints)
  }

  public get Stats(): NpcClassStats {
    return this._stats
  }

  public set Stats(stats: NpcClassStats) {
    this._stats = stats
  }

  public get Rules(): string {
    return ByTier(localize(this._id, 'rules', this._rules))
  }

  public RulesByTier(tier: number): string {
    return ByTier(localize(this._id, 'rules', this._rules), tier)
  }

  public get ShardCount(): string {
    return this.Shards?.CountString || '0'
  }

  public get Icon(): string {
    return 'mdi-layers-triple-outline'
  }
}

function persistentTraits(): { name: string; detail: string }[] {
  return PersistentTraitData.map(t => ({
    name: localize(eidolonTraitId(t.name), 'name', t.name),
    detail: localize(eidolonTraitId(t.name), 'detail', t.detail),
  }))
}

export { EidolonLayer, persistentTraits }
export type { IEidolonLayerData }
