import _ from 'lodash';
import { ICloudSyncable } from './ICloudSyncable';
import {
  CampaignStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
  UserStore,
} from '@/stores';
import { downloadFromS3, updateItem, uploadToS3 } from '@/io/apis/account';
import { Pilot } from '@/class';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { Unit } from '@/classes/npc/unit/Unit';
import { Encounter } from '@/classes/encounter/Encounter';
import { Campaign } from '@/classes/campaign/Campaign';
import { Character } from '@/classes/narrative/Character';
import { Faction } from '@/classes/narrative/Faction';
import { Location } from '@/classes/narrative/Location';
import { error } from 'console';
import logger from '@/user/logger';

const syncableTypes = [
  'pilot',
  'unit',
  'doodad',
  'eidolon',
  'character',
  'faction',
  'location',
  'encounter',
  'campaign',
];

interface ICloudData {
  metadata: dbItemMeta;
  cloud_data: string;
}

enum SyncStatus {
  LocalOnly = 'LocalOnly',
  LocalNewer = 'LocalNewer',
  CloudOnly = 'CloudOnly',
  CloudNewer = 'CloudNewer',
  Synced = 'Synced',
}

type dbItemMeta = {
  user_id: string;
  sortkey: string;
  name: string;
  author: string;
  item_modified: number; // latest saveController lastModified
  uri: string;
  size?: number;
  created?: number;
  updated?: number; // latest db update. do not test against this. this may drift from item_modified
  deleted?: number;
  code?: string;
  ttl?: number; // update on local delete/perm delete

  preserve?: boolean; // archive only
};

class DbItemMetadata {
  public raw: dbItemMeta;
  public UserId: string;
  public SortKey: string;
  public Name: string;
  public Author: string;
  public ItemModified: number;
  public Uri: string;
  public Size?: number;
  public Created?: number;
  public Updated?: number;
  public Deleted?: number;
  public Code?: string;
  public TTL?: number;

  public constructor(data: dbItemMeta) {
    this.raw = data;
    this.UserId = data.user_id;
    this.SortKey = data.sortkey;
    this.Name = data.name;
    this.Author = data.author;
    this.Uri = data.uri;
    this.ItemModified = data.item_modified;
    if (data.size) this.Size = data.size;
    if (data.created) this.Created = data.created;
    if (data.updated) this.Updated = data.updated;
    if (data.deleted) this.Deleted = data.deleted;
    if (data.code) this.Code = data.code;
    if (data.ttl) this.TTL = data.ttl;
  }

  public Serialize(): dbItemMeta {
    return {
      user_id: this.UserId,
      sortkey: this.SortKey,
      name: this.Name,
      author: this.Author,
      item_modified: this.ItemModified,
      uri: this.Uri,
      size: this.Size,
      created: this.Created,
      updated: this.Updated,
      deleted: this.Deleted,
      code: this.Code,
      ttl: this.TTL,
    };
  }
}

class CloudController {
  public readonly Parent: ICloudSyncable;

  private _metadata!: DbItemMetadata;

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent;
    this.GenerateMetadata();
  }

  public GenerateSortKey(): string {
    let type = this.Parent.ItemType;
    return `${this.Parent.DataType}_${this.Parent.ItemType}_${this.Parent.ID}`;
  }

  public SetItemSize(data: any) {
    if (this.Metadata) this.Metadata.Size = JSON.stringify(data).length;
  }

  public get SyncStatus(): SyncStatus {
    if (!this.Metadata || !this.Metadata.ItemModified) return SyncStatus.LocalOnly;
    if (this.Metadata.ItemModified < this.Parent.SaveController.LastModified)
      return SyncStatus.LocalNewer;
    if (this.Metadata.ItemModified > this.Parent.SaveController.LastModified)
      return SyncStatus.CloudNewer;
    return SyncStatus.Synced;
  }

  public get Metadata(): DbItemMetadata {
    return this._metadata;
  }

  public set Metadata(data: dbItemMeta) {
    this._metadata = new DbItemMetadata(data);
  }

  public GenerateMetadata(): void {
    this._metadata = CloudController.GenerateMetadata(this);
  }

  public static GenerateMetadata(controller: CloudController) {
    return new DbItemMetadata({
      user_id: UserStore().Cognito.userId,
      author: UserStore().UserMetadata.Username,
      sortkey: controller.GenerateSortKey(),
      name: controller.Parent.Name,
      uri: `${UserStore().Cognito.userId}/${controller.GenerateSortKey()}.json`,
      item_modified: controller.Parent.SaveController.LastModified,
    });
  }

  public async UpdateCloud(scope = 'item') {
    const savedata = this.Parent.Serialize(this.Parent);
    // called after we're sure cloud needs to be updated
    this.Metadata.ItemModified = this.Parent.SaveController.LastModified;
    this.Metadata.Name = this.Parent.Name;
    this.Metadata.Size = JSON.stringify(savedata).length;
    const res = await updateItem(this.Metadata.Serialize(), scope);
    if (res.error) return res.error;
    if (res.data) {
      this.Metadata = res.data;
      this.Parent.SaveController.saveSilent();
    }
    if (res.presign.upload) {
      const uploadResult = await uploadToS3(savedata, res.presign.upload);
      return uploadResult;
    } else throw new Error('No presign returned.');
  }

  public static async MarkCloudDeleted(metadata: DbItemMetadata) {
    metadata.Deleted = Date.now();
    const res = await updateItem(metadata.Serialize());
    if (res.data) return res.data;
    if (res.error) throw new Error(res.error);
  }

  public static async Undelete(metadata: DbItemMetadata) {
    metadata.Deleted = 0;
    metadata.TTL = -1;

    const res = await updateItem(metadata.Serialize());
    if (res.data) return res.data;
    if (res.error) throw new Error(res.error);
  }

  public async Download() {
    return await downloadFromS3(this.Metadata.Uri);
  }

  public get UserID(): string {
    return this.Metadata?.UserId || '';
  }

  public get ShareCode(): string {
    return this.Metadata?.Code || '';
  }

  public get LastUpdateLocal(): number {
    return this.Parent.SaveController.LastModified;
  }

  public static Serialize(parent: ICloudSyncable, target: any) {
    if (!target.cloud) target.cloud = {};
    // if (target.cloud.metadata && target.cloud.metadata.is_remote)
    // target.cloud.metadata = parent.CloudController.Metadata.raw;
    // target.cloud.cloud_data = JSON.stringify(parent.CloudController.CloudData);
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    if (!parent.CloudController)
      throw new Error(
        `CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`
      );
    // if (data.metadata) parent.CloudController.Metadata = data.metadata;
    // if (data?.cloud_data) parent.CloudController.CloudData = JSON.parse(data.cloud_data);
  }

  public static async AutoSync(item: any): Promise<void> {
    if (item.CloudController.SyncStatus === 'Synced') return;
    const strategy = UserStore().SyncSettings.resolutionStrategy;
    if (strategy === 'manual') return;
    switch (strategy) {
      case 'local':
        if (item.IsCloudOnly) await CloudController.SyncToCloud(item);
        else await CloudController.SyncToLocal(item);
        break;
      case 'cloud':
        await CloudController.SyncToCloud(item);
        break;
      case 'newest':
        await CloudController.SyncToNewest(item);
        break;
      default:
        logger.error('Unknown sync strategy:', this);
        break;
    }
  }

  public static async SyncToNewest(item: any) {
    if (item.IsCloudOnly || item.CloudController.SyncStatus === 'CloudNewer')
      await CloudController.SyncToCloud(item);
    else await CloudController.SyncToLocal(item);
  }

  public static async UpdateRemote(item: any) {
    if (item.CloudController.SyncStatus === 'Synced') return;

    const itemType = item.CloudController.Metadata.SortKey.split('_')[1].toLowerCase();
    const meta = { ...item.CloudController.Metadata.raw };
    let data = await downloadFromS3(item.CloudController.Metadata.Uri);
    const updatedItem = CloudController.NewByType(itemType, data);
    updatedItem.CloudController.setRemoteMetadata(meta);

    await CloudController.AddByType(itemType, updatedItem);
  }

  public setRemoteMetadata(meta: any) {
    this.Metadata = meta;
    this.Parent.SaveController.SetRemote(
      meta.code,
      meta.author || '',
      meta.collection || '',
      meta.item_modified
    );
  }

  // download latest cloud data and sync local
  public static async SyncToCloud(item: any) {
    if (UserStore().StorageFull) throw new Error('Storage full! Unable to download.');

    if (
      !item.CloudController?.Metadata?.SortKey ||
      !syncableTypes.includes(item.ItemType.toLowerCase())
    ) {
      UserStore().addCloudNotification(`Unable to sync ${item.ItemType} ${item.Name}.`, 'error');
      logger.error(`CloudController: Unable to sync ${item.ItemType} ${item.Name}.`, this);
      return;
    }
    const itemType = item.CloudController.Metadata.SortKey.split('_')[1].toLowerCase();

    let data = item.IsCloudOnly
      ? await downloadFromS3(item.raw.uri)
      : await item.CloudController.Download();

    if (data && item.IsCloudOnly)
      UserStore().addCloudNotification(`Added ${item.ItemType} "${item.Name}" from cloud data.`);

    await CloudController.AddByType(itemType, this.NewByType(itemType, data));
  }

  public static NewByType(itemType: string, data: any): ICloudSyncable {
    switch (itemType.toLowerCase()) {
      case 'pilot':
        return new Pilot(data);
      case 'unit':
        return Unit.Deserialize(data);
      case 'doodad':
        return Doodad.Deserialize(data);
      case 'eidolon':
        return Eidolon.Deserialize(data);
      case 'character':
        return Character.Deserialize(data);
      case 'faction':
        return Faction.Deserialize(data);
      case 'location':
        return Location.Deserialize(data);
      case 'encounter':
        return Encounter.Deserialize(data);
      case 'campaign':
        return Campaign.Deserialize(data);
      default:
        throw new Error('Unknown item type: ' + itemType);
    }
  }

  public static async AddByType(itemType: string, item: any) {
    switch (itemType.toLowerCase()) {
      case 'pilot':
        PilotStore().AddPilot(item);
        break;
      case 'unit':
        await NpcStore().AddNpc(item);
        break;
      case 'doodad':
        await NpcStore().AddNpc(item);
        break;
      case 'eidolon':
        await NpcStore().AddNpc(item);
        break;
      case 'character':
      case 'faction':
      case 'location':
        await NarrativeStore().AddItem(item);
        break;
      case 'encounter':
        await EncounterStore().AddEncounter(item);
        break;
      case 'campaign':
        await CampaignStore().AddCampaign(item);
        break;
      default:
        logger.error(`CloudController: Unknown item type ${itemType}`, this);
        break;
    }
  }

  // upload local data to cloud
  public static async SyncToLocal(item: ICloudSyncable) {
    if (UserStore().CloudStorageFull) throw new Error('Cloud storage full! Unable to sync.');

    if (!item.SaveController) {
      logger.error(`CloudController: Unable to sync ${item.ItemType} ${item.Name}.`, this);
      return;
    }
    const res = await item.CloudController.UpdateCloud();
  }

  public static ImageMetadata(filename: string, fileExt: string, size: number): any {
    const cleanedFilename = filename.replace(/[^a-zA-Z0-9]/g, '');
    return {
      user_id: UserStore().Cognito.userId,
      sortkey: `image_${cleanedFilename}.${fileExt}`,
      name: cleanedFilename,
      uri: `${UserStore().Cognito.userId}/images/${cleanedFilename}.${fileExt}`,
      size: size,
    };
  }
}

export { CloudController, DbItemMetadata };
export type { ICloudData, dbItemMeta };
