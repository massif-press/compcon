import { Encounter, IEncounterData } from '../encounter/Encounter';
import { ContentBlock } from './CampaignContentBlock';

interface IEncounterDataContainer {
  data?: IEncounterData;
}

class EncounterDataContainer {
  public readonly Parent: ContentBlock;
  private _data: Encounter | null = null;

  constructor(parent: ContentBlock, edc?: IEncounterDataContainer) {
    this.Parent = parent;
    if (edc && edc.data && Object.keys(edc.data).length > 0) {
      this._data = Encounter.Deserialize(edc.data);
    }
  }

  public get Data(): Encounter | null {
    return this._data;
  }

  public set Data(value: Encounter | null) {
    this._data = value;
    this.Parent.Campaign.save();
  }

  public Unlink(): void {
    this.Data?.RenewID();
    this.Parent.Campaign.save();
  }

  public get ChangeWatchValue(): string {
    throw new Error('Method not implemented.');
  }

  public static Serialize(c: EncounterDataContainer): IEncounterDataContainer {
    const edc = {} as IEncounterDataContainer;
    if (!c.Data) return edc;
    else edc.data = Encounter.Serialize(c.Data);

    return edc;
  }
}

export { EncounterDataContainer };
export type { IEncounterDataContainer };
