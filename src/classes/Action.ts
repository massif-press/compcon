import uuid from 'uuid/v4'
import { ActivationType, Damage, Range } from '@/class'
import { IDeployableData } from './components/feature/deployable/Deployable'
import { isNumber } from 'lodash'
import { IDamageData } from './Damage'
import { IRangeData } from './Range'

interface IActionData {
  id?: string
  name: string
  activation: ActivationType
  cost?: number
  frequency?: string
  init?: string
  trigger?: string
  terse?: string
  detail: string
  description?: string
  pilot?: boolean
  mech?: boolean
  damage?: IDamageData[]
  range?: IRangeData[]
  hide_active?: boolean
  synergy_locations?: string[]
  confirm?: string[]
  log?: string
  ignore_used?: boolean
  heat_cost?: number
  tech_attack?: boolean
}

enum ActivePeriod {
  Turn = 'Turn',
  Round = 'Round',
  Scene = 'Scene',
  Encounter = 'Encounter',
  Mission = 'Mission',
  Unlimited = 'Unlimited',
}

class Frequency {
  public readonly Uses: number
  public readonly Duration: ActivePeriod
  public readonly FreqText: string
  private _unlimited: boolean

  public constructor(frq: string) {
    this.FreqText = frq
    if (!frq || !frq.includes('/')) {
      this.Uses = 1
      this.Duration = ActivePeriod.Unlimited
      this._unlimited = true
    } else {
      const fArr = frq.split('/')
      const num = parseInt(fArr[0])

      if (!Number.isNaN(num) && Number.isInteger(num)) {
        this.Uses = num
      } else {
        this.Uses = 1
        this.Duration = ActivePeriod.Unlimited
        this._unlimited = true
      }

      switch (fArr[1].toLowerCase()) {
        case 'turn':
          this.Duration = ActivePeriod.Turn
          break
        case 'round':
          this.Duration = ActivePeriod.Round
          break
        case 'scene':
        case 'encounter':
          this.Duration = ActivePeriod.Scene
          break
        case 'mission':
          this.Duration = ActivePeriod.Mission
          break
        default:
          this.Uses = Number.MAX_SAFE_INTEGER
          this.Duration = ActivePeriod.Unlimited
          this._unlimited = true
          break
      }
    }
  }

  public ToString(): string {
    if (this._unlimited) return this.Duration
    return `${this.Uses}/${this.Duration}`
  }

  public RegainUsesOnEvent(event: ActivePeriod): boolean {
    //Nothing takes an unlimited time to regain uses
    if (event == ActivePeriod.Unlimited) return false

    const order: Record<ActivePeriod, number> = {
      Unlimited: 0,
      Turn: 1,
      Round: 2,
      Scene: 3,
      Encounter: 3,
      Mission: 4,
    }
    //This action is free to regain uses if the given event
    //meets the duration threshold
    return order[this.Duration] <= order[event]
  }
}

class Action {
  public LastUse: ActivationType | null
  public readonly ID: string
  public readonly Name: string
  public readonly Origin: string
  public readonly Activation: ActivationType
  public readonly Terse: string
  public readonly Detail: string
  public readonly Description: string
  public readonly Cost: number
  public readonly HeatCost: number
  public readonly Frequency: Frequency
  public readonly Init: string
  public readonly Trigger: string
  public readonly Damage: Damage[]
  public readonly Range: Range[]
  public readonly IsPilotAction: boolean
  public readonly IsMechAction: boolean
  public readonly IsItemAction: boolean
  public readonly IsDowntimeAction: boolean
  public readonly IsActiveHidden: boolean
  public readonly IsTechAttack: boolean
  public readonly SynergyLocations: string[]
  public readonly Confirm: string[]
  public readonly Log: string
  public Deployable: IDeployableData
  private _uses: number
  private _used: boolean
  private _ignore_used: boolean
  private _free_used: boolean
  private _log_id: string

