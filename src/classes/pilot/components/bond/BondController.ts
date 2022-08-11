import { IClockData, Clock } from '@/classes/components/narrative/elements/Clock'
import { Pilot } from '../../Pilot'
import { BondPower, Bond } from './Bond'

interface IPilotBondData {
  bondId?: string
  xp: number
  stress: number
  maxStress: number
  powerSelections: number
  isBroken: boolean
  burdens: IClockData[]
  bondPowers: BondPower[]
  clocks: IClockData[]
  minorIdeal: string
  bondAnswers: string[]
}

class BondController {
  public readonly Parent: Pilot
  private _powerSelections: number
  private _maxStress: number
  private _bond: Bond
  private _xp: number
  private _stress: number
  private _isBroken: boolean
  private _answers: string[]
  private _minorIdeal: string
  private _burdens: Clock[]
  private _bondPowers: BondPower[]
  private _clocks: Clock[]

  public constructor(parent: Pilot) {
    this.Parent = parent
    this._xp = 0
    this._stress = 0
    this._maxStress = 8
    this._powerSelections = 0
    this._isBroken = false
    this._answers = ['', '']
    this._minorIdeal = ''
    this._bondPowers = []
    this._burdens = []
    this._clocks = []
    this._bond = null
  }

  public get Bond(): Bond {
    return this._bond
  }

  public set Bond(bond: Bond) {
    if (!bond) return
    this._bond = bond
    this._answers = bond.Questions ? new Array(bond.Questions.length) : ['', '']
    this.Parent.SaveController.save()
  }

  public ClearBond() {
    this._bond = null
  }

  public get XP(): number {
    return this._xp
  }

  public set XP(val: number) {
    if (val < 0) this._xp = 0
    else if (val > 8) this._xp = 8
    else this._xp = val
    this.Parent.SaveController.save()
  }

  public get Stress(): number {
    return this._stress
  }

  public set Stress(val: number) {
    if (val < 0) this._stress = 0
    else if (val > this._maxStress) this._stress = this._maxStress
    else this._stress = val
    this.Parent.SaveController.save()
  }

  public get MaxStress(): number {
    return this._maxStress
  }

  public set MaxStress(val: number) {
    if (val < this.Stress) this._maxStress = this.Stress
    else if (val > 20) this._maxStress = 20
    else this._maxStress = val
    this.Parent.SaveController.save()
  }

  public get AtMaxStress(): boolean {
    return this.Stress === this.MaxStress
  }

  public get IsBroken(): boolean {
    return this._isBroken
  }

  public set IsBroken(val: boolean) {
    this._isBroken = val
    this.Parent.SaveController.save()
  }

  public get Burdens(): Clock[] {
    return this._burdens
  }

  public set Burdens(burdens: Clock[]) {
    this._burdens = burdens
    this.Parent.SaveController.save()
  }

  public AddNewBurden() {
    this._stress = 0
    const segments = !this._burdens.length ? 4 : this._burdens.length === 1 ? 6 : 10
    this._burdens.push(
      new Clock({
        title: 'New Burden',
        segments,
      })
    )
    this.Parent.SaveController.save()
  }

  public AddClock() {
    this._clocks.push(
      new Clock({
        title: 'New Clock',
        segments: 6,
      })
    )
    this.Parent.SaveController.save()
  }

  public get AtMaxBurdens() {
    return this.Burdens.length === 3
  }

  public get BondPowers(): BondPower[] {
    return this._bondPowers
  }

  public set BondPowers(powers: BondPower[]) {
    this._bondPowers = powers
    this.Parent.SaveController.save()
  }

  public AddPower(p: BondPower) {
    this.BondPowers.push(p)
    this.Parent.SaveController.save()
  }

  public RemovePower(p: BondPower) {
    const idx = this._bondPowers.findIndex(x => x.name === p.name)
    if (idx > -1) this.BondPowers.splice(idx, 1)
    this.Parent.SaveController.save()
  }

  public get PowerSelections(): number {
    return this._powerSelections
  }

  public set PowerSelections(val: number) {
    this._powerSelections = val
    this.Parent.SaveController.save()
  }

  public get TotalPowerSelections(): number {
    return Math.max(this.PowerSelections + this.MinPowerSelections - this.BondPowers.length, 0)
  }

  public get MinPowerSelections(): number {
    const l = this.Parent.Level
    if (!l) return 0
    if (l < 5) return 1
    if (l < 10) return 3
    return 5
  }

  public get Clocks(): Clock[] {
    return this._clocks
  }

  public set Clocks(clocks: Clock[]) {
    this._clocks = clocks
    this.Parent.SaveController.save()
  }

  public get Answers(): string[] {
    return this._answers
  }

  public SetAnswer(answers: string[]) {
    this._answers = answers
    this.Parent.SaveController.save()
  }

  public get MinorIdeal(): string {
    return this._minorIdeal
  }

  public set MinorIdeal(minorIdeal: string) {
    this._minorIdeal = minorIdeal
    this.Parent.SaveController.save()
  }

  public LevelUp() {
    if (this.XP < 8) return
    this._xp = 0
    this._powerSelections++
    this.Parent.SaveController.save()
  }

  public get HasVeteranPower() {
    if (!this._bond) return false
    return this._bondPowers.some(x => !this._bond._powers.map(y => y.name).includes(x.name))
  }

  public static Serialize(parent: Pilot, target: any) {
    if (!target.bond) target.bond = {}
    target.bond.bondId = parent.BondController.Bond ? parent.BondController.Bond.ID : ''
    target.bond.xp = parent.BondController._xp
    target.bond.stress = parent.BondController._stress
    target.bond.isBroken = parent.BondController._isBroken
    target.bond.burdens = parent.BondController._burdens.map(x => Clock.Serialize(x))
    target.bond.bondPowers = parent.BondController._bondPowers
    target.bond.powerSelections = parent.BondController._powerSelections
    target.bond.maxStress = parent.BondController._maxStress
    target.bond.bondAnswers = parent.BondController._answers
    target.bond.minorIdeal = parent.BondController._minorIdeal
    target.bond.clocks = parent.BondController._clocks.map(x => Clock.Serialize(x))
  }

  public static Deserialize(parent: Pilot, data: IPilotBondData) {
    if (!parent.BondController)
      throw new Error(
        `BondController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      )

    parent.BondController.Bond = data.bondId ? Bond.Deserialize(data.bondId) : null
    parent.BondController._xp = data.xp || 0
    parent.BondController._stress = data.stress || 0
    parent.BondController._maxStress = data.maxStress || 8
    parent.BondController._powerSelections = data.powerSelections || 0
    parent.BondController._isBroken = data.isBroken
    parent.BondController._bondPowers = data.bondPowers || []
    parent.BondController._burdens = data.burdens ? data.burdens.map(x => Clock.Deserialize(x)) : []
    parent.BondController._clocks = data.clocks ? data.clocks.map(x => Clock.Deserialize(x)) : []
    parent.BondController._answers = data.bondAnswers || []
    parent.BondController._minorIdeal = data.minorIdeal || ''
  }
}

export { BondController, IPilotBondData }
