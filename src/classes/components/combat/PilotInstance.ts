import _ from 'lodash'
import uuid from 'uuid/v4'
import { Mech, PilotLoadout, Pilot, Synergy } from '../../../class'
import { Action, IPilotLoadoutData, IRankedData } from '../../../interface'
import { ActiveState, IActiveStateData, ICombatStats } from './ActiveState'
import { Bonus, IBonusData } from '../feature/bonus/Bonus'
import { IReserveData, CoreBonus, Reserve, PilotSkill, PilotTalent } from '../../pilot/components'
import {
  CounterController,
  ICounterCollection,
  ICounterContainer,
  ISaveable,
  ISaveData,
  MechSkills,
  PortraitController,
  SaveController,
} from '..'
import { ImageTag } from '@/io/ImageManagement'
import { IDeployableData } from '../feature/deployable/Deployable'
import { IActiveStatData, ActiveStatController } from './stats/ActiveStatController'
import { IMechInstanceData, MechInstance } from './MechInstance'
import { IStatData, StatController } from './stats/StatController'

class PilotInstanceData implements ICounterCollection {
  id: string
  link_id: string

  // pilot
  level: number
  callsign: string
  name: string
  player_name: string
  status: string
  notes: string

  grit: number
  max_hp: number
  armor: number
  speed: number
  evasion: number
  edef: number
  limited_bonus: number

  mech: IMechInstanceData

  skills: IRankedData[]
  talents: IRankedData[]
  mechSkills: number[]
  core_bonuses: string[]
  reserves: IReserveData[]
  loadout: IPilotLoadoutData

  bonuses: IBonusData[]
  synergies: Synergy[]
  deployables: IDeployableData[]

  stats: IStatData
  current_stats: IActiveStatData
  state: IActiveStateData

  save: ISaveData

  // CounterController
  custom_counters: any[]
  counter_data: ICounterSaveData[]
}

class PilotInstance implements ISaveable, ICounterContainer {
  public readonly ItemType: string = 'pilot'
  public readonly Size: 0.5
  public readonly Activations: 2

  public SaveController: SaveController
  public ActiveStatController: ActiveStatController
  public StatController: StatController
  public PortraitController: PortraitController
  public CounterController: CounterController
  public ImageTag = ImageTag.Pilot

  public ID: string
  public LinkID: string
  public Callsign: string
  public Name: string
  public PlayerName: string
  public Level: number

  public Grit: number
  public MaxHP: number
  public Armor: number
  public Speed: number
  public Evasion: number
  public EDefense: number
  public LimitedBonus: number

  public Mech: MechInstance

  public Skills: PilotSkill[]
  public Talents: PilotTalent[]
  public MechSkills: MechSkills
  public CoreBonuses: CoreBonus[]
  public Reserves: Reserve[]
  public Bonuses: Bonus[]
  public Synergies: Synergy[]
  public Actions: Action[]
  public Deployables: IDeployableData[]
  public PilotLoadout: PilotLoadout

  private _status: string
  private _notes: string
  private _missing_hp: number
  private _dead: boolean
  private _resistances: string[]
  private _state: ActiveState

  public constructor(pilot?: Pilot, mech?: Mech) {
    this.ID = uuid()

    this.SaveController = new SaveController(this)
    this.StatController = new StatController(this, pilot)
    this.ActiveStatController = new ActiveStatController(this)

    if (pilot) {
      this.LinkID = pilot.ID || ''
      this.CounterController = new CounterController(this)
      this.Skills = pilot.SkillsController.Skills
      this.Talents = pilot.TalentsController.Talents
      this.MechSkills = pilot.MechSkillsController.MechSkills
      this.CoreBonuses = pilot.CoreBonusController.CoreBonuses
      this.Reserves = pilot.ReservesController.Reserves
      this.Bonuses = pilot.FeatureController.Bonuses
      this.Synergies = pilot.FeatureController.Synergies
      this.Actions = pilot.FeatureController.Actions
      this.Deployables = pilot.FeatureController.Deployables
      this.PilotLoadout = pilot.PilotLoadoutController.Loadout

      this.Grit = pilot.Grit

      this.MaxHP = pilot.MaxHP
      this.Armor = pilot.Armor
      this.Speed = pilot.Speed
      this.Evasion = pilot.Evasion
      this.EDefense = pilot.EDefense
      this.LimitedBonus = pilot.LimitedBonus

      this.Level = pilot.Level
      this.Callsign = pilot.Callsign
      this.Name = pilot.Name
      this.PlayerName = pilot.PlayerName
    }
    if (mech) this.Mech = new MechInstance(this, mech)

    this._notes = ''
    this._missing_hp = 0
    this._resistances = []
    this._dead = false

    this._state = new ActiveState(this)
  }

