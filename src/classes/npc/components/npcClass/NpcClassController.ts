import { Npc } from '../../Npc'
import { NpcStats } from '../../NpcStats'
import { NpcClass } from './NpcClass'
import { NpcStore, store } from '@/store'

interface INpcClassSaveData {
  class: string
  tier: number
}

class NpcClassController {
  public readonly Parent: Npc
  private _class: NpcClass
  private _tier: number

  public constructor(parent: Npc) {
    this.Parent = parent
    this._class = null
    this._tier = 1
  }

  public get Class(): NpcClass {
    return this._class
  }

  public get Tier(): number {
    return this._tier
  }

  public set Tier(newTier: number) {
    this._tier = newTier
    this.Parent.Stats = NpcStats.FromClass(this.Class, newTier)
    this.Parent.Items.forEach(i => {
      i.Tier = newTier
    })
    this.Parent.RecalcBonuses()
    this.Parent.SaveController.save()
  }

  public SetClass(npcClass: NpcClass, tier: number) {
    this._class = npcClass
    this.Parent.Stats = NpcStats.FromClass(npcClass, tier)
    this.Parent.ResetStats()
    this.Parent.NpcFeatureController.ResetFeatures()
  }

  public static Serialize(parent: Npc, target: any) {
    target.class = parent.NpcClassController.Class.ID
    target.tier = parent.NpcClassController.Tier
  }

  public static Deserialize(parent: Npc, data: INpcClassSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      )

    parent.NpcClassController._class = store.getters.referenceByID('NpcClasses', data.class)
    parent.NpcClassController._tier = data.tier
  }
}

export { INpcClassSaveData, NpcClassController }
