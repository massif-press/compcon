import { describe, it, expect, beforeEach } from 'vitest'
import logger, { LEVELS } from './logger'

const MAX_CALLER_DEPTH = 4
const MAX_CALLER_ITEMS_PER_LEVEL = 40
const MAX_CALLER_STRING_CHARS = 500

const lastCaller = () => logger.History[logger.History.length - 1].caller

beforeEach(() => {
  logger.level = LEVELS.DEBUG
  logger.clear()
})

describe('the logged caller snapshot', () => {
  it('stops descending at the depth limit instead of cloning the whole graph', () => {
    class Deep {
      constructor(public next: any) {}
    }
    let obj: any = 'bottom'
    for (let i = 0; i < 12; i++) obj = new Deep(obj)

    logger.info('deep', obj)

    let walked = lastCaller()
    for (let i = 0; i < MAX_CALLER_DEPTH; i++) walked = walked.next
    expect(walked).toBe('[Deep]')
  })

  it('truncates long strings and long collections', () => {
    logger.info('big', { note: 'x'.repeat(5000), items: Array.from({ length: 500 }, (_, i) => i) })

    const caller = lastCaller()
    expect(caller.note.length).toBeLessThan(MAX_CALLER_STRING_CHARS + 100)
    expect(caller.items.length).toBe(MAX_CALLER_ITEMS_PER_LEVEL + 1)
  })

  it('stops once the total node budget runs out', () => {
    const leaf = () => ({ a: 1, b: 2 })
    const wide = (make: () => any) =>
      Object.fromEntries(Array.from({ length: MAX_CALLER_ITEMS_PER_LEVEL }, (_, i) => [i, make()]))

    logger.info(
      'wide',
      wide(() => wide(() => wide(leaf)))
    )

    expect(JSON.stringify(lastCaller())).toContain('[Budget exceeded]')
  })

  it('marks cycles rather than recursing forever', () => {
    const a: any = { name: 'a' }
    a.self = a

    logger.info('cyclic', a)

    expect(lastCaller().self).toBe('[Circular]')
  })

  it('redacts sensitive keys', () => {
    logger.info('creds', { username: 'ash', password: 'hunter2' })

    expect(lastCaller().password).toBe('[REDACTED]')
    expect(lastCaller().username).toBe('ash')
  })

  it('survives a getter that throws', () => {
    const obj = {
      ok: 1,
      get boom(): string {
        throw new Error('nope')
      },
    }

    expect(() => logger.info('throws', obj)).not.toThrow()
    expect(lastCaller().boom).toBe('[Unreadable]')
  })
})
