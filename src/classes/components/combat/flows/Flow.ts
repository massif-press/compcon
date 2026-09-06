type StepOutcome = 'continue' | 'halt' | 'await'
type FlowOutcome = 'complete' | 'halted' | 'awaiting'

type RequestKind = 'roll' | 'stage' | 'check' | 'select'

export interface IFlowRequest {
  kind: RequestKind
  label: string
  targets?: number[]
  events?: number[]
  pending?: string[]
  options?: { id: string; label: string }[]
}

type StepUndo<S> = ((state: S) => void) | 'irreversible'
type UndoCoverage = 'none' | 'undo' | 'irreversible'

export interface IFlowStep<S> {
  Name: string
  Run: (state: S, input?: unknown) => StepOutcome
  Request?: (state: S) => IFlowRequest | undefined
  Undo?: StepUndo<S>
  ReportHalt?: boolean
}

export interface IFlowHooks<S> {
  Scope?: <T>(state: S, run: () => T) => T
  OnHalt?: (state: S, step: string) => void
  OnResume?: (state: S, request: IFlowRequest, input: unknown) => void
}

export interface IFlowResult<S> {
  state: S
  outcome: FlowOutcome
  completed: string[]
  pending?: string
  request?: IFlowRequest
}

export function step<S>(
  Name: string,
  run: (state: S) => void,
  extra: { Undo?: StepUndo<S> } = {}
): IFlowStep<S> {
  return {
    Name,
    Run: state => {
      run(state)
      return 'continue'
    },
    ...extra,
  }
}

export class Flow<S> {
  public readonly Name: string
  private _steps: IFlowStep<S>[]
  private _hooks: IFlowHooks<S>

  public constructor(name: string, steps: IFlowStep<S>[] = [], hooks: IFlowHooks<S> = {}) {
    this.Name = name
    this._steps = steps
    this._hooks = hooks
    const seen = new Set<string>()
    for (const s of steps) {
      if (seen.has(s.Name)) throw new Error(`${name}: duplicate step "${s.Name}"`)
      seen.add(s.Name)
    }
  }

  private _scope<T>(state: S, run: () => T): T {
    return this._hooks.Scope ? this._hooks.Scope(state, run) : run()
  }

  public get Steps(): string[] {
    return this._steps.map(s => s.Name)
  }

  public get UndoCoverage(): Record<string, UndoCoverage> {
    return Object.fromEntries(
      this._steps.map(s => [
        s.Name,
        s.Undo === undefined ? 'none' : s.Undo === 'irreversible' ? 'irreversible' : 'undo',
      ])
    )
  }

  public UndoAll(state: S, completed?: string[]): string[] {
    const ran = completed ? new Set(completed) : undefined
    const irreversible: string[] = []
    this._scope(state, () => {
      for (let i = this._steps.length - 1; i >= 0; i--) {
        const { Name, Undo } = this._steps[i]
        if (ran && !ran.has(Name)) continue
        if (Undo === 'irreversible') irreversible.push(Name)
        else Undo?.(state)
      }
    })
    return irreversible
  }

  public Begin(state: S): IFlowResult<S> {
    return this._run(state, 0, [])
  }

  public Resume(result: IFlowResult<S>, input?: unknown): IFlowResult<S> {
    if (result.outcome !== 'awaiting') return result
    const from = this._steps.findIndex(s => s.Name === result.pending)
    if (from === -1) throw new Error(`${this.Name}: no step named "${result.pending}"`)
    return this._run(result.state, from, [...result.completed], input)
  }

  public AsStep(name: string = this.Name): IFlowStep<S> {
    const inner = new WeakMap<object, IFlowResult<S>>()
    return {
      Name: name,
      Run: (state, input) => {
        const held = inner.get(state as object)
        const result = held?.outcome === 'awaiting' ? this.Resume(held, input) : this.Begin(state)
        inner.set(state as object, result)
        if (result.outcome === 'complete') return 'continue'
        return result.outcome === 'awaiting' ? 'await' : 'halt'
      },
      Request: state => inner.get(state as object)?.request,
    }
  }

  private _run(state: S, from: number, completed: string[], input?: unknown): IFlowResult<S> {
    return this._scope(state, () => {
      for (let i = from; i < this._steps.length; i++) {
        const { Name, Run, Request, ReportHalt } = this._steps[i]
        const request = i === from && input !== undefined ? Request?.(state) : undefined
        const outcome = Run(state, i === from ? input : undefined)
        if (request && outcome !== 'await') this._hooks.OnResume?.(state, request, input)
        if (outcome === 'continue') {
          completed.push(Name)
          continue
        }
        if (outcome === 'halt' && ReportHalt) this._hooks.OnHalt?.(state, Name)
        return {
          state,
          outcome: outcome === 'await' ? ('awaiting' as const) : ('halted' as const),
          completed,
          pending: Name,
          request: outcome === 'await' ? Request?.(state) : undefined,
        }
      }
      return { state, outcome: 'complete' as const, completed }
    })
  }
}
