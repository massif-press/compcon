import { Clock, IClockData } from './elements/Clock'
import { IRollableTableData, RollableTable } from './elements/RollableTable'
import { INarrativeElement } from './INarrativeElement'

type TextItem = {
  title: string
  body: string
}

interface NarrativeElementData {
  textItems: TextItem[]
  clocks: IClockData[]
  tables: IRollableTableData[]
}

class NarrativeElementController {
  public readonly Parent: INarrativeElement
  private _textItems: TextItem[]
  private _clocks: Clock[]
  private _tables: RollableTable[]

  public constructor(parent: INarrativeElement) {
    this.Parent = parent
    this._textItems = []
    this._clocks = []
    this._tables = []
  }

  public get TextItems(): TextItem[] {
    return this._textItems
  }

  public set TextItems(val: TextItem[]) {
    this._textItems = val
    this.Parent.SaveController.save()
  }

  public AddTextItem(s: TextItem) {
    this.TextItems.push(s)
  }

  public DeleteTextItem(s: TextItem) {
    const idx = this.TextItems.findIndex(x => x.body === s.body && x.title === s.title)
    if (idx === -1) return
    this.TextItems.splice(idx, 1)
  }

  public get Clocks(): Clock[] {
    return this._clocks
  }

  public set Clocks(val: Clock[]) {
    this._clocks = val
    this.Parent.SaveController.save()
  }

  public AddClock(c?: IClockData) {
    this.Clocks.push(new Clock(c ? c : { title: 'New Clock' }))
  }

  public DeleteClock(c: Clock) {
    const idx = this.Clocks.findIndex(x => x.ID === c.ID)
    if (idx === -1) return
    this.Clocks.splice(idx, 1)
  }

  public get Tables(): RollableTable[] {
    return this._tables
  }

  public set Tables(val: RollableTable[]) {
    this._tables = val
    this.Parent.SaveController.save()
  }

  public AddTable(t?: IRollableTableData) {
    this.Tables.push(new RollableTable(t ? t : { title: 'New Table' }))
  }

  public DeleteTable(t: RollableTable) {
    const idx = this.Tables.findIndex(x => x.ID === t.ID)
    if (idx === -1) return
    this.Tables.splice(idx, 1)
  }

  public static Serialize(parent: INarrativeElement, target: any) {
    target.textItems = parent.NarrativeElementController.TextItems
    target.clocks = parent.NarrativeElementController.Clocks.map(x => Clock.Serialize(x))
    target.tables = parent.NarrativeElementController.Tables.map(x => RollableTable.Serialize(x))
  }

  public static Deserialize(parent: INarrativeElement, data: NarrativeElementData) {
    if (!parent.NarrativeElementController)
      throw new Error(
        `NarrativeElementController not found on parent (${typeof parent}). New NarrativeElementControllers must be instantiated in the parent's constructor method.`
      )

    parent.NarrativeElementController.TextItems = data.textItems
    parent.NarrativeElementController.Clocks = data.clocks.map(x => Clock.Deserialize(x))
    parent.NarrativeElementController.Tables = data.tables.map(x => RollableTable.Deserialize(x))
  }
}

export { NarrativeElementData, NarrativeElementController }
