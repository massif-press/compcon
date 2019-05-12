class Invocation {
  private trigger: string
  private modifier: number

  constructor(trigger: string, modifier: number) {
    this.trigger = trigger;
    this.modifier = modifier;
  }

  public get Trigger(): string {
    return this.trigger
  }

  public get Modifier(): number {
    return this.modifier
  }

  public get IsAdvantage(): boolean {
    return this.modifier > 0
  }

  public get IsDisadvantage(): boolean {
    return this.modifier < 0
  }
}

export default Invocation