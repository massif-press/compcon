/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// defines the pilot's relationship to the mech for actvive mode. does not hold active mech info (eg heat, destroyed status)
// but associated logic should be handled by this class (eg. ride-along conditions)

import { store } from '@/store'
import { Mech, Deployable, Pilot, MechEquipment, MechWeapon, Mount, ActivationType } from '@/class'
import { Action } from '@/interface'
import { IDeployableData, IDeployedData } from '../Deployable'
import { mission } from '@/io/Generators'
import { Duration } from '../enums'

enum Stage {
  Narrative = 'Narrative',
  Combat = 'Combat',
  Rest = 'Rest',
}

interface ICombatLogData {
  id: string
  timestamp: string
  mission: number
  encounter: number
  round: number
  event: string
  detail: string
  undoAction: Action
}

interface ICombatStats {
  moves: number
  kills: number
  damage: number
  hp_damage: number
  structure_damage: number
  overshield: number
  heat_damage: number
  reactor_damage: number
  overcharge_uses: number
  core_uses: number
}

interface IActiveStateData {
  active_mech_id: string
  stage: string
  mission: number
  turn: number
  actions: number
  braced: boolean
  overcharged: boolean
  prepare: boolean
  bracedCooldown: boolean
  redundant: boolean
  mounted: boolean
  stats: ICombatStats
  deployed: IDeployedData[]
}

class ActiveState {
  private _deployed: Deployable[]
  public _stage: Stage
  public InTurn: boolean

  private _log: ICombatLogData[] // write this to a pilot log after mission is ended

  private _pilot_mounted: boolean
  private _pilot_move: number

  private _pilot: Pilot
  private _mech: Mech | null

  private _round: number
  private _encounter: number
  private _mission: number

  private _actions: number

  private _barrageSelections: MechWeapon[]
  private _barrageMounts: Mount[]
  private _shBarrageSelection: MechWeapon
  private _shBarrageMount: Mount

  private _self_destruct_counter: number

  public StabilizeMajor: string
  private _last_stabilize_major: string
  public StabilizeMinor: string
  private _last_stabilize_minor: string

  private _cachedBurnDamage: number
  private _cachedBurnStructure: number

  private _stabilizeUndo: {
    heat: number
    hp: number
    reloads: string[]
    burn: number
    exposed: boolean
  }

  public OverchargeHeat: number
  private _overchargeUndo: string[]

  private _shutDownUndo: {
    heat: number
    cascade: string[]
    statuses: string[]
    conditions: string[]
  }

  private _jockeying: boolean
  private _braced: boolean
  private _overcharged: boolean
  private _prepare: boolean
  private _bracedCooldown: boolean
  private _redundant: boolean

  private _stageNextTurnCoreEnd: boolean
  private _stageNextRoundCoreEnd: boolean

  private _stats: ICombatStats

  public constructor(pilot: Pilot) {
    this._pilot = pilot
    this._mech = null
    this._stage = Stage.Narrative
    this._self_destruct_counter = -1
    this._round = 1
    this._encounter = 1
    this._pilot_move = pilot.Speed
    this._actions = 2
    this._barrageSelections = []
    this._barrageMounts = []
    this._braced = false
    this._overcharged = false
    this._prepare = false
    this._bracedCooldown = false
    this._redundant = false
    this._deployed = []
    this._log = []
    this._stats = ActiveState.NewCombatStats()
    this.InTurn = true
    this._cachedBurnDamage = 0
    this._cachedBurnStructure = 0
  }

