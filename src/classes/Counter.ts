interface ICounterData {
  id: string
  name: string
  min?: number
  max?: number
  defaultValue?: number
  custom?: boolean
}

class Counter {

  public readonly ID: string
  public readonly Name: string
  public readonly Min: number
  public readonly Max: number
  public readonly Default: number

  constructor(data: ICounterData) {
    const { id, name, min, max, defaultValue } = data

    if (max && defaultValue > max)
      throw new Error(`Error creating Counter: Default value of ${defaultValue} is greater than max value of ${max}`)
    
    if (min && defaultValue < min)
      throw new Error(`Error creating Counter: Default value of ${defaultValue} is lesser than min value of ${min}`)

    this.ID = id
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
  public Increment(): void {
    if (this.Max) this._value = Math.min( this.Max, this._value + 1 )
    else this._value = this._value + 1
  }
  public Decrement(): void {
    if (this.Min) this._value = Math.max( this.Min, this._value - 1 )
    else this._value = this._value - 1
  }

  public Set(inputValue: number): void {
    if (typeof inputValue !== 'number' || isNaN(inputValue)) return
    let value = inputValue
    if (this.Max) value = Math.min( this.Max, value )
    if (this.Min) value = Math.max( this.Min, value )
    this._value = value
  }

  public Reset(): void {
    this._value = this.Default
  }

  public Serialize(): ICounterSaveData {
    return {
      id: this.ID,
      val: this.Value
    }
  }

  public LoadData(data: ICounterSaveData): void {
    this.Set(data.val)
  }


}

export { ICounterData, Counter }