import { describe, it, expect } from 'vitest'
import { Unit } from './unit/Unit'
import { NpcFeatureFactory } from './feature/NpcFeatureFactory'
import type { NpcFeature } from './feature/NpcFeature'

function henchman(): Unit {
  const unit = new Unit()
  unit.StatController.setMax('hp', 30)
  unit.StatController.setMax('heatcap', 8)
  unit.StatController.setMax('structure', 1)
  unit.NpcFeatureController.Features = [
    NpcFeatureFactory.Build<NpcFeature>({
      id: 'npcf_ws_henchman',
      name: 'Weak Structure',
      type: 'Trait',
      bonuses: [{ id: 'hp', val: '({hp}/2)', replace: true }],
    } as any),
    NpcFeatureFactory.Build<NpcFeature>({
      id: 'npcf_if_henchman',
      name: 'Inferior Frame',
      type: 'Trait',
      bonuses: [
        { id: 'structure', val: '1', replace: true },
        { id: 'heatcap', val: '({heatcap}/2)', replace: true },
      ],
    } as any),
  ]
  return unit
}

describe('replace bonuses on an NPC', () => {
  it('replaces the base stat rather than adding to it', () => {
    const unit = henchman()

    expect(unit.StatController.getMaxWithBonuses('hp')).toBe(15)
    expect(unit.StatController.getMaxWithBonuses('heatcap')).toBe(4)
    expect(unit.StatController.getMaxWithBonuses('structure')).toBe(1)
  })

  it('still adds non-replace bonuses on top of the replaced base', () => {
    const unit = henchman()
    unit.NpcFeatureController.Features = [
      ...unit.NpcFeatureController.Features,
      NpcFeatureFactory.Build<NpcFeature>({
        id: 'npcf_armored',
        name: 'Armored',
        type: 'Trait',
        bonuses: [{ id: 'hp', val: 5 }],
      } as any),
    ]

    expect(unit.StatController.getMaxWithBonuses('hp')).toBe(20)
  })
})
