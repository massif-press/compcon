import { NpcClass } from './'
import { store } from '@/store'
import _ from 'lodash'

interface INpcStats {
  activations: number
  armor: number
  hp: number
  evade: number
  edef: number
  heatcap: number
  speed: number
  sensor: number
  save: number
  hull: number
  agility: number
  systems: number
  engineering: number
  sizes: number[]
  size: number
  structure?: number
  stress?: number
  reactions?: string[]
  bonuses?: INpcStats
  overrides?: INpcStats
}

class NpcStats {
  private _stats: INpcStats
  private _bonuses: INpcStats
  private _overrides: INpcStats
  private _active: boolean

  public constructor(data: INpcStats, bonuses?: INpcStats, overrides?: INpcStats) {
    this._stats = data
    this._bonuses = bonuses || NpcStats.Empty()
    this._overrides = overrides || NpcStats.Empty()
  }

  public static Empty(): INpcStats {
    return {
      activations: 0,
      armor: 0,
      structure: 0,
      stress: 0,
      hp: 0,
      evade: 0,
      edef: 0,
      heatcap: 0,
      speed: 0,
      sensor: 0,
      save: 0,
      hull: 0,
      agility: 0,
      systems: 0,
      engineering: 0,
      sizes: [],
      size: 0,
      reactions: [],
    }
  }

  public static FromClass(npcClass: NpcClass, tier: number): NpcStats {
    const s = new NpcStats({
      activations: npcClass.Stats.Activations(tier),
      structure: npcClass.Stats.Structure(tier),
      stress: npcClass.Stats.Stress(tier),
      armor: npcClass.Stats.Armor(tier),
      hp: npcClass.Stats.HP(tier),
      evade: npcClass.Stats.Evade(tier),
      edef: npcClass.Stats.EDefense(tier),
      heatcap: npcClass.Stats.HeatCapacity(tier),
      speed: npcClass.Stats.Speed(tier),
      sensor: npcClass.Stats.Sensor(tier),
      save: npcClass.Stats.Save(tier),
      hull: npcClass.Stats.Hull(tier),
      agility: npcClass.Stats.Agility(tier),
      systems: npcClass.Stats.Systems(tier),
      engineering: npcClass.Stats.Engineering(tier),
      sizes: npcClass.Stats.Sizes(tier),
      size: npcClass.Stats.Sizes(tier)[0],
      reactions: ['Overwatch'],
      bonuses: NpcStats.Empty(),
      overrides: NpcStats.Empty(),
    })
    return s
  }

  public static FromMax(max: NpcStats): NpcStats {
    return new NpcStats({
      activations: max.Activations,
      armor: max.Armor,
      structure: max.Structure,
      stress: max.Stress,
      hp: max.HP,
      evade: max.Evade,
      edef: max.EDefense,
      heatcap: 0,
      speed: 0,
      sensor: max.Sensor,
      save: max.Save,
      hull: max.Hull,
      agility: max.Agility,
      systems: max.Systems,
      engineering: max.Engineering,
      sizes: max.Sizes,
      size: max.Size,
      reactions: ['Overwatch'],
      bonuses: NpcStats.Empty(),
      overrides: NpcStats.Empty(),
    })
  }

  public Reset(max: NpcStats): void {
    this._stats.activations = max.Stats.activations
    this._stats.structure = max.Stats.structure
    this._stats.stress = max.Stats.stress
    this._stats.armor = max.Stats.armor
    this._stats.hp = max.Stats.hp
    this._stats.evade = max.Stats.evade
    this._stats.edef = max.Stats.edef
    this._stats.heatcap = 0
    this._stats.speed = max.Stats.speed
    this._stats.sensor = max.Stats.sensor
    this._stats.save = max.Stats.save
    this._stats.hull = max.Stats.hull
    this._stats.agility = max.Stats.agility
    this._stats.systems = max.Stats.systems
    this._stats.engineering = max.Stats.engineering
    this._stats.sizes = max.Stats.sizes
    this._stats.size = max.Stats.size
    this._stats.reactions = ['Overwatch']
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
  }

  public ClearBonuses(): void {
    this._bonuses = NpcStats.Empty()
  }

  public get Bonuses(): INpcStats {
    return this._bonuses
  }

  public set Bonuses(val: INpcStats) {
    this._bonuses = val
  }

  public get Overrides(): INpcStats {
    return this._overrides
  }

  public set Overrides(val: INpcStats) {
    this._overrides = val
  }

  private save(): void {
    if (this.Active) store.dispatch('mission/saveActiveMissionData')
    else store.dispatch('npc/saveNpcData')
  }

  public get Stats(): INpcStats {
    return this._stats
  }

  public set Stats(val: INpcStats) {
    this._stats = val
  }

  public get Activations(): number {
    if (this._overrides.activations) return this._overrides.activations
    return this._stats.activations + this._bonuses.activations
  }

  public set Activations(val: number) {
    this._stats.activations = val
  }

