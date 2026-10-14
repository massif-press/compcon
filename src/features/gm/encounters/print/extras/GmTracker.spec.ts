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

import { mount } from '@vue/test-utils'
import GmTracker from './GmTracker.vue'
import { Encounter } from '@/classes/encounter/Encounter'
import { makeEidolon, makeNpc } from '@/__tests__/factories'

const rowNames = (encounter: Encounter) =>
  mount(GmTracker, { props: { encounter } })
    .findAll('.heading')
    .map(x => x.text())

describe('printed GM tracker', () => {
  it('prints a row for each NPC', () => {
    const encounter = new Encounter()
    encounter.AddCombatant(makeNpc('Test NPC 1'))
    encounter.AddCombatant(makeNpc('Test NPC 2'))

    expect(rowNames(encounter)).toEqual(['Test NPC 1', 'Test NPC 2'])
  })

  it('prints an Eidolon as one row per layer, outermost first', () => {
    const encounter = new Encounter()
    encounter.AddCombatant(makeEidolon())

    expect(rowNames(encounter)).toEqual([
      'Test Eidolon: Test Layer 3',
      'Test Eidolon: Test Layer 2',
      'Test Eidolon: Test Layer 1',
      'Test Eidolon: Core',
    ])
  })
})
