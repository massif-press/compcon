import { ActivationType } from '@/class'

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
  sub_actions?: IActionData[]
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
  public readonly Frequency: Frequency
  public readonly Init: string
  public readonly Trigger: string
  public readonly IsPilotAction: boolean
  public readonly IsDowntimeAction: boolean
  public readonly SynergyLocations: string[]
  public readonly Log: string[]
  private _sub_actions: IActionData[]
  private _uses: number

  public constructor(data: IActionData, origin?: string) {
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
    this.Frequency = new Frequency(data.frequency || '')
    this._uses = this.Frequency.Uses
    this.Init = data.init || ''
    this.Trigger = data.trigger || ''
    this.IsPilotAction = data.pilot
    this.IsDowntimeAction = data.activation && data.activation.toString() === 'Downtime'
    this._sub_actions = data.sub_actions || []
    // this.SubAactions = data.sub_actions ? data.sub_actions.map(a => new Action(a)) : []
  }

  public get Uses(): number {
    return this._uses
  }

  public Use(): void {
    this._uses--
  }

  public Reset(): void {
    this._uses = this.Frequency.Uses
  }

  public get SubActions(): Action[] {
    return this._sub_actions.map(a => new Action(a))
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
}

export { IActionData, Action }
