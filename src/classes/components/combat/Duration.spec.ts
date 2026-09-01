import { describe, it, expect } from 'vitest'
import { isExpired, expiredIn, isDue, roundsRemaining, regainsOn, ActivePeriod } from './Duration'
import { expiration } from './Expiration'

const ctx = (over = {}) => ({ round: 1, actorId: 'a', turn: 1, ...over }) as any

describe('Duration', () => {
  it('treats an absent expiration as never expiring, rather than as expired', () => {
    expect(isExpired(undefined, ctx())).toBe(false)
    expect(isExpired(null, ctx())).toBe(false)
  })

  it('asks the expiration itself, passing the phase and the encounter end', () => {
    const turnExp = new expiration('end_turn_self')
    turnExp.ExpirationActorID = 'a'
    turnExp.ExpirationActorTurn = 1

    expect(isExpired(turnExp, ctx({ turn: 1 }))).toBe(false)
    expect(isExpired(turnExp, ctx({ turn: 2 }))).toBe(true)
    expect(isExpired(turnExp, ctx({ turn: 2, phase: 'start' }))).toBe(false)
  })

  it('ends an encounter-scoped expiration only when told the encounter ended', () => {
    const sceneExp = new expiration('scene')

    expect(isExpired(sceneExp, ctx({ turn: 99 }))).toBe(false)
    expect(isExpired(sceneExp, ctx({ encounterEnded: true }))).toBe(true)
  })

  it('filters a list of things that carry expirations', () => {
    const gone = new expiration('scene')
    const items = [{ expires: gone }, { expires: undefined }]

    expect(expiredIn(items, ctx({ encounterEnded: true }))).toHaveLength(1)
    expect(expiredIn(items, ctx())).toHaveLength(0)
    expect(expiredIn([], ctx())).toEqual([])
  })

  it('counts the rounds left on a timed effect, never below zero', () => {
    expect(roundsRemaining({ Round: 5 }, 2)).toBe(3)
    expect(roundsRemaining({ Round: 2 }, 2)).toBe(0)
    expect(roundsRemaining({ Round: 1 }, 4)).toBe(0)
    expect(roundsRemaining(undefined, 4)).toBe(0)
  })

  it('is due exactly when no rounds remain, which is the panel countdown reaching zero', () => {
    expect(isDue({ Round: 5 }, 2)).toBe(false)
    expect(isDue({ Round: 2 }, 2)).toBe(true)
    expect(isDue({ Round: 1 }, 4)).toBe(true)
    expect(isDue(undefined, 4)).toBe(false)
  })

  it('re-exports the use-period rule so every duration question has one import', () => {
    expect(regainsOn(ActivePeriod.Turn, ActivePeriod.Round)).toBe(true)
    expect(regainsOn(ActivePeriod.Scene, ActivePeriod.Turn)).toBe(false)
  })
})
