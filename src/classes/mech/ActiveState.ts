// activemech via activestate
// status via activestate
// new ver tutorial on startup (first time only, track in profile)

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Vue from 'vue'
import { Mech, Drone, Deployable } from '@/class'

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
}

class ActiveState {
  private _deployed_drones: Drone[]
  private _deployed_deployables: Deployable[]
  private _stage: Stage

  private _log: LogEntry[] // write this to a pilot log after mission is ended

  private _pilot_mounted: boolean

  private _pilot_status: string //enum?

  private _mech: Mech | null

  private _round: number
  private _on_turn: boolean // off turn -> reacion mode

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

  public constructor(mech?: Mech) {
    this._mech = mech || null
    this._stage = Stage.Narrative
    this._round = 1
    this._move = 0
    this._maxMove = mech ? mech.Speed : 0
    this._actions = 2
    this._overwatch = false
    this._braced = false
    this._overcharged = false
    this._prepare = false
    this._bracedCooldown = false
    this._redundant = false
    this._history = []
  }

  public newRound(): void {
    this._round += 1
    this._history = []
    this._move = 0
    this._actions = 2
    this._maxMove = this._mech.Ejected ? this._mech.Pilot.Speed : this._mech.Speed
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

  // public StartCombat()
  // public EndCombat()
  // public StartRest()
  // public EndRest()
  // public EndMission()
  // public StartDowntime()

  // public SetActiveMech()
  // public MountMech()
  // public DismountMech()
  // public EjectMech()
  // public DestroyMech()
  // public DestroyReactor()
  // public StartMeltdown()

  // public StartTurn()
  // public EndTurn()

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

  public get Protocols(): string[] {
    return ['test protocol']
  }

  public get MoveActions(): string[] {
    return ['move']
  }
  public get FullActions(): string[] {
    return [
      'barrage',
      'full tech',
      'stabilize',
      'disengage',
      'improvised attack',
      'full activation',
      'boot up',
      'mount',
      'dismount',
      'skill check',
    ]
  }
  public get QuickActions(): string[] {
    return [
      'skirmish',
      'boost',
      'ram',
      'grapple',
      'quick tech',
      'hide',
      'search',
      'quick activation',
      'eject',
      'prepare',
      'self-destruct',
      'shut down',
    ]
  }
  public get FreeActions(): string[] {
    return ['overcharge']
  }
  public get Reactions(): string[] {
    return ['brace', 'overwatch']
  }
  public get OtherActions(): string[] {
    return ['overcharge']
  }

  public static Serialize(s: ActiveState): IMechState {
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
    }
  }

  public static Deserialize(data: IMechState): ActiveState {
    const s = new ActiveState()
    // s._stage = data.stage || 'Downtime'
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
    return s
  }
}

export { ActiveState }
