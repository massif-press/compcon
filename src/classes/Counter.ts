interface ICounterData {
  name: string
  min?: number
  max?: number
  defaultValue?: number
}

class Counter {

  public readonly Name: string
  public readonly Min: number
  public readonly Max: number
  public readonly Default: number

  constructor(data: ICounterData) {
    const { name, min, max, defaultValue } = data

    if (defaultValue > max)
      throw new Error(`Error creating Counter: Default value of ${defaultValue} is greater than max value of ${max}`)
    
    if (defaultValue < min)
      throw new Error(`Error creating Counter: Default value of ${defaultValue} is lesser than min value of ${min}`)

    this.Name = name
    this.Min = min
    this.Max = max
    this.Default = defaultValue || 0

    this._value = this.Default

  }


  private _value: number
  public get Value(): number {
    return this._value
  }
  public Increment(by: number = 1): void {
    this._value = Math.min( this.Max, this._value + by )
  }
  public Decrement(by: number = 1): void {
    this._value = Math.max( this.Min, this._value - by )
  }

  public Reset(): void {
    this._value = this.Default
  }


}

export { ICounterData, Counter }