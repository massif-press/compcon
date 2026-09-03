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

  it('carries the answer into the step that asked for it, and only that step', () => {
    const seen: (unknown | undefined)[] = []
    const gate: IFlowStep<S> = {
      Name: 'gate',
      Run: (s, input) => {
        seen.push(input)
        if (input === undefined) return 'await'
        s.damage = input as number
        return 'continue'
      },
      Request: () => ({ kind: 'roll', label: 'damage' }),
    }
    const after: IFlowStep<S> = {
      Name: 'after',
      Run: (s, input) => {
        seen.push(input)
        return 'continue'
      },
    }
    const f = new Flow<S>('test', [gate, after])

    const first = f.Begin(state())
    expect(first.outcome).toBe('awaiting')
    expect(first.request).toEqual({ kind: 'roll', label: 'damage' })

    const second = f.Resume(first, 9)
    expect(second.outcome).toBe('complete')
    expect(second.state.damage).toBe(9)
    expect(second.request).toBeUndefined()
    expect(seen).toEqual([undefined, 9, undefined])
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

  it('resumes a nested flow where it suspended instead of restarting it', () => {
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
    expect(second.state.log).toEqual(['i1', 'i2', 'i2', 'o2'])
  })

  it('keeps two runs of one composition apart', () => {
    const inner = new Flow<any>('inner', [
      { Name: 'i1', Run: s => (s.ready ? 'continue' : 'await') },
      {
        Name: 'i2',
        Run: s => {
          s.log = [...(s.log ?? []), 'i2']
          return 'continue'
        },
      },
    ])
    const outer = new Flow<any>('outer', [inner.AsStep('nested')])

    const a = outer.Begin({ ready: false })
    expect(a.outcome).toBe('awaiting')

    const b = outer.Begin({ ready: true })
    expect(b.outcome).toBe('complete')

    a.state.ready = true
    const resumed = outer.Resume(a)

    expect(resumed.outcome).toBe('complete')
    expect(resumed.state.log).toEqual(['i2'])
  })

  it('undoes only the steps that ran when told which ones did', () => {
    const undone: string[] = []
    const step = (name: string): IFlowStep<S> => ({
      Name: name,
      Run: () => (name === 'b' ? 'halt' : 'continue'),
      Undo: () => undone.push(name),
    })
    const f = new Flow<S>('test', [step('a'), step('b'), step('c')])

    const r = f.Begin(state())
    expect(r.completed).toEqual(['a'])

    f.UndoAll(r.state, r.completed)
    expect(undone).toEqual(['a'])

    undone.length = 0
    f.UndoAll(r.state)
    expect(undone).toEqual(['c', 'b', 'a'])
  })

  it('refuses a duplicate step name at construction', () => {
    expect(() => new Flow<S>('test', [mark('a'), mark('a')])).toThrow(/duplicate step "a"/)
  })

  it('refuses to resume against a step that does not exist', () => {
    const f = new Flow<S>('test', [mark('a')])

    expect(() =>
      f.Resume({ state: state(), outcome: 'awaiting', completed: [], pending: 'nope' })
    ).toThrow(/no step named "nope"/)
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

describe('re-entrancy of a nested flow', () => {
  it('does not re-run the nested steps that completed before the suspension', () => {
    const log: string[] = []
    const inner = new Flow<any>('inner', [
      {
        Name: 'i1',
        Run: s => {
          log.push('i1')
          return 'continue'
        },
      },
      { Name: 'i2', Run: s => (s.ready ? 'continue' : 'await') },
    ])
    const outer = new Flow<any>('outer', [inner.AsStep('nested')])

    const first = outer.Begin({ ready: false })
    expect(first.outcome).toBe('awaiting')
    expect(log).toEqual(['i1'])

    first.state.ready = true
    outer.Resume(first)

    expect(log).toEqual(['i1'])
  })

  it('carries the nested request and answer through the composition', () => {
    const inner = new Flow<any>('inner', [
      {
        Name: 'roll',
        Run: (s, input) => {
          if (input === undefined) return 'await'
          s.rolled = input
          return 'continue'
        },
        Request: () => ({ kind: 'roll', label: 'inner' }),
      },
    ])
    const outer = new Flow<any>('outer', [inner.AsStep('nested')])

    const first = outer.Begin({})
    expect(first.pending).toBe('nested')
    expect(first.request).toEqual({ kind: 'roll', label: 'inner' })

    const second = outer.Resume(first, 12)
    expect(second.outcome).toBe('complete')
    expect(second.state.rolled).toBe(12)
  })

  it('a guard step is the way a mutating tail survives that restart', () => {
    const log: string[] = []
    const inner = new Flow<any>('inner', [
      { Name: 'gate', Run: s => (s.ready ? 'continue' : 'await') },
      {
        Name: 'guard',
        Run: s => {
          if (s.done) return 'halt'
          s.done = true
          return 'continue'
        },
      },
      {
        Name: 'mutate',
        Run: s => {
          log.push('mutate')
          return 'continue'
        },
      },
    ])
    const outer = new Flow<any>('outer', [inner.AsStep('nested')])

    const first = outer.Begin({ ready: false, done: false })
    first.state.ready = true

    outer.Resume(first)
    outer.Resume(first)

    expect(log).toEqual(['mutate'])
  })
})
