import { NpcClass } from './'
import { store } from '@/store'
import _ from 'lodash'

export interface INpcStats {
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
}

export class NpcStats {
  private _stats: INpcStats
  private _active: boolean

  public constructor(data: INpcStats) {
    this._stats = data
  }

  public static FromClass(npcClass: NpcClass, tier: number): NpcStats {
    return new NpcStats({
      activations: npcClass.Stats.Activations(tier),
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
      structure: npcClass.Stats.Structure(tier),
      stress: npcClass.Stats.Stress(tier),
      reactions: ['Overwatch'],
    })
  }

  public static FromMax(max: NpcStats): NpcStats {
    return new NpcStats({
      activations: max.Activations,
      armor: max.Armor,
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
      structure: max.Structure,
      stress: max.Stress,
      reactions: ['Overwatch'],
    })
  }

  public Reset(max: NpcStats): void {
    this._stats.activations = max.Stats.activations
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
    this._stats.structure = max.Stats.structure
    this._stats.stress = max.Stats.stress
    this._stats.reactions = ['Overwatch']
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
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
    return this._stats.activations
  }

  public set Activations(val: number) {
    this._stats.activations = val
  }

  public get Armor(): number {
    return this._stats.armor
  }

  public set Armor(val: number) {
    this._stats.armor = val
    this.save()
  }

  public get HP(): number {
    return this._stats.hp
  }

  public set HP(val: number) {
    this._stats.hp = val
    this.save()
  }

  public get Evade(): number {
    return this._stats.evade
  }

  public set Evade(val: number) {
    this._stats.evade = val
    this.save()
  }

  public get EDefense(): number {
    return this._stats.edef
  }

  public set EDefense(val: number) {
    this._stats.edef = val
    this.save()
  }

  public get HeatCapacity(): number {
    return this._stats.heatcap
  }

  public set HeatCapacity(val: number) {
    this._stats.heatcap = val
    this.save()
  }

  public get Speed(): number {
    return this._stats.speed
  }

  public set Speed(val: number) {
    this._stats.speed = val
    this.save()
  }

  public get Sensor(): number {
    return this._stats.sensor
  }

  public set Sensor(val: number) {
    this._stats.sensor = val
    this.save()
  }

  public get Save(): number {
    return this._stats.save
  }

  public set Save(val: number) {
    this._stats.save = val
    this.save()
  }

  public get Hull(): number {
    return this._stats.hull
  }

  public set Hull(val: number) {
    this._stats.hull = val
    this.save()
  }

  public get Agility(): number {
    return this._stats.agility
  }

  public set Agility(val: number) {
    this._stats.agility = val
    this.save()
  }

  public get Systems(): number {
    return this._stats.systems
  }

  public set Systems(val: number) {
    this._stats.systems = val
    this.save()
  }

  public get Engineering(): number {
    return this._stats.engineering
  }

  public set Engineering(val: number) {
    this._stats.engineering = val
    this.save()
  }

  public get Sizes(): number[] {
    return this._stats.sizes
  }

  public get Size(): number {
    return this._stats.size
  }

  public set Size(val: number) {
    this._stats.size = val
    this.save()
  }

  public get Structure(): number {
    return this._stats.structure
  }

  public set Structure(val: number) {
    this._stats.structure = val
    this.save()
  }

  public get Stress(): number {
    return this._stats.stress
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
      structure: item.Stats.structure,
      stress: item.Stats.stress,
      reactions: item.Stats.reactions,
    }
  }

  public static Deserialize(data: INpcStats): NpcStats {
    if (!data.reactions) data.reactions = ['Overwatch']
    return new NpcStats(_.clone(data))
  }
}
