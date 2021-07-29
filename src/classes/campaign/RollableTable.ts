import uuid from 'uuid/v4'

interface ITableRoll {
  min: number,
  max: number,
  result: string
}

interface IRollableTableData {
  id: string,
  title: string,
  description: string,
  dice: string,
  results: ITableRoll[]
}

class RollableTable {
  public readonly ID: string
  public Title: string
  public Description: string
  public Dice: string
  public Results: ITableRoll[]

  public constructor(data: IRollableTableData) {
    this.ID = data.id || uuid()
    this.Title = data.title || ''
    this.Description = data.description || ''
    this.Dice = data.dice || '1d20'
    this.Results = data.results || []
  }

  public get Min(): number {
    return parseInt(this.Dice.split('d')[0])
  }

  public get Max(): number {
    const dArr = this.Dice.split('d')
    return parseInt(dArr[0]) * parseInt(dArr[1])
  }

  public static Serialize(c: RollableTable): IRollableTableData {
    return {
      id: c.ID,
      title: c.Title,
      description: c.Description,
      dice: c.Dice,
      results: c.Results,
    }
  }

  public static Deserialize(data: IRollableTableData): RollableTable {
    return new RollableTable(data)
  }
}

export { IRollableTableData, RollableTable }