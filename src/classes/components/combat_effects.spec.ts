import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { StatController } from './combat/stats/StatController'
import { StatKey } from './combat/stats/Stats'
import { EffectSave } from './feature/active_effects/effect_subtype/EffectSave'
import { EffectSpecial } from './feature/active_effects/effect_subtype/EffectSpecial'
import { TimedEffect } from './feature/active_effects/TimedEffect'
import { Deployable } from './feature/deployable/Deployable'
import type { Mech } from '@/classes/mech/Mech'

let mech: Mech

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
})

describe('StatController', () => {
  const stats = () => mech.CombatController.StatController

  it('reports max and current for a frame-derived stat', () => {
    expect(stats().getMax(StatKey.HP)).toBeGreaterThan(0)
    expect(stats().getCurrent(StatKey.HP)).toBe(stats().getMax(StatKey.HP))
  })

  it('sets a current stat', () => {
    stats().setCurrentStat(StatKey.HP, 3)
    expect(stats().getCurrent(StatKey.HP)).toBe(3)
  })

  it('preserves a floor', () => {
    stats().setFloor(StatKey.HP, 2)
    stats().setCurrentStat(StatKey.HP, -5)
    expect(stats().getCurrent(StatKey.HP)).toBe(2)

    stats().clearFloor(StatKey.HP)
    stats().setCurrentStat(StatKey.HP, -5)
    expect(stats().getCurrent(StatKey.HP)).toBe(-5)
  })

  it('resets current stats back to max', () => {
    stats().setCurrentStat(StatKey.HP, 1)
    stats().resetCurrentStats()

    expect(stats().getCurrent(StatKey.HP)).toBe(stats().getMax(StatKey.HP))
  })

  it('round-trips through Serialize', () => {
    stats().setCurrentStat(StatKey.HP, 4)

    const target: any = {}
    StatController.Serialize(mech.CombatController, target)

    const other = makeMech(makePilot({ level: 3 }))
    StatController.Deserialize(other.CombatController, target)

    expect(other.CombatController.StatController.getCurrent(StatKey.HP)).toBe(4)
  })
})

describe('EffectSave', () => {
  it('reads a bare stat name', () => {
    const save = new EffectSave('hull')

    expect(save.Stat.toLowerCase()).toBe('hull')
    expect(save.AoE).toBeFalsy()
  })

  it('reads the object form with an area flag', () => {
    const save = new EffectSave({ stat: 'agi', aoe: true })

    expect(save.Stat.toLowerCase()).toBe('agi')
    expect(save.AoE).toBe(true)
  })
})

describe('EffectSpecial', () => {
  it('round-trips its attribute and detail', () => {
    const special = new EffectSpecial({ attribute: 'Brace Cooldown', detail: 'no reactions' })
    const back = EffectSpecial.Deserialize(EffectSpecial.Serialize(special))

    expect(back.Attribute).toBe('Brace Cooldown')
    expect(back.Detail).toBe('no reactions')
  })
})

describe('TimedEffect', () => {
  it('round-trips what it applies and removes', () => {
    const effect = new TimedEffect({
      name: 'Overshield',
      detail: 'absorbs damage',
      round: 2,
      apply: { status: ['exposed'] },
    } as never)

    const back = TimedEffect.Deserialize(JSON.parse(JSON.stringify(TimedEffect.Serialize(effect))))

    expect(back.Name).toBe('Overshield')
    expect(back.Round).toBe(2)
    expect(back.Apply?.status).toEqual(['exposed'])
  })
})

describe('Deployable', () => {
  it('serializes the data it was built from', () => {
    const deployable = new Deployable({ name: 'Turret', type: 'Drone', detail: 'shoots' } as never)

    const data = Deployable.Serialize(deployable)

    expect(data.name).toBe('Turret')
    expect(data.type).toBe('Drone')
  })
})
