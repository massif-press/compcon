import uuid from 'uuid/v4'

interface ITableRoll {
  min: number
  max: number
  result: string
}

interface IRollableTableData {
  id?: string
  title?: string
  description?: string
  die?: number
  mult?: number
  results?: ITableRoll[]
}

class RollableTable {
  public readonly ID: string
  public Title: string
  public Description: string
  public Die: number
  public Mult: number
  public Results: ITableRoll[]
  public ItemType: string = 'RollableTable'

  public constructor(data?: IRollableTableData) {
    this.ID = data.id || uuid()
    this.Title = data.title || ''
    this.Description = data.description || ''
    this.Mult = data.mult || 1
    this.Die = data.die || 6
    this.Results = data.results || []
    if (!this.Results.length) this.setArray(2)
  }

  public get Min(): number {
    return this.Mult
  }

  public get Max(): number {
    return this.Mult * this.Die
  }

  public setArray(step) {
    if (this.Results.length) this.Results.splice(0, this.Results.length)
    for (let i = 1; i <= this.Max; i += step) {
      if (i < this.Min && i + step - 1 < this.Min) continue
      if (i < this.Min) this.Results.push({ min: this.Min, max: i + step - 1, result: '' })
      else if (i + step - 1 >= this.Max) this.Results.push({ min: i, max: this.Max, result: '' })
      else this.Results.push({ min: i, max: i + step - 1, result: '' })
    }
  }

  public static Serialize(c: RollableTable): IRollableTableData {
    return {
      id: c.ID,
      title: c.Title,
      description: c.Description,
      die: c.Die,
      mult: c.Mult,
      results: c.Results,
    }
  }

  public static Deserialize(data: IRollableTableData): RollableTable {
    return new RollableTable(data)
  }
}

export { IRollableTableData, RollableTable }
