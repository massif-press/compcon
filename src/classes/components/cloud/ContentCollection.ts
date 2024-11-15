import { cloudDelete, updateItem, uploadToS3 } from '@/io/apis/account';
import { GenerateExportCollection } from '@/io/Importer';
import { RemoveItem, SetItem } from '@/io/Storage';
import {
  CampaignStore,
  CompendiumStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
  UserStore,
} from '@/stores';
import { v4 as uuid } from 'uuid';

type CollectionContentItem = {
  name: string;
  collection_type: 'npcs' | 'encounters' | 'narratives' | 'pilots' | 'campaigns' | 'lcps';
  item_type: string;
  id: string;
  last_updated: number;
};

type ChangelogItem = {
  version: string;
  changes: string[];
};

type CollectionData = {
  __content_type: 'collection';
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  changelog: ChangelogItem[];
  next_changelog?: string;
  items: CollectionContentItem[];
};

type CollectionMetadata = {
  user_id: string;
  sortkey: string;
  name: string;
  author: string;
  description: string;
  version: string;
  changelog: string;
  contents: string;
  uri: string;

  created?: number;
  updated?: number;
  deleted?: number;
  code?: string;
};

class ContentCollection {
  public readonly ID: string;
  public static readonly Sortkey = 'content_collection';
  public static readonly StorageType = 'content_collection';

  public Name: string;
  public Author: string;
  public Description: string;
  public Version: string;
  public Changelog: ChangelogItem[];

  public Metadata?: CollectionMetadata;

  public NextChangelog: string = '';

  private _contents: any[] = [];

  private _autoLog: string[] = [];

  constructor(c_data?: CollectionData) {
    this.ID = c_data?.id || uuid();
    this.Name = c_data?.name || 'New Collection';
    this.Author = c_data?.author || '';
    this.Description = c_data?.description || '';
    this.Version = c_data?.version || '0.0';
    this.Changelog = c_data?.changelog || [];
    this.NextChangelog = c_data?.next_changelog || '';

    if (c_data && c_data.items)
      this._contents = c_data?.items.map((item) => {
        const e = { ...item } as any;
        let data;
        switch (item.collection_type) {
          case 'npcs':
            data = NpcStore().getNpcByID(item.id);
            break;
          case 'encounters':
            data = EncounterStore().getEncounterByID(item.id);
            break;
          case 'narratives':
            data = NarrativeStore().getItemByID(item.id);
            break;
          case 'pilots':
            data = PilotStore().getPilotByID(item.id);
            break;
          case 'campaigns':
            data = CampaignStore().Campaigns.find((x) => x.ID === item.id);
            break;
          case 'lcps':
            data = CompendiumStore().ContentPacks.find((x) => x.ID === item.id);
            break;
        }
        if (data) e.data = data;
        return e;
      });
  }

  public Save() {
    CompendiumStore().saveContentCollection(this);
  }

  public Delete() {
    RemoveItem(ContentCollection.StorageType, this.ID);
  }

  public get Contents() {
    return this._contents;
  }

  public AddItem(collectionType: string, item: any) {
    this._contents.push({
      name: item.Name,
      collection_type: collectionType,
      item_type: item.ItemType,
      id: item.ID,
      last_updated: item.SaveController?.LastModified || '',
      data: item,
    });
    this._autoLog.push(`Added ${item.ItemType} ${item.Name}`);
  }

  public RemoveItem(item: any) {
    const idx = this._contents.findIndex((x) => x.id === item.id);
    if (idx === -1) return;
    this._contents.splice(idx, 1);
    this._autoLog.push(`Removed ${item.item_type} ${item.name}`);
  }

  public UpdateItem(item: any) {
    const idx = this._contents.findIndex((x) => x.id === item.id);
    if (idx === -1) return;
    this._contents[idx].last_updated = item.data.SaveController.LastModified;
    this._contents[idx].data = item.data;
  }

  public GenerateChangelog() {
    let changes = [...this._autoLog];
    this.Contents.forEach((e) => {
      if (e.last_updated != e.data.SaveController.LastModified)
        changes.push(`Updated ${e.item_type} ${e.name}`);
    });
    changes = changes.map((x) => `- ${x}\n`);
    return `${new Date().toLocaleDateString()}\n${changes.join('')}`;
  }

  public NextVersion(type: 'major' | 'minor') {
    let ver = this.Version.split('.');
    if (type === 'major') {
      ver[0] = (parseInt(ver[0]) + 1).toString();
      ver[1] = '0';
    } else {
      ver[1] = (parseInt(ver[1]) + 1).toString();
    }
    return ver.join('.');
  }

  public async Publish(type: 'major' | 'minor') {
    this.Version = this.NextVersion(type);
    await this._publish();
  }

  private async _publish() {
    this.Contents.forEach((contentItem) => {
      this.UpdateItem(contentItem);
    });
    this.Changelog.push({
      version: this.Version,
      changes: this.GenerateChangelog().split('\n'),
    });
    this.NextChangelog = '';

    this.Save();

    const serialized = ContentCollection.Serialize(this);

    const metadata = {
      user_id: UserStore().Cognito.userId,
      sortkey: `collection_${serialized.id}`,
      name: serialized.name,
      author: serialized.author,
      description: serialized.description,
      version: serialized.version,
      changelog: JSON.stringify(serialized.changelog),
      contents: JSON.stringify(serialized.items),
      uri: `${UserStore().Cognito.userId}/collections/collection_${serialized.id}.json`,
    } as any;

    if (this.Metadata) metadata.created = this.Metadata.created;
    if (this.Metadata) metadata.code = this.Metadata.code;

    try {
      const res = await updateItem(metadata, 'collection');
      const collectedData = GenerateExportCollection(
        this._contents.map((x) => x.data),
        'collection'
      );
      console.log(collectedData);
      await uploadToS3(collectedData, res.presign.upload);
    } catch (e) {
      throw new Error('Error while publishing collection ' + e);
    }
  }

  public static Serialize(collection: ContentCollection): CollectionData {
    return {
      __content_type: 'collection',
      id: collection.ID,
      name: collection.Name,
      author: collection.Author,
      description: collection.Description,
      version: collection.Version,
      changelog: collection.Changelog,
      next_changelog: collection.NextChangelog,
      items: collection._contents.map((item) => {
        return {
          name: item.name,
          collection_type: item.collection_type,
          item_type: item.item_type,
          last_updated: item.last_updated,
          id: item.id,
        };
      }),
    };
  }

  public static Deserialize(data: CollectionData): ContentCollection {
    return new ContentCollection(data);
  }

  public static async Delete(collection: ContentCollection) {
    await CompendiumStore().deleteContentCollection(collection);
    if (collection.Metadata)
      await cloudDelete(
        collection.Metadata.user_id,
        collection.Metadata.sortkey,
        collection.Metadata?.uri
      );
  }
}

export { ContentCollection };
