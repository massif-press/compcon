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
import EidolonPrint from './EidolonPrint.vue'
import { makeEidolon, makeEidolonLayer } from '@/__tests__/factories'

const options = { layout: {}, orientation: {}, paper: {}, include: [], extras: [] } as any

function printed(tier: number) {
  const layer = makeEidolonLayer(1, {
    rules: 'This layer has {10/15/20} Armor.',
    stats: { armor: [10, 15, 20] },
    features: [
      {
        id: 'test_elayer_weapon',
        name: 'Test Layer Weapon',
        origin: 'test_elayer_1',
        type: 'Weapon',
        weapon_type: 'Heavy Memetic',
        attack_bonus: [2, 4, 6],
        damage: [{ type: 'Kinetic', val: [3, 5, 7] }],
        range: [{ type: 'Range', val: 15 }],
      } as any,
    ],
    shards: { count: [4, 5, 6], detail: 'Shards deal {1/2/3} damage.' },
  })
  const npc = makeEidolon([layer])
  npc.Tier = tier
  return mount(EidolonPrint, { props: { npc, options } }).text()
}

describe('Eidolon print', () => {
  it('prints every layer value at the tier of the Eidolon', () => {
    const text = printed(3)

    expect(text).toContain('This layer has 20 Armor.')
    expect(text).toContain('+6')
    expect(text).toContain('7')
    expect(text).toContain('New Shards: 6')
    expect(text).toContain('Shards deal 3 damage.')
  })

  it('prints tier 1 values for a tier 1 Eidolon', () => {
    const text = printed(1)

    expect(text).toContain('This layer has 10 Armor.')
    expect(text).toContain('+2')
    expect(text).toContain('New Shards: 4')
    expect(text).toContain('Shards deal 1 damage.')
    expect(text).not.toContain('20 Armor')
  })
})
