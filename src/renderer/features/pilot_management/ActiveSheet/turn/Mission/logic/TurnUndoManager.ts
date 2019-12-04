import { Mech } from '@/class'

interface IAction {
  field: string
  val: any
}

function Undo(action: IAction, mech: Mech): number {
  switch (action.field) {
    case 'avoid_meltdown':
      mech.MeltdownImminent = true
      return 0
    case 'meltdown':
      mech.IsDestroyed = false
      mech.ReactorDestroyed = false
      return 0
    case 'boost':
      this.maxMove -= mech.IsEjected ? this.pilot.Speed : mech.Speed
      if (this.move < this.maxMove) this.move === this.maxMove
      return 1
    case 'hide':
      const hidx = mech.Statuses.findIndex(x => x === 'Hidden')
      if (hidx > -1) mech.Statuses.splice(hidx, 1)
      return 1
    case 'dismount':
      return 1
    case 'eject':
      mech.IsEjected = false
      return 1
    case 'remount':
      mech.IsEjected = true
      return 2
    case 'bombard':
      const abidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
      if (abidx > -1) this.pilot.Reserves[abidx].Used = false
      return 2
    case 'depshield':
      const dsidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
      if (dsidx > -1) this.pilot.Reserves[dsidx].Used = false
      return 0
    case 'corebattery':
      const cdidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
      mech.CurrentCoreEnergy = 0
      if (cdidx > -1) this.pilot.Reserves[cdidx].Used = false
      return 0
    case 'overcharge':
      mech.ReduceHeat(parseInt(action.val), true)
      return -1
    case 'prepare':
      return 1
    case 'shutdown':
      const sdidx = mech.Statuses.findIndex(x => x === 'Shut Down')
      if (sdidx > -1) mech.Statuses.splice(sdidx, 1)
      return 1
    case 'braced':
      const bidx = mech.Resistances.findIndex(x => x === 'Next Attack')
      if (bidx > -1) mech.Resistances.splice(bidx, 1)
      return 0
    default:
      return 0
  }
}

export { Undo }
