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

  private _metadata: DbItemMetadata;

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent;
    this._metadata = this.GenerateMetadata();
  }

  public GenerateSortKey(): string {
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

  public get IsRemote(): boolean {
    if (!this.Metadata) return false;
    return this.Metadata.UserId !== UserStore().Cognito.userId;
  }

  public get Metadata(): DbItemMetadata {
    return this._metadata;
  }

  public set Metadata(data: dbItemMeta) {
    this._metadata = new DbItemMetadata(data);
  }

  public GenerateMetadata(): DbItemMetadata {
    return CloudController.GenerateMetadata(this);
  }

  public static GenerateMetadata(controller: CloudController) {
    return new DbItemMetadata({
      user_id: UserStore().Cognito.userId,
      sortkey: controller.GenerateSortKey(),
      name: controller.Parent.Name,
      uri: `${UserStore().Cognito.userId}/${controller.GenerateSortKey()}.json`,
      item_modified: controller.Parent.SaveController.LastModified,
    });
  }

  public async UpdateCloud() {
    const savedata = this.Parent.Serialize(this.Parent);
    // called after we're sure cloud needs to be updated
    this.Metadata.ItemModified = this.Parent.SaveController.LastModified;
    this.Metadata.Name = this.Parent.Name;
    this.Metadata.Size = JSON.stringify(savedata).length;
    // TODO: item deleted && TTL
    const res = await updateItem(this.Metadata.Serialize());
    if (res.error) return res.error;
    if (res.data) {
      this.Metadata = res.data;
      this.Parent.SaveController.saveSilent();
    }
    if (res.presign.upload) {
      console.log('Uploading data to S3:', savedata);
      const uploadResult = await uploadToS3(savedata, res.presign.upload);
      return uploadResult;
    } else throw new Error('No presign returned.');
  }

  public static async MarkCloudDeleted(metadata: DbItemMetadata) {
    metadata.Deleted = Date.now();
    const tdlDays = Number(UserStore().SyncSettings.itemRetention);
    if (tdlDays > -1) {
      metadata.TTL = new Date().setDate(new Date().getDate() + tdlDays);
    }
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
    // target.cloud.metadata = parent.CloudController.Metadata.raw;
    // target.cloud.cloud_data = JSON.stringify(parent.CloudController.CloudData);
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    // console.log(data);
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
        console.error('Unknown sync strategy:', strategy);
        break;
    }
  }

  public static async SyncToNewest(item: any) {
    if (item.IsCloudOnly || item.CloudController.SyncStatus === 'CloudNewer')
      await CloudController.SyncToCloud(item);
    else await CloudController.SyncToLocal(item);
  }

  // download latest cloud data and sync local
  public static async SyncToCloud(item: any) {
    if (UserStore().StorageFull) throw new Error('Storage full! Unable to download.');

    if (!item.CloudController?.Metadata?.SortKey) {
      console.error('Item cannot be synced:', item);
      return;
    }
    const itemType = item.CloudController.Metadata.SortKey.split('_')[1].toLowerCase();

    let data = item.IsCloudOnly
      ? await downloadFromS3(item.raw.uri)
      : await item.CloudController.Download();

    console.log(data);
    console.log(itemType);

    switch (itemType.toLowerCase()) {
      case 'pilot':
        PilotStore().AddPilot(new Pilot(data));
        break;
      case 'unit':
        await NpcStore().AddNpc(new Unit(data));
        break;
      case 'doodad':
        await NpcStore().AddNpc(new Doodad(data));
        break;
      case 'eidolon':
        await NpcStore().AddNpc(new Eidolon(data));
        break;
      case 'collectionitem':
        await NarrativeStore().AddItem(data);
        break;
      case 'encounter':
        await EncounterStore().AddEncounter(data);
        break;
      case 'campaign':
        await CampaignStore().AddCampaign(data);
        break;
      default:
        console.error('Unknown item type:', itemType);
        break;
    }
  }

  // upload local data to cloud
  public static async SyncToLocal(item: ICloudSyncable) {
    if (UserStore().CloudStorageFull) throw new Error('Cloud storage full! Unable to sync.');

    if (!item.SaveController) {
      console.error('Item cannot be synced (has no local instance):', item);
      return;
    }
    const res = await item.CloudController.UpdateCloud();
  }
}

export { CloudController, DbItemMetadata };
export type { ICloudData, dbItemMeta };
