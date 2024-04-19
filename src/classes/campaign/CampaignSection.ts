import _ from 'lodash';
import { Campaign } from './Campaign';
import { IContentBlockData, ContentBlock } from './CampaignContentBlock';
import { Encounter, IEncounterData } from '../encounter/Encounter';

type ICampaignSectionData = {
  title: string;
  sectionType: 'section' | 'beat' | 'mission' | 'combat' | 'other';
  content: IContentBlockData[];
  children: ICampaignSectionData[];
};

class CampaignSection {
  public readonly Campaign: Campaign;
  public Parent: CampaignSection | null;
  private _title: string;
  private _sectionType: 'section' | 'beat' | 'mission' | 'combat' | 'other';
  private _content: ContentBlock[];
  private _children: CampaignSection[];

  constructor(parent: CampaignSection | null, campaign: Campaign, data?: ICampaignSectionData) {
    this.Parent = parent;
    this.Campaign = campaign;
    this._title = data
      ? data?.title ||
        `New ${data?.sectionType.charAt(0).toUpperCase() + data?.sectionType.slice(1)}`
      : 'New Section';
    this._sectionType = data?.sectionType || 'section';
    this._content = data?.children
      ? data.content.map((x) => new ContentBlock(this, campaign, x))
      : [];
    this._children = data?.children
      ? data.children.map((x) => new CampaignSection(this, campaign, x))
      : [];
  }

  private flattenNestedArrays(arr: any[]): any[] {
    let flattenedArray = [] as any[];

    arr.forEach((obj) => {
      flattenedArray.push(obj);
      if (obj.Children && Array.isArray(obj.Children)) {
        flattenedArray = flattenedArray.concat(this.flattenNestedArrays(obj.Children));
      }
    });

    return flattenedArray;
  }

  public get ItemNumber(): number {
    return (
      this.flattenNestedArrays(this.Campaign.Contents)
        .filter((x) => x.SectionType === this.SectionType)
        .indexOf(this) + 1
    );
  }

  public get Depth(): number {
    return this.Parent ? this.Parent.Depth + 1 : 0;
  }

  public get Title(): string {
    return this._title;
  }

  public set Title(value: string) {
    this._title = value;
    this.Campaign.save();
  }

  public get SectionType(): 'section' | 'beat' | 'mission' | 'combat' | 'other' {
    return this._sectionType;
  }

  public set SectionType(value: 'section' | 'beat' | 'mission' | 'combat' | 'other') {
    this._sectionType = value;
    this.Campaign.save();
  }

  public get Content(): ContentBlock[] {
    return this._content;
  }

  public set Content(value: ContentBlock[]) {
    this._content = value;
    this.Campaign.save();
  }

  public get Children(): CampaignSection[] {
    return this._children;
  }

  public set Children(value: CampaignSection[]) {
    this._children = value;
    this.Campaign.save();
  }

  public get AllChildren(): CampaignSection[] {
    let children = this.Children || ([] as CampaignSection[]);
    this.Children.forEach((child) => {
      children = children.concat(child.AllChildren);
    });
    return children;
  }

  public AllChildrenExclusive(exclude: CampaignSection): CampaignSection[] {
    if (_.isEqual(this, exclude)) return [] as CampaignSection[];
    if (_.isEqual(this.Parent, exclude)) return [] as CampaignSection[];
    let children = this.Children || ([] as CampaignSection[]);
    this.Children.forEach((child) => {
      children = children.concat(child.AllChildrenExclusive(exclude));
    });
    return children;
  }

  public AddContentItem(data?: IContentBlockData): void {
    if (!data)
      data = {
        title: 'New Content',
        headerType: 'header-4',
        color: 'text',
        variant: '',
        contentType: 'text',
        content: { Body: '' },
      };
    this._content.push(new ContentBlock(this, this.Campaign, data));
    this.Campaign.save();
  }

  public RemoveContentItem(index: number): void {
    this._content.splice(index, 1);
    this.Campaign.save();
  }

  public AddChildSection(data?: ICampaignSectionData): void {
    this._children.push(new CampaignSection(this, this.Campaign, data));
    this.Campaign.save();
  }

  public RemoveChildSection(index: number): void {
    this._children.splice(index, 1);
    this.Campaign.save();
  }

  public MoveUp(): void {
    let parent = this.Parent || this.Campaign;
    const index = parent.Children.indexOf(this);
    if (index === 0) return;
    parent.Children.splice(index, 1);
    parent.Children.splice(index - 1, 0, this);
    this.Campaign.save();
  }

  public MoveToTop(): void {
    let parent = this.Parent || this.Campaign;
    const index = parent.Children.indexOf(this);
    if (index === 0) return;
    parent.Children.splice(index, 1);
    parent.Children.unshift(this);
    this.Campaign.save();
  }

  public MoveDown(): void {
    let parent = this.Parent || this.Campaign;
    const index = parent.Children.indexOf(this);
    if (index === parent.Children.length - 1) return;
    parent.Children.splice(index, 1);
    parent.Children.splice(index + 1, 0, this);
    this.Campaign.save();
  }

  public MoveToBottom(): void {
    let parent = this.Parent || this.Campaign;
    const index = parent.Children.indexOf(this);
    if (index === parent.Children.length - 1) return;
    parent.Children.splice(index, 1);
    parent.Children.push(this);
    this.Campaign.save();
  }

  public MoveToSection(section: CampaignSection): void {
    let parent = this.Parent || this.Campaign;
    const index = parent.Children.indexOf(this);
    parent.Children.splice(index, 1);
    section.Children.push(this);
    this.Parent = section;
    this.Campaign.save();
  }

  public MoveToCampaignRoot(): void {
    if (!this.Parent) return;
    const index = this.Parent.Children.indexOf(this);
    this.Parent.Children.splice(index, 1);
    this.Campaign.Contents.push(this);
    this.Parent = null;
    this.Campaign.save();
  }

  public DeleteSelf(): void {
    if (!this.Parent) this.Campaign.RemoveSection(this.Campaign.Contents.indexOf(this));
    else this.Parent.RemoveChildSection(this.Parent.Children.indexOf(this));
  }

  public Duplicate(): void {
    const data = CampaignSection.Serialize(this);
    data.title = `${data.title} (Copy)`;
    if (this.Parent) this.Parent.AddChildSection(data);
    else this.Campaign.AddSection(data);
  }

  public static Serialize(c: CampaignSection): ICampaignSectionData {
    return {
      title: c.Title,
      sectionType: c.SectionType,
      content: c.Content.map((x) => ContentBlock.Serialize(x)),
      children: c.Children.map((x) => CampaignSection.Serialize(x)),
    };
  }
}

export { CampaignSection };
export type { ICampaignSectionData };
