import type { IControllerStatic } from '@/classes/ISerializable'
import { INpcClassData, NpcClass } from './NpcClass'
import { CompendiumStore } from '@/features/compendium/store'
import { Unit } from '../unit/Unit'
import { Stats } from '@/classes/components/combat/stats/Stats'
import { StatController } from '@/classes/components/combat/stats/StatController'
import { assertController } from '../../utility/assertController'

interface INpcClassSaveData {
  class: { id: string; data: INpcClassData }
  tier: number
}

class NpcClassController {
  public readonly Parent: Unit
  private _class: NpcClass | null
  private _tier: number

  public constructor(parent: Unit) {
    this.Parent = parent

    this._class = null
    this._tier = 1
  }

  public get HasClass(): boolean {
    return !!this._class?.ID
  }

  public get Class(): NpcClass | null {
    return this._class
  }

  public get Tier(): number {
    return this._tier
  }

  public getClassStats(): any {
    const c = this.Class as NpcClass
    const kvps = [] as { key: string; val: number }[]

    const allStats = Object.keys({
      ...this.Parent.StatController.MaxStats,
      ...Stats.DefaultStats,
    })

    allStats.forEach(key => {
      const tieredDef = Stats.TieredDefaults[key]
      const fallback = tieredDef
        ? StatController.resolveDefault(tieredDef, this.Tier - 1)
        : (Stats.DefaultStats[key] ?? 0)
      let statVal = c?.Stats.Stat(key, this.Tier) ?? fallback
      if (key === 'size') {
        const sizeVal = c?.Stats.Stat('sizes', this.Tier) || c?.Stats.Stat('size', this.Tier) || 1
        statVal = Array.isArray(sizeVal) ? sizeVal[0] : sizeVal
      }
      kvps.push({ key, val: statVal })

      // this.Parent.StatController.setMax(key, statVal);
    })
    kvps.push({ key: 'burn', val: 0 })
    // let sizes = c?.Stats.Stat('sizes', this.Tier) || 1;
    // if (!Array.isArray(sizes)) sizes = [sizes];
    // this.Parent.StatController.setMax('size', sizes[0]);
    return kvps
  }

  public get ChangedStats(): any {
    if (!this.HasClass) return

    const c = this.Class as NpcClass

    const changedStats = {}
    this.Parent.CombatController.StatController.MaxStats.forEach(key => {
      if (key === 'size' || key === 'sizes') return
      if (
        this.Parent.CombatController.StatController.getMax(key) !== c.Stats.Stat(key, this.Tier)
      ) {
        changedStats[key] = c.Stats.Stat(key, this.Tier)
      }
    })
    return changedStats
  }

  public ResetStats() {
    this.Parent.SetStats()
    this.Parent.save()
  }

  public set Tier(newTier: number) {
    this._tier = newTier

    this.ResetStats()
    this.Parent.save()
  }

  public SetClass(npcClass: NpcClass | null, tier: number) {
    if (!npcClass) {
      this._class = null
      this.Parent.NpcFeatureController.ResetFeatures()
      return
    }
    if (!this.HasClass) this.Parent.Tag = 'Mech'
    if (npcClass.Role.toLowerCase() === 'biological') this.Parent.Tag = 'Biological'
    if (npcClass.ForceTag) this.Parent.Tag = npcClass.ForceTag
    this._class = npcClass
    this.Tier = tier
    this.Parent.NpcFeatureController.ResetFeatures()
    this.Parent.save()
  }

  public static Serialize(parent: Unit, target: any) {
    target.class = {
      id: parent.NpcClassController.Class?.ID || '',
      data: parent.NpcClassController.Class?.Data || {},
    }
    target.tier = parent.NpcClassController.Tier
  }

  public static Deserialize(parent: Unit, data: INpcClassSaveData) {
    assertController(parent.NpcClassController, 'NpcClassController')

    let id
    try {
      id = typeof data.class === 'string' ? data.class : data.class.id
    } catch (e) {
      console.error(e)
    }

    parent.NpcClassController._class = CompendiumStore().has('NpcClasses', id)
      ? CompendiumStore().referenceByID('NpcClasses', id) as unknown as NpcClass
      : data?.class?.data && Object.keys(data.class.data).length
        ? new NpcClass(data.class.data)
        : null

    parent.NpcClassController._tier = data.tier
  }
}

const _checkController: IControllerStatic<Unit, INpcClassSaveData> = NpcClassController
export { NpcClassController }
export type { INpcClassSaveData }
