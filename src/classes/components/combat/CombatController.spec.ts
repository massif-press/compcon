import { describe, it, expect, beforeEach } from 'vitest'
import { DamageType } from '@/classes/enums'
import { StatKey } from './stats/Stats'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'
import { CombatLog } from './CombatLog'

let mech: Mech

const cc = () => mech.CombatController
const stat = (key: string) => cc().StatController.getCurrent(key)
const setStat = (key: string, val: number) => cc().StatController.setCurrentStat(key, val)

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
})

describe('CombatController.CalculateDamage', () => {
  it('passes damage through untouched with no armor or resistance', () => {
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(5)
  })

  it('subtracts armor', () => {
    setStat(StatKey.ARMOR, 2)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(3)
  })

  it('never goes below zero', () => {
    setStat(StatKey.ARMOR, 10)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(0)
  })

  it('ignores armor when the attack is AP', () => {
    setStat(StatKey.ARMOR, 2)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5, true).total).toBe(5)
  })

  it('ignores armor for heat and burn', () => {
    setStat(StatKey.ARMOR, 2)
    expect(cc().CalculateDamage(DamageType.Heat, 5).total).toBe(5)
    expect(cc().CalculateDamage(DamageType.Burn, 5).total).toBe(5)
  })

  it('skips every reduction when the damage is irreducible', () => {
    setStat(StatKey.ARMOR, 2)
    cc().AddResist('kinetic', 'resistance')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5, false, true).total).toBe(5)
  })

  it('raises the total to the reliable floor', () => {
    setStat(StatKey.ARMOR, 4)
    expect(cc().CalculateDamage(DamageType.Kinetic, 5, false, false, 3).total).toBe(3)
  })

  it('doubles non-heat damage while exposed', () => {
    cc().AddStatus('exposed')
    const out = cc().CalculateDamage(DamageType.Kinetic, 5)
    expect(out.total).toBe(10)
    expect(out.condition).toContain('exposed')
  })

  it('does not double heat while exposed', () => {
    cc().AddStatus('exposed')
    expect(cc().CalculateDamage(DamageType.Heat, 5).total).toBe(5)
  })

  it('makes shredded ignore armor and resistance', () => {
    setStat(StatKey.ARMOR, 2)
    cc().AddResist('kinetic', 'resistance')
    cc().AddStatus('shredded')

    const out = cc().CalculateDamage(DamageType.Kinetic, 6)
    expect(out.total).toBe(6)
    expect(out.condition).toContain('shredded')
  })
})

describe('CombatController resistances', () => {
  it('halves damage, rounding up', () => {
    cc().AddResist('kinetic', 'resistance')
    const out = cc().CalculateDamage(DamageType.Kinetic, 5)
    expect(out.total).toBe(3)
    expect(out.resist).toContain('resistance')
  })

  it('doubles damage when vulnerable', () => {
    cc().AddResist('kinetic', 'vulnerable')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(10)
  })

  it('zeroes damage when immune', () => {
    cc().AddResist('kinetic', 'immunity')
    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(0)
  })

  it('only applies to the matching damage type', () => {
    cc().AddResist('kinetic', 'immunity')
    expect(cc().CalculateDamage(DamageType.Energy, 5).total).toBe(5)
  })

  it('reports and removes a resistance', () => {
    cc().AddResist('kinetic', 'resistance')
    expect(cc().GetResistance('kinetic')).toBe('resistance')
    cc().RemoveResist('kinetic')
    expect(cc().CalculateDamage(DamageType.Kinetic, 4).total).toBe(4)
  })
})

