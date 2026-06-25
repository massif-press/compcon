import { Damage } from './Damage'
import { ActivationType, ItemType } from './enums'
import { Range } from './Range'
import { IDeployableData } from './components/feature/deployable/Deployable'
import { isNumber } from 'lodash-es'
import { IDamageData } from './Damage'
import { IRangeData } from './Range'
import { ByTier } from '@/util/tierFormat'
import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'
import { ActiveEffect, IActiveEffectData } from './components/feature/active_effects/ActiveEffect'
import {
  EffectSpecial,
  IEffectSpecialData,
} from './components/feature/active_effects/effect_subtype/EffectSpecial'
import {
  EffectOther,
  IEffectOtherData,
} from './components/feature/active_effects/effect_subtype/EffectOther'
import {
  EffectResist,
  IEffectResistData,
} from './components/feature/active_effects/effect_subtype/EffectResist'
import { EffectStatus } from './components/feature/active_effects/effect_subtype/EffectStatus'
import { BonusDamage, IBonusDamageData } from './components/feature/active_effects/BonusDamage'

interface IActionData {
  id?: string
  name: string
  activation: ActivationType
  description?: string
  cost?: number
  frequency?: string
  init?: string
  trigger?: string
  terse?: string
  detail: string
  effect?: string
  pilot?: boolean
  mech?: boolean
  active_effects?: IActiveEffectData[]
  damage?: IDamageData[]
  range?: IRangeData[]
  hide_active?: boolean
  synergy_locations?: string[]
  ignore_used?: boolean
  heat_cost?: number
  tech_attack?: boolean
  add_status?: string[] | { stat: string; aoe: boolean }[]
  add_special?: IEffectSpecialData[]
  remove_special?: string[]
  add_resist?: IEffectResistData[]
  add_other?: IEffectOtherData[]
  bonus_damage?: IBonusDamageData
  attack?: 'melee' | 'ranged' | 'tech'
  hidden?: boolean
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
  public readonly Unlimited: boolean

  public constructor(frq: string) {
    this.FreqText = frq
    this.Unlimited = false
    if (!frq || !frq.includes('/')) {
      this.Uses = 1
      this.Duration = ActivePeriod.Unlimited
      this.Unlimited = true
    } else {
      const fArr = frq.split('/')
      const num = parseInt(fArr[0])

      if (!Number.isNaN(num) && Number.isInteger(num)) {
        this.Uses = num
      } else {
        this.Uses = 1
        this.Duration = ActivePeriod.Unlimited
        this.Unlimited = true
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
          this.Unlimited = true
          break
      }
    }
  }

  public ToString(): string {
    if (this.Unlimited) return this.Duration
    return `${this.Uses}/${this.Duration}`
  }

