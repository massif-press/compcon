import { NpcClassStats } from '../class/NpcClassStats';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory';

interface IEidolonShardData {
  count: number | string;
  detail: string;
  features: INpcFeatureData[];
}

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
};

class EidolonShard {
  public readonly ItemType = 'EidolonShard';
  public readonly LcpName: string;
  public readonly InLcp: boolean;

  public readonly Count: number | number[] | string;
  public readonly Detail: string;
  public readonly Features: NpcFeature[] = [];

  private _stats: NpcClassStats;

  public static EidolonShardBaseStats = shard_stats;

  public constructor(data: IEidolonShardData, packName?: string) {
    this._stats = new NpcClassStats(shard_stats);
    this.LcpName = packName || 'Lancer CORE NPCs';

    this.Count = data.count;
    this.Detail = data.detail;
    if (data.features) this.Features = data.features.map((f) => NpcFeatureFactory.Build(f));

    this.InLcp = true;
  }

  public get Stats(): NpcClassStats {
    return this._stats;
  }

  public get CountString(): string {
    if (this.Count === 'hostile_characters') return '# of Hostile Mechs';
    if (Array.isArray(this.Count)) return this.Count.join('/');
    return this.Count as string;
  }
}

export { EidolonShard };
export type { IEidolonShardData };
