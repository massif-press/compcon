import * as _ from 'lodash-es'
import { markRaw } from 'vue'
import { IStatContainer } from './IStatContainer'
import { Stats, StatKey } from './Stats'
import { Rules } from '@/classes/utility/Rules'

interface ICustomStatData {
  key: string
  title: string
  trackable: boolean
  default?: number | string
  icon?: string
  sort?: number
}

interface IStatData {
  max: any
  current: any
  stat_version?: number
}

const CURRENT_STAT_VERSION = 1

const MandatoryStats: string[] = [
  StatKey.ACTIVATIONS,
  StatKey.SIZE,
  StatKey.SIZES,
  StatKey.STRUCTURE,
  StatKey.HULL,
  StatKey.AGI,
  StatKey.SYS,
  StatKey.ENG,
  StatKey.HP,
  StatKey.ARMOR,
  StatKey.STRESS,
  StatKey.HEAT,
  StatKey.SPEED,
  StatKey.EVASION,
  StatKey.EDEF,
  StatKey.SENSOR_RANGE,
  StatKey.SAVE_TARGET,
  StatKey.OVERSHIELD,
  StatKey.OVERCHARGE,
  StatKey.BURN,
]

const TrackableStatKeys = new Set<string>([
  StatKey.HP,
  StatKey.STRESS,
  StatKey.HEATCAP,
  StatKey.STRUCTURE,
  StatKey.REPAIR_CAPACITY,
  StatKey.OVERCHARGE,
  StatKey.OVERSHIELD,
  StatKey.ACTIVATIONS,
  StatKey.BURN,
  StatKey.SPEED,
])

class StatController {
  public readonly IsEncounterInstance: boolean
  public Parent: IStatContainer

  private _maxStats: Record<string, any> = {}
  private _currentStats: Record<string, any> = {}
  private _statFloors: Record<string, number> = markRaw({})
  private _customTrackable = new Set<string>()

  private static _customStatRegistry: Map<string, ICustomStatData> = new Map()

  public static RegisterCustomStat(data: ICustomStatData): void {
    StatController._customStatRegistry.set(data.key, data)
    if (data.icon) Stats.IconMap[data.key] = data.icon
    if (data.sort != null) Stats.SortMap[data.key] = data.sort
  }

  public static ClearCustomStats(): void {
    for (const key of StatController._customStatRegistry.keys()) {
      delete Stats.IconMap[key]
      delete Stats.SortMap[key]
    }
    StatController._customStatRegistry.clear()
  }

  // resolves a tiered default to a number given a tier index (0-based).
  // accepts a number (used as-is), a string 'x/y/z' (picks by tier), or undefined (returns 0).
  // non-NPC parents always receive tier index 0.
  public static resolveDefault(def: number | string | undefined, tierIndex: number): number {
    if (def === undefined) return 0
    if (typeof def === 'number') return def
    const parts = def.split('/').map(Number)
    return parts[Math.min(tierIndex, parts.length - 1)] ?? 0
  }

  public applyRegisteredCustomStats(): void {
    const tier: number = (this.Parent as any).NpcClassController?.Tier ?? 1
    const tierIndex = Math.max(0, tier - 1)
    for (const [key, data] of StatController._customStatRegistry) {
      if (!(key in this._maxStats)) {
        const val = StatController.resolveDefault(data.default, tierIndex)
        this._maxStats[key] = val
        this._currentStats[key] = val
        if (data.trackable) this._customTrackable.add(key)
      }
    }
  }

  public constructor(parent: IStatContainer, isEncounterInstance = false) {
    this.IsEncounterInstance = isEncounterInstance

    for (const key of MandatoryStats) {
      this._maxStats[key] = Stats.DefaultStats[key]
    }
    if (parent.AdditionalStats) {
      for (const key of parent.AdditionalStats) {
        this._maxStats[key] = Stats.DefaultStats[key] ?? 0
      }
    }
    this._currentStats = { ...this._maxStats }

    this.Parent = parent
  }

  public save() {
    // instances within encounters should only be saved as part of the encounterInstance serialization process
    // falling back to saveController will create duplicate parents
    if (this.IsEncounterInstance || (this.Parent as any).IsEncounterInstance) return
    this.Parent.SaveController.save()
  }

  public setStats(stats: any) {
    this._maxStats = stats
  }

  public get DisplayKeys(): { key: string; title: string; type: string }[] {
    return Object.keys(this._maxStats)
      .filter(x => x.toLowerCase() !== 'sizes')
      .filter(x => this._maxStats[x] !== undefined && this._maxStats[x] !== null && (this._maxStats[x] !== 0 || MandatoryStats.includes(x)))
      .map(key => ({
        key,
        title: Stats.expandKey(key),
        type: StatController.getKeyType(key),
        icon: Stats.IconMap[key] || 'mdi-flask-empty-outline',
        sort: Stats.SortMap[key] || 100,
      }))
  }

  public isTrackable(key: string): boolean {
    return TrackableStatKeys.has(key) || this._customTrackable.has(key)
  }

  public get TrackableStats(): { key: string; title: string; type: string }[] {
    return this.DisplayKeys.filter(x => this.isTrackable(x.key))
  }

