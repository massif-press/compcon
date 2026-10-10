import type { StatController } from '@/classes/components/combat/stats/StatController'

type TierEdits = 'reset' | 'preserve' | 'project'
type StatTable = Record<string, number>
type StatEdit = { key: string; value: number; change: number }

function statEdits(stats: StatController, table: StatTable): StatEdit[] {
  return Object.keys(table)
    .filter(key => stats.getMax(key) !== undefined && stats.getMax(key) !== table[key])
    .map(key => ({ key, value: stats.getMax(key), change: stats.getMax(key) - table[key] }))
}

function restoreEdits(stats: StatController, edits: StatEdit[], keep: TierEdits): void {
  if (keep === 'reset') return
  edits.forEach(({ key, value, change }) =>
    stats.setMax(key, keep === 'preserve' ? value : stats.getMax(key) + change)
  )
}

export { statEdits, restoreEdits }
export type { TierEdits, StatTable, StatEdit }
