import { store } from '@/store'
import { MechWeapon, Tag, ActivationType, Duration, MechSystem } from '@/class'
import { IActionData, Action } from '../Action'
import { IBonusData, Bonus } from '../Bonus'
import { ISynergyData, Synergy } from '../Synergy'
import { ICounterData } from '../Counter'
import { MechEquipment } from './MechEquipment'
import { IDeployableData } from '../Deployable'
import { CompendiumItem } from '../CompendiumItem'

interface ICoreData {
  name: string
  description: string
  active_name: string
  active_effect: string
  activation: ActivationType
  deactivation?: ActivationType
  use?: Duration
  active_actions?: IActionData[]
  active_bonuses?: IBonusData[]
  active_synergies?: ISynergyData[]
  passive_name?: string
  passive_effect?: string
  passive_actions?: IActionData[]
  passive_bonuses?: IBonusData[]
  passive_synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
  special_equipment?: string[]
  tags: ITagData[]
}

class CoreSystem {
  public readonly Name: string
  public readonly Description: string
  public readonly Activation: ActivationType
  public readonly ActivateAction: Action
  public readonly ActiveName: string
  public readonly ActiveEffect: string
  public readonly ActiveActions: Action[]
  public readonly ActiveBonuses: Bonus[]
  public readonly ActiveSynergies: Synergy[]
  public readonly Deactivation?: ActivationType
  public readonly Duration: Duration
  public readonly PassiveName: string
  public readonly PassiveEffect: string
  public readonly PassiveActions: Action[]
  public readonly PassiveBonuses: Bonus[]
  public readonly PassiveSynergies: Synergy[]
  public readonly Deployables: IDeployableData[]
  public readonly DeployActions: Action[]
  public readonly Counters: ICounterData[]
  private _integrated: string[]
  private _special_equipment: string[]
  private _tags: ITagData[]
  private _used: boolean

  private generateActivateAction(): Action {
    return new Action(
      {
        id: `core_active_activate`,
        name: 'Activate CORE System',
        activation: this.Activation,
        detail: this.ActiveEffect,
        mech: true,
        hide_active: true,
      },
      'Frame CORE System'
    )
  }

  public constructor(data: ICoreData) {
    this.Name = data.name
    this.Description = data.description || ''
    this.ActiveName = data.active_name
    this.ActiveEffect = data.active_effect
    this.Activation = data.activation
    this.ActiveActions = data.active_actions ? data.active_actions.map(x => new Action(x)) : []
    this.ActiveBonuses = data.active_bonuses ? data.active_bonuses.map(x => new Bonus(x)) : []
    this.ActiveSynergies = data.active_synergies
      ? data.active_synergies.map(x => new Synergy(x, 'Frame CORE System (Active)'))
      : []
    if (data.deactivation) this.Deactivation = data.deactivation
    this.Duration = data.use ? (data.use as Duration) : Duration.Mission
    this.PassiveName = data.passive_name || ''
    this.PassiveEffect = data.passive_effect || ''
    this.PassiveActions = data.passive_actions ? data.passive_actions.map(x => new Action(x)) : []
    this.PassiveBonuses = data.passive_bonuses ? data.passive_bonuses.map(x => new Bonus(x)) : []
    this.PassiveSynergies = data.passive_synergies
      ? data.passive_synergies.map(x => new Synergy(x, 'Frame CORE System (Passive)'))
      : []
    this.Deployables = data.deployables ? data.deployables : []
    if (this.Deployables.length)
      this.DeployActions = this.Deployables.map(x => Action.CreateDeployAction(x, this.Name))
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._special_equipment = data.special_equipment || []
    this._tags = data.tags
    this.ActivateAction = this.generateActivateAction()
  }

  public get Used(): boolean {
    return this._used
  }

  public Use(): void {
    this._used = true
  }

  public Reset(): void {
    this._used = false
  }

  public Undo(): void {
    this._used = false
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return []
    const res = this._special_equipment.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w && !w.err) return w
      const s = store.getters.referenceByID('MechSystems', x)
      if (s && !s.err) return s
      const wm = store.getters.referenceByID('WeaponMods', x)
      if (wm && !wm.err) return wm
      const pg = store.getters.referenceByID('PilotGear', x)
      if (pg && !pg.err) return pg
      return false
    })
    return res.filter(x => x)
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    return this._integrated.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w) return w
      return store.getters.referenceByID('MechSystems', x)
    })
  }

  public get PassiveIntegratedWeapons(): MechWeapon[] {
    return this.IntegratedWeapons
  }

  public get PassiveCounters(): ICounterData[] {
    return this.Counters
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map(x => store.getters.referenceByID('MechWeapons', x))
      .filter(x => !x.err)
  }

  public get PassiveIntegratedSystems(): MechSystem[] {
    return this.IntegratedSystems
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map(x => store.getters.referenceByID('MechSystems', x))
      .filter(x => !x.err)
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }
}

export { CoreSystem, ICoreData }
