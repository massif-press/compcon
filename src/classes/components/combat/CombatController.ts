import { ICombatant } from './ICombatant'

interface ICombatData {}

class CombatController {
  public Parent: ICombatant
  public Reactions: string[]

  public constructor(parent: ICombatant) {
    this.Parent = parent
    this.Reactions = []
  }

  public NewTurn(): void {
    this.Parent.CurrentStats.Activations = this.Parent.Stats.Activations
    this.Parent.CurrentStats.TurnActions = 2
    this.Parent.CurrentStats.CurrentMove = this.Parent.CurrentStats.MaxMove
  }

  public AddDamage(dmg: number, type?: string): void {
    if (type && this.Parent.CurrentStats.includes(type)) {
      dmg = Math.ceil(dmg / 2)
    }
    this.Parent.CurrentStats -= dmg
  }

  public AddHeat(heat: number): void {
    if (this.Parent.Stats.HeatCapacity) {
      heat = this.Parent.CurrentStats.Resistances.includes('Heat') ? Math.ceil(heat / 2) : heat
      let newHeat = this.Parent.CurrentStats.Heat + heat
      while (newHeat > this.Parent.Stats.HeatCapacity) {
        this.Parent.CurrentStats.CurrentStress -= 1
        newHeat -= this.Parent.Stats.HeatCapacity
      }
      this.Parent.CurrentStats.CurrentHeat = newHeat
    } else {
      this.AddDamage(heat, 'Energy')
    }
  }

  public ReduceHeat(heat: number): void {
    if (!this.Parent.Stats.HeatCapacity) return
    while (heat > this.Parent.CurrentStats.CurrentHeat) {
      heat -= this.Parent.CurrentStats.CurrentHeat
      this.Parent.CurrentStats.CurrentStress += 1
      this.Parent.CurrentStats.CurrentHeat = this.Parent.Stats.HeatCapacity
    }
    this.Parent.CurrentStats.CurrentHeat -= heat
  }

  public FullRepair(): void {
    this.Parent.CurrentStats.Reset(this.Parent.Stats)
    this.Parent.Items.forEach(e => e.Repair())
    this.Parent.CurrentStats.IsDestroyed = false
  }
}

export { CombatController }
