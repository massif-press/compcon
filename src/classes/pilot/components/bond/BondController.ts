import { IClockData, Clock } from '@/classes/components/clocks/Clock'
import { Pilot } from '../../Pilot'
import { BondPower, Bond } from './Bond'

interface IPilotBondData {
  bondId?: string
  xp: number
  stress: number
  isBroken: boolean
  burdens: Burden[]
  bondPowers: BondPower[]
  clocks: IClockData[]
}

type Burden = {
  burden: string
  major: boolean
  marked: boolean
}

class BondController {
  public readonly Parent: Pilot
  private _bond: Bond
  private _xp: number
  private _stress: number
  private _isBroken: boolean
  private _burdens: Burden[]
  private _bondPowers: BondPower[]
  private _clocks: Clock[]

  public constructor(parent: Pilot) {
    this.Parent = parent
    this._xp = 0
    this._stress = 0
    this._isBroken = false
    this._bondPowers = []
    this._burdens = []
    this._clocks = []
  }

  public get Bond(): Bond {
    return this._bond
  }

  public set Bond(bond: Bond) {
    this._bond = bond
    this.Parent.SaveController.save()
  }

  public get XP(): number {
    return this._xp
  }

  public set XP(val: number) {
    this._xp = val
    this.Parent.SaveController.save()
  }

  public get IsBroken(): boolean {
    return this._isBroken
  }

  public set IsBroken(val: boolean) {
    this._isBroken = val
    this.Parent.SaveController.save()
  }

  public get Burdens(): Burden[] {
    return this._burdens
  }

  public set Burdens(burdens: Burden[]) {
    this._burdens = burdens
    this.Parent.SaveController.save()
  }

  public get BondPowers(): BondPower[] {
    return this._bondPowers
  }

  public set BondPowers(powers: BondPower[]) {
    this._bondPowers = powers
    this.Parent.SaveController.save()
  }

  public get Clocks(): Clock[] {
    return this._clocks
  }

  public set Clocks(clocks: Clock[]) {
    this._clocks = clocks
    this.Parent.SaveController.save()
  }

  public get MajorBurdenCount(): number {
    return this.Burdens.filter(x => x.major).length
  }

  public static Serialize(parent: Pilot, target: any) {
    target.bondId = parent.BondController.Bond ? parent.BondController.Bond.ID : ''
    target.xp = parent.BondController._xp
    target.stress = parent.BondController._stress
    target.isBroken = parent.BondController._isBroken
    target.burdens = parent.BondController._burdens
    target.bondPowers = parent.BondController._bondPowers
    target.clocks = parent.BondController._clocks.map(x => Clock.Serialize(x))
  }

  public static Deserialize(parent: Pilot, data: IPilotBondData) {
    if (!parent.BondController)
      throw new Error(
        `BondController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      )

    parent.BondController.Bond = data.bondId ? Bond.Deserialize(data.bondId) : null
    parent.BondController._xp = data.xp || 0
    parent.BondController._stress = data.stress || 0
    parent.BondController._isBroken = data.isBroken
    parent.BondController._bondPowers = data.bondPowers || []
    parent.BondController._burdens = data.burdens || []
    parent.BondController._clocks = data.clocks ? data.clocks.map(x => Clock.Deserialize(x)) : []
  }
}

export { BondController, IPilotBondData, Burden }
