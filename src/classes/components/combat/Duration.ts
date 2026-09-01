import { regainsOn, ActivePeriod } from '@/classes/Frequency'
import type { expiration } from './Expiration'

interface IDurationContext {
  round: number
  actorId: string
  turn: number
  phase?: 'start' | 'end'
  encounterEnded?: boolean
}

interface ITimed {
  Round: number
}

function isExpired(expires: expiration | undefined | null, ctx: IDurationContext): boolean {
  if (!expires) return false
  return expires.HasExpired(ctx.round, ctx.actorId, ctx.turn, ctx.phase ?? 'end', {
    encounterEnded: ctx.encounterEnded,
  })
}

function expiredIn<T extends { expires?: expiration }>(items: T[], ctx: IDurationContext): T[] {
  return (items || []).filter(i => isExpired(i.expires, ctx))
}

function roundsRemaining(effect: ITimed | undefined | null, round: number): number {
  if (!effect) return 0
  return Math.max(effect.Round - round, 0)
}

function isDue(effect: ITimed | undefined | null, round: number): boolean {
  if (!effect) return false
  return roundsRemaining(effect, round) === 0
}

export { isExpired, expiredIn, isDue, roundsRemaining, regainsOn, ActivePeriod }
export type { IDurationContext, ITimed }
