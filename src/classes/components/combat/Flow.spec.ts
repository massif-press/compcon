import { describe, it, expect } from 'vitest'
import { Flow } from './Flow'
import type { IFlowStep } from './Flow'

type S = { log: string[]; ready: boolean; damage: number }

const state = (over: Partial<S> = {}): S => ({ log: [], ready: false, damage: 0, ...over })

const mark = (name: string, outcome: 'continue' | 'halt' | 'await' = 'continue'): IFlowStep<S> => ({
  Name: name,
  Run: s => {
    s.log.push(name)
    return outcome
  },
})

describe('Flow', () => {
  it('runs its steps in order and reports them by name', () => {
    const f = new Flow<S>('test', [mark('a'), mark('b'), mark('c')])
    const r = f.Begin(state())

    expect(r.outcome).toBe('complete')
    expect(r.state.log).toEqual(['a', 'b', 'c'])
    expect(r.completed).toEqual(['a', 'b', 'c'])
    expect(r.pending).toBeUndefined()
  })

  it('halts on a step that halts, naming it and running nothing after it', () => {
    const f = new Flow<S>('test', [mark('a'), mark('b', 'halt'), mark('c')])
    const r = f.Begin(state())

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('b')
    expect(r.completed).toEqual(['a'])
    expect(r.state.log).toEqual(['a', 'b'])
  })

  it('suspends on a step that awaits, which is not a halt', () => {
    const f = new Flow<S>('test', [mark('a'), mark('b', 'await'), mark('c')])
    const r = f.Begin(state())

    expect(r.outcome).toBe('awaiting')
    expect(r.pending).toBe('b')
    expect(r.state.log).toEqual(['a', 'b'])
  })

  it('resumes an awaiting flow by re-running the step that awaited', () => {
    const gate: IFlowStep<S> = {
      Name: 'gate',
      Run: s => {
        s.log.push('gate')
        return s.ready ? 'continue' : 'await'
      },
    }
    const f = new Flow<S>('test', [mark('a'), gate, mark('c')])

    const first = f.Begin(state())
    expect(first.outcome).toBe('awaiting')

    first.state.ready = true
    const second = f.Resume(first)

    expect(second.outcome).toBe('complete')
    expect(second.state.log).toEqual(['a', 'gate', 'gate', 'c'])
    expect(second.completed).toEqual(['a', 'gate', 'c'])
  })

  it('does not re-run steps that completed before the suspension', () => {
    const apply: IFlowStep<S> = {
      Name: 'apply',
      Run: s => {
        s.damage += 5
        return 'continue'
      },
    }
    const f = new Flow<S>('test', [apply, mark('gate', 'await')])

    const first = f.Begin(state())
    expect(first.state.damage).toBe(5)

    const second = f.Resume(first)
    expect(second.state.damage).toBe(5)
    expect(second.outcome).toBe('awaiting')
  })

  it('returns a resumed result unchanged when it was not awaiting', () => {
    const f = new Flow<S>('test', [mark('a', 'halt')])
    const halted = f.Begin(state())

    expect(f.Resume(halted)).toBe(halted)
  })

  it('composes: a flow used as a step runs inside another flow', () => {
    const inner = new Flow<S>('inner', [mark('i1'), mark('i2')])
    const outer = new Flow<S>('outer', [mark('o1'), inner.AsStep(), mark('o2')])

    const r = outer.Begin(state())

    expect(r.outcome).toBe('complete')
    expect(r.state.log).toEqual(['o1', 'i1', 'i2', 'o2'])
    expect(r.completed).toEqual(['o1', 'inner', 'o2'])
  })

  it('propagates a nested await as an await, not a halt', () => {
    const inner = new Flow<S>('inner', [mark('i1', 'await')])
    const outer = new Flow<S>('outer', [inner.AsStep(), mark('o2')])
    const r = outer.Begin(state())

    expect(r.outcome).toBe('awaiting')
    expect(r.pending).toBe('inner')
    expect(r.state.log).toEqual(['i1'])
  })

  it('re-runs a nested flow from its first step on resume, so its steps must be re-entrant', () => {
    let attempts = 0
    const gate: IFlowStep<S> = {
      Name: 'i2',
      Run: s => {
        s.log.push('i2')
        return ++attempts > 1 ? 'continue' : 'await'
      },
    }
    const inner = new Flow<S>('inner', [mark('i1'), gate])
    const outer = new Flow<S>('outer', [inner.AsStep(), mark('o2')])

    const first = outer.Begin(state())
    expect(first.state.log).toEqual(['i1', 'i2'])

    const second = outer.Resume(first)
    expect(second.outcome).toBe('complete')
    expect(second.state.log).toEqual(['i1', 'i2', 'i1', 'i2', 'o2'])
  })

  it('inserts a step before or after a named one', () => {
    const f = new Flow<S>('test', [mark('a'), mark('c')])
    f.InsertStepBefore('c', mark('b'))
    f.InsertStepAfter('c', mark('d'))

    expect(f.Steps).toEqual(['a', 'b', 'c', 'd'])
    expect(f.Begin(state()).state.log).toEqual(['a', 'b', 'c', 'd'])
  })

  it('removes a step by name', () => {
    const f = new Flow<S>('test', [mark('a'), mark('b'), mark('c')])
    f.RemoveStep('b')

    expect(f.Steps).toEqual(['a', 'c'])
    expect(f.Begin(state()).state.log).toEqual(['a', 'c'])
  })

  it('refuses a duplicate step name, at construction and at insertion', () => {
    expect(() => new Flow<S>('test', [mark('a'), mark('a')])).toThrow(/duplicate step "a"/)

    const f = new Flow<S>('test', [mark('a')])
    expect(() => f.InsertStepAfter('a', mark('a'))).toThrow(/duplicate step "a"/)
  })

  it('refuses to address a step that does not exist', () => {
    const f = new Flow<S>('test', [mark('a')])

    expect(() => f.InsertStepBefore('nope', mark('b'))).toThrow(/no step named "nope"/)
    expect(() => f.RemoveStep('nope')).toThrow(/no step named "nope"/)
  })

  it('holds no state of its own, so the same flow can run twice independently', () => {
    const f = new Flow<S>('test', [mark('a'), mark('b')])

    const one = f.Begin(state())
    const two = f.Begin(state())

    expect(one.state.log).toEqual(['a', 'b'])
    expect(two.state.log).toEqual(['a', 'b'])
    expect(one.state).not.toBe(two.state)
  })
})
