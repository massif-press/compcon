import { ContentPack } from '@/class';
import { NpcClassStats } from '../class/NpcClassStats';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory';
import { EidolonShard, IEidolonShardData } from './EidolonShard';

interface IEidolonLayerData {
  id: string;
  name: string;
  appearance: string;
  hints: string;
  rules: string;
  features: INpcFeatureData[];
  shards: IEidolonShardData;
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
};

class EidolonLayer {
  public readonly ItemType = 'EidolonLayer';
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly HpPerPlayer: number = 5;

  public readonly Appearance: string;
  public readonly Hints: string;
  public readonly Features: NpcFeature[];
  public readonly Shards: EidolonShard;

  public readonly Color: string = 'deep-purple';

  private _id: string;
  private _name: string;
  private _rules: string;

  private _stats: NpcClassStats;

  public static EidolonLayerBaseStats = layer_stats;

  public constructor(data: IEidolonLayerData, pack?: ContentPack) {
    this._id = data.id;
    this._name = data.name;
    this._stats = new NpcClassStats(layer_stats);
    this._rules = data.rules;
    this.LcpName = pack?.Name || 'LANCER Core Book';
    this.InLcp = !!pack;

    this.Appearance = data.appearance;
    this.Hints = data.hints;

    this.Features = data.features.map((f) => NpcFeatureFactory.Build(f));
    this.Shards = new EidolonShard(data.shards);
    this.InLcp = true;
  }

  public get ID(): string {
    return this._id;
  }

  public get Name(): string {
    return this._name;
  }

  public get Stats(): NpcClassStats {
    return this._stats;
  }

  public get Rules(): string {
    if (!this._rules) return '';
    let out = this._rules;
    const perTier = /(\{.*?\})/gi;
    const matches = out.match(perTier);
    if (matches) {
      matches.forEach((m) => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return out;
  }

  public RulesByTier(tier: number): string {
    if (!this._rules) return '';
    let fmt = this._rules;
    const perTier = /(\{.*?\})/g;
    const m = this._rules.match(perTier);
    if (m) {
      m.forEach((x) => {
        if (tier) {
          const tArr = x.replace('{', '').replace('}', '').split('/');
          fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`);
        } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return fmt;
  }

  //TODO: passthrough for datatable until bug gets fixed
  public get ShardCount(): string {
    return this.Shards.CountString;
  }
}

export { EidolonLayer };
export type { IEidolonLayerData };
