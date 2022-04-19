import { ICombatant } from './ICombatant'

interface ICombatData {}

class CombatController {
  public Parent: ICombatant
  private _active: boolean
  private _conditions: string[]
  private _statuses: string[]
  private _resistances: string[]
  private _burn: number
  private _overshield: number
  private _destroyed: boolean
  private _defeat: string
  private _turn_actions: number

  public constructor(parent: ICombatant) {
    this.Parent = parent
    this._active = false
    this._conditions = []
    this._statuses = []
    this._resistances = []
    this._burn = 0
    this._overshield = 0
    this._destroyed = false
    this._defeat = ''
    this._turn_actions = 2
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
  }

  public get CurrentStructure(): number {
    return this.Parent.CurrentStats.Structure
  }

  public set CurrentStructure(val: number) {
    this.Parent.CurrentStats.Structure = val
    if (this.Active && this.Parent.CurrentStats.Structure === 0) {
      this.Parent.CurrentStats.HP = 0
      this.Destroyed = true
    }
  }

  public get CurrentHP(): number {
    return this.Parent.CurrentStats.HP
  }

  public set CurrentHP(val: number) {
    if (val > this.Parent.Stats.MaxHP) this.Parent.CurrentStats.HP = this.Parent.Stats.MaxHP
    else if (val <= 0) {
      this.Parent.CurrentStats.HP = this.Parent.Stats.MaxHP + val
      this.CurrentStructure -= 1
    } else this.Parent.CurrentStats.HP = val
  }

  public get CurrentStress(): number {
    return this.Parent.CurrentStats.Stress
  }

  public set CurrentStress(val: number) {
    this.Parent.CurrentStats.Stress = val
    if (
      this.Parent.Stats.Active &&
      this.Parent.CurrentStats.Stress === 0 &&
      !this.Statuses.includes('EXPOSED')
    ) {
      this.Statuses.push('EXPOSED')
    }
  }

  public get CurrentHeat(): number {
    return this.Parent.CurrentStats.HeatCapacity
  }

  public set CurrentHeat(val: number) {
    if (val > this.Parent.Stats.HeatCapacity) {
      this.CurrentStress -= 1
      this.Parent.CurrentStats.HeatCapacity = val - this.Parent.Stats.HeatCapacity
    } else this.Parent.CurrentStats.HeatCapacity = val
  }

  public get Conditions(): string[] {
    return this._conditions
  }

  public set Conditions(conditions: string[]) {
    this._conditions = conditions
    this.Parent.SaveController.save()
  }

  public get Statuses(): string[] {
    return this._statuses
  }

  public set Statuses(statuses: string[]) {
    this._statuses = statuses
    this.Parent.SaveController.save()
  }

  public get Resistances(): string[] {
    return this._resistances
  }

  public set Resistances(resistances: string[]) {
    this._resistances = resistances
    this.Parent.SaveController.save()
  }

  public get Burn(): number {
    return this._burn
  }

  public set Burn(burn: number) {
    this._burn = burn
    if (this._burn < 0) this._burn = 0
    this.Parent.SaveController.save()
  }

  public get Overshield(): number {
    return this._overshield
  }

  public set Overshield(val: number) {
    this._overshield = val
    this.Parent.SaveController.save()
  }

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(val: boolean) {
    this._destroyed = val
    this._defeat = val ? 'Destroyed' : ''
    this.Parent.SaveController.save()
  }

  public get Defeat(): string {
    return this._defeat
  }

  public set Defeat(val: string) {
    this._defeat = val
    this.Parent.SaveController.save()
  }

  public get Activations(): number {
    return this.Parent.CurrentStats.Activations
  }

  public set Activations(val: number) {
    this.Parent.CurrentStats.Activations = val
    this.Parent.SaveController.save()
  }

  public get TurnActions(): number {
    return this._turn_actions
  }

  public set TurnActions(val: number) {
    this._turn_actions = val
    this.Parent.SaveController.save()
  }

  public get CurrentMove(): number {
    return this.Parent.CurrentStats.Speed
  }

  public set CurrentMove(val: number) {
    this.Parent.CurrentStats.Speed = val
    this.Parent.SaveController.save()
  }

  public get MaxMove(): number {
    return this.Parent.Stats.Speed
  }

  public get Reactions(): string[] {
    return this.Parent.CurrentStats.Reactions
  }

  public AddReaction(r: string): void {
    this.Parent.CurrentStats.AddReaction(r)
  }

  public RemoveReaction(r: string): void {
    this.Parent.CurrentStats.RemoveReaction(r)
  }

  public FullRepair(): void {
    this.Parent.CurrentStats.Reset(this.Parent.Stats)
    this.Parent.Items.forEach(e => e.Repair())
    this._defeat = ''
    this._destroyed = false
  }

  public NewTurn(): void {
    this.Parent.CurrentStats.Activations = this.Parent.Stats.Activations
    this._turn_actions = 2
    this.Parent.CurrentStats.Speed = 0
    this.Parent.CurrentStats.AddReaction('Overwatch')
    this.Parent.SaveController.save()
  }
}

export { CombatController }
