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

const fakePack = {
  ID: 'lcp_test',
  Name: 'Test Pack',
  Version: '1.0',
  Website: '',
  v3: true,
  Data: { tags: [] },
} as any

function packFeature(data: INpcFeatureData = featureData): NpcFeature {
  return NpcFeatureFactory.Build<NpcFeature>(data, fakePack)
}

function npcWithFeature(name: string) {
  const npc = makeNpc(name)
  npc.NpcFeatureController.AddFeature(packFeature())
  return npc
}

describe('NpcFeatureController', () => {
  it('does not write per-npc state back onto the source feature data', () => {
    const source = packFeature()
    expect(source.ItemData).toBe(featureData)

    const a = makeNpc('Test NPC A')
    a.NpcFeatureController.AddFeature(source)
    const b = makeNpc('Test NPC B')
    b.NpcFeatureController.AddFeature(source)

    const featA = a.NpcFeatureController.Features[0]
    featA.Used = true
    featA.FlavorName = 'A-only name'
    a.Serialize()

    expect((featureData as any).isUsed).toBeUndefined()
    expect((featureData as any).flavorName).toBeUndefined()
    expect((featureData as any).flavorDescription).toBeUndefined()
    expect(b.NpcFeatureController.Features[0].ItemData).not.toBe(featA.ItemData)
    expect(b.NpcFeatureController.Features[0].Used).toBe(false)
  })

  it('ignores per-npc state baked into compendium source data', () => {
    const poisoned = packFeature({
      ...(featureData as any),
      id: 'npcf_poisoned',
      isUsed: true,
      flavorName: 'stale name',
      flavorDescription: 'stale description',
    } as unknown as INpcFeatureData)

    const npc = makeNpc('Test NPC 1')
    npc.NpcFeatureController.AddFeature(poisoned)
    const feat = npc.NpcFeatureController.Features[0]

    expect(feat.FlavorDescription).toBe('')
    expect(feat.FlavorName).toBe('')
    expect(feat.Used).toBe(false)
  })

  it('round-trips used state for features not in the compendium', () => {
    const npc = npcWithFeature('Test NPC 1')
    npc.NpcFeatureController.Features[0].Used = true

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))

    expect(loaded.NpcFeatureController.Features[0].Used).toBe(true)
  })

  it('leaves unused features unused across a round trip', () => {
    const npc = npcWithFeature('Test NPC 1')

    const loaded = Unit.Deserialize(JSON.parse(JSON.stringify(npc.Serialize())))

    expect(loaded.NpcFeatureController.Features[0].Used).toBe(false)
  })
})
