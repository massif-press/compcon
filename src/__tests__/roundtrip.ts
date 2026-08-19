import fc from 'fast-check'
import { expect } from 'vitest'

export function assertDataRoundTrip<T, S>(
  arb: fc.Arbitrary<S>,
  serialize: (x: T) => S,
  deserialize: (s: S) => T
) {
  fc.assert(
    fc.property(arb, data => {
      const once = serialize(deserialize(data))
      expect(serialize(deserialize(once))).toEqual(once)
    })
  )
}

export function assertFixtureRoundTrip<T, S>(
  fixture: S,
  serialize: (x: T) => S,
  deserialize: (s: S) => T
) {
  const once = serialize(deserialize(fixture))
  expect(serialize(deserialize(once))).toEqual(once)
}
