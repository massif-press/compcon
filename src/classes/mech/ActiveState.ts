/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Vue from 'vue'
import { Mech } from '@/class'

class ActiveState {
  public stage: string
  public mech: Mech | null
  public turn: number
  public move: number
  public maxMove: number
  public actions: number
  public overwatch: boolean
  public braced: boolean
  public overcharged: boolean
  public prepare: boolean
  public bracedCooldown: boolean
  public redundant: boolean
  public history: IHistoryItem[]

  public constructor(mech?: Mech) {
    this.mech = mech || null
    this.stage = 'Downtime'
    this.turn = 1
    this.move = 0
    this.maxMove = mech ? mech.Speed : 0
    this.actions = 2
    this.overwatch = false
    this.braced = false
    this.overcharged = false
    this.prepare = false
    this.bracedCooldown = false
    this.redundant = false
    this.history = []
  }

  public newTurn(): void {
    this.turn += 1
    this.history = []
    this.move = 0
    this.actions = 2
    this.maxMove = this.mech.Ejected ? this.mech.Pilot.Speed : this.mech.Speed
    this.overcharged = false
    this.overwatch = false
    this.prepare = false
    if (this.braced) {
      this.bracedCooldown = true
      this.actions = 1
      this.move = this.maxMove
      this.braced = false
    } else if (this.bracedCooldown) {
      this.bracedCooldown = false
    }
    if (this.mech.Burn) {
      this.mech.AddDamage(this.mech.Burn, 'Burn')
    }
  }

  restart(): void {
    this.turn = 1
    this.history = []
    this.move = 0
    this.actions = 2
    this.maxMove = this.mech.Ejected ? this.mech.Pilot.Speed : this.mech.Speed
    this.overcharged = false
    this.prepare = false
    this.braced = false
    this.bracedCooldown = false
  }

  undo(): void {
    const action = this.history.pop()
    switch (action.field) {
      case 'avoid_meltdown':
        this.mech.MeltdownImminent = true
      case 'meltdown':
        this.mech.Destroyed = false
        this.mech.ReactorDestroyed = false
      case 'boost':
        this.maxMove -= this.mech.Ejected ? this.mech.Pilot.Speed : this.mech.Speed
        if (this.move < this.maxMove) this.move === this.maxMove
        this.actions += 1
        break
      case 'hide':
        const hidx = this.mech.Statuses.findIndex(x => x === 'Hidden')
        if (hidx > -1) this.mech.Statuses.splice(hidx, 1)
        this.actions += 1
        break
      case 'dismount':
        this.actions += 1
      case 'eject':
        this.mech.Ejected = false
        this.actions += 1
        break
      case 'remount':
        this.mech.Ejected = true
        this.actions += 2
        break
      case 'bombard':
        this.actions += 2
        const abidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        if (abidx > -1) this.mech.Pilot.Reserves[abidx].Used = false
        break
      case 'depshield':
        const dsidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        if (dsidx > -1) this.mech.Pilot.Reserves[dsidx].Used = false
        break
      case 'corebattery':
        const cdidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        this.mech.CurrentCoreEnergy = 0
        if (cdidx > -1) this.mech.Pilot.Reserves[cdidx].Used = false
        break
      case 'overcharge':
        this.mech.ReduceHeat(action.val, true)
        this.actions -= 1
        break
      case 'prepare':
        this.actions += 1
      case 'shutdown':
        this.actions += 1
        const sdidx = this.mech.Statuses.findIndex(x => x === 'SHUT DOWN')
        if (sdidx > -1) this.mech.Statuses.splice(sdidx, 1)
      case 'braced':
        const bidx = this.mech.Resistances.findIndex(x => x === 'Next Attack')
        if (bidx > -1) this.mech.Resistances.splice(bidx, 1)
      default:
        Vue.set(this, action.field, action.val)
        break
    }
  }

  quickAction() {
    if (this.actions > 0) {
      this.history.push({ field: 'actions', val: this.actions })
      this.actions--
    }
  }

  boost() {
    if (this.actions > 0) {
      this.history.push({ field: 'boost' })
      this.actions--
      this.maxMove += this.mech.Ejected ? this.mech.Pilot.Speed : this.mech.Speed
      if (this.move < 0) this.move === 0
    }
  }

  hide() {
    this.history.push({ field: 'hide', val: false })
    if (!this.mech.Statuses.includes('Hidden')) this.mech.Statuses.push('Hidden')
    this.actions -= 1
  }