  public get NonTrackableStats(): { key: string; title: string; type: string }[] {
    return this.DisplayKeys.filter(x => !this.isTrackable(x.key))
  }

  public GetStatCollection(keys: string[]): { key: string; title: string; type: string }[] {
    return this.DisplayKeys.filter(x => keys.includes(x.key))
  }

  public CustomStats(itemType: string): { key: string; title: string; type: string }[] {
    const hiddenStats = {
      mech: ['limitedbonus', 'attack', 'sp', 'attackbonus'],
      Drone: ['resist'],
      Deployable: ['resist'],
    }
    return this.DisplayKeys.filter(
      x =>
        !Object.keys(Stats.IconMap).includes(x.key) &&
        !this.Parent.AdditionalStats?.includes(x.key) &&
        !hiddenStats[itemType]?.includes(x.key.toLowerCase())
    )
  }

  public static get CoreStats(): { key: string; title: string; type: string }[] {
    return Object.keys(Stats.DefaultStats).map(key => ({
      key,
      title: Stats.expandKey(key),
      type: this.getKeyType(key),
    }))
  }

  public StatSelections(key: string) {
    if (key === StatKey.SIZE) {
      let sizes = this.getMax(StatKey.SIZES) as number | number[]
      if (!Array.isArray(sizes)) sizes = [sizes]
      return sizes
    }
    return []
  }

  private static getKeyType(key: string): string {
    switch (key.toLowerCase()) {
      case 'sizes':
        return 'array'
      default:
        return 'number'
    }
  }

  public AddCoreStat(key: string): void {
    this._maxStats[key] = Stats.DefaultStats[key]
    this._currentStats[key] = Stats.DefaultStats[key]
    this.save()
  }

  public AddCustomStat(title: string, isTrackable = true): void {
    const key = Stats.cleanKey(_.camelCase(title))
    this._maxStats[key] = 0
    this._currentStats[key] = 0
    if (isTrackable) this._customTrackable.add(key)
    this.save()
  }

  public RemoveStat(key: string): void {
    if (MandatoryStats.includes(key) || this.Parent.AdditionalStats?.includes(key)) return
    delete this._maxStats[key]
    this._customTrackable.delete(key)
    this.save()
  }

  public get MaxStats(): any {
    return this._maxStats
  }

  public set MaxStats(val: any) {
    this._maxStats = val
  }

  public get CurrentStats(): any {
    return this._currentStats
  }

  public set CurrentStats(val: any) {
    this._currentStats = val
  }

  public getStatArray(stat: string): number {
    return this[Stats.cleanKey(stat)]
  }

  public getMax(stat: string): any {
    return this._maxStats[Stats.cleanKey(stat)]
  }

  /** @deprecated Use getMax() instead */
  public getStat(stat: string): any {
    return this.getMax(stat)
  }

  public getCurrent(stat: string): any {
    return this._currentStats[Stats.cleanKey(stat)]
  }

  public setCurrentStat(stat: string, val: number): void {
    const k = Stats.cleanKey(stat)
    this._currentStats[k] = Math.max(val, this._statFloors[k] ?? -Infinity)
  }

  public setFloor(key: string, val: number): void {
    this._statFloors[Stats.cleanKey(key)] = val
  }

  public clearFloor(key: string): void {
    delete this._statFloors[Stats.cleanKey(key)]
  }

  public setMax(stat: string, val: any) {
    this._maxStats[Stats.cleanKey(stat)] = val
  }

  public resetCurrentStats() {
    this._currentStats = { ...this._maxStats }
    this._currentStats[StatKey.HEATCAP] = 0
  }

  public get SizeIcon(): string {
    const size = this.getMax(StatKey.SIZE)
    if (!size) return 'cc:size_1'
    return Rules.SizeIcon(size)
  }

  public static Serialize(parent: IStatContainer, target: any) {
    if (!target.stats) target.stats = {}
    target.max = parent.StatController._maxStats
    target.current = parent.StatController._currentStats
    target.stat_version = CURRENT_STAT_VERSION
  }

  public static Deserialize(parent: IStatContainer, data: IStatData) {
    if (!parent.StatController)
      throw new Error(
        `StatController not found on parent (${typeof parent}). New StatControllers must be instantiated in the parent's constructor method.`
      )

    // Recompute max from SetStats() and reset rather than trusting the saved max.
    if (!data.stat_version) {
      parent.Parent?.SetStats?.()
      parent.StatController.resetCurrentStats()
      return
    }

    if (data.max) parent.StatController._maxStats = data.max
    if (data.current && Object.keys(data.current).length) {
      parent.StatController._currentStats = data.current
      for (const key of MandatoryStats) {
        if (!(key in parent.StatController._currentStats)) {
          parent.StatController._currentStats[key] =
            Stats.DefaultStats[key] ?? parent.StatController._maxStats[key] ?? 0
        }
      }
    } else {
      parent.Parent.SetStats()
      parent.StatController.resetCurrentStats()
    }
  }
}

export { StatController, MandatoryStats }
export type { IStatData, ICustomStatData }
