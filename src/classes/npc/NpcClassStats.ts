export interface INpcClassStats {
  activations: number[]
  armor: number[]
  hp: number[]
  evade: number[]
  edef: number[]
  heatcap: number[]
  speed: number[]
  sensor: number[]
  save: number[]
  hull: number[]
  agility: number[]
  systems: number[]
  engineering: number[]
  size: number[]
  structure?: number[]
  stress?: number[]
}

export class NpcClassStats {
  private _stats: INpcClassStats

  public constructor(data: INpcClassStats) {
    this._stats = data
  }

  public Activations(tier: number): number {
    return this._stats.activations[tier - 1]
  }

  public Armor(tier: number): number {
    return this._stats.armor[tier - 1]
  }

  public HP(tier: number): number {
    return this._stats.hp[tier - 1]
  }

  public Evade(tier: number): number {
    return this._stats.evade[tier - 1]
  }

  public EDefense(tier: number): number {
    return this._stats.edef[tier - 1]
  }

  public HeatCapacity(tier: number): number {
    return this._stats.heatcap[tier - 1]
  }

  public Speed(tier: number): number {
    return this._stats.speed[tier - 1]
  }

  public Sensor(tier: number): number {
    return this._stats.sensor[tier - 1]
  }

  public Save(tier: number): number {
    return this._stats.save[tier - 1]
  }

  public Hull(tier: number): number {
    return this._stats.hull[tier - 1]
  }

  public Agility(tier: number): number {
    return this._stats.agility[tier - 1]
  }

  public Systems(tier: number): number {
    return this._stats.systems[tier - 1]
  }

  public Engineering(tier: number): number {
    return this._stats.engineering[tier - 1]
  }

  public Size(tier: number): number {
    return this._stats.size[tier - 1]
  }

  public Structure(tier: number): number {
    return this._stats.structure ? this._stats.structure[tier - 1] : 1
  }

  public Stress(tier: number): number {
    return this._stats.stress ? this._stats.stress[tier - 1] : 1
  }
}
