import { describe, it, expect } from 'vitest'
import { hasUsesRemaining, isSelectableWeapon } from './AttackRules'
import { isDestroyable } from './StructureCheck'

const limited = (uses: number, maxUses = 2, over: Record<string, unknown> = {}) => ({
  IsLimited: true,
  Uses: uses,
  MaxUses: maxUses,
  ...over,
})

describe('hasUsesRemaining', () => {
  it('reports nothing left once spent to maximum', () => {
    expect(hasUsesRemaining(limited(0))).toBe(true)
    expect(hasUsesRemaining(limited(1))).toBe(true)
    expect(hasUsesRemaining(limited(2))).toBe(false)
  })

  it('treats an unlimited item as always having uses', () => {
    expect(hasUsesRemaining({ IsLimited: false, Uses: 99, MaxUses: 0 })).toBe(true)
    expect(hasUsesRemaining({})).toBe(true)
  })
})

describe('callers agree', () => {
  it('provides a limited weapon at full charge and hides a spent one', () => {
    expect(isSelectableWeapon(limited(0))).toBe(true)
    expect(isSelectableWeapon(limited(2))).toBe(false)
  })

  it('can destroy a limited system with a charge, but not a spent one', () => {
    expect(isDestroyable(limited(0))).toBe(true)
    expect(isDestroyable(limited(1))).toBe(true)
    expect(isDestroyable(limited(2))).toBe(false)
  })

  it('ignores other item conditionals', () => {
    expect(isSelectableWeapon({ ...limited(0), Destroyed: true })).toBe(false)
    expect(isSelectableWeapon({ ...limited(0), Used: true })).toBe(false)
    expect(isDestroyable({ ...limited(0), Destroyed: true })).toBe(false)
    expect(isDestroyable({ ...limited(0), IsIndestructible: true })).toBe(false)
    expect(isDestroyable({ ...limited(0), IsMod: true })).toBe(false)
  })
})
