import { describe, it, expect } from 'vitest'
import { makeNpc } from '@/__tests__/factories'
import { Unit } from '../unit/Unit'
import { NpcFeatureFactory } from './NpcFeatureFactory'
import type { NpcFeature, INpcFeatureData } from './NpcFeature'

const featureData = {
  id: 'npcf_test',
  name: 'Test Trait',
  description: 'd',
  type: 'Trait',
  origin: { type: 'Class', name: 'Test', base: true },
} as unknown as INpcFeatureData

function npcWithFeature(name: string) {
  const npc = makeNpc(name)
  npc.NpcFeatureController.AddFeature(NpcFeatureFactory.Build<NpcFeature>(featureData))
  return npc
}

describe('NpcFeatureController', () => {
  it('does not write per-npc state back onto the source feature data', () => {
    const source = NpcFeatureFactory.Build<NpcFeature>(featureData)

    const a = makeNpc('A')
    a.NpcFeatureController.AddFeature(source)
    const b = makeNpc('B')
    b.NpcFeatureController.AddFeature(source)

    const featA = a.NpcFeatureController.Features[0]
    featA.Used = true
    featA.FlavorName = 'A-only name'
    a.Serialize()

    expect((featureData as any).isUsed).toBeUndefined()
    expect((featureData as any).flavorName).toBeUndefined()
    expect(b.NpcFeatureController.Features[0].ItemData).not.toBe(featA.ItemData)
    expect(b.NpcFeatureController.Features[0].Used).toBe(false)
  })

  it('round-trips used state for features not in the compendium', () => {
    const npc = npcWithFeature('Pursuer')
    npc.NpcFeatureController.Features[0].Used = true

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))

    expect(loaded.NpcFeatureController.Features[0].Used).toBe(true)
  })

  it('leaves unused features unused across a round trip', () => {
    const npc = npcWithFeature('Pursuer')

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))

    expect(loaded.NpcFeatureController.Features[0].Used).toBe(false)
  })
})