describe('CombatController.ApplyDamage', () => {
  it('reduces HP', () => {
    const before = stat(StatKey.HP)
    cc().ApplyDamage(DamageType.Kinetic, 3)
    expect(stat(StatKey.HP)).toBe(before - 3)
  })

  it('spends overshield first', () => {
    setStat(StatKey.OVERSHIELD, 4)
    const hp = stat(StatKey.HP)

    cc().ApplyDamage(DamageType.Kinetic, 3)
    expect(stat(StatKey.OVERSHIELD)).toBe(1)
    expect(stat(StatKey.HP)).toBe(hp)
  })

  it('breaks overshield and carries the remainder to HP', () => {
    setStat(StatKey.OVERSHIELD, 2)
    const hp = stat(StatKey.HP)

    cc().ApplyDamage(DamageType.Kinetic, 5)
    expect(stat(StatKey.OVERSHIELD)).toBe(0)
    expect(stat(StatKey.HP)).toBe(hp - 3)
  })

  it('takes structure and refills HP when HP hits zero', () => {
    const maxHp = cc().StatController.getMax(StatKey.HP)
    const structure = stat(StatKey.STRUCTURE)

    cc().ApplyDamage(DamageType.Kinetic, maxHp)

    expect(stat(StatKey.STRUCTURE)).toBe(structure - 1)
    expect(stat(StatKey.HP)).toBe(maxHp)
  })

  it('takes several structure for a single overwhelming hit', () => {
    const maxHp = cc().StatController.getMax(StatKey.HP)
    const structure = stat(StatKey.STRUCTURE)

    cc().ApplyDamage(DamageType.Kinetic, maxHp * 2)
    expect(stat(StatKey.STRUCTURE)).toBe(structure - 2)
  })

  it('accumulates burn', () => {
    cc().ApplyDamage(DamageType.Burn, 3)
    expect(stat(StatKey.BURN)).toBe(3)
  })
})

describe('CombatController.ApplyHeat', () => {
  it('adds heat', () => {
    cc().ApplyHeat(2)
    expect(stat(StatKey.HEATCAP)).toBe(2)
  })

  it('takes stress and resets heat on overheat', () => {
    const cap = cc().StatController.getMax(StatKey.HEATCAP)
    const stress = stat(StatKey.STRESS)

    cc().ApplyHeat(cap + 1)

    expect(stat(StatKey.STRESS)).toBe(stress - 1)
    expect(stat(StatKey.HEATCAP)).toBeLessThanOrEqual(cap)
  })

  it('reports the danger zone at half capacity', () => {
    const cap = cc().StatController.getMax(StatKey.HEATCAP)
    expect(cc().IsInDangerZone).toBe(false)
    cc().ApplyHeat(Math.ceil(cap / 2))
    expect(cc().IsInDangerZone).toBe(true)
  })
})

describe('CombatController.TakeDamage', () => {
  it('applies armor reduction before touching HP', () => {
    setStat(StatKey.ARMOR, 2)
    const hp = stat(StatKey.HP)

    cc().TakeDamage(DamageType.Kinetic, 5)
    expect(stat(StatKey.HP)).toBe(hp - 3)
  })

  it('routes heat damage to the heat track', () => {
    const hp = stat(StatKey.HP)
    cc().TakeDamage(DamageType.Heat, 2)

    expect(stat(StatKey.HEATCAP)).toBe(2)
    expect(stat(StatKey.HP)).toBe(hp)
  })
})

describe('CombatController statuses', () => {
  it('adds, reports, and removes a status', () => {
    expect(cc().HasStatus('exposed')).toBe(false)
    cc().AddStatus('exposed')
    expect(cc().HasStatus('exposed')).toBe(true)
    cc().RemoveStatus('exposed')
    expect(cc().HasStatus('exposed')).toBe(false)
  })

  it('does not stack the same status twice', () => {
    cc().AddStatus('exposed')
    cc().AddStatus('exposed')
    expect(cc().Statuses.filter(s => s.status.ID === 'exposed')).toHaveLength(1)
  })
})

describe('CombatController destruction', () => {
  it('is destroyed when structure runs out', () => {
    expect(cc().IsDestroyed).toBe(false)
    setStat(StatKey.STRUCTURE, 0)
    expect(cc().IsDestroyed).toBe(true)
  })

  it('restores full structure when un-destroyed', () => {
    cc().SetDestroyed(true)
    expect(cc().IsDestroyed).toBe(true)

    cc().SetDestroyed(false)
    expect(stat(StatKey.STRUCTURE)).toBe(cc().StatController.getMax(StatKey.STRUCTURE))
  })
})

