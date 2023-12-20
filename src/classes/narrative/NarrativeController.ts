import { Clock, IClockData } from './elements/Clock';
import { IRollableTableData, RollableTable } from './elements/RollableTable';
import { INarrativeElement } from './INarrativeElement';

type TextItem = {
  title: string;
  body: string;
};

interface NarrativeElementData {
  textItems: TextItem[];
  clocks: IClockData[];
  tables: IRollableTableData[];
  labels: string[];
  campaign: string;
}

class NarrativeController {
  public readonly Parent: INarrativeElement;
  private _textItems: TextItem[];
  private _clocks: Clock[];
  private _tables: RollableTable[];
  private _labels: string[];
  private _campaign: string;

  public constructor(parent: INarrativeElement) {
    this.Parent = parent;
    this._textItems = [];
    this._clocks = [];
    this._tables = [];
    this._labels = [];
    this._campaign = '';
  }

  public get Campaign(): string {
    return this._campaign;
  }

  public set Campaign(val: string) {
    this._campaign = val;
    this.Parent.SaveController.save();
  }

  public get Labels(): string[] {
    return this._labels;
  }

  public set Labels(val: string[]) {
    this._labels = val;
    this.Parent.SaveController.save();
  }

  public get LabelString(): string {
    return this._labels.join(', ');
  }

  public get TextItems(): TextItem[] {
    return this._textItems;
  }

  public set TextItems(val: TextItem[]) {
    this._textItems = val;
    this.Parent.SaveController.save();
  }

  public AddTextItem(s: TextItem) {
    this.TextItems.push(s);
    this.Parent.SaveController.save();
  }

  public DeleteTextItem(s: TextItem) {
    const idx = this.TextItems.findIndex((x) => x.body === s.body && x.title === s.title);
    if (idx === -1) return;
    this.TextItems.splice(idx, 1);
    this.Parent.SaveController.save();
  }

  public get Clocks(): Clock[] {
    return this._clocks;
  }

  public set Clocks(val: Clock[]) {
    this._clocks = val;
    this.Parent.SaveController.save();
  }

  public AddClock(c?: IClockData) {
    this.Clocks.push(new Clock(c ? c : { title: 'New Clock' }));
    this.Parent.SaveController.save();
  }

  public DeleteClock(c: Clock) {
    const idx = this.Clocks.findIndex((x) => x.ID === c.ID);
    if (idx === -1) return;
    this.Clocks.splice(idx, 1);
    this.Parent.SaveController.save();
  }

  public get Tables(): RollableTable[] {
    return this._tables;
  }

  public set Tables(val: RollableTable[]) {
    this._tables = val;
    this.Parent.SaveController.save();
  }

  public AddTable(t?: IRollableTableData) {
    this.Tables.push(new RollableTable(t ? t : { title: 'New Table' }));
    this.Parent.SaveController.save();
  }

  public DeleteTable(t: RollableTable) {
    const idx = this.Tables.findIndex((x) => x.ID === t.ID);
    if (idx === -1) return;
    this.Tables.splice(idx, 1);
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: INarrativeElement, target: any) {
    if (!target.narrative) target.narrative = {};
    target.narrative.textItems = parent.NarrativeController.TextItems;
    target.narrative.campaign = parent.NarrativeController.Campaign;
    target.narrative.labels = parent.NarrativeController.Labels;
    target.narrative.clocks = parent.NarrativeController.Clocks.map((x) => Clock.Serialize(x));
    target.narrative.tables = parent.NarrativeController.Tables.map((x) =>
      RollableTable.Serialize(x)
    );
  }

  public static Deserialize(parent: INarrativeElement, data: NarrativeElementData) {
    if (!parent.NarrativeController)
      throw new Error(
        `NarrativeController not found on parent (${typeof parent}). New NarrativeControllers must be instantiated in the parent's constructor method.`
      );

    parent.NarrativeController._textItems = data.textItems;
    parent.NarrativeController._labels = data.labels;
    parent.NarrativeController._campaign = data.campaign;
    parent.NarrativeController._clocks = data.clocks.map((x) => Clock.Deserialize(x));
    parent.NarrativeController._tables = data.tables.map((x) => RollableTable.Deserialize(x));
  }
}

export { NarrativeController };
export type { NarrativeElementData };
