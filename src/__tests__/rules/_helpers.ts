import { vi } from 'vitest'
import { makeMech, makePilot, makeNpc } from '@/__tests__/factories'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'
import type { Unit } from '@/classes/npc/unit/Unit'
import type { CombatController } from '@/classes/components/combat/CombatController'

export { StatKey }

export function mech(level = 3): Mech {
  const m = makeMech(makePilot({ level }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
  return m
}

export function pilot(level = 3): Pilot {
  return makeMech(makePilot({ level })).Pilot as Pilot
}

export function npc(): Unit {
  const u = makeNpc()
  u.SetStats()
  return u
}

export const cur = (c: CombatController, k: string) => c.StatController.getCurrent(k)
export const max = (c: CombatController, k: string) => c.StatController.getMax(k)
export const set = (c: CombatController, k: string, v: number) => c.StatController.setCurrentStat(k, v)
export const setMax = (c: CombatController, k: string, v: number) => c.StatController.setMax(k, v)

export const rolls = (face: number) => vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(face)

export const rollSeq = (...values: number[]) => {
  let i = 0
  vi.spyOn(DiceRoller, 'rollDie').mockImplementation(() => values[Math.min(i++, values.length - 1)])
}
