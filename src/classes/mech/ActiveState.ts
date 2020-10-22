// defines the pilot's relationship to the mech for actvive mode. does not hold active mech info (eg heat, destroyed status)
// but associated logic should be handled by this class (eg. ride-along conditions)

// activemech via activestate
// status via activestate
// new ver tutorial on startup (first time only, track in profile)

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Vue from 'vue'
import { store } from '@/store'
import {
  Mech,
  Drone,
  Deployable,
  Pilot,
  MechEquipment,
  MechWeapon,
  Mount,
  ActivationType,
} from '@/class'
import { Action } from '@/interface'

enum Stage {
  Narrative = 'Narrative',
  Combat = 'Combat',
  Rest = 'Rest',
}

interface LogEntry {
  id: string
  key: string
  value: any
  detail: string
}

interface IActiveStateData {
  stage: string
  turn: number
  move: number
  actions: number
  overwatch: boolean
  braced: boolean
  overcharged: boolean
  prepare: boolean
  bracedCooldown: boolean
  redundant: boolean
  history: IHistoryItem[]
  // active_mech_id: string
  mounted: boolean
}

class ActiveState {
  private _deployed_drones: Drone[]
  private _deployed_deployables: Deployable[]
  public _stage: Stage

  private _log: LogEntry[] // write this to a pilot log after mission is ended

  private _pilot_mounted: boolean

  private _pilot_status: string //enum?

  private _pilot: Pilot
  private _mech: Mech | null

  private _round: number
  private _encounter: number

  private _barrageSelections: MechWeapon[]
  private _barrageMounts: Mount[]

  private _move: number
  private _maxMove: number
  private _actions: number
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
    this._encounter = 0
    this._move = 0
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
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public newRound(): void {
    this._round += 1
    this._history = []
    this._move = 0
    this._actions = 2
    this._barrageSelections = []
    this._overcharged = false
    this._overwatch = false
    this._prepare = false
    if (this._braced) {
      this._bracedCooldown = true
      this._actions = 1
      this._move = this._maxMove
      this._braced = false
    } else if (this._bracedCooldown) {
      this._bracedCooldown = false
    }
    if (this._mech.Burn) {
      this._mech.AddDamage(this._mech.Burn, 'Burn')
    }
  }

  public get MaxMove(): number {
    return this._pilot_mounted ? this._pilot.Speed : this._mech.Speed
  }

  public get Stage(): Stage {
    return this._stage
  }

  public StartCombat(): void {
    this._stage = Stage.Combat
    this._pilot_mounted = true
    this._round = 1
    this._encounter++
    this.save()
  }

  public get Round(): number {
    return this._round
  }

  public NextRound(): void {
    this._round++
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
  // public DestroyReactor()
  // public StartMeltdown()

  public get BarrageSelections(): MechWeapon[] {
    return this._barrageSelections
  }

  public get BarrageMounts(): Mount[] {
    return this._barrageMounts
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

  restart(): void {
    this._round = 1
    this._history = []
    this._move = 0
    this._actions = 2
    this._maxMove = this._mech.Ejected ? this._mech.Pilot.Speed : this._mech.Speed
    this._overcharged = false
    this._prepare = false
    this._braced = false
    this._bracedCooldown = false
  }

  //undo needs to be able to take a generic action
  undo(): void {
    const action = this._history.pop()
    switch (action.field) {
      case 'avoid_meltdown':
        this._mech.MeltdownImminent = true
      case 'meltdown':
        this._mech.Destroyed = false
        this._mech.ReactorDestroyed = false
      case 'boost':
        this._maxMove -= this._mech.Ejected ? this._mech.Pilot.Speed : this._mech.Speed
        if (this._move < this._maxMove) this._move === this._maxMove
        this._actions += 1
        break
      case 'hide':
        const hidx = this._mech.Statuses.findIndex(x => x === 'Hidden')
        if (hidx > -1) this._mech.Statuses.splice(hidx, 1)
        this._actions += 1
        break
      case 'dismount':
        this._actions += 1
      case 'eject':
        this._mech.Ejected = false
        this._actions += 1
        break
      case 'remount':
        this._mech.Ejected = true
        this._actions += 2
        break
      case 'bombard':
        this._actions += 2
        const abidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        if (abidx > -1) this._mech.Pilot.Reserves[abidx].Used = false
        break
      case 'depshield':
        const dsidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        if (dsidx > -1) this._mech.Pilot.Reserves[dsidx].Used = false
        break
      case 'corebattery':
        const cdidx = this._mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        this._mech.CurrentCoreEnergy = 0
        if (cdidx > -1) this._mech.Pilot.Reserves[cdidx].Used = false
        break
      case 'overcharge':
        this._mech.ReduceHeat(action.val, true)
        this._actions -= 1
        break
      case 'prepare':
        this._actions += 1
      case 'shutdown':
        this._actions += 1
        const sdidx = this._mech.Statuses.findIndex(x => x === 'SHUT DOWN')
        if (sdidx > -1) this._mech.Statuses.splice(sdidx, 1)
      case 'braced':
        const bidx = this._mech.Resistances.findIndex(x => x === 'Next Attack')
        if (bidx > -1) this._mech.Resistances.splice(bidx, 1)
      default:
        Vue.set(this, action.field, action.val)
        break
    }
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
      this._maxMove += this._mech.Ejected ? this._mech.Pilot.Speed : this._mech.Speed
      if (this._move < 0) this._move === 0
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
    this._move = 0
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

  public get Protocols(): Action[] {
    return this._mech.Actions.filter(x => x.Activation === 'Protocol')
  }

  public get MoveActions(): string[] {
    return ['move']
  }

  private get baseActions(): Action[] {
    return store.getters.getItemCollection('Actions')
  }

  public BaseActions(type: string): Action[] {
    let act = this.baseActions.filter(
      x => x.Activation === type && x.IsPilotAction !== this._pilot_mounted
    )
    act = act.filter(x => x.ID !== 'act_free_action')
    if (!this._mech.IsShutDown) act = act.filter(x => x.ID !== 'act_boot_up')
    if (type === ActivationType.Free)
      act.push(this.baseActions.find(x => x.ID === 'act_overcharge'))
    // if (type === ActivationType.Quick) act.push(this.baseActions.find(x => x.ID === 'act_invade'))
    return act
  }

  public ItemActions(type: string): Action[] {
    return this._mech.Actions.filter(
      x => x.Activation === type && x.IsPilotAction !== this._pilot_mounted
    )
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

  public get QuickActions(): Action[] {
    return []
  }
  public get FreeActions(): Action[] {
    return []
  }
  public get Reactions(): Action[] {
    return []
  }
  public get OtherActions(): string[] {
    return ['overcharge']
  }

  public static Serialize(s: ActiveState): IActiveStateData {
    return {
      stage: s._stage,
      turn: s._round,
      move: s._move,
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
    s._stage = data.stage as Stage
    s._round = data.turn
    s._move = data.move
    s._actions = data.actions
    s._overwatch = data.overwatch
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

export { ActiveState }
