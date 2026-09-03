import { describe, it, expect } from 'vitest'
import { ActiveEventTarget } from './eventTarget'

const target = (over: any = {}) => {
  const t = Object.create(ActiveEventTarget.prototype) as any
  Object.assign(t, {
    AttackType: 'ranged',
    TargetDefenseValue: 12,
    MissedFromInvisibility: false,
    HitResultOverride: undefined,
    ...over,
  })
  return t
}

describe('the hit result override', () => {
  it('reads the roll against the real defense when nothing is overridden', () => {
    expect(target({ AttackRolledValue: 12 }).HitResult).toBe('hit')
    expect(target({ AttackRolledValue: 11 }).HitResult).toBe('miss')
    expect(target({ AttackRolledValue: 20 }).HitResult).toBe('crit')
  })

  it('forces a hit without touching the defense value it is compared against', () => {
    const t = target({ AttackRolledValue: 7 })
    t.OverrideHitResult('hit')

    expect(t.HitResult).toBe('hit')
    expect(t.TargetDefenseValue).toBe(12)
  })

  it('keeps a natural twenty a crit on a forced hit', () => {
    const t = target({ AttackRolledValue: 20 })
    t.OverrideHitResult('hit')
    expect(t.HitResult).toBe('crit')
  })

  it('forces a miss even on a natural twenty', () => {
    const t = target({ AttackRolledValue: 20 })
    t.OverrideHitResult('miss')

    expect(t.HitResult).toBe('miss')
    expect(t.TargetDefenseValue).toBe(12)
  })

  it('goes back to the roll when the override is cleared', () => {
    const t = target({ AttackRolledValue: 7 })
    t.OverrideHitResult('hit')
    t.OverrideHitResult(undefined)

    expect(t.HitResult).toBe('miss')
  })

  it('lets invisibility win over a forced hit', () => {
    const t = target({ AttackRolledValue: 20, MissedFromInvisibility: true })
    t.OverrideHitResult('hit')
    expect(t.HitResult).toBe('miss')
  })
})
