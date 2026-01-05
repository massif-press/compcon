import { StatController } from '@/classes/components/combat/stats/StatController';
import { NpcClassStats } from '../class/NpcClassStats';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { ActivationType, ContentPack, Deployable } from '@/class';
import { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance';
import { ICombatant } from '@/classes/components/combat/ICombatant';
import Activate from '@/assets/icons/svg/activate.vue';
import { CombatantData } from '@/classes/encounter/Encounter';

interface IEidolonShardData {
  count: number | string | number[];
  detail: string;
  features: INpcFeatureData[];
  tier?: number;
}

const shard_stats = {
  hull: [1, 2, 3],
  agility: [1, 2, 3],
  systems: [1, 2, 3],
  engineering: [1, 2, 3],
  hp: [5, 6, 8],
  armor: [0, 0, 0],
  size: [0.5, 0.5, 0.5],
  heatcap: [5, 5, 5],
  evade: [10, 12, 14],
  edef: [10, 12, 14],
  save: [12, 14, 16],
  speed: [5, 5, 5],
  sensor: [20, 20, 20],
  activations: [1, 1, 1],
};

class EidolonShard {
  public readonly ItemType = 'EidolonShard';
  public readonly LcpName: string;
  public readonly InLcp: boolean;

  public readonly Count: number | number[] | string;
  public readonly Detail: string;
  public readonly Features: NpcFeature[] = [];

  public StatController: StatController;

  public MandatoryStats: string[] = [];

  public _tier: number = 1;

  public static EidolonShardBaseStats = shard_stats;

  public IsEncounterInstance = false;

  public constructor(data: IEidolonShardData, pack?: ContentPack, tier?: number) {
    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;

    this.Count = data.count;
    this.Detail = data.detail;
    if (data.features) this.Features = data.features.map((f) => NpcFeatureFactory.Build(f));
    this._tier = tier || 1;

    this.StatController = new StatController(this as any);

    this.setStats();

    this.InLcp = true;
  }

  private setStats() {
    const tierStats = {};
    for (const key in shard_stats) {
      tierStats[key] = shard_stats[key][this._tier! - 1];
    }

    this.StatController.setStats(tierStats);
  }

  public get Tier(): number {
    return this._tier;
  }

  public set Tier(tier: number) {
    this._tier = tier;
    this.setStats();
  }

  public get Stats(): NpcClassStats {
    return this.StatController.MaxStats;
  }

  public get CountString(): string {
    if (this.Count === 'hostile_characters') return '# of Hostile Mechs';
    if (Array.isArray(this.Count)) return this.Count.join('/');
    return this.Count as string;
  }

  public Create(owner: CombatantData, layerName: string): DeployableInstance {
    const deployableData = {
      name: `${layerName} Shard`,
      type: 'shard',
      detail: this.Detail,
      activation: ActivationType.Free,
      size: 1,
      id: `${layerName} Shard`,
      description: this.Detail,
    };
    const deployable = new DeployableInstance(deployableData, owner);
    deployable.SetStats();

    return deployable;
  }
}

export { EidolonShard };
export type { IEidolonShardData };
