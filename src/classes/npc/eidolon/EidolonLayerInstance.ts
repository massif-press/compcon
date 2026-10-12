import { SaveController } from '@/classes/components/save/SaveController'
import { StatKey, Stats } from '@/classes/components/combat/stats/Stats'
import { StatController } from '@/classes/components/combat/stats/StatController'
import { CompendiumStore } from '@/features/compendium/store'
import type { Eidolon } from './Eidolon'
import { EidolonLayer, IEidolonLayerData, CORE_LAYER_ID, coreLayer } from './EidolonLayer'
import { FeatureController } from '@/classes/components/feature/FeatureController'
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer'
import { NpcFeature } from '../feature/NpcFeature'
import { CombatController, CombatData } from '@/classes/components/combat/CombatController'
import { ICombatant } from '@/classes/components/combat/ICombatant'
import { statEdits, type StatTable } from '../tierChange'

interface IEidolonLayerInstanceData {
  id: string
  data: IEidolonLayerData
  description: string
  combat_data?: CombatData
  player_hp?: number
  ui_state?: Record<string, boolean>
}

function resolveLayer(id: string, data: IEidolonLayerData): EidolonLayer {
  if (id === CORE_LAYER_ID) return coreLayer()
  return CompendiumStore().EidolonLayers.find(x => x.ID === id) || new EidolonLayer(data)
}

class EidolonLayerInstance implements IFeatureContainer, ICombatant {
  public readonly IsEncounterInstance: boolean = false
  public readonly ItemType: string = 'EidolonLayer'
  public readonly IgnoresEngagement: boolean = true
  public readonly RefreshesReactionsEachTurn: boolean = true
  public readonly Parent: Eidolon
  public readonly Key: string = crypto.randomUUID()
  public readonly Layer: EidolonLayer
  public SaveController: SaveController
  public FeatureController: FeatureController
  public CombatController: CombatController
  public UIState: Record<string, boolean>

  private _description: string
  private _playerHp: number

  public constructor(data: IEidolonLayerInstanceData, parent: Eidolon) {
    this.Parent = parent
    this.Layer = resolveLayer(data.id, data.data)
    this.UIState = data.ui_state || {}
    this._description = data.description
    this._playerHp = data.player_hp || 0

    this.SaveController = parent.SaveController
    this.FeatureController = new FeatureController(this)
    this.FeatureController.Register(this)
    this.CombatController = new CombatController(this)

    if (data.combat_data) CombatController.Deserialize(this.CombatController, data.combat_data)
    else this.SetStats()
  }

  public get ID(): string {
    return this.Layer.ID
  }

  public get RootActor(): Eidolon {
    return this.Parent
  }

  public get Name(): string {
    return this.Layer.Name
  }

  public get StatController(): StatController {
    return this.CombatController.StatController
  }

  public get Tier(): number {
    return this.Parent.Tier
  }

  public get FeatureSource(): NpcFeature[] {
    return this.Layer.Features
  }

  public get Description(): string {
    return this._description
  }

  public set Description(newDescription: string) {
    this._description = newDescription
    this.SaveController.save()
  }

  public get StatTable(): StatTable {
    const { sizes, hp, ...stats } = this.Layer.Stats.AllStats(this.Tier)
    const byTier = (key: string) =>
      StatController.resolveDefault(Stats.TieredDefaults[key], this.Tier - 1)
    return {
      ...StatController.CustomStatDefaults(this.Tier),
      ...stats,
      [StatKey.SIZE]: sizes,
      [StatKey.HP]: hp + this._playerHp,
      [StatKey.GRAPPLE]: byTier(StatKey.GRAPPLE),
      [StatKey.RAM]: byTier(StatKey.RAM),
    }
  }

  public SetStats(): void {
    this._playerHp = 0
    const table = this.StatTable
    this.CombatController.setStats(Object.keys(table).map(key => ({ key, val: table[key] })))
  }

  public get HasEditedStats(): boolean {
    return statEdits(this.StatController, this.StatTable).length > 0
  }

  public PrepareForEncounter(playerCount: number, activations: number, encounter?: unknown): void {
    this.StatController.applyRegisteredCustomStats()
    this.FeatureController.BonusController.applyToStats(this.StatController, encounter as any)
    this.ScaleToEncounter(playerCount, activations)
    this.StatController.resetCurrentStats()
    this.CombatController.Reset()
  }

  public ScaleToEncounter(playerCount: number, activations: number): void {
    this.StatController.setMax(StatKey.ACTIVATIONS, activations)
    if (this.Layer.HasOwnHp) return

    const playerHp = this.Layer.HpPerPlayer * playerCount
    const change = playerHp - this._playerHp
    this._playerHp = playerHp
    if (!change) return

    const current = this.StatController.getCurrent(StatKey.HP)
    this.StatController.setMax(StatKey.HP, this.StatController.getMax(StatKey.HP) + change)
    if (current > 0)
      this.StatController.setCurrentStat(StatKey.HP, Math.max(1, current + change), {
        silent: true,
      })
  }

  public Serialize(): IEidolonLayerInstanceData {
    const data: IEidolonLayerInstanceData = {
      id: this.Layer.ID,
      data: this.Layer.Data,
      description: this.Description,
      combat_data: {} as CombatData,
      player_hp: this._playerHp || undefined,
      ui_state: Object.keys(this.UIState).length ? { ...this.UIState } : undefined,
    }

    CombatController.Serialize(this.CombatController, data.combat_data)

    return data
  }
}

export { EidolonLayerInstance }
export type { IEidolonLayerInstanceData }
