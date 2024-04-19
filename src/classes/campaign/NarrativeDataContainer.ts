import { Character, CharacterData } from '../narrative/Character';
import { Faction, FactionData } from '../narrative/Faction';
import { Location, LocationData } from '../narrative/Location';
import { ContentBlock } from './CampaignContentBlock';

interface INarrativeDataContainer {
  data?: CharacterData | LocationData | FactionData;
}

class NarrativeDataContainer {
  public readonly Parent: ContentBlock;
  private _data: Character | Location | Faction | null = null;

  constructor(parent: ContentBlock, ndc?: INarrativeDataContainer) {
    this.Parent = parent;
    if (ndc && ndc.data && Object.keys(ndc.data).length > 0) {
      if (ndc.data as CharacterData) this._data = Character.Deserialize(ndc.data as CharacterData);
      else if (ndc.data as LocationData)
        this._data = Location.Deserialize(ndc.data as LocationData);
      else if (ndc.data as FactionData) this._data = Faction.Deserialize(ndc.data as FactionData);
    }
  }

  public get Data(): Character | Location | Faction | null {
    return this._data;
  }

  public set Data(value: Character | Location | Faction | null) {
    this._data = value;
    this.Parent.Campaign.save();
  }

  public Unlink(): void {
    this.Data?.RenewID();
    this.Parent.Campaign.save();
  }

  public get NarrativeItemType(): 'character' | 'location' | 'faction' {
    if (this._data instanceof Character) return 'character';
    else if (this._data instanceof Location) return 'location';
    else return 'faction';
  }

  public get ChangeWatchValue(): string {
    throw new Error('Method not implemented.');
  }

  public static Serialize(c: NarrativeDataContainer): INarrativeDataContainer {
    const ndc = {} as INarrativeDataContainer;
    if (!c.Data) return ndc;
    if (c.Data instanceof Character) ndc.data = Character.Serialize(c.Data);
    else if (c.Data instanceof Location) ndc.data = Location.Serialize(c.Data);
    else if (c.Data instanceof Faction) ndc.data = Faction.Serialize(c.Data);

    return ndc;
  }
}

export { NarrativeDataContainer };
export type { INarrativeDataContainer };