  dismount() {
    this.history.push({ field: 'dismount', val: false })
    this.mech.Ejected = true
    this.actions -= 2
  }

  eject() {
    this.history.push({ field: 'eject', val: false })
    this.mech.Ejected = true
    this.actions -= 1
  }

  remount() {
    this.history.push({ field: 'remount', val: false })
    this.mech.Ejected = false
    this.actions -= 2
  }

  fullAction() {
    if (this.actions >= 2) {
      this.history.push({ field: 'actions', val: 2 })
      this.actions -= 2
    }
  }

  bombard() {
    if (this.actions >= 2) {
      this.history.push({ field: 'bombard', val: false })
      this.actions -= 2
      const abidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
      if (abidx > -1) this.mech.Pilot.Reserves[abidx].Used = true
    }
  }

  redundantRepair() {
    const rridx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_redundant_repair')
    if (rridx > -1) this.mech.Pilot.Reserves[rridx].Used = true
    // this.$refs.stabilize.show(true)
  }

  deployableShield() {
    this.history.push({ field: 'depshield', val: false })
    const dsidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_deployable_shield')
    if (dsidx > -1) this.mech.Pilot.Reserves[dsidx].Used = true
  }

  coreBattery() {
    this.history.push({ field: 'corebattery', val: false })
    const cbidx = this.mech.Pilot.Reserves.findIndex(x => x.ID === 'reserve_core_battery')
    if (cbidx > -1) this.mech.Pilot.Reserves[cbidx].Used = true
    this.mech.CurrentCoreEnergy = 1
  }

  setPrepare() {
    this.history.push({ field: 'prepare', val: false })
    this.prepare = true
    this.actions -= 1
  }

  setBrace() {
    this.history.push({ field: 'braced', val: false })
    if (!this.mech.Resistances.includes('Next Attack')) this.mech.Resistances.push('Next Attack')
    this.braced = true
  }

  setOverwatch() {
    this.history.push({ field: 'overwatch', val: false })
    this.overwatch = true
  }

  commitOvercharge(heat: number) {
    this.history.push({ field: 'overcharge', val: heat })
    this.overcharged = true
    this.mech.CurrentOvercharge += 1
    this.actions += 1
    this.mech.AddHeat(heat)
  }

  commitStabilize(actionsUsed: number) {
    this.actions += actionsUsed
  }

  endStatus(s: string) {
    const stidx = this.mech.Statuses.findIndex(x => x === s)
    if (stidx > -1) this.mech.Statuses.splice(stidx, 1)
  }

  endCondition(s: string) {
    const stidx = this.mech.Conditions.findIndex(x => x === s)
    if (stidx > -1) this.mech.Conditions.splice(stidx, 1)
  }

  shutDown() {
    this.mech.Statuses.push('SHUT DOWN')
    this.mech.Conditions.push('STUNNDED')
    this.actions -= 1
    this.mech.CurrentHeat = 0
    this.endStatus('EXPOSED')
    this.history.push({ field: 'shutdown' })
  }

  boot() {
    this.endStatus('SHUT DOWN')
    this.endCondition('STUNNDED')
    this.move = 0
    this.actions = 0
  }

  meltdown() {
    this.history.push({ field: 'meltdown', val: true })
    this.mech.Destroy()
    this.mech.ReactorDestroyed = true
  }

  avoidMeltdown() {
    this.history.push({ field: 'avoid_meltdown', val: false })
    this.mech.MeltdownImminent = false
  }

  public static Serialize(s: ActiveState): IMechState {
    return {
      stage: s.stage,
      turn: s.turn,
      move: s.move,
      actions: s.actions,
      overwatch: s.overwatch,
      braced: s.braced,
      overcharged: s.overcharged,
      prepare: s.prepare,
      bracedCooldown: s.bracedCooldown,
      redundant: s.redundant,
      history: s.history,
    }
  }

  public static Deserialize(data: IMechState, mech: Mech): ActiveState {
    const s = new ActiveState(mech)
    s.stage = data.stage || 'Downtime'
    s.turn = data.turn
    s.move = data.move
    s.actions = data.actions
    s.overwatch = data.overwatch
    s.braced = data.braced
    s.overcharged = data.overcharged
    s.prepare = data.prepare
    s.bracedCooldown = data.bracedCooldown
    s.redundant = data.redundant
    s.history = data.history
    return s
  }
}

export { ActiveState }
