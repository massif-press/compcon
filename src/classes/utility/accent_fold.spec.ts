import { describe, it, expect } from 'vitest'
import accentFold, { accentInclude, unCamelCase } from './accent_fold'

describe('accentFold', () => {
  it('strips diacritics', () => {
    expect(accentFold('Sécurité')).toBe('Securite')
    expect(accentFold('Ærø')).toBe('Ærø'.normalize('NFD').replace(/[̀-ͯ]/g, ''))
  })

  it('leaves plain text alone', () => {
    expect(accentFold('Everest')).toBe('Everest')
  })

  it('is empty for empty input', () => {
    expect(accentFold('')).toBe('')
    expect(accentFold(undefined as unknown as string)).toBe('')
  })
})

describe('accentInclude', () => {
  it('matches across accents and case', () => {
    expect(accentInclude('Sécurité Nationale', 'securite')).toBe(true)
    expect(accentInclude('SECURITE', 'sécu')).toBe(true)
  })

  it('is false when the needle is absent', () => {
    expect(accentInclude('Everest', 'atlas')).toBe(false)
  })

  it('matches everything against an empty needle', () => {
    expect(accentInclude('Everest', '')).toBe(true)
  })
})

describe('unCamelCase', () => {
  it('splits camel case into words', () => {
    expect(unCamelCase('mechWeapon')).toBe('mech Weapon')
    expect(unCamelCase('coreBonusPoint')).toBe('core Bonus Point')
  })

  it('leaves a single word alone', () => {
    expect(unCamelCase('frame')).toBe('frame')
  })
})
