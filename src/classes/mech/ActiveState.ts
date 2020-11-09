// defines the pilot's relationship to the mech for actvive mode. does not hold active mech info (eg heat, destroyed status)
// but associated logic should be handled by this class (eg. ride-along conditions)

// activemech via activestate
// status via activestate
// new ver tutorial on startup (first time only, track in profile)

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { store } from '@/store'
import { Mech, Deployable, Pilot, MechEquipment, MechWeapon, Mount, ActivationType } from '@/class'
import { Action } from '@/interface'
import { ICombatLogData } from '../pilot/CombatLog'
import { IDeployableData } from '../Deployable'

enum Stage {
  Narrative = 'Narrative',
  Combat = 'Combat',
  Rest = 'Rest',
}

interface IActiveStateData {
  stage: string
  turn: number
  actions: number
  overwatch: boolean
  braced: boolean
  overcharged: boolean
  prepare: boolean
  bracedCooldown: boolean
  redundant: boolean
  history: IHistoryItem[]
  mounted: boolean
}

class ActiveState {
  private _deployed: Deployable[]
  public _stage: Stage

  private _log: ICombatLogData[] // write this to a pilot log after mission is ended

  private _pilot_mounted: boolean
  private _pilot_move: number

  private _pilot_status: string //enum?

  private _pilot: Pilot
  private _mech: Mech | null

  private _round: number
  private _encounter: number

  private _actions: number

  private _barrageSelections: MechWeapon[]
  private _barrageMounts: Mount[]
  private _shBarrageSelection: MechWeapon
  private _shBarrageMount: Mount

  private _stabilizeUndo: {
    heat: number
    hp: number
    reloads: string[]
    burn: number
    exposed: boolean
  }

  private _overwatch: boolean
  private _braced: boolean
  private _overcharged: boolean
  private _prepare: boolean
  private _bracedCooldown: boolean
  private _redundant: boolean
  private _history: IHistoryItem[]