  public RegainUsesOnEvent(event: ActivePeriod): boolean {
    //Nothing takes an unlimited time to regain uses
    if (event === ActivePeriod.Unlimited) return false

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
  private _name: string
  public readonly Origin: string
  public readonly Activation: ActivationType
  private _terse: string
  public readonly Description: string
  public readonly Cost: number
  public readonly HeatCost: number
  public readonly Frequency: Frequency
  public readonly Init: string
  private _trigger: string
  private _lkey?: string
  public readonly Damage: Damage[]
  public readonly Range: Range[]
  public readonly IsPilotAction: boolean
  public readonly IsMechAction: boolean
  public readonly IsItemAction: boolean
  public readonly IsDowntimeAction: boolean
  public readonly IsActiveHidden: boolean
  public readonly SynergyLocations: string[]
  public readonly ItemType: ItemType = ItemType.Action
  public readonly ActiveEffects: ActiveEffect[]
  public readonly AddStatus: EffectStatus[] = []
  public readonly AddSpecial: EffectSpecial[] = []
  public readonly RemoveSpecial: string[] = []
  public readonly AddResist: EffectResist[] = []
  public readonly AddOther: EffectOther[] = []
  public readonly BonusDamage?: BonusDamage
  public readonly Attack?: 'melee' | 'ranged' | 'tech'
  public readonly Hidden: boolean = false
  public Deployable: IDeployableData | undefined
  private _detail: string
  private _uses: number
  private _ignore_used: boolean

  private static normalizeData(data: IActionData): IActionData {
    const toArray = <T>(v: T | T[] | undefined): T[] | undefined =>
      v === undefined ? undefined : Array.isArray(v) ? v : [v]
    return {
      ...data,
      synergy_locations: toArray(data.synergy_locations),
      damage: toArray(data.damage),
      range: toArray(data.range),
      add_status: toArray(data.add_status as any) as IActionData['add_status'],
      add_special: toArray(data.add_special),
      add_resist: toArray(data.add_resist as any) as IActionData['add_resist'],
      add_other: toArray(data.add_other),
    }
  }

  public constructor(data: IActionData, origin?: string, heat?: number) {
    this._lkey = keyPrefixes.get(data as object) // capture before normalizeData copies data
    data = Action.normalizeData(data)
    this._name = data.name || (origin ? `Activate ${origin}` : 'Unknown Action')
    this.Description = data.description || ''
    const nameForId = this._name.toLowerCase().replace(/\s/g, '')
    this.ID = data.id ? data.id : `act_${nameForId}_${crypto.randomUUID()}`
    this.Origin = origin || ''
    this.IsItemAction = !!origin
    this.SynergyLocations = data.synergy_locations ?? []
    this.Activation = data.activation
      ? ((Object.values(ActivationType).find(
          v => v.toLowerCase() === (data.activation as string).toLowerCase().replace(/_/g, ' ')
        ) as ActivationType) ?? data.activation)
      : ActivationType.Quick
    this.Attack = data.attack

    if (this.Activation === ActivationType.Invade && !this.Attack) {
      this.Attack = 'tech'
    }

    this._terse = data.terse || ''
    this._detail = data.detail || data.effect || ''
    this.Cost = Object.hasOwn(data, 'cost') ? data.cost || 0 : 1
    this.HeatCost = heat && isNumber(heat) ? heat : 0
    // heat cost override
    if (data.heat_cost || data.heat_cost === 0)
      this.HeatCost = isNumber(data.heat_cost) ? data.heat_cost : 0
    this.Frequency = new Frequency(data.frequency || '')
    this._uses = this.Frequency.Uses
    this.Init = data.init || ''
    this._trigger = data.trigger || ''
    this.Damage = data.damage ? data.damage.map(x => new Damage(x)) : []
    if (this.Damage.length) this.Damage.forEach(d => d.setDamageAttributes(this))
    this.Range = data.range ? data.range.map(x => new Range(x)) : []
    this.IsPilotAction =
      data.pilot ||
      data.id?.includes('jockey') ||
      data.name?.toLowerCase().includes('jockey') ||
      false

    this.IsMechAction = data.mech || !data.pilot

    this.IsActiveHidden = data.hide_active || false
    this.IsDowntimeAction = data.activation && data.activation.toString() === 'Downtime'
    this.ActiveEffects = data.active_effects
      ? data.active_effects.map(x => new ActiveEffect(x, this, true))
      : []
    this.AddStatus = data.add_status ? data.add_status.map(x => new EffectStatus(x)) : []
    this.AddSpecial = data.add_special ? data.add_special.map(x => new EffectSpecial(x)) : []
    if (data.remove_special) this.RemoveSpecial = data.remove_special
    this.AddResist = data.add_resist ? data.add_resist.map(x => new EffectResist(x)) : []
    this.AddOther = data.add_other ? data.add_other.map(x => new EffectOther(x)) : []
    if (data.bonus_damage) this.BonusDamage = new BonusDamage(data.bonus_damage, this.Name)

    this._ignore_used = data.ignore_used || false
    this.LastUse = null
    this.Hidden = data.hidden || false
  }

  private get _lk(): string {
    return this._lkey ?? this.ID
  }

  public get Name(): string { return localize(this._lk, 'name', this._name) }
  public get Terse(): string { return localize(this._lk, 'terse', this._terse) }
  public get Trigger(): string { return localize(this._lk, 'trigger', this._trigger) }

  public get Detail(): string {
    return ByTier(localize(this._lk, 'detail', this._detail))
  }

  public getDetail(tier?: number): string {
    return ByTier(localize(this._lk, 'detail', this._detail), tier)
  }
  public getCondition(tier?: number): string {
    return ByTier((this as any)._condition || (this as any).Condition || '', tier)
  }
  public getTrigger(tier?: number): string {
    return ByTier(this.Trigger || '', tier)
  }

  public get Uses(): number {
    return this._uses
  }

  public get Color(): string {
    if (this.Activation === ActivationType.None) return 'primary'
    if (this.ID === 'act_overcharge') return 'action--overcharge'
    if (this.ID === 'act_self_destruct') return 'error'
    return `action--${this.Activation.toLowerCase()}`
  }

  public get Icon(): string {
    if (this.ID === 'act_overcharge') return 'cc:overcharge'
    if (this.ID === 'act_full_tech') return 'cc:full_tech'
    if (this.ID === 'act_self_destruct') return 'mdi-alert-rhombus'
    return Action.getIcon(this.Activation)
  }

  public static getIcon(activation: ActivationType): string {
    switch (activation) {
      case ActivationType.Full:
        return 'mdi-hexagon-slice-6'
      case ActivationType.Quick:
        return 'mdi-hexagon-slice-3'
      case ActivationType.Move:
        return 'mdi-arrow-right-bold-hexagon-outline'
      case ActivationType.Jockey:
        return 'cc:activation_full'
      case ActivationType.Invade:
        return 'cc:quick_tech'
      case ActivationType.Reaction:
        return 'cc:reaction'
      case ActivationType.FullTech:
        return 'cc:full_tech'
      case ActivationType.QuickTech:
        return 'cc:quick_tech'
      case ActivationType.None:
        return 'mdi-rhombus-outline'
      case ActivationType.Other:
        return 'cc:activate'
      default:
        return `cc:${activation.toLowerCase().replace(' ', '_')}`
    }
  }

  public static CreateDeployAction(d: IDeployableData, origin?: string): Action {
    const a = new Action(
      {
        id: `deploy_${d.name}_${crypto.randomUUID()}`,
        name: `Deploy ${d.name}`,
        activation: d.activation || ActivationType.Quick,
        cost: Object.hasOwn(d, 'cost') ? d.cost : 1,
        detail: '',
        synergy_locations:
          d.type?.toLowerCase() === 'drone' ? ['deployable', 'drone'] : ['deployable'],
        pilot: d.pilot,
      },
      origin
    )
    a.Deployable = d
    return a
  }

  public static Serialize(action: Action): IActionData {
    return {
      id: action.ID,
      name: action._name,
      activation: action.Activation,
      cost: action.Cost,
      frequency: action.Frequency.FreqText,
      init: action.Init,
      trigger: action.Trigger,
      terse: action._terse,
      detail: action._detail,
      pilot: action.IsPilotAction,
      mech: action.IsMechAction,
      damage: action.Damage ? action.Damage.map(x => Damage.Serialize(x)) : [],
      range: action.Range ? action.Range.map(x => Range.Serialize(x)) : [],
      hide_active: action.IsActiveHidden,
      synergy_locations: action.SynergyLocations,
      ignore_used: action._ignore_used,
      heat_cost: action.HeatCost,
      attack: action.Attack,
    }
  }

  public static Deserialize(data: IActionData, origin?: string, heat?: number): Action {
    return new Action(data, origin, heat)
  }
}

export { Action, ActivePeriod }
export type { IActionData }
