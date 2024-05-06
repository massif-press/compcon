import { v4 as uuid } from 'uuid';
import { ISaveData, ISaveable, SaveController } from '../components';
import { ICampaignSectionData, CampaignSection } from './CampaignSection';
import _ from 'lodash';
import { EncounterDataContainer } from './EncounterDataContainer';

type ICampaignData = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  cover_image_url: string;
  banner_image_url: string;
  author_contact: { service: string; contact: string }[];
  website: string;
  ll: [number, number];
  players: [number, number];

  publish_info?: {
    origin_id: string;
    version_history: { ver: string; changes: string; date: number }[];
  };

  published: boolean;

  title_page_content: ICampaignSectionData;

  content: ICampaignSectionData[];

  save: ISaveData;
};

class Campaign implements ISaveable {
  public readonly ID: string;
  public readonly ItemType: string = 'Campaign';
  public readonly StorageType: string = 'campaigns';
  public readonly Published: boolean = false;

  private _title: string;
  private _subtitle: string;
  private _description: string;
  private _coverImageUrl: string;
  private _bannerImageUrl: string;
  private _author: string;
  private _authorContact: { service: string; contact: string }[];
  private _website: string;
  private _ll: [number, number];
  private _players: [number, number];

  private _originID?: string;
  private _versionHistory: { ver: string; changes: string; date: number }[] = [];

  public TitlePageContent: CampaignSection;
  public Contents: CampaignSection[];

  public SaveController: SaveController;

  constructor(data?: ICampaignData) {
    this.Published = data?.published || false;

    this.ID = data?.id || uuid();
    this._title = data?.title || 'New Campaign';
    this._subtitle = data?.subtitle || '';
    this._description = data?.description || '';
    this._coverImageUrl = data?.cover_image_url || '';
    this._bannerImageUrl = data?.banner_image_url || '';
    this._author = data?.author || '';
    this._authorContact = data?.author_contact || [{ service: '', contact: '' }];
    this._website = data?.website || '';
    this._ll = data?.ll || [1, 3];
    this._players = data?.players || [3, 5];

    if (data?.publish_info) {
      this._originID = data.publish_info.origin_id;
      this._versionHistory = data.publish_info.version_history;
    }

    if (data?.title_page_content)
      this.TitlePageContent = new CampaignSection(null, this, data.title_page_content);
    else
      this.TitlePageContent = new CampaignSection(null, this, {
        title: 'Title Page',
        sectionType: 'section',
        children: [],
        content: [
          {
            title: 'Contributors',
            headerType: 'header-4',
            variant: '',
            color: 'text',
            contentType: 'text',
            content: {
              Body: '',
            },
          },
          {
            title: 'License',
            headerType: 'header-4',
            variant: '',
            color: 'text',
            contentType: 'text',
            content: {
              Body: '',
            },
          },
        ],
      });

    this.Contents =
      data && data.content.length > 0
        ? data.content.map((x) => new CampaignSection(null, this, x))
        : [];

    this.SaveController = new SaveController(this);
  }

  public save(): void {
    this.SaveController.save();
  }

  public get Name(): string {
    return this._title;
  }

  public set Name(value: string) {
    this._title = value;
    this.save();
  }

  public get Title(): string {
    return this._title;
  }

  public set Title(value: string) {
    this.Name = value;
  }

  public get Subtitle(): string {
    return this._subtitle;
  }

