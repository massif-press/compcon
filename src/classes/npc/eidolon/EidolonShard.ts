import { INpcClassStats, NpcClassStats } from '../class/NpcClassStats'
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature'
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory'
import { ContentPack } from '../../ContentPack'
import { ActivationType, ItemType } from '../../enums'
import { applyLcpTracking, type ILcpTracked } from '@/classes/LcpItemMixin'
import { StatController } from '@/classes/components/combat/stats/StatController'
import type { IStatContainer } from '@/classes/components/combat/stats/IStatContainer'
import { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { localize } from '@/i18n/localize'
import { i18n } from '@/i18n'

interface IEidolonShardData {
  count: number | string | number[]
  detail: string
  stats?: Partial<INpcClassStats>
  destroyed_with_layer?: boolean
  features?: INpcFeatureData[]
}

const SHARD_TYPE = 'shard'
const PER_HOSTILE = 'hostile_characters'

const shard_stats = {
  hull: [1, 2, 3],
  agility: [1, 2, 3],
  systems: [1, 2, 3],
  engineering: [1, 2, 3],
  hp: [5, 6, 8],
  armor: 0,
  size: 0.5,
  heatcap: 5,
  evade: [10, 12, 14],
  edef: [10, 12, 14],
  save: [12, 14, 16],
  speed: 5,
  sensor: 20,
  activations: 1,
}

class EidolonShard implements ILcpTracked {
  public readonly ItemType: ItemType = ItemType.EidolonShard
  public LcpName: string = ''
  public InLcp: boolean = false

  public readonly Count: number | number[] | string
  public readonly DestroyedWithLayer: boolean
  public readonly Stats: NpcClassStats
  public readonly Features: NpcFeature[] = []
  private readonly _detail: string
  private readonly _layerId: string

  public constructor(data: IEidolonShardData, pack?: ContentPack, layerId: string = '') {
    applyLcpTracking(this, pack)

    this.Count = data.count
    this.DestroyedWithLayer = !!data.destroyed_with_layer
    this.Stats = new NpcClassStats({ ...shard_stats, ...data.stats } as INpcClassStats)
    this._detail = data.detail
    this._layerId = layerId
    if (data.features) this.Features = data.features.map(f => NpcFeatureFactory.Build(f, pack))

    this.InLcp = true
  }

  public get Detail(): string {
    return localize(this._layerId, 'shard_detail', this._detail)
  }

  public get CountString(): string {
    return this.CountLabel()
  }

  public CountLabel(tier?: number): string {
    if (this.Count === PER_HOSTILE) return i18n.global.t('gm.eidolon.shardsPerHostile')
    if (!Array.isArray(this.Count)) return String(this.Count)
    return tier ? String(this.Count[tier - 1]) : this.Count.join('/')
  }

  public CountFor(tier: number, hostileCount: number): number {
    if (this.Count === PER_HOSTILE) return hostileCount
    if (Array.isArray(this.Count)) return this.Count[tier - 1] ?? 0
    return Number(this.Count) || 0
  }

  public StatBlock(tier: number): IStatContainer {
    const block = {} as IStatContainer
    const { sizes, ...stats } = this.Stats.AllStats(tier)
    block.StatController = new StatController(block, true)
    block.StatController.setStats({ ...stats, size: sizes })
    return block
  }

  public Create(owner: CombatantData, layerName: string, tier: number): DeployableInstance {
    const stat = (key: string) => this.Stats.Stat(key, tier) as number
    return new DeployableInstance(
      {
        id: `${layerName} Shard`,
        name: `${layerName} Shard`,
        type: SHARD_TYPE,
        detail: this.Detail,
        description: this.Detail,
        activation: ActivationType.None,
        size: stat('sizes'),
        hp: stat('hp'),
        armor: stat('armor'),
        evasion: stat('evasion'),
        edef: stat('edef'),
        heatcap: stat('heatcap'),
        speed: stat('speed'),
        save: stat('saveTarget'),
        sensor_range: stat('sensorRange'),
      },
      owner
    )
  }
}

export { EidolonShard, SHARD_TYPE }
export type { IEidolonShardData }
