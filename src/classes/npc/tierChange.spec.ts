import { describe, it, expect } from 'vitest'
import { statEdits, restoreEdits, type StatTable } from './tierChange'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import { makeNpc } from '@/__tests__/factories'

function unit() {
  const u = makeNpc()
  u.SetStats()
  const table = (): StatTable =>
    Object.fromEntries(u.NpcClassController.getClassStats().map(({ key, val }) => [key, val]))
  return { u, stats: u.StatController, table }
}

describe('tier change stat edits', () => {
  it('finds nothing on an unedited unit', () => {
    const { stats, table } = unit()

    expect(statEdits(stats, table())).toEqual([])
  })

  it('records an edit as its value and its difference from the table', () => {
    const { stats, table } = unit()
    const base = table()[StatKey.HP]

    stats.setMax(StatKey.HP, base + 7)

    expect(statEdits(stats, table())).toEqual([{ key: StatKey.HP, value: base + 7, change: 7 }])
  })

  function retiered(keep: 'reset' | 'preserve' | 'project') {
    const { u, stats, table } = unit()
    const base = table()[StatKey.HP]
    stats.setMax(StatKey.HP, base + 7)
    const edits = statEdits(stats, table())

    u.NpcClassController.Tier = 2
    restoreEdits(stats, edits, keep)

    return { hp: stats.getMax(StatKey.HP), base, next: table()[StatKey.HP] }
  }

  it('reset leaves the new tier value', () => {
    const { hp, next } = retiered('reset')
    expect(hp).toBe(next)
  })

  it('preserve restores the edited value', () => {
    const { hp, base } = retiered('preserve')
    expect(hp).toBe(base + 7)
  })

  it('project adds the edit to the new tier value', () => {
    const { hp, next } = retiered('project')
    expect(hp).toBe(next + 7)
  })
})
