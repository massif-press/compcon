import { describe, it, expect } from 'vitest'
import { Unit } from '@/classes/npc/unit/Unit'
import { NpcFeatureFactory } from '@/classes/npc/feature/NpcFeatureFactory'
import type { NpcFeature, INpcFeatureData } from '@/classes/npc/feature/NpcFeature'
import { makeNpc } from '@/__tests__/factories'

const counterFeatureData = {
  id: 'npcf_counter_test',
  name: 'Charged Trait',
  description: 'd',
  type: 'Trait',
  origin: { type: 'Class', name: 'Test', base: true },
  counters: [{ id: 'ctr_charges', name: 'Charges', max: 3 }],
} as unknown as INpcFeatureData

describe('CounterController persistence', () => {
  it('round-trips counter values', () => {
    const npc = makeNpc('Pursuer')
    const counters = npc.CombatController.CounterController
    counters.createCustomCounter('ammo')
    const id = counters.CustomCounterData[0].id
    counters.saveCounter({ id, val: 4 })

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))
    const loadedCounters = loaded.CombatController.CounterController

    expect(loadedCounters.CustomCounterData.map(c => c.name)).toEqual(['ammo'])
    expect(loadedCounters.CounterSaveData).toEqual([{ id, val: 4 }])
  })

  it('round-trips values for counters that come from a feature', () => {
    const npc = makeNpc('Pursuer')
    npc.NpcFeatureController.AddFeature(
      NpcFeatureFactory.Build<NpcFeature>(counterFeatureData)
    )
    const counters = npc.CombatController.CounterController
    expect(counters.CounterData.map(c => c.id)).toContain('ctr_charges')
    counters.saveCounter({ id: 'ctr_charges', val: 2 })

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))

    expect(loaded.CombatController.CounterController.CounterSaveData).toEqual([
      { id: 'ctr_charges', val: 2 },
    ])
  })

  it('ignores legacy counter_data that holds definitions rather than values', () => {
    const npc = makeNpc('Pursuer')
    const data = JSON.parse(JSON.stringify(npc.Serialize()))
    data.combat_data.counters.counter_data = [{ id: 'ctr_legacy', name: 'Legacy' }]

    const loaded = Unit.Deserialize(data)

    expect(loaded.CombatController.CounterController.CounterSaveData).toEqual([])
  })
})