  public constructor(pilot: Pilot) {
    this._pilot = pilot
    this._mech = null
    this._stage = Stage.Narrative
    this._round = 1
    this._encounter = 1
    this._pilot_move = pilot.Speed
    this._actions = 2
    this._barrageSelections = []
    this._barrageMounts = []
    this._overwatch = false
    this._braced = false
    this._overcharged = false
    this._prepare = false
    this._bracedCooldown = false
    this._redundant = false
    this._history = []
    this._log = []
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public newRound(): void {
    this._round += 1
    this._history = []
    this._pilot_move = this._pilot.Speed
    this._actions = 2
    this._barrageSelections = []
    this._overcharged = false
    this._overwatch = false
    this._prepare = false
    if (this._braced) {
      this._bracedCooldown = true
      this._actions = 1
      this._braced = false
    } else if (this._bracedCooldown) {
      this._bracedCooldown = false
    }
    if (this._mech.Burn) {
      this._mech.AddDamage(this._mech.Burn, 'Burn')
    }
  }

  public get Move(): number {
    return !this._pilot_mounted ? this._pilot_move : this._mech.CurrentMove
  }

  public get MaxMove(): number {
    return !this._pilot_mounted ? this._pilot.Speed : this._mech.Speed
  }

  public get Actions(): number {
    return this._actions
  }

  public set Actions(val: number) {
    this._actions = val
  }

  public get IsProtocolAvailable(): boolean {
    return this.Move === this.MaxMove && this.Actions === 2 && !this._overcharged
  }

  public get Stage(): Stage {
    return this._stage
  }

  public get Encounter(): number {
    return this._encounter
  }

  public get Round(): number {
    return this._round
  }

  public StartCombat(): void {
    this._stage = Stage.Combat
    this._pilot_mounted = true
    this._round = 1
    this._encounter++
    this.save()
  }

  public NextRound(): void {
    this._round++
    this._actions = 2
    this._pilot_move = this._pilot.Speed
    // TODO: base on freq
    this.AllActions.forEach(a => a.Reset())
    this._mech.CurrentMove = this._mech.MaxMove
    //if in brace recovery, do so here
    this.save()
  }

  public StartRest(): void {
    this._stage = Stage.Rest
    this._pilot.CurrentHP += Math.ceil(this._pilot.MaxHP / 2)
    this._mech.CurrentHeat = 0
    this._mech.Conditions.splice(0, this._mech.Conditions.length)
    this._mech.Statuses.splice(0, this._mech.Statuses.length)
    this.save()
  }

  RepairHP(): void {
    this._mech.CurrentHP = this._mech.MaxHP
    this._mech.CurrentRepairs -= 1
  }

  RepairStructure(): void {
    this._mech.CurrentStructure += 1
    this._mech.CurrentRepairs -= this._mech.ID === 'mf_standard_pattern_i_everest' ? 1 : 2
  }

  RepairStress(): void {
    this._mech.CurrentStress = this._mech.MaxStress
    this._mech.CurrentRepairs -= 2
  }

  RepairSystem(w: MechEquipment): void {
    w.Repair()
    this._mech.CurrentRepairs -= 1
  }

  RepairDestroyed(selfRepairPts: number): void {
    this._mech.CurrentRepairs -= selfRepairPts
    this._mech.Repair()
  }

  public StartDowntime(): void {
    this._stage = Stage.Narrative
    this.save()
  }

  public set ActiveMech(mech: Mech | null) {
    this._mech = mech
    this.save()
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

  public MountMech(): void {
    this.IsMounted = true
  }

  public DismountMech(): void {
    this.IsMounted = false
  }

  public EjectMech(): void {
    // add Impaired
    // mech remains impaired and cannot eject again until a full repair
    this.IsMounted = false
  }

  // public DestroyMech()
  // public StartMeltdown()
  // public DestroyReactor()

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

  public SetLog(entry: { id: string; event: string; detail: string }) {
    this._log.push({
      id: entry.id,
      timestamp: this.timestamp,
      encounter: this._encounter,
      round: this._round,
      event: entry.event,
      detail: entry.detail,
    })
  }

  public CommitAction(action: Action, activation: ActivationType) {
    let activationCost = 0
    if (activation === ActivationType.Quick) activationCost = 1
    else if (activation === ActivationType.Full) activationCost = 2

    if (this.Actions >= activationCost) {
      action.Use()
      this.Actions -= activationCost
      if (action.HeatCost) this._mech.CurrentHeat += action.HeatCost
      this.SetLog({
        id: action.LogID,
        event: action.Activation.toUpperCase(),
        detail: action.Name.toUpperCase(),
      })
    }

    if (action.ID === 'act_dismount') this._pilot_mounted = false
    if (action.ID === 'act_mount') this._pilot_mounted = true
  }

  public UndoAction(action: Action, activation: ActivationType) {
    if (activation === ActivationType.Quick) this.Actions += 1
    else if (activation === ActivationType.Full) this.Actions += 2
    action.Undo()
    if (action.HeatCost) this._mech.CurrentHeat -= action.HeatCost
    const idx = this._log.map(x => x.id === action.LogID).lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
  }

  public SetMove(val: number) {
    this._mech.CurrentMove = val
    this.SetLog({
      id: `set_move`,
      event: 'MOVE',
      detail: `${
        val > 0 ? `FRAME/COMMIT.TAC: ${val} SPACES` : `FRAME/RESCIND.TAC: ${Math.abs(val)} SPACES`
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
      detail: `${added ? '' : '!ALERT! '}FRAME/STATUS.${sstr.toUpperCase()} ++ALARM.${
        removed ? 'OFF' : 'ON'
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
      detail: `${
        val > 0
          ? `!ALERT! FRAME/DMG.ONGOING: ${val} ++ALARM.ON++`
          : `FRAME/DMG.MITIGATE: ${Math.abs(val)} ${
              this._mech.Burn > 0 ? '++ALARM.ON++' : '++ALARM.OFF++'
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
    this._mech.CurrentStructure = val
    const pct = (this._mech.CurrentStructure / this._mech.MaxStructure).toFixed(2)
    this.SetLog({
      id: `set_str`,
      event: 'STRUCTURE DAMAGE',
      detail: `!CRITICAL! FRAME.STR::INTEGRITY COMPROMISED ++${pct}++`,
    })
  }

  public SetStress(val: number) {
    this._mech.CurrentStress = val
    const pct = (this._mech.CurrentStress / this._mech.MaxStress).toFixed(2)
    this.SetLog({
      id: `set_stress`,
      event: 'REACTOR STRESS',
      detail: `!CRITICAL! FRAME.REACTOR::INTEGRITY COMPROMISED ++${pct}++`,
    })
  }

  public SetOvershield(val: number) {
    this._mech.Overshield = val
    this.SetLog({
      id: `set_overshield`,
      event: 'OVERSHIELD',
      detail: `FRAME.REMOTE::OVERSHIELD.SET ++${val}++`,
    })
  }

  public SetHp(val: number) {
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
      detail: `${
        val < 0 ? `FRAME/COMMIT.REPAIR: ${val}` : `FRAME/RECOVER.REPAIR: ${Math.abs(val)}`
      }`,
    })
  }

  public SetCorePower(val: number) {
    this._mech.CurrentCoreEnergy = val
    this.SetLog({
      id: `set_core`,
      event: 'CORE POWER',
      detail: `${
        val > 0 ? `FRAME/CORE:: CAPACITY RESTORED` : `!ALERT! FRAME CORE ACTIVATION !ALERT!`
      }`,
    })
  }

  public SetOvercharge(val: number) {
    const inc = this._mech.CurrentOvercharge < val
    this._mech.CurrentOvercharge = val
    this.SetLog({
      id: `set_oc`,
      event: 'OVERCHARGE',
      detail: `${
        inc
          ? `!WARN! FRAME/REACTOR.SYS::POWER REROUTE CONFIRM ++HEAT.ALARM.ON++`
          : `FRAME/REACTOR.SYS::CHARGE PROTOCOL RECOVERY`
      }`,
    })
  }

  public CommitStabilize(major: string, minor: string) {
    this.Actions -= 2
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
    if (major === 'cool') {
      str += ' ::REACTOR_VENT'
      this._mech.CurrentHeat = 0
      const expIdx = this._mech.Statuses.indexOf('EXPOSED')
      if (expIdx > -1) this._mech.Statuses.splice(expIdx, 1)
    } else if (major === 'repair') {
      str += ' ::REPAIR'
      this._mech.CurrentRepairs -= 1
      this._mech.CurrentHP = this._mech.MaxHP
    }

    if (minor === 'reload') {
      str += ' ::RELOAD'
      this._mech.ActiveLoadout.Weapons.filter(x => x.IsLoading && !x.Loaded).forEach(
        w => (w.Loaded = true)
      )
    } else if (minor === 'end_burn') {
      str += ' ::END.BURN'
      this._mech.Burn = 0
    } else if (minor === 'end_self_condition') str += ' ::SYS.RESTORE'
    else if (minor === 'end_ally_condition') str += ' ::REMOTE.ASSIST'

    this.SetLog({
      id: `stabilize`,
      event: 'STABILIZE',
      detail: str,
    })
  }

  public UndoStabilize(major: string, minor: string) {
    this.Actions += 2
    const idx = this._log.map(x => x.id === 'stabilize').lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
    if (major === 'cool') {
      this._mech.CurrentHeat = this._stabilizeUndo.heat
      if (this._stabilizeUndo.exposed) this._mech.Statuses.push('EXPOSED')
    } else if (major === 'repair') {
      this._mech.CurrentRepairs += 1
      this._mech.CurrentHP = this._stabilizeUndo.hp
    }

    if (minor === 'reload') {
      this._stabilizeUndo.reloads.forEach(
        x => (this._mech.ActiveLoadout.Weapons.find(w => w.ID === x).Loaded = false)
      )
    } else if (minor === 'end_burn') {
      this._mech.Burn = this._stabilizeUndo.burn
    }
  }

  public LogAttackAction(action: string, weapon: string, damage: number, kill?: boolean) {
    this.SetLog({
      id: action,
      event: weapon.toUpperCase(),
      detail: `${action.toUpperCase()}//${weapon.toUpperCase()}::${damage} DMG ${
        kill ? '++KILL CONFIRM++' : ''
      }`,
    })
  }

  public UndoLogAttackAction(action: string, weapon: string) {
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
  }

  restart(): void {
    this._round = 1
    this._history = []
    this._actions = 2
    this._overcharged = false
    this._prepare = false
    this._braced = false
    this._bracedCooldown = false
  }

  quickAction() {
    if (this._actions > 0) {
      this._history.push({ field: 'actions', val: this._actions })
      this._actions--
    }
  }

  boost() {
    if (this._actions > 0) {
      this._history.push({ field: 'boost' })
      this._actions--
      // this._maxMove += this._mech.Ejected ? this._mech.Pilot.Speed : this._mech.Speed
      // if (this._move < 0) this._move === 0
    }
  }

  hide() {
    this._history.push({ field: 'hide', val: false })
    if (!this._mech.Statuses.includes('HIDDEN')) this._mech.Statuses.push('HIDDEN')
    this._actions -= 1
  }

  dismount() {
    this._history.push({ field: 'dismount', val: false })
    this._mech.Ejected = true
    this._actions -= 2
  }

  eject() {
    this._history.push({ field: 'eject', val: false })
    this._mech.Ejected = true
    this._actions -= 1
  }

  remount() {
    this._history.push({ field: 'remount', val: false })
    this._mech.Ejected = false
    this._actions -= 2
  }

  fullAction() {
    if (this._actions >= 2) {
      this._history.push({ field: 'actions', val: 2 })
      this._actions -= 2
    }
  }

  bombard() {
    if (this._actions >= 2) {
      this._history.push({ field: 'bombard', val: false })
      this._actions -= 2
      const abidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
      if (abidx > -1) this._mech.Pilot.Reserves[abidx].Used = true
    }
  }

  redundantRepair() {
    const rridx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_redundant_repair')
    if (rridx > -1) this._mech.Pilot.Reserves[rridx].Used = true
    // this.$refs.stabilize.show(true)
  }

  deployableShield() {
    this._history.push({ field: 'depshield', val: false })
    const dsidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_deployable_shield')
    if (dsidx > -1) this._mech.Pilot.Reserves[dsidx].Used = true
  }

  coreBattery() {
    this._history.push({ field: 'corebattery', val: false })
    const cbidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_core_battery')
    if (cbidx > -1) this._mech.Pilot.Reserves[cbidx].Used = true
    this._mech.CurrentCoreEnergy = 1
  }

  setPrepare() {
    this._history.push({ field: 'prepare', val: false })
    this._prepare = true
    this._actions -= 1
  }

  setBrace() {
    this._history.push({ field: 'braced', val: false })
    if (!this._mech.Resistances.includes('Next Attack')) this._mech.Resistances.push('Next Attack')
    this._braced = true
  }

  setOverwatch() {
    this._history.push({ field: 'overwatch', val: false })
    this._overwatch = true
  }

  commitOvercharge(heat: number) {
    this._history.push({ field: 'overcharge', val: heat })
    this._overcharged = true
    this._mech.CurrentOvercharge += 1
    this._actions += 1
    this._mech.AddHeat(heat)
  }

  commitStabilize(actionsUsed: number) {
    this._actions += actionsUsed
  }

  endStatus(s: string) {
    const stidx = this._mech.Statuses.findIndex(x => x === s)
    if (stidx > -1) this._mech.Statuses.splice(stidx, 1)
  }

  endCondition(s: string) {
    const stidx = this._mech.Conditions.findIndex(x => x === s)
    if (stidx > -1) this._mech.Conditions.splice(stidx, 1)
  }

  shutDown() {
    this._mech.Statuses.push('SHUT DOWN')
    this._mech.Conditions.push('STUNNED')
    this._actions -= 1
    this._mech.CurrentHeat = 0
    this.endStatus('EXPOSED')
    this._history.push({ field: 'shutdown' })
  }

  boot() {
    this.endStatus('SHUT DOWN')
    this.endCondition('STUNNED')
    // this._move = 0
    this._actions = 0
  }

  meltdown() {
    this._history.push({ field: 'meltdown', val: true })
    this._mech.Destroy()
    this._mech.ReactorDestroyed = true
  }

  avoidMeltdown() {
    this._history.push({ field: 'avoid_meltdown', val: false })
    this._mech.MeltdownImminent = false
  }

  // -- Action Collection -------------------------------------------------------------------------

  private get baseActions(): Action[] {
    return store.getters.getItemCollection('Actions').filter(x => x)
  }

  public BaseActions(type: string): Action[] {
    let act = this.baseActions.filter(
      x =>
        x.Activation === type &&
        ((x.IsMechAction && this._pilot_mounted) || (x.IsPilotAction && !this._pilot_mounted))
    )
    if (!this._mech.IsShutDown) act = act.filter(x => x.ID !== 'act_boot_up')
    if (type === ActivationType.Free)
      act.push(this.baseActions.find(x => x.ID === 'act_overcharge'))
    // if (type === ActivationType.Quick) act.push(this.baseActions.find(x => x.ID === 'act_invade'))
    return act.filter(x => !x.IsActiveHidden)
  }

  public ItemActions(type: string): Action[] {
    return this._mech.Actions.filter(
      x =>
        x.Activation === type &&
        ((x.IsMechAction && this._pilot_mounted) || (x.IsPilotAction && !this._pilot_mounted))
    )
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

  public get TechActions(): Action[] {
    const exclude = ['QUICK TECH', 'FULL TECH']
    const out = this.AllBaseTechActions.concat(this.AllItemTechActions)
    return out.filter(x => !exclude.some(y => y === x.Name.toUpperCase()))
  }

  // interface ICombatLogData {
  //   date: string
  //   mission: number
  //   encounter: number
  //   turn: number
  //   round: number
  //   event: string
  //   detail: string
  // }

  // -- Log ---------------------------------------------------------------------------------------
  public get Log() {
    return this._log
  }

  // -- I/O ---------------------------------------------------------------------------------------

  public static Serialize(s: ActiveState): IActiveStateData {
    return {
      stage: s._stage,
      turn: s._round,
      // move: s.Move,
      actions: s._actions,
      overwatch: s._overwatch,
      braced: s._braced,
      overcharged: s._overcharged,
      prepare: s._prepare,
      bracedCooldown: s._bracedCooldown,
      redundant: s._redundant,
      history: s._history,
      mounted: s._pilot_mounted,
    }
  }

  public static Deserialize(pilot: Pilot, data: IActiveStateData): ActiveState {
    const s = new ActiveState(pilot)
    s._stage = (data.stage as Stage) || Stage.Narrative
    s._round = data.turn || 1
    s._actions = data.actions || 2
    s._overwatch = data.overwatch || false
    s._braced = data.braced
    s._overcharged = data.overcharged
    s._prepare = data.prepare
    s._bracedCooldown = data.bracedCooldown
    s._redundant = data.redundant
    s._history = data.history
    s._pilot_mounted = data.mounted
    return s
  }
}

export { ActiveState, IActiveStateData }
