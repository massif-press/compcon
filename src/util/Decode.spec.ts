import fc from 'fast-check'
import { describe, it, expect, beforeAll } from 'vitest'
import { encrypt, decrypt } from './Decode'

beforeAll(() => {
  if (!import.meta.env.VITE_ACHIEVEMENT_KEY) {
    import.meta.env.VITE_ACHIEVEMENT_KEY = 'test-key'
  }
})

describe('encrypt/decrypt', () => {
  it('round-trips any text', () => {
    fc.assert(
      fc.property(fc.string(), text => {
        expect(decrypt(encrypt(text))).toBe(text)
      })
    )
  })

  it('does not emit the plaintext', () => {
    expect(encrypt('achievement_unlocked')).not.toContain('achievement')
  })

  it('round-trips an empty string', () => {
    expect(decrypt(encrypt(''))).toBe('')
  })
})