  public get Items(): any[] {
    return this.Mech.Loadout.Equipment
  }

  public get Notes(): string {
    return this._notes
  }

  public set Notes(newVal: string) {
    this._notes = newVal
    this.SaveController.save()
  }

  // -- Active Mode -------------------------------------------------------------------------------
  public SpecialEval(val: number | string): number {
    if (typeof val === 'number') return val
    let valStr = val as string
    // @ts-ignore
    valStr = valStr.replaceAll(`{ll}`, this.Level.toString())
    // @ts-ignore
    valStr = valStr.replaceAll(`{grit}`, this.Grit.toString())
    valStr = valStr.replace(/[^-()\d/*+.]/g, '')
    return Math.ceil(eval(valStr))
  }

  public get State(): ActiveState {
    return this._state
  }

  public UpdateCombatStats(ms: ICombatStats, p: Pilot): void {
    // for (const k in p._combat_history) {
    //   if (ms[k]) p._combat_history[k] += ms[k]
    // }
  }

  // -- I/O ---------------------------------------------------------------------------------------

  public static Serialize(p: PilotInstance): PilotInstanceData {
    const data = {
      id: p.ID,
      level: p.Level,
      callsign: p.Callsign,
      name: p.Name,
      player_name: p.PlayerName,
      notes: p.Notes,
      mech: MechInstance.Serialize(p.Mech),
      state: ActiveState.Serialize(p.State),
    }

    SaveController.Serialize(p, data)
    CounterController.Serialize(p, data)
    StatController.Serialize(p, data)
    ActiveStatController.Serialize(p, data)

    return data as PilotInstanceData
  }

  public Serialize(): PilotInstanceData {
    return PilotInstance.Serialize(this)
  }

  public static Deserialize(data: PilotInstanceData): PilotInstance {
    const p = new PilotInstance()
    try {
      p.Update(data)
      p.SaveController.SetLoaded()
      return p
    } catch (err) {
      console.error(err)
    }
  }

  public Update(data: PilotInstanceData): void {
    this.ID = data.id
    this.LinkID = data.link_id
    this.Callsign = data.callsign
    this.Name = data.name
    this.PlayerName = data.player_name
    this.Level = data.level
    this.Grit = data.grit
    this.Skills = data.skills.map(x => PilotSkill.Deserialize(x))
    this.Talents = data.talents.map(x => PilotTalent.Deserialize(x))
    this.MechSkills = MechSkills.Deserialize(data.mechSkills)
    this.CoreBonuses = data.core_bonuses.map(x => CoreBonus.Deserialize(x))
    this.Reserves = data.reserves.map(x => Reserve.Deserialize(x))
    this.Bonuses = data.bonuses.map(x => new Bonus(x, ''))
    this.Synergies = data.synergies
    this.Deployables = data.deployables
    this.PilotLoadout = PilotLoadout.Deserialize(data.loadout)
    this._status = data.status
    this._notes = data.notes

    this.Mech = MechInstance.Deserialize(data.mech, this)

    SaveController.Deserialize(this, data.save)
    CounterController.Deserialize(this, data)
    StatController.Deserialize(this, data.stats)
    ActiveStatController.Deserialize(this, data.current_stats)

    this._state = ActiveState.Deserialize(this, data.state)
  }

  public Clone(): PilotInstance {
    const data = PilotInstance.Serialize(this)
    return PilotInstance.Deserialize(data)
  }
}

export { PilotInstance, PilotInstanceData }
