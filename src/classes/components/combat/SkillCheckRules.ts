interface IBonusSource {
  Source: string
  Value: number
}

interface IAccDiffSource {
  Source: string
  Accuracy: number
}

interface ICheckSources {
  bonuses: IBonusSource[]
  accDiff: IAccDiffSource[]
}

const DIFFICULT_MODIFIER = -1

function statLabel(stat: string): string {
  return `${stat.charAt(0).toUpperCase()}${stat.slice(1)} Stat`
}

function checkSources(cc: any, stat: string): ICheckSources {
  const bonuses =
    cc?.ActiveActor?.FeatureController?.Bonuses?.filter(
      (b: any) => b.ID === stat || b.ID === 'check'
    ) ?? []
  const sources: ICheckSources = {
    bonuses: bonuses.filter((b: any) => !!b.Value),
    accDiff: bonuses.filter((b: any) => !!b.Accuracy),
  }
  if (!stat) return sources
  const statBonus = cc?.ActiveActor?.CombatController?.StatController?.getMax(stat)
  if (statBonus) sources.bonuses.push({ Source: statLabel(stat), Value: statBonus })
  return sources
}

function totalBonus(sources: ICheckSources, difficult: boolean): number {
  return sources.bonuses.reduce((sum, b) => sum + b.Value, 0) + (difficult ? DIFFICULT_MODIFIER : 0)
}

function totalAccDiff(sources: ICheckSources): number {
  return sources.accDiff.reduce((sum, b) => sum + b.Accuracy, 0)
}

export { checkSources, totalBonus, totalAccDiff, DIFFICULT_MODIFIER }
export type { ICheckSources, IBonusSource, IAccDiffSource }
