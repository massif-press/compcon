import uuid from 'uuid/v4'
import { ActivationType } from '@/class'
import { IDeployableData } from './Deployable'

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
  pilot?: boolean
  mech?: boolean
  hide_active?: boolean
  synergy_locations?: string[]
  log?: string[]
}

enum ActivePeriod {
  Turn = 'Turn',
  Round = 'Round',
  Encounter = 'Encounter',
  Mission = 'Mission',
  Unlimited = 'Unlimited',
}

class Frequency {
  public readonly Uses: number
  public readonly Duration: ActivePeriod
  private _unlimited: boolean

  public constructor(frq: string) {
    if (!frq || !frq.includes('/')) {
      this.Uses = 1
      this.Duration = ActivePeriod.Unlimited
      this._unlimited = true
    } else {
      const fArr = frq.split('/')
      const num = parseInt(fArr[0])

      if (!Number.isNaN && Number.isInteger(num)) {
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
          this.Duration = ActivePeriod.Encounter
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
}

class Action {
  public readonly ID: string
  public readonly Name: string
  public readonly Origin: string
  public readonly Activation: ActivationType
  public readonly Terse: string
  public readonly Detail: string
  public readonly Cost: number
  public readonly HeatCost: number
  public readonly Frequency: Frequency
  public readonly Init: string
  public readonly Trigger: string
  public readonly IsPilotAction: boolean
  public readonly IsMechAction: boolean
  public readonly IsDowntimeAction: boolean
  public readonly IsActiveHidden: boolean
  public readonly SynergyLocations: string[]
  public readonly Log: string[]
  private _uses: number
  private _used: boolean
  private _log_id: string

  public constructor(data: IActionData, origin?: string, heat?: number) {
    if (data.name) this.Name = data.name
    else this.Name = `Activate ${origin}` || 'Unknown Action'
    this.ID = data.id ? data.id : `act_${this.Name.toLowerCase().replace(/\s/g, '')}`
    this.Origin = origin || ''
    if (data.synergy_locations)
      this.SynergyLocations = Array.isArray(data.synergy_locations)
        ? data.synergy_locations
        : [data.synergy_locations]
    else this.SynergyLocations = []
    if (data.log) this.Log = Array.isArray(data.log) ? data.log : [data.log]
    else this.Log = [`ACTIVATION CONFIRMED.`]
    this.Activation = data.activation || ActivationType.Quick
    this.Terse = data.terse || ''
    this.Detail = data.detail || ''
    this.Cost = data.cost || 1
    this.HeatCost = heat || 0
    this.Frequency = new Frequency(data.frequency || '')
    this._uses = this.Frequency.Uses
    this.Init = data.init || ''
    this.Trigger = data.trigger || ''
    this.IsPilotAction = data.pilot
    this.IsMechAction = data.mech || !data.pilot
    this.IsActiveHidden = data.hide_active
    this.IsDowntimeAction = data.activation && data.activation.toString() === 'Downtime'
    this._used = false
    this._log_id = ''
  }

  public get Used(): boolean {
    return this._used
  }

  public get Uses(): number {
    return this._uses
  }

  public Use(): void {
    this._log_id = uuid()
    this._uses -= this.Cost
    this._used = true
  }

  public get LogID(): string {
    return this._log_id
  }

  public Undo(): void {
    this._uses += this.Cost
    this._used = false
  }

  public Reset(): void {
    this._uses = this.Frequency.Uses
    this._used = false
  }

  public get Color(): string {
    return `action--${this.Activation.toLowerCase()}`
  }

  public get Icon(): string {
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
    return new Action(
      {
        id: `deploy_${d.name}`,
        name: `Deploy ${d.name}`,
        activation: d.activation,
        cost: d.cost || 1,
        detail: '',
        synergy_locations:
          d.type.toLowerCase() === 'drone' ? ['deployable', 'drone'] : ['deployable'],
        log: ['DEPLOYING EQUIPMENT.'],
      },
      origin
    )
  }
}

export { IActionData, Action }