  public constructor(data: IActionData, origin?: string, heat?: number) {
    if (data.name) this.Name = data.name
    else this.Name = `Activate ${origin}` || 'Unknown Action'
    this.ID = data.id ? data.id : `act_${this.Name.toLowerCase().replace(/\s/g, '')}_${uuid()}`
    this.Origin = origin || ''
    this.IsItemAction = !!origin
    if (data.synergy_locations)
      this.SynergyLocations = Array.isArray(data.synergy_locations)
        ? data.synergy_locations
        : [data.synergy_locations]
    else this.SynergyLocations = []
    if (data.confirm) this.Confirm = Array.isArray(data.confirm) ? data.confirm : [data.confirm]
    else this.Confirm = [`ACTIVATION CONFIRMED.`]
    this.Log = data.log || ''
    this.Activation = data.activation || ActivationType.Quick
    this.Terse = data.terse || ''
    this.Detail = data.detail || ''
    this.Description = data.description || ''
    this.Cost = data.cost || 1
    this.HeatCost = heat && isNumber(heat) ? heat : 0
    // heat cost override
    if (data.heat_cost || data.heat_cost === 0)
      this.HeatCost = isNumber(data.heat_cost) ? data.heat_cost : 0
    this.Frequency = new Frequency(data.frequency || '')
    this._uses = this.Frequency.Uses
    this.Init = data.init || ''
    this.Trigger = data.trigger || ''
    if (data.damage) this.Damage = data.damage.map(x => new Damage(x))
    if (data.range) this.Range = data.range.map(x => new Range(x))
    this.IsPilotAction = data.pilot
    this.IsTechAttack = data.tech_attack
    this.IsMechAction = data.mech || !data.pilot
    this.IsActiveHidden = data.hide_active
    this.IsDowntimeAction = data.activation && data.activation.toString() === 'Downtime'
    this._used = false
    this._ignore_used = data.ignore_used
    this._free_used = false
    this.LastUse = null
    this._log_id = ''
  }

  public get Used(): boolean {
    return this._used || this._uses == 0
  }

  public get Uses(): number {
    return this._uses
  }

  public Use(): void {
    this._log_id = uuid()
    this._uses -= this.Cost
    if (!this._ignore_used) this._used = true
    this.LastUse = this.Activation
  }

  public get FreeUsed(): boolean {
    return this._free_used
  }

  public get AnyUsed(): boolean {
    return this._free_used || this._used
  }

  public UseFree(): void {
    this._log_id = uuid()
    this._uses -= this.Cost
    this._free_used = true
    this.LastUse = ActivationType.Free
  }

  public get LogID(): string {
    return this._log_id
  }

  public Undo(): void {
    this._uses += this.Cost
    this._used = false
    this._free_used = false
    this.LastUse = null
  }

  public Reset(event: ActivePeriod = ActivePeriod.Mission): void {
    if (this.Frequency.RegainUsesOnEvent(event)) {
      this._uses = this.Frequency.Uses
    }
    this._used = false
    this._free_used = false
    this.LastUse = null
  }

  public get Color(): string {
    if (this.ID === 'act_overcharge') return 'action--overcharge'
    if (this.ID === 'act_self_destruct') return 'error'
    return `action--${this.Activation.toLowerCase()}`
  }

  public get Icon(): string {
    if (this.ID === 'act_overcharge') return 'cci-overcharge'
    if (this.ID === 'act_self_destruct') return 'mdi-alert-rhombus'
    switch (this.Activation) {
      case ActivationType.Full:
        return 'mdi-hexagon-slice-6'
      case ActivationType.Quick:
        return 'mdi-hexagon-slice-3'
      case ActivationType.Move:
        return 'mdi-arrow-right-bold-hexagon-outline'
      default:
        return `cci-${this.Activation.toLowerCase().replace(' ', '-')}`
    }
  }

  public static CreateDeployAction(d: IDeployableData, origin?: string): Action {
    const a = new Action(
      {
        id: `deploy_${d.name}_${uuid()}`,
        name: `Deploy ${d.name}`,
        activation: d.activation,
        cost: d.cost || 1,
        detail: '',
        synergy_locations:
          d.type.toLowerCase() === 'drone' ? ['deployable', 'drone'] : ['deployable'],
        pilot: d.pilot,
        confirm: ['DEPLOYING EQUIPMENT.'],
      },
      origin
    )
    a.Deployable = d
    return a
  }

  public static Serialize(action: Action): IActionData {
    return {
      id: action.ID,
      name: action.Name,
      activation: action.Activation,
      cost: action.Cost,
      frequency: action.Frequency.FreqText,
      init: action.Init,
      trigger: action.Trigger,
      terse: action.Terse,
      detail: action.Detail,
      description: action.Description,
      pilot: action.IsPilotAction,
      mech: action.IsMechAction,
      damage: action.Damage ? action.Damage.map(x => Damage.Serialize(x)) : null,
      range: action.Range ? action.Range.map(x => Range.Serialize(x)) : null,
      hide_active: action.IsActiveHidden,
      synergy_locations: action.SynergyLocations,
      confirm: action.Confirm,
      log: action.Log,
      ignore_used: action._ignore_used,
      heat_cost: action.HeatCost,
      tech_attack: action.IsTechAttack,
    }
  }
}

export { IActionData, Action, ActivePeriod }
