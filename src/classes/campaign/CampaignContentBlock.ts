import { Clock, IClockData } from '../narrative/elements/Clock';
import { IRollableTableData, RollableTable } from '../narrative/elements/RollableTable';
import { Campaign } from './Campaign';
import { CampaignSection } from './CampaignSection';
import { EncounterDataContainer, IEncounterDataContainer } from './EncounterDataContainer';
import { NarrativeDataContainer, INarrativeDataContainer } from './NarrativeDataContainer';

type ContentType =
  | CampaignTextSection
  | CampaignImageSection
  | RollableTable
  | Clock
  | NarrativeDataContainer
  | EncounterDataContainer
  | null;

type ContentDataType =
  | CampaignTextSection
  | CampaignImageSection
  | IRollableTableData
  | IClockData
  | INarrativeDataContainer
  | IEncounterDataContainer
  | null;

type ContentStringIdentifier = 'text' | 'image' | 'table' | 'clock' | 'narrative' | 'encounter';

interface IContentBlockData {
  title: string;
  headerType: 'header-1' | 'header-2' | 'header-3' | 'header-4' | '';
  variant: 'outline' | 'tonal' | 'block' | 'clipped-block' | 'quote' | '';
  color: string;
  contentType: ContentStringIdentifier;
  content: ContentDataType;
}

type CampaignTextSection = {
  Body: string;
};

type CampaignImageSection = {
  ImageUrl: string;
  Caption: string;
};

class ContentBlock {
  public readonly Parent: CampaignSection;
  public readonly Campaign: Campaign;
  private _title: string;
  private _headerType: 'header-1' | 'header-2' | 'header-3' | 'header-4' | '';
  private _variant: 'outline' | 'tonal' | 'block' | 'clipped-block' | 'quote' | '';
  private _color: string;
  private _contentType: ContentStringIdentifier;
  private _content: ContentType;

  constructor(parent: CampaignSection, campaign: Campaign, data?: IContentBlockData) {
    this.Parent = parent;
    this.Campaign = campaign;
    this._title = data?.title || '';
    this._headerType = data?.headerType || '';
    this._variant = data?.variant || '';
    this._color = data?.color || '';
    this._contentType = data?.contentType || 'text';
    this._content = { Body: '' };
    if (data?.content) {
      if (this._contentType === 'text') this._content = data.content as CampaignTextSection;
      else if (this._contentType === 'image') this._content = data.content as CampaignImageSection;
      else if (this._contentType === 'table')
        this._content = new RollableTable(data.content as IRollableTableData);
      else if (this._contentType === 'clock') this._content = new Clock(data.content as IClockData);
      else if (this._contentType === 'encounter')
        this._content = new EncounterDataContainer(this, data.content as IEncounterDataContainer);
      else
        this._content = new NarrativeDataContainer(this, data.content as INarrativeDataContainer);
    }
  }

  public get Title(): string {
    return this._title;
  }

  public set Title(value: string) {
    this._title = value;
    this.Campaign.save();
  }

  public get HeaderType(): 'header-1' | 'header-2' | 'header-3' | 'header-4' | '' {
    return this._headerType;
  }

  public set HeaderType(value: 'header-1' | 'header-2' | 'header-3' | 'header-4' | '') {
    this._headerType = value;
    this.Campaign.save();
  }

  public get Variant(): 'outline' | 'tonal' | 'block' | 'clipped-block' | 'quote' | '' {
    return this._variant;
  }

  public set Variant(value: 'outline' | 'tonal' | 'block' | 'clipped-block' | 'quote' | '') {
    this._variant = value;
    this.Campaign.save();
  }

  public get Color(): string {
    return this._color;
  }

  public set Color(value: string) {
    this._color = value;
    this.Campaign.save();
  }

  public get ContentType(): ContentStringIdentifier {
    return this._contentType;
  }

  public set ContentType(value: ContentStringIdentifier) {
    this._contentType = value;
    if (value === 'text') this._content = { Body: '' };
    else if (value === 'image') this._content = { ImageUrl: '', Caption: '' };
    else if (value === 'table') this._content = new RollableTable();
    else if (value === 'clock') this._content = new Clock();
    else if (value === 'encounter') this._content = new EncounterDataContainer(this);
    else this._content = new NarrativeDataContainer(this);

    this.Campaign.save();
  }

  public get Content(): ContentType {
    return this._content;
  }

  public MoveUp(): void {
    const index = this.Parent.Content.indexOf(this);
    if (index === 0) return;
    this.Parent.Content.splice(index, 1);
    this.Parent.Content.splice(index - 1, 0, this);
    this.Campaign.save();
  }

  public MoveDown(): void {
    const index = this.Parent.Content.indexOf(this);
    if (index === this.Parent.Content.length - 1) return;
    this.Parent.Content.splice(index, 1);
    this.Parent.Content.splice(index + 1, 0, this);
    this.Campaign.save();
  }

  public get ChangeWatchValue(): string {
    throw new Error('Method not implemented.');
  }

  public static Serialize(c: ContentBlock): IContentBlockData {
    return {
      title: c.Title,
      headerType: c.HeaderType,
      variant: c.Variant,
      color: c.Color,
      contentType: c.ContentType,
      content: this._serializeByContentType(c.ContentType, c.Content),
    };
  }

  private static _serializeByContentType(type: string, content: ContentType): ContentDataType {
    if (!content) return null;
    if (type === 'image') return content as CampaignImageSection;
    else if (type === 'table') return RollableTable.Serialize(content as RollableTable);
    else if (type === 'clock') return Clock.Serialize(content as Clock);
    else if (type === 'narrative')
      return NarrativeDataContainer.Serialize(content as NarrativeDataContainer);
    else if (type === 'encounter')
      return EncounterDataContainer.Serialize(content as EncounterDataContainer);
    else return content as CampaignTextSection;
  }
}

export { ContentBlock };
export type { IContentBlockData, CampaignTextSection, CampaignImageSection };
