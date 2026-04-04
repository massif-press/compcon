import { Bonus } from './Bonus'
import { IFeatureController } from '../IFeatureController'
import { StatController } from '../../combat/stats/StatController'

const CHILD_PREFIXES = ['drone_', 'deployable_']

class BonusController {
  private readonly _parent: IFeatureController
  private _flags: Record<string, boolean> = {}

  public constructor(parent: IFeatureController) {
    this._parent = parent
  }

  public get Bonuses(): Bonus[] {
    return this._parent.FeatureController.Bonuses
  }

  public getFor(statId: string): Bonus[] {
    return this.Bonuses.filter(b => b.ID === statId)
  }

  public evaluate(bonus: Bonus): number {
    if (bonus.Condition) {
      const result = this._parent.FeatureController.EvaluateSpecial(bonus.Condition)
      if (!result) return 0
    }
    return Bonus.Evaluate(bonus, this._parent)
  }

  public sum(statId: string, base: number = 0): number {
    const all = this.getFor(statId)

    const overwrites = all.filter(b => b.Overwrite && !b.Replace)
    if (overwrites.length) {
      return Math.max(...overwrites.map(b => this.evaluate(b)))
    }

    const replaces = all.filter(b => b.Replace)
    const val = replaces.length ? replaces.reduce((s, b) => s + this.evaluate(b), 0) : base

    return (
      val + all.filter(b => !b.Overwrite && !b.Replace).reduce((s, b) => s + this.evaluate(b), 0)
    )
  }

  public contributors(statId: string): { name: string; val: number }[] {
    return Bonus.Contributors(statId, this._parent)
  }

  // apply all stat bonuses to a StatController
  // pass encounter to also handle per-PC bonuses (activations_pct, hp_per_player, etc)
  public applyToStats(
    statController: StatController,
    encounter?: { Combatants: { type: string }[] }
  ): void {
    const bonuses = this.Bonuses

    const statIds = [
      ...new Set(
        bonuses
          .filter(b => !b.PerPc && !b.IsFlag && !CHILD_PREFIXES.some(p => b.ID.startsWith(p)))
          .map(b => b.ID)
      ),
    ]

    for (const statId of statIds) {
      const base = statController.getMax(statId) ?? 0
      statController.setMax(statId, this.sum(statId, base))
    }

    if (encounter) {
      const pcCount = encounter.Combatants.filter(c => c.type === 'pilot').length
      bonuses
        .filter(b => b.PerPc)
        .forEach(bonus => {
          if (pcCount >= Number(bonus.Value)) {
            const statId = bonus.ID.replace('_pct', '')
            statController.setMax(statId, (statController.getMax(statId) ?? 0) + 1)
          }
        })
    }

    this._buildFlags()
  }

  // apply parent bonuses that target a child entity (e.g. prefix = 'drone_' or 'deployable_')
  // strips the prefix to find the child stat key and applies overwrite/replace/additive logic
  public applyChildBonuses(childStats: StatController, prefix: string): void {
    const prefixed = this.Bonuses.filter(b => b.ID.startsWith(prefix) && !b.IsFlag)
    if (!prefixed.length) return

    const statIds = [...new Set(prefixed.map(b => b.ID.slice(prefix.length)))]

    for (const statId of statIds) {
      const forStat = prefixed.filter(b => b.ID === prefix + statId)
      const base = childStats.getMax(statId) ?? 0

      // Overwrite: ignore base, take highest overwrite value
      const overwrites = forStat.filter(b => b.Overwrite && !b.Replace)
      if (overwrites.length) {
        childStats.setMax(statId, Math.max(...overwrites.map(b => this.evaluate(b))))
        continue
      }

      const replaces = forStat.filter(b => b.Replace)
      const effectiveBase = replaces.length
        ? replaces.reduce((sum, b) => sum + this.evaluate(b), 0)
        : base

      const addVal = forStat
        .filter(b => !b.Overwrite && !b.Replace)
        .reduce((sum, b) => sum + this.evaluate(b), 0)

      childStats.setMax(statId, effectiveBase + addVal)
    }
  }

  public get Flags(): Record<string, boolean> {
    return { ...this._flags }
  }

  public hasFlag(id: string): boolean {
    return this._flags[id] === true
  }

  private _buildFlags(): void {
    this._flags = {}
    this.Bonuses.filter(b => b.IsFlag).forEach(b => {
      this._flags[b.ID] = true
    })
  }
}

export { BonusController }
