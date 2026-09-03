type StepOutcome = 'continue' | 'halt' | 'await'
type FlowOutcome = 'complete' | 'halted' | 'awaiting'

type RequestKind = 'roll' | 'stage' | 'check' | 'select'

interface IFlowRequest {
  kind: RequestKind
  label: string
  targets?: number[]
  events?: number[]
  pending?: string[]
  options?: { id: string; label: string }[]
}

type StepUndo<S> = ((state: S) => void) | 'irreversible'
type UndoCoverage = 'none' | 'undo' | 'irreversible'

interface IFlowStep<S> {
  Name: string
  Run: (state: S, input?: unknown) => StepOutcome
  Request?: (state: S) => IFlowRequest | undefined
  Undo?: StepUndo<S>
}

interface IFlowResult<S> {
  state: S
  outcome: FlowOutcome
  completed: string[]
  pending?: string
  request?: IFlowRequest
}

class Flow<S> {
  public readonly Name: string
  private _steps: IFlowStep<S>[]

  public constructor(name: string, steps: IFlowStep<S>[] = []) {
    this.Name = name
    this._steps = []
    steps.forEach(s => this._add(s, this._steps.length))
  }

  public get Steps(): string[] {
    return this._steps.map(s => s.Name)
  }

  public HasStep(name: string): boolean {
    return this._steps.some(s => s.Name === name)
  }

  public get UndoCoverage(): Record<string, UndoCoverage> {
    return Object.fromEntries(
      this._steps.map(s => [
        s.Name,
        s.Undo === undefined ? 'none' : s.Undo === 'irreversible' ? 'irreversible' : 'undo',
      ])
    )
  }

  // walks inverses backwards. only steps that actually ran are undone
  public UndoAll(state: S, completed?: string[]): string[] {
    const ran = completed ? new Set(completed) : undefined
    const irreversible: string[] = []
    for (let i = this._steps.length - 1; i >= 0; i--) {
      const { Name, Undo } = this._steps[i]
      if (ran && !ran.has(Name)) continue
      if (Undo === 'irreversible') irreversible.push(Name)
      else Undo?.(state)
    }
    return irreversible
  }

  public Begin(state: S): IFlowResult<S> {
    return this._run(state, 0, [])
  }

  public Resume(result: IFlowResult<S>, input?: unknown): IFlowResult<S> {
    if (result.outcome !== 'awaiting') return result
    return this._run(
      result.state,
      this._indexOf(result.pending as string),
      [...result.completed],
      input
    )
  }

  public AsStep(name: string = this.Name): IFlowStep<S> {
    // keyed by the outer state so two runs of the same composition cannot see each other
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

  private _add(step: IFlowStep<S>, at: number): this {
    if (this.HasStep(step.Name)) throw new Error(`${this.Name}: duplicate step "${step.Name}"`)
    this._steps.splice(at, 0, step)
    return this
  }

  private _indexOf(name: string): number {
    const i = this._steps.findIndex(s => s.Name === name)
    if (i === -1) throw new Error(`${this.Name}: no step named "${name}"`)
    return i
  }

  private _run(state: S, from: number, completed: string[], input?: unknown): IFlowResult<S> {
    for (let i = from; i < this._steps.length; i++) {
      const { Name, Run, Request } = this._steps[i]
      const outcome = Run(state, i === from ? input : undefined)
      if (outcome !== 'continue')
        return {
          state,
          outcome: outcome === 'await' ? 'awaiting' : 'halted',
          completed,
          pending: Name,
          request: outcome === 'await' ? Request?.(state) : undefined,
        }
      completed.push(Name)
    }
    return { state, outcome: 'complete', completed }
  }
}

export { Flow }
export type {
  IFlowStep,
  IFlowResult,
  IFlowRequest,
  RequestKind,
  StepOutcome,
  FlowOutcome,
  StepUndo,
  UndoCoverage,
}