  public set Subtitle(value: string) {
    this._subtitle = value;
    this.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(value: string) {
    this._description = value;
    this.save();
  }

  public get CoverImageUrl(): string {
    return this._coverImageUrl;
  }

  public set CoverImageUrl(value: string) {
    this._coverImageUrl = value;
    this.save();
  }

  public get BannerImageUrl(): string {
    return this._bannerImageUrl;
  }

  public set BannerImageUrl(value: string) {
    this._bannerImageUrl = value;
    this.save();
  }

  public get Author(): string {
    return this._author;
  }

  public set Author(value: string) {
    this._author = value;
    this.save();
  }

  public get AuthorContact(): { service: string; contact: string }[] {
    return this._authorContact;
  }

  public set AuthorContact(value: { service: string; contact: string }[]) {
    this._authorContact = value;
    this.save();
  }

  public get Website(): string {
    return this._website;
  }

  public set Website(value: string) {
    this._website = value;
    this.save();
  }

  public get MinLL(): number {
    return this._ll[0];
  }

  public get MaxLL(): number {
    return this._ll[1];
  }

  public set MinLL(value: number) {
    this._ll[0] = value;
    this.save();
  }

  public set MaxLL(value: number) {
    this._ll[1] = value;
    this.save();
  }

  public get MinPlayers(): number {
    return this._players[0];
  }

  public get MaxPlayers(): number {
    return this._players[1];
  }

  public set MinPlayers(value: number) {
    this._players[0] = value;
    this.save();
  }

  public set MaxPlayers(value: number) {
    this._players[1] = value;
    this.save();
  }

  public AddSection(data?: ICampaignSectionData): void {
    const s = new CampaignSection(null, this, data);
    this.Contents.push(s);
    this.save();
  }

  public RemoveSection(index: number): void {
    this.Contents.splice(index, 1);
    this.save();
  }

  public MoveSection(from: number, to: number) {
    this.Contents = this.Contents.splice(to, 0, this.Contents.splice(from, 1)[0]);
    this.save();
  }

  public DeleteSection(idx: number) {
    if (idx === -1) return;
    this.Contents.splice(idx, 1);
    this.save();
  }

  public get AllContent(): CampaignSection[] {
    return this.Contents.concat(this.Contents.flatMap((x) => x.AllChildren));
  }

  public get AllNpcContent(): any[] {
    return this.AllContent.flatMap((x) => x.Content)
      .filter((x) => x.ContentType === 'encounter')
      .flatMap((x) => x.Content as EncounterDataContainer)
      .map((x) => x.Data?.Combatants);
  }

  // passthroughs for move functions, TODO: clean up
  public get Content(): CampaignSection[] {
    return this.Contents;
  }

  public get Children(): CampaignSection[] {
    return this.Contents;
  }

  public ContentMoveLocations(self: CampaignSection): CampaignSection[] {
    return this.Contents.concat(this.Contents.flatMap((x) => x.AllChildrenExclusive(self))).filter(
      (x) => _.isEqual(x, self) === false
    );
  }

  public get VersionHistory(): { ver: string; changes: string; date: number }[] {
    return this._versionHistory || [];
  }

  public get Latest(): {
    ver: string;
    changes: string;
    date: number;
  } {
    return this._versionHistory[this._versionHistory.length - 1];
  }

  public get OriginID(): string {
    return this._originID || '';
  }

  public Publish(version: string, changelog: string): ICampaignData {
    const newVer = { ver: version, changes: changelog, date: Date.now() };
    this._versionHistory.push(newVer);
    this.save();

    this._originID = this.ID;

    const data = this.Serialize();

    data.id = uuid();
    data.published = true;

    return data;
  }

  public static Serialize(c: Campaign): ICampaignData {
    const data = {
      id: c.ID,
      title: c.Title,
      author: c.Author,
      ll: c._ll,
      players: c._players,
      subtitle: c.Subtitle,
      description: c.Description,
      cover_image_url: c.CoverImageUrl,
      banner_image_url: c.BannerImageUrl,
      author_contact: c.AuthorContact,
      website: c.Website,
      title_page_content: CampaignSection.Serialize(c.TitlePageContent),
      content: c.Contents.map((x) => CampaignSection.Serialize(x)),
    } as ICampaignData;

    if (c.VersionHistory.length) {
      data.publish_info = {
        origin_id: c.OriginID,
        version_history: c.VersionHistory,
      };
    }

    SaveController.Serialize(c, data);

    return data as ICampaignData;
  }

  Serialize(): ICampaignData {
    return Campaign.Serialize(this);
  }

  public static Deserialize(data: ICampaignData): Campaign {
    const c = new Campaign(data);

    SaveController.Deserialize(c, data.save);

    return c;
  }

  public Clone(): Campaign {
    const itemData = Campaign.Serialize(this);
    itemData.id = uuid();
    const newItem = Campaign.Deserialize(itemData);
    newItem.Title += ' (COPY)';
    return newItem;
  }
}

export { Campaign };
export type { ICampaignData };