  public static NewCombatStats(): ICombatStats {
    return {
      moves: 0,
      kills: 0,
      damage: 0,
      hp_damage: 0,
      structure_damage: 0,
      overshield: 0,
      heat_damage: 0,
      reactor_damage: 0,
      overcharge_uses: 0,
      core_uses: 0,
    }
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get Stats(): ICombatStats {
    return this._stats
  }

  public get Move(): number {
    if (this._pilot_mounted && this._mech.IsShutDown) return 0
    return !this._pilot_mounted ? this._pilot_move : this._mech.CurrentMove
  }

  public get MaxMove(): number {
    if (this._pilot_mounted && this._mech.IsShutDown) return 0
    return !this._pilot_mounted ? this._pilot.Speed : this._mech.Speed
  }

  public get Actions(): number {
    return this._actions
  }

  public set Actions(val: number) {
    this._actions = val
    if (this._actions > 3) this._actions = 3
  }

  public get IsProtocolAvailable(): boolean {
    return this.Move === this.MaxMove && this.Actions === 2 && !this._overcharged
  }

  public get IsSkirmishAvailable(): boolean {
    return this.Actions > 0 && !this.AllActions.find(x => x.ID === 'act_skirmish').Used
  }

  public get IsJockeying(): boolean {
    return this._jockeying
  }

  public set IsJockeying(val: boolean) {
    this._jockeying = val
  }

  public get IsBraceCooldown(): boolean {
    return this._bracedCooldown
  }

  public get SelfDestructCounter(): number {
    return this._self_destruct_counter
  }

  public StartSelfDestruct(): void {
    this._self_destruct_counter = 3
  }

  public ReactorCriticalDestruct(): void {
    this._self_destruct_counter = 1
  }

  public CancelSelfDestruct(): void {
    this._self_destruct_counter = -1
  }

  public SelfDestruct(): void {
    this._mech.CurrentHP = 0
    this._mech.CurrentStructure = 0
    this._mech.CurrentStress = 0
    this._mech.Destroyed = true
    this._mech.ReactorDestroyed = true
    this._self_destruct_counter = 0
    if (this._pilot_mounted) this._mech.Pilot.Kill()
  }

  public get Stage(): Stage {
    return this._stage
  }

  public get Encounter(): number {
    return this._encounter
  }

  public get Mission(): number {
    return this._mission
  }

  public get Round(): number {
    return this._round
  }

  public StartCombat(): void {
    this._stage = Stage.Combat
    this._pilot_mounted = true
    this._round = 0
    this._encounter++
    this._deployed = []
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.INIT',
      detail: 'COMBAT MODE ACTIVATED',
    })
    this.NextRound()
    this.InTurn = true
  }

  public UndoEndTurn(): void {
    if (this._cachedBurnDamage) {
      this._mech.Burn = this._cachedBurnDamage
      this._mech.CurrentHP += this._cachedBurnDamage
    }
    if (this._cachedBurnStructure) this._mech.CurrentStructure += this._cachedBurnStructure
    this.InTurn = true
  }

  public EndTurn(burnHp: number, burnStr: number): void {
    this._cachedBurnDamage = burnHp
    this._cachedBurnStructure = burnStr
    if (this._mech.Frame.CoreSystem.Duration === Duration.Turn) this._mech.IsCoreActive = false
    if (this._mech.Frame.CoreSystem.Duration === Duration.NextTurn) {
      if (this._stageNextTurnCoreEnd) {
        this._mech.IsCoreActive = false
        this._stageNextTurnCoreEnd = false
      } else this._stageNextTurnCoreEnd = true
    }
    this.InTurn = false
  }

  public NextRound(): void {
    this._round++
    if (this.SelfDestructCounter > 0) this._self_destruct_counter -= 1
    if (this.SelfDestructCounter === 0) this.SelfDestruct()
    if (this._bracedCooldown) this._bracedCooldown = false
    if (this._braced) this._braced = true
    this._actions = this._braced ? 1 : 2
    this._pilot_move = this._pilot.Speed
    this._barrageSelections = []
    this._barrageMounts = []
    // TODO: base on freq
    this.AllActions.forEach(a => a.Reset())
    this.AllBaseTechActions.forEach(a => a.Reset())
    this._mech.ActiveLoadout.Equipment.forEach(e => e.Reset())
    this._mech.Pilot.Loadout.Equipment.forEach(e => e.Reset())
    this.Deployed.forEach(d => d.Actions.forEach(a => a.Reset()))
    this._mech.CurrentMove = this._braced ? 0 : this._mech.MaxMove
    this._braced = false
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.ROUND',
      detail: 'ROUND START',
    })
    if (this._mech.Frame.CoreSystem.Duration === Duration.Round) this._mech.IsCoreActive = false
    if (this._mech.Frame.CoreSystem.Duration === Duration.NextRound) {
      if (this._stageNextRoundCoreEnd) {
        this._mech.IsCoreActive = false
        this._stageNextRoundCoreEnd = false
      } else this._stageNextRoundCoreEnd = true
    }
    this.InTurn = true
    this.save()
  }

  public StartRest(): void {
    this._stage = Stage.Rest
    this._pilot.CurrentHP += Math.ceil(this._pilot.MaxHP / 2)
    this._mech.CurrentHeat = 0
    this._mech.Conditions.splice(0, this._mech.Conditions.length)
    this._mech.Statuses.splice(0, this._mech.Statuses.length)
    this._deployed.splice(0, this._deployed.length)
    if (this._mech.Frame.CoreSystem.PassiveActions) this._mech.Frame.CoreSystem.PassiveActions.forEach(a => a.Reset())
    if (this._mech.Frame.CoreSystem.DeployActions) this._mech.Frame.CoreSystem.DeployActions.forEach(a => a.Reset())
    if (this._mech.Pilot.IsDownAndOut)
      this._mech.Pilot.CurrentHP = Math.ceil(this._mech.Pilot.MaxHP / 2)
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.END',
      detail: 'ENCOUNTER COMPLETE. COMBAT MODE DEACTIVATED.',
    })
    if (this._mech.Frame.CoreSystem.Duration === Duration.Encounter) this._mech.IsCoreActive = false
    this.InTurn = true
    this.save()
  }

  public StartMission(): void {
    this._mission += 1
    this._stats = ActiveState.NewCombatStats()
    this._pilot.FullRestore()
    this._mech.FullRepair()
    this.SetLog({
      id: 'start_mission',
      event: 'MISSION.START',
      detail: `STARTING MISSION//${this.timestamp}::${mission()}`,
    })
    this._deployed.splice(0, this._deployed.length)
    this.InTurn = true
    this.StartCombat()
  }

  public EndMission(): void {
    this._mech.IsCoreActive = false
    this._pilot.UpdateCombatStats(this._stats)
    this.SetLog({
      id: 'end_mission',
      event: 'MISSION.COMPLETE',
      detail: `REC::MISSION COMPLETE @ ${this.timestamp}`,
    })
    this._deployed.splice(0, this._deployed.length)
    this._stage = Stage.Narrative
    this.save()
  }

  RepairHP(): void {
    this._mech.CurrentHP = this._mech.MaxHP
    this._mech.CurrentRepairs -= 1
  }

  RepairStructure(): void {
    this._mech.CurrentStructure += 1
    const cheap = this._mech.Bonuses.some(x => x.ID === 'cheap_struct')
    this._mech.CurrentRepairs -= cheap ? 1 : 2
  }

  RepairStress(): void {
    this._mech.CurrentStress += 1
    if (this._mech.CurrentStress > this._mech.MaxStress)
      this._mech.CurrentStress = this._mech.MaxStress
    const cheap = this._mech.Bonuses.some(x => x.ID === 'cheap_stress')
    this._mech.CurrentRepairs -= cheap ? 1 : 2
  }

  RepairSystem(w: MechEquipment): void {
    w.Repair()
    this._mech.CurrentRepairs -= 1
  }

  RepairDestroyed(selfRepairPts: number): void {
    this._mech.CurrentRepairs -= selfRepairPts
    this._mech.Repair()
  }

  public set ActiveMech(mech: Mech | null) {
    this._mech = mech
  }

  public get ActiveMech(): Mech | null {
    return this._mech || null
  }

  public get IsMounted() {
    return this._pilot_mounted
  }

  public set IsMounted(val: boolean) {
    this._pilot_mounted = val
    this.save()
  }

  // -- Barrage Staging ---------------------------------------------------------------------------

  public get BarrageSelections(): MechWeapon[] {
    return this._barrageSelections
  }

  public get SHBarrageSelection(): MechWeapon {
    return this._shBarrageSelection
  }

  public get BarrageMounts(): Mount[] {
    return this._barrageMounts
  }

  public get SHBarrageMount(): Mount {
    return this._shBarrageMount
  }

  public SelectShBarrage(w: MechWeapon, m: Mount) {
    this._shBarrageSelection = w
    this._shBarrageMount = m
  }

  public ClearShBarrage() {
    this._shBarrageSelection = null
    this._shBarrageMount = null
  }

  public SelectBarrage(w: MechWeapon, m: Mount) {
    if (this._barrageSelections.length < 2) this._barrageSelections.push(w)
    if (this._barrageMounts.length < 2) this._barrageMounts.push(m)
  }

  public RemoveBarrage(w: MechWeapon, m: Mount) {
    const idx = this._barrageSelections.findIndex(x => x.ID === w.ID)
    if (idx > -1) this._barrageSelections.splice(idx, 1)
    const midx = this._barrageMounts.findIndex(x => x.ID === m.ID)
    if (midx > -1) this._barrageMounts.splice(idx, 1)
  }

  public ClearBarrageSelections() {
    this._barrageSelections = []
    this._barrageMounts = []
  }

  public RegisterBarrage(free?: boolean) {
    this.CommitAction(
      this.AllActions.find(x => x.ID === 'act_barrage'),
      free
    )
  }

  public RegisterSkirmish(free?: boolean) {
    this.CommitAction(
      this.AllActions.find(x => x.ID === 'act_skirmish'),
      free
    )
  }

  public get AvailableAmmoUses(): number {
    const ac = this._mech.ActiveLoadout.IntegratedSystems.find(x => x.ID.includes('walking_armory'))
    if (!ac) return 0
    else return ac.Uses
  }

  public SpendAmmoCost(cost: number) {
    const ac = this._mech.ActiveLoadout.IntegratedSystems.find(x => x.ID.includes('walking_armory'))
    if (ac) ac.Uses -= cost
  }

  public RefundAmmoCost(cost: number) {
    const ac = this._mech.ActiveLoadout.IntegratedSystems.find(x => x.ID.includes('walking_armory'))
    if (ac) ac.Uses += cost
  }

  // -- Actions -----------------------------------------------------------------------------------
  private get timestamp(): string {
    const d = new Date()
    return `${d.getFullYear() + 3000}.${d.getMonth() + 1}.${d
      .getDate()
      .toString()
      .padStart(2, '0')}//${d
        .getHours()
        .toString()
        .padStart(2, '0')}:${d
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${d
            .getMilliseconds()
            .toString()
            .padStart(2, '0')}`
  }

  public SetLog(entry: { id: string; event: string; detail: string }, action?: Action) {
    this._log.push({
      id: entry.id,
      timestamp: this.timestamp,
      encounter: this._encounter,
      mission: this._mission,
      round: this._round,
      event: entry.event,
      detail: entry.detail,
      undoAction: action,
    })
  }

  public CommitAction(action: Action, free?: boolean) {
    let activationCost = 0
    if (!free) {
      const act = action.Activation
      if (act === ActivationType.Quick || act === ActivationType.QuickTech) activationCost = 1
      else if (act === ActivationType.Full || act === ActivationType.FullTech) activationCost = 2
    }

    if (this.Actions < activationCost) return

    free ? action.UseFree() : action.Use()

    this.Actions -= activationCost
    if (action.HeatCost) this._mech.CurrentHeat += action.HeatCost

    if (action.Deployable) {
      const instances = action.Deployable.instances || 1
      for (let i = 0; i < instances; i++) {
        this.Deploy(action.Deployable)
      }
    }

    console.log(action.ID)

    if (action.ID === 'act_boost') this.AddBoost()
    if (action.ID === 'core_active_activate') this.SetCorePower(0)
    if (action.ID === 'act_overcharge') this.CommitOvercharge()
    if (action.ID === 'act_stabilize') this.CommitStabilize()
    if (action.ID === 'act_jockey') this.IsJockeying = true
    else this.IsJockeying = false
    if (action.ID === 'act_self_destruct') this.StartSelfDestruct()
    if (action.ID === 'act_shut_down') this.CommitShutDown()
    if (action.ID === 'act_boot_up') this.CommitBootUp()
    if (action.ID === 'act_brace') this._braced = true
    if (action.ID === 'act_dismount') this._pilot_mounted = false
    if (action.ID === 'act_mount') this._pilot_mounted = true
    if (action.ID === 'act_hide') this._mech.AddStatus('HIDDEN')
    if (action.ID === 'act_eject') {
      this._mech.AddCondition('IMPAIRED')
      this._pilot_mounted = false
    }

    this.SetLog(
      {
        id: action.LogID,
        event: action.Activation.toUpperCase(),
        detail: action.Log ? action.Log : action.Name.toUpperCase(),
      },
      action
    )
  }

  public UndoAction(action: Action) {
    const act = action.LastUse
    if (act === ActivationType.Quick || act === ActivationType.QuickTech) this.Actions += 1
    else if (act === ActivationType.Full || act === ActivationType.FullTech) this.Actions += 2

    action.Undo()

    if (action.HeatCost) this._mech.CurrentHeat -= action.HeatCost

    const idx = this._log.map(x => x.id === action.LogID).lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)

    if (action.ID === 'act_overcharge') this.UndoOvercharge()
    if (action.ID === 'act_stabilize') this.UndoStabilize()
    if (action.ID === 'act_jockey') this.IsJockeying = false
    if (action.ID === 'act_self_destruct') this.CancelSelfDestruct()
    if (action.ID === 'act_shut_down') this.UndoShutDown()
    if (action.ID === 'act_boot_up') this.UndoBootUp()
    if (action.ID === 'act_brace') this._braced = false
    if (action.ID === 'act_dismount') this._pilot_mounted = true
    if (action.ID === 'act_mount') this._pilot_mounted = false
    if (action.ID === 'act_hide') this._mech.RemoveStatus('HIDDEN')
    if (action.ID === 'act_eject') {
      this._mech.RemoveCondition('IMPAIRED')
      this._pilot_mounted = true
    }
  }

  public SetMove(val: number) {
    this._stats.moves += this._mech.CurrentMove - val
    this._mech.CurrentMove = val
    if (this._mech.CurrentMove > this._mech.MaxMove) this._mech.CurrentMove = this._mech.MaxMove
    this.SetLog({
      id: `set_move`,
      event: 'MOVE',
      detail: `${val > 0 ? `FRAME/COMMIT.TAC: ${val} SPACES` : `FRAME/RESCIND.TAC: ${Math.abs(val)} SPACES`
        }`,
    })
  }

  public SetStatusCondition(statuses: string[], isStatus?: boolean) {
    const scType = isStatus ? 'Statuses' : 'Conditions'
    if (!statuses.length) {
      this._mech[scType] = statuses
      this.SetLog({
        id: `clear_status`,
        event: 'STATUS',
        detail: `FRAME/STATUS.CLEAR ++ALARM.OFF.ALL++`,
      })
      return
    }
    const added = statuses.find(x => !this._mech[scType].includes(x))
    const removed = this._mech[scType].find(x => !statuses.includes(x))
    const sstr = added ? added : removed
    this._mech[scType] = statuses
    this.SetLog({
      id: `set_status`,
      event: 'STATUS',
      detail: `${added ? '' : '!ALERT! '}FRAME/STATUS.${sstr.toUpperCase()} ++ALARM.${removed ? 'OFF' : 'ON'
        }++`,
    })
  }

  public SetResistance(resistances: string[]) {
    if (!resistances.length) {
      this._mech.Resistances = resistances
      this.SetLog({
        id: `clear_resist`,
        event: 'RESISTANCE',
        detail: `FRAME/DEF.RES ++RES.END.ALL++`,
      })
      return
    }
    const added = resistances.find(x => !this._mech.Resistances.includes(x))
    const removed = this._mech.Resistances.find(x => !resistances.includes(x))
    const sstr = added ? added : removed
    this._mech.Resistances = resistances
    this.SetLog({
      id: `set_res`,
      event: 'RESISTANCE',
      detail: `FRAME/DEF.RES::${sstr.toUpperCase()}${removed ? '++RES.END++' : ''}`,
    })
  }

  public SetBurn(val: number) {
    this._mech.Burn = val
    this.SetLog({
      id: `set_burn`,
      event: 'BURN',
      detail: `${val > 0
        ? `!ALERT! FRAME/DMG.ONGOING: ${val} ++ALARM.ON++`
        : `FRAME/DMG.MITIGATE: ${Math.abs(val)} ${this._mech.Burn > 0 ? '++ALARM.ON++' : '++ALARM.OFF++'
        }`
        }`,
    })
  }

  public CommitFullRepair() {
    this._mech.FullRepair()
    this.SetLog({
      id: `full_repair`,
      event: 'FULL REPAIR',
      detail: `FRAME/ROOT::FULL REPAIR`,
    })
  }

  public SetStructure(val: number) {
    this._stats.structure_damage += this._mech.CurrentStructure - val
    this._mech.CurrentStructure = val
    const pct = (this._mech.CurrentStructure / this._mech.MaxStructure).toFixed(2)
    this.SetLog({
      id: `set_str`,
      event: 'STRUCTURE DAMAGE',
      detail: `!CRITICAL! FRAME.STR::INTEGRITY COMPROMISED ++${pct}++`,
    })
  }

  public SetStress(val: number) {
    this._stats.reactor_damage += this._mech.CurrentStress - val
    this._mech.CurrentStress = val
    const pct = (this._mech.CurrentStress / this._mech.MaxStress).toFixed(2)
    this.SetLog({
      id: `set_stress`,
      event: 'REACTOR STRESS',
      detail: `!CRITICAL! FRAME.REACTOR::INTEGRITY COMPROMISED ++${pct}++`,
    })
  }

  public SetOvershield(val: number) {
    this._stats.overshield += this._mech.Overshield - val
    this._mech.Overshield = val
    this.SetLog({
      id: `set_overshield`,
      event: 'OVERSHIELD',
      detail: `FRAME.REMOTE::OVERSHIELD.SET ++${val}++`,
    })
  }

  public SetHp(val: number) {
    this._stats.hp_damage += this._mech.CurrentHP - val
    if (val > this._mech.CurrentHP) {
      this._mech.CurrentHP = val
      this.SetLog({
        id: `rep_dmg`,
        event: 'REPAIR',
        detail: `FRAME/REP.PROCESS:: ${val} HP RESTORED`,
      })
    } else {
      const str = this._mech.CurrentStructure
      this._mech.CurrentHP = val
      this.SetLog({
        id: `add_dmg`,
        event: 'DAMAGE',
        detail: `!WARN! INC:: ${val} HP DAMAGE`,
      })
      if (this._mech.CurrentStructure < str) {
        const pct = (this._mech.CurrentStructure / this._mech.MaxStructure).toFixed(2)
        this.SetLog({
          id: `set_str`,
          event: 'STRUCTURE DAMAGE',
          detail: `!CRITICAL! FRAME.STR::INTEGRITY COMPROMISED ++${pct}++`,
        })
      }
    }
  }

  public SetHeat(val: number) {
    this._stats.heat_damage += val
    if (val < this._mech.CurrentHeat) {
      const dz = this._mech.IsInDangerZone
      this._mech.CurrentHeat = val
      this.SetLog({
        id: `clear_heat`,
        event: 'CLEAR HEAT',
        detail: `FRAME/REACTOR.VENT:: ${val} HEAT CLEARED`,
      })
      if (dz && !this._mech.IsInDangerZone) {
        this.SetLog({
          id: `out_dangerzone`,
          event: 'HEAT LEVELS NOMINAL',
          detail: `FRAME/REACTOR:: ++TEMP.OK++`,
        })
      }
    } else {
      const str = this._mech.CurrentStress
      this._mech.CurrentHeat = val
      this.SetLog({
        id: `add_heat`,
        event: 'HEAT',
        detail: `!WARN! FRAME/REACTOR.HEAT_LVL:: ${val} HEAT`,
      })
      if (this._mech.IsInDangerZone) {
        this.SetLog({
          id: `dangerzone`,
          event: 'HEAT ALERT',
          detail: `!ALERT! FRAME/REACTOR:: ++TEMP.CRITICAL++`,
        })
      }
      if (this._mech.CurrentStress < str) {
        const pct = (this._mech.CurrentStress / this._mech.MaxStress).toFixed(2)
        this.SetLog({
          id: `set_stress`,
          event: 'REACTOR STRESS',
          detail: `!CRITICAL! FRAME.REACTOR::INTEGRITY COMPROMISED ++${pct}++`,
        })
      }
    }
  }

  public SetRepCap(val: number) {
    this._mech.CurrentRepairs = val
    this.SetLog({
      id: `set_rep`,
      event: 'REPAIR CAPACITY',
      detail: `${val < 0 ? `FRAME/COMMIT.REPAIR: ${val}` : `FRAME/RECOVER.REPAIR: ${Math.abs(val)}`
        }`,
    })
  }

  public SetCorePower(val: number) {
    console.log('in set core power', this._mech.CurrentCoreEnergy, val)
    if (this._mech.CurrentCoreEnergy > 0 && val === 0) this._mech.IsCoreActive = true
    this._stats.core_uses += this._mech.CurrentCoreEnergy - val
    this._mech.CurrentCoreEnergy = val
    this.SetLog({
      id: `set_core`,
      event: 'CORE POWER',
      detail: `${val > 0 ? `FRAME/CORE:: CAPACITY RESTORED` : `!ALERT! FRAME CORE ACTIVATION !ALERT!`
        }`,
    })
  }

  public SetOvercharge(val: number) {
    const inc = this._mech.CurrentOvercharge < val
    this._mech.CurrentOvercharge = val
    this.SetLog({
      id: `set_oc`,
      event: 'OVERCHARGE',
      detail: `${inc
        ? `!WARN! FRAME/REACTOR.SYS::POWER REROUTE CONFIRM ++HEAT.ALARM.ON++`
        : `FRAME/REACTOR.SYS::CHARGE PROTOCOL RECOVERY`
        }`,
    })
  }

  public CommitStabilize() {
    this._stabilizeUndo = {
      heat: this._mech.CurrentHeat,
      hp: this._mech.CurrentHP,
      reloads: this._mech.ActiveLoadout.Weapons.filter(x => x.IsLoading && !x.Loaded).map(
        w => w.ID
      ),
      burn: this._mech.Burn,
      exposed: this._mech.Statuses.includes('EXPOSED'),
    }
    let str = 'FRAME.ROOT.DEF//STABILIZE'
    if (this.StabilizeMajor === 'cool') {
      str += ' ::REACTOR_VENT'
      this._mech.CurrentHeat = 0
      const expIdx = this._mech.Statuses.indexOf('EXPOSED')
      if (expIdx > -1) this._mech.Statuses.splice(expIdx, 1)
    } else if (this.StabilizeMajor === 'repair') {
      str += ' ::REPAIR'
      this._mech.CurrentRepairs -= 1
      this._mech.CurrentHP = this._mech.MaxHP
    }

    if (this.StabilizeMinor === 'reload') {
      str += ' ::RELOAD'
      this._mech.ActiveLoadout.Weapons.filter(x => x.IsLoading && !x.Loaded).forEach(
        w => (w.Loaded = true)
      )
    } else if (this.StabilizeMinor === 'end_burn') {
      str += ' ::END.BURN'
      this._mech.Burn = 0
    } else if (this.StabilizeMinor === 'end_self_condition') str += ' ::SYS.RESTORE'
    else if (this.StabilizeMinor === 'end_ally_condition') str += ' ::REMOTE.ASSIST'

    this.SetLog({
      id: `stabilize`,
      event: 'STABILIZE',
      detail: str,
    })

    this._last_stabilize_major = this.StabilizeMajor
    this.StabilizeMajor = null
    this._last_stabilize_minor = this.StabilizeMinor
    this.StabilizeMinor = null
  }

  public UndoStabilize() {
    const idx = this._log.map(x => x.id === 'stabilize').lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
    if (this._last_stabilize_major === 'cool') {
      this._mech.CurrentHeat = this._stabilizeUndo.heat
      if (this._stabilizeUndo.exposed) this._mech.Statuses.push('EXPOSED')
    } else if (this._last_stabilize_major === 'repair') {
      this._mech.CurrentRepairs += 1
      this._mech.CurrentHP = this._stabilizeUndo.hp
    }

    if (this._last_stabilize_minor === 'reload') {
      this._stabilizeUndo.reloads.forEach(
        x => (this._mech.ActiveLoadout.Weapons.find(w => w.ID === x).Loaded = false)
      )
    } else if (this._last_stabilize_minor === 'end_burn') {
      this._mech.Burn = this._stabilizeUndo.burn
    }
  }

  public ClearBurn() {
    this._mech.Burn = 0
  }

  public TakeBurn() {
    this._mech.AddDamage(this._mech.Burn)
  }

  public AddBoost() {
    this._mech.Boost = this._mech.MaxMove
  }

  public SetBoost(val) {
    this._mech.Boost = val
  }

  public CommitOvercharge() {
    this._overchargeUndo = []
    this.AllActions.concat(this.TechActions).forEach(a => {
      if (a.Used) this._overchargeUndo.push(a.ID)
      a.Reset()
    })
    this.Actions += 1
    this._mech.AddHeat(this.OverchargeHeat)
    if (this._mech.CurrentOvercharge < this._mech.OverchargeTrack.length)
      this._mech.CurrentOvercharge += 1
    this.AllActions.find(x => x.ID === 'act_overcharge').Use()
  }

  public UndoOvercharge() {
    this.AllActions.forEach(a => {
      if (this._overchargeUndo.includes(a.ID)) a.Use()
    })
    this.TechActions.forEach(a => {
      if (this._overchargeUndo.includes(a.ID)) a.Use()
    })
    this._overchargeUndo = []
    this.Actions -= 1
    this._mech.ReduceHeat(this.OverchargeHeat)
    if (this._mech.CurrentOvercharge > 0) this._mech.CurrentOvercharge -= 1
    this.OverchargeHeat = 0
  }

  public CommitShutDown() {
    this._shutDownUndo = {
      heat: this._mech.CurrentHeat,
      cascade: this._mech.ActiveLoadout.Equipment.filter(x => x.IsCascading).map(e => e.ID),
      statuses: this._mech.Statuses,
      conditions: this._mech.Conditions,
    }
    this._mech.CurrentHeat = 0
    this._mech.RemoveStatus('EXPOSED')
    this._mech.RemoveCondition('JAMMED')
    this._mech.RemoveCondition('LOCK ON')
    this._mech.ActiveLoadout.Equipment.filter(x => x.IsCascading).forEach(e => {
      e.IsCascading = false
    })
    this._mech.AddStatus('SHUT DOWN')
    this._mech.AddStatus('STUNNED')
  }

  public UndoShutDown() {
    this._mech.CurrentHeat = this._shutDownUndo.heat
    this._mech.ActiveLoadout.Equipment.forEach(e => {
      if (this._shutDownUndo.cascade.includes(e.ID)) e.IsCascading = true
    })
    this._mech.Statuses = this._shutDownUndo.statuses
    this._mech.Conditions = this._shutDownUndo.conditions
  }

  public CommitBootUp() {
    this._mech.RemoveStatus('SHUT DOWN')
    this._mech.RemoveCondition('STUNNED')
  }

  public UndoBootUp() {
    this._mech.AddStatus('SHUT DOWN')
    this._mech.AddCondition('STUNNED')
  }

  public LogAttackAction(action: string, weapon: string, damage: number, kill?: boolean) {
    this._stats.damage += damage
    this._stats.kills += kill ? 1 : 0
    this.SetLog({
      id: action,
      event: weapon.toUpperCase(),
      detail: `${action.toUpperCase()}//${weapon.toUpperCase()}::${damage} DMG ${kill ? '++KILL CONFIRM++' : ''
        }`,
    })
  }

  public UndoLogAttackAction(action: string, weapon: string, damage: number, kill?: boolean) {
    this._stats.damage -= damage
    this._stats.kills -= kill ? 1 : 0
    const idx = this._log
      .map(x => x.id === action && x.event === weapon.toUpperCase())
      .lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
  }

  public Deploy(d: IDeployableData) {
    const n = this._deployed.filter(x => x.BaseName.toLowerCase().includes(d.name.toLowerCase()))
      .length
    this._deployed.push(new Deployable(d, this._mech, n))
    this.SetLog({
      id: `deploy`,
      event: 'DEPLOY EQUIPMENT',
      detail: `FRAME/REMOTE::${d.name.toUpperCase().replace(/\s/g, '.')}.${n} ++STATUS OK++`,
    })
    this.save()
  }

  public get Deployed(): Deployable[] {
    return this._deployed
  }

  public RemoveDeployable(id: string) {
    this._deployed.splice(
      this._deployed.findIndex(x => x.ID === id),
      1
    )
    this.save()
  }

  public RecallDeployable(d: Deployable): boolean {
    let activationCost = 0
    if (d.Recall === ActivationType.Quick) activationCost = 1
    else if (d.Recall === ActivationType.Full) activationCost = 2

    if (this.Actions < activationCost) return false
    this._actions -= activationCost

    this.SetLog({
      id: `recall_${d.ID}`,
      event: 'RECALL EQUIPMENT',
      detail: `DEPLOYABLE.RECALL//${d.Name}`,
    })

    d.IsRecalled = true
    this.save()
    return true
  }

  public RedeployDeployable(d: Deployable): boolean {
    let activationCost = 0
    if (d.Redeploy === ActivationType.Quick) activationCost = 1
    else if (d.Redeploy === ActivationType.Full) activationCost = 2

    if (this.Actions < activationCost) return false
    this._actions -= activationCost

    this.SetLog({
      id: `redeploy_${d.ID}`,
      event: 'REDEPLOY EQUIPMENT',
      detail: `DEPLOYABLE.REDEPLOY//${d.Name}`,
    })

    d.IsRecalled = false
    this.save()
    return true
  }

  // -- Action Collection -------------------------------------------------------------------------

  private get baseActions(): Action[] {
    return store.getters.getItemCollection('Actions').filter(x => x)
  }

  public BaseActions(type: string): Action[] {
    return this.baseActions.filter(x => x.Activation === type)
  }

  public ItemActions(type: string): Action[] {
    return this._mech.Actions.filter(x => x.Activation === type)
  }

  public ActionsByType(type: string): Action[] {
    return this.BaseActions(type).concat(this.ItemActions(type))
  }

  private get baseActionTypes() {
    const exclude = ['Move', 'Invade', 'Quick Tech', 'Full Tech']
    return Object.keys(ActivationType)
      .map(k => ActivationType[k as string])
      .filter(x => !exclude.includes(x))
  }

  private get techActionTypes() {
    const include = ['Invade', 'Quick Tech', 'Full Tech']
    return Object.keys(ActivationType)
      .map(k => ActivationType[k as string])
      .filter(x => include.includes(x))
  }

  public get AllBaseActions(): Action[] {
    return this.baseActionTypes.flatMap(t => this.BaseActions(t))
  }

  public get AllBaseTechActions(): Action[] {
    return this.techActionTypes.flatMap(t => this.BaseActions(t))
  }

  public get AllItemActions(): Action[] {
    return this.baseActionTypes.flatMap(t => this.ItemActions(t))
  }

  public get AllItemTechActions(): Action[] {
    return this.techActionTypes.flatMap(t => this.ItemActions(t))
  }

  public get AllActions(): Action[] {
    return this.AllBaseActions.concat(this.AllItemActions)
  }

  public get AvailableActions(): string[] {
    if (this.Stage === 'Narrative')
      return store.getters
        .getItemCollection('Actions')
        .filter(x => x && x.Activation === 'Downtime')
        .map(x => x.ID)

    if (!this.IsMounted) {
      const pilotActions = this.AllActions.filter(x => x.IsPilotAction && !x.IsActiveHidden).map(
        x => x.ID
      )
      if (!this._mech.ReactorDestroyed) return pilotActions
      return pilotActions.filter(x => x !== 'act_mount')
    } else {
      if (this._mech.IsShutDown) {
        return ['act_boot_up', 'act_dismount', 'act_eject']
      }
      if (this._mech.IsStunned) {
        return ['act_dismount', 'act_eject']
      }
      if (this._mech.ReactorDestroyed) {
        return []
      }
      if (this._mech.Destroyed) {
        return ['act_dismount']
      }
      const out = this.AllActions.filter(x => x.IsMechAction && !x.IsActiveHidden).map(x => x.ID)
      if (!this._mech.IsShutDown) out.splice(out.indexOf('act_boot_up'), 1)
      return out
    }
  }

  public get TechActions(): Action[] {
    const exclude = ['QUICK TECH', 'FULL TECH']
    const out = this.AllBaseTechActions.concat(this.AllItemTechActions)
    return out.filter(x => !exclude.some(y => y === x.Name.toUpperCase()))
  }

  public get DowntimeActions(): Action[] {
    return store.getters.getItemCollection('Actions').filter(x => x && x.Activation === 'Downtime')
  }

  // -- Log ---------------------------------------------------------------------------------------
  public get Log() {
    return this._log
  }

  // -- I/O ---------------------------------------------------------------------------------------

  public static Serialize(s: ActiveState): IActiveStateData {
    return {
      active_mech_id: s._mech ? s._mech.ID : '',
      stage: s._stage,
      turn: s._round,
      mission: s._mission,
      actions: s._actions,
      braced: s._braced,
      overcharged: s._overcharged,
      prepare: s._prepare,
      bracedCooldown: s._bracedCooldown,
      redundant: s._redundant,
      mounted: s._pilot_mounted,
      stats: s._stats,
      deployed: s._deployed.map(x => Deployable.Serialize(x)),
    }
  }

  public static Deserialize(pilot: Pilot, data: IActiveStateData): ActiveState {
    const mech = pilot.Mechs.find(x => x.ID === data.active_mech_id)
    if (!mech) return new ActiveState(pilot)
    const s = new ActiveState(pilot)
    s._mech = mech
    s._stage = (data.stage as Stage) || Stage.Narrative
    s._round = data.turn || 1
    s._mission = data.mission || 0
    s._actions = data.actions || 2
    s._braced = data.braced
    s._overcharged = data.overcharged
    s._prepare = data.prepare
    s._bracedCooldown = data.bracedCooldown
    s._redundant = data.redundant
    s._pilot_mounted = data.mounted
    s._stats = data.stats ? data.stats : ActiveState.NewCombatStats()
    s._deployed = data.deployed ? data.deployed.map(x => Deployable.Deserialize(x, s._mech)) : []
    return s
  }
}

export { ActiveState, IActiveStateData, ICombatStats }
