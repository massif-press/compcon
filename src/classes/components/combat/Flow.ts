type StepOutcome = 'continue' | 'halt' | 'await'
type FlowOutcome = 'complete' | 'halted' | 'awaiting'

interface IFlowStep<S> {
  Name: string
  Run: (state: S) => StepOutcome
}

interface IFlowResult<S> {
  state: S
  outcome: FlowOutcome
  completed: string[]
  pending?: string
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

  public InsertStepBefore(existing: string, step: IFlowStep<S>): this {
    return this._add(step, this._indexOf(existing))
  }

  public InsertStepAfter(existing: string, step: IFlowStep<S>): this {
    return this._add(step, this._indexOf(existing) + 1)
  }

  public RemoveStep(name: string): this {
    this._steps.splice(this._indexOf(name), 1)
    return this
  }

  public Begin(state: S): IFlowResult<S> {
    return this._run(state, 0, [])
  }

  public Resume(result: IFlowResult<S>): IFlowResult<S> {
    if (result.outcome !== 'awaiting') return result
    return this._run(result.state, this._indexOf(result.pending as string), [...result.completed])
  }

  public AsStep(name: string = this.Name): IFlowStep<S> {
    return {
      Name: name,
      Run: state => {
        const result = this.Begin(state)
        if (result.outcome === 'complete') return 'continue'
        return result.outcome === 'awaiting' ? 'await' : 'halt'
      },
    }
  }

  private _add(step: IFlowStep<S>, at: number): this {
    if (this.HasStep(step.Name))
      throw new Error(`${this.Name}: duplicate step "${step.Name}"`)
    this._steps.splice(at, 0, step)
    return this
  }

  private _indexOf(name: string): number {
    const i = this._steps.findIndex(s => s.Name === name)
    if (i === -1) throw new Error(`${this.Name}: no step named "${name}"`)
    return i
  }

  private _run(state: S, from: number, completed: string[]): IFlowResult<S> {
    for (let i = from; i < this._steps.length; i++) {
      const { Name, Run } = this._steps[i]
      const outcome = Run(state)
      if (outcome !== 'continue')
        return {
          state,
          outcome: outcome === 'await' ? 'awaiting' : 'halted',
          completed,
          pending: Name,
        }
      completed.push(Name)
    }
    return { state, outcome: 'complete', completed }
  }
}

export { Flow }
export type { IFlowStep, IFlowResult, StepOutcome, FlowOutcome }