describe('CombatController.Stabilize', () => {
  it('cool clears heat and the exposed status', () => {
    cc().ApplyHeat(3)
    cc().AddStatus('exposed')

    cc().Stabilize('cool')

    expect(stat(StatKey.HEATCAP)).toBe(0)
    expect(cc().HasStatus('exposed')).toBe(false)
  })

  it('repair refills HP and spends a repair', () => {
    const repairs = stat(StatKey.REPAIR_CAPACITY)
    cc().ApplyDamage(DamageType.Kinetic, 4)

    cc().Stabilize('repair')

    expect(stat(StatKey.HP)).toBe(cc().StatController.getMax(StatKey.HP))
    expect(stat(StatKey.REPAIR_CAPACITY)).toBe(repairs - 1)
  })

  it('clear_burn zeroes burn', () => {
    cc().ApplyDamage(DamageType.Burn, 5)
    cc().Stabilize('clear_burn')
    expect(stat(StatKey.BURN)).toBe(0)
  })
})

describe('CombatController.EndRound', () => {
  it('restores the turn counter, spent actions, and speed', () => {
    cc().Turn = 3
    cc().SetCombatAction('Full', false)
    setStat(StatKey.SPEED, 0)

    expect(cc().CanActivate('full')).toBe(false)

    cc().EndRound(null)

    expect(cc().Turn).toBe(1)
    expect(cc().CanActivate('full')).toBe(true)
    expect(stat(StatKey.SPEED)).toBe(cc().StatController.getMax(StatKey.SPEED))
  })

  it('drops Braced and leaves a cooldown status behind', () => {
    cc().Braced = true
    cc().EndRound(null)

    expect(cc().Braced).toBe(false)
    expect(cc().CustomStatuses.some(s => s.status.Attribute === 'Brace Cooldown')).toBe(true)
    expect(cc().CombatActions.Full).toBe(false)
  })
})

describe('CombatController combat actions', () => {
  it('spends the two quick actions one at a time', () => {
    cc().SetCombatAction('Quick', false)
    expect(cc().CanActivate('quick')).toBe(true)

    cc().SetCombatAction('Quick', false)
    expect(cc().CanActivate('quick')).toBe(false)
  })

  it('spending a full action spends both quick actions with it', () => {
    cc().SetCombatAction('Full', false)
    expect(cc().CanActivate('quick')).toBe(false)
    expect(cc().CanActivate('protocol')).toBe(false)
  })

  it('toggle flips the current availability', () => {
    cc().SetCombatAction('Overcharge', false)
    expect(cc().CanActivate('overcharge')).toBe(false)
    cc().toggleCombatAction('Overcharge')
    expect(cc().CanActivate('overcharge')).toBe(true)
  })

  it('ResetCombatActions restores the full pool', () => {
    cc().SetCombatAction('Full', false)
    cc().SetCombatAction('Reaction', false)

    cc().ResetCombatActions()

    expect(cc().CanActivate('full')).toBe(true)
    expect(cc().CanActivate('reaction')).toBe(true)
  })

  it('move depends on remaining speed', () => {
    expect(cc().CanActivate('move')).toBe(true)
    setStat(StatKey.SPEED, 0)
    expect(cc().CanActivate('move')).toBe(false)
  })

  it('marks and clears a used action', () => {
    cc().MarkActionUsed('act_barrage')
    expect(cc().IsActionUsed('act_barrage')).toBe(true)
    cc().ClearActionUsed('act_barrage')
    expect(cc().IsActionUsed('act_barrage')).toBe(false)
  })
})

describe('CombatLog history cap', () => {
  it('keeps the most recent entries and drops the oldest', () => {
    const log = cc().CombatLog
    for (let i = 0; i < 600; i++) log.LogSimpleEvent(`event ${i}`)

    expect(log.History.length).toBe(500)
    expect(log.History[0].event).toBe('event 100')
    expect(log.History[499].event).toBe('event 599')
  })

  it('trims an oversized history loaded from save data', () => {
    const oversized = Array.from({ length: 900 }, (_, i) => ({
      timestamp: 0,
      round: 1,
      dir: 'incoming' as const,
      event: `old ${i}`,
    }))

    cc().CombatLog.History = CombatLog.trim(oversized)

    expect(cc().CombatLog.History.length).toBe(500)
    expect(cc().CombatLog.History[0].event).toBe('old 400')
  })
})