  public get Armor(): number {
    if (this._overrides.armor) return this._overrides.armor
    return this._stats.armor + this._bonuses.armor
  }

  public set Armor(val: number) {
    this._stats.armor = val
    this.save()
  }

  public get HP(): number {
    if (this._overrides.hp) return this._overrides.hp
    return this._stats.hp + this._bonuses.hp
  }

  public set HP(val: number) {
    this._stats.hp = val
    this.save()
  }

  public get Evade(): number {
    if (this._overrides.evade) return this._overrides.evade
    return this._stats.evade + this._bonuses.evade
  }

  public set Evade(val: number) {
    this._stats.evade = val
    this.save()
  }

  public get EDefense(): number {
    if (this._overrides.edef) return this._overrides.edef
    return this._stats.edef + this._bonuses.edef
  }

  public set EDefense(val: number) {
    this._stats.edef = val
    this.save()
  }

  public get HeatCapacity(): number {
    if (this._overrides.heatcap) return this._overrides.heatcap
    return this._stats.heatcap + this._bonuses.heatcap
  }

  public set HeatCapacity(val: number) {
    this._stats.heatcap = val
    this.save()
  }

  public get Speed(): number {
    if (this._overrides.speed) return this._overrides.speed
    return this._stats.speed + this._bonuses.speed
  }

  public set Speed(val: number) {
    this._stats.speed = val
    this.save()
  }

  public get Sensor(): number {
    if (this._overrides.sensor) return this._overrides.sensor
    return this._stats.sensor + this._bonuses.sensor
  }

  public set Sensor(val: number) {
    this._stats.sensor = val
    this.save()
  }

  public get Save(): number {
    if (this._overrides.save) return this._overrides.save
    return this._stats.save + this._bonuses.save
  }

  public set Save(val: number) {
    this._stats.save = val
    this.save()
  }

  public get Hull(): number {
    if (this._overrides.hull) return this._overrides.hull
    return this._stats.hull + this._bonuses.hull
  }

  public set Hull(val: number) {
    this._stats.hull = val
    this.save()
  }

  public get Agility(): number {
    if (this._overrides.agility) return this._overrides.agility
    return this._stats.agility + this._bonuses.agility
  }

  public set Agility(val: number) {
    this._stats.agility = val
    this.save()
  }

  public get Systems(): number {
    if (this._overrides.systems) return this._overrides.systems
    return this._stats.systems + this._bonuses.systems
  }

  public set Systems(val: number) {
    this._stats.systems = val
    this.save()
  }

  public get Engineering(): number {
    if (this._overrides.engineering) return this._overrides.engineering
    return this._stats.engineering + this._bonuses.engineering
  }

  public set Engineering(val: number) {
    this._stats.engineering = val
    this.save()
  }

  public get Sizes(): number[] {
    return this._stats.sizes
  }

  public get Size(): number {
    if (this._overrides.size) return this._overrides.size
    return this._stats.size + this._bonuses.size
  }

  public set Size(val: number) {
    this._stats.size = val
    this.save()
  }

  public get Structure(): number {
    if (this._overrides.structure) return this._overrides.structure
    return this._stats.structure + this._bonuses.structure
  }

  public set Structure(val: number) {
    this._stats.structure = val
    this.save()
  }

  public get Stress(): number {
    if (this._overrides.stress) return this._overrides.stress
    return this._stats.stress + this._bonuses.stress
  }

  public set Stress(val: number) {
    this._stats.stress = val
    this.save()
  }

  public get Reactions(): string[] {
    return this._stats.reactions
  }

  public AddReaction(r: string): void {
    if (!this._stats.reactions.some(x => x === r)) {
      this._stats.reactions.push(r)
    }
    this.save()
  }

  public RemoveReaction(r: string): void {
    const idx = this._stats.reactions.findIndex(x => x === r)
    if (idx > -1) this._stats.reactions.splice(idx, 1)
    this.save()
  }

  public static Serialize(item: NpcStats): INpcStats {
    return {
      activations: item.Stats.activations,
      armor: item.Stats.armor,
      structure: item.Stats.structure,
      stress: item.Stats.stress,
      hp: item.Stats.hp,
      evade: item.Stats.evade,
      edef: item.Stats.edef,
      heatcap: item.Stats.heatcap,
      speed: item.Stats.speed,
      sensor: item.Stats.sensor,
      save: item.Stats.save,
      hull: item.Stats.hull,
      agility: item.Stats.agility,
      systems: item.Stats.systems,
      engineering: item.Stats.engineering,
      sizes: item.Stats.sizes,
      size: item.Stats.size,
      reactions: item.Stats.reactions,
      bonuses: item.Bonuses,
      overrides: item.Overrides,
    }
  }

  public static Deserialize(data: INpcStats): NpcStats {
    if (!data.reactions) data.reactions = ['Overwatch']
    return new NpcStats(_.clone(data))
  }
}

export { NpcStats, INpcStats }
