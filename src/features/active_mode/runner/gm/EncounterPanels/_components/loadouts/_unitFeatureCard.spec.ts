import { describe, it, expect, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  GetAll: vi.fn(async () => []),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import UnitFeatureCard from './_unitFeatureCard.vue'
import { EncounterContextKey } from '../../encounterContext'
import { Encounter } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { makeEidolon, makeEidolonLayer, makeMech, makePilot } from '@/__tests__/factories'

describe('feature card on an Eidolon layer', () => {
  it('shows the feature at the tier of the Eidolon', () => {
    const source = makeEidolon([
      makeEidolonLayer(1, {
        features: [
          {
            id: 'test_elayer_trait',
            name: 'Test Layer Trait',
            origin: 'test_elayer_1',
            type: 'Trait',
            effect: 'Characters take {2/3/4} damage.',
          } as any,
        ],
      }),
    ])
    source.Tier = 3
    const encounter = new Encounter()
    encounter.AddCombatant(source)
    const pilot = makePilot({ name: 'Test Pilot 1', callsign: 'TEST1' })
    makeMech(pilot)
    const instance = new EncounterInstance(undefined, encounter, [pilot])
    const combatant = instance.Combatants.find(c => c.type === 'eidolon')!
    const layer = (combatant.actor as unknown as Eidolon).ActiveLayer
    layer.UIState['test_elayer_trait'] = false

    const text = mount(UnitFeatureCard, {
      props: { item: layer.Layer.Features[0], unit: layer as any },
      global: {
        provide: {
          [EncounterContextKey as symbol]: {
            owner: computed(() => combatant),
            encounterInstance: computed(() => instance),
          },
        },
      },
    }).text()

    expect(text).toContain('Characters take 4 damage.')
  })
})
