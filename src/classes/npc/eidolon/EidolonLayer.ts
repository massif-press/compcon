import { ContentPack } from '../../ContentPack'
import { ItemType } from '../../enums'
import { applyLcpTracking, type ILcpTracked } from '@/classes/LcpItemMixin'
import { INpcClassStats, NpcClassStats } from '../class/NpcClassStats'
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature'
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory'
import { EidolonShard, IEidolonShardData, layer_stats } from './EidolonShard'
import logger from '@/user/logger'
import { ByTier } from '@/util/tierFormat'
import { localize } from '@/i18n/localize'
import { eidolonTraitId } from '@/i18n/contentKeys'
import PersistentTraitData from './persistent_traits.json'
import CoreLayerData from './core_layer.json'

interface IEidolonLayerData {
  id: string
  name: string
  appearance: string
  hints: string
  rules: string
  stats?: Partial<INpcClassStats>
  features: INpcFeatureData[]
  shards: IEidolonShardData
}

const CORE_LAYER_ID = 'el_core'

class EidolonLayer implements ILcpTracked {
  public readonly ItemType: ItemType = ItemType.EidolonLayer
  public readonly Data: IEidolonLayerData
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly HpPerPlayer: number = 5
  public readonly HasOwnHp: boolean

  public readonly Features: NpcFeature[]
  public readonly Shards?: EidolonShard
  public readonly Stats: NpcClassStats

  public readonly Color: string = 'deep-purple'

  private _id: string
  private _name: string
  private _rules: string
  private _appearance: string
  private _hints: string

  public constructor(data: IEidolonLayerData, pack?: ContentPack) {
    this._id = data.id
    this.Data = data
    this._name = data.name
    this.Stats = new NpcClassStats({ ...layer_stats, ...data.stats } as INpcClassStats)
    this.HasOwnHp = data.stats?.hp !== undefined
    this._rules = data.rules
    applyLcpTracking(this, pack)

    this._appearance = data.appearance
    this._hints = data.hints

    if (!data.features || !Array.isArray(data.features)) {
      logger.error('EidolonLayer: Features data missing')
      data.features = []
    }

    this.Features = data.features.map(f => NpcFeatureFactory.Build(f, pack))
    if (data.shards) this.Shards = new EidolonShard(data.shards, pack, this._id)
    this.InLcp = true
  }

  public get ID(): string {
    return this._id
  }

  public get IsCore(): boolean {
    return this._id === CORE_LAYER_ID
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

  public get Rules(): string {
    return ByTier(localize(this._id, 'rules', this._rules))
  }

  public RulesByTier(tier: number): string {
    return ByTier(localize(this._id, 'rules', this._rules), tier)
  }

  public get ShardCount(): string {
    return this.Shards?.CountLabel() || '0'
  }

  public get Icon(): string {
    return 'mdi-layers-triple-outline'
  }
}

let core: EidolonLayer | undefined
function coreLayer(): EidolonLayer {
  if (!core) core = new EidolonLayer(structuredClone(CoreLayerData) as unknown as IEidolonLayerData)
  return core
}

function persistentTraits(): { name: string; detail: string }[] {
  return PersistentTraitData.map(t => ({
    name: localize(eidolonTraitId(t.name), 'name', t.name),
    detail: localize(eidolonTraitId(t.name), 'detail', t.detail),
  }))
}

export { EidolonLayer, persistentTraits, coreLayer, CORE_LAYER_ID }
export type { IEidolonLayerData }
