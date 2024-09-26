//TODO:
// - don't save cloud data (including name, etc). This should be refreshed on app start/login/data viewer open
// - only download latest on item update or open diff editor

/* NOTES
- sync process:
0) load saved local data (done as part of parent data load process)
  0.a) do not save/load last cloud update
  0.b) default status to LOCAL ONLY
1) GET data from cloud as batch get elsewhere. Sync part 1 fn should use this data by item ID (sortkey)
2) check db data
  2.a) IF savecontroller.lastModified === item_modified, set status to SYNCED
  2.b) ELSE IF DB item_modified > savecontroller.lastModified, set status to CLOUDNEWER/CONFLICT
  2.c) ELSE IF DB item_modified < savecontroller.lastModified, set status to LOCALNEWER/CONFLICT
3) receive STAGE UPDATE call
  3.a) IF status === SYNCED, LOCALNEWER, or NONE, (CONFLICT === false) ignore
  3.b) ELSE IF cloud data is NEWER, download cloud data into cloudcoutroller and WAIT. This data should be SAVED LOCALLY
    3.b.I) SAVE cloud data timestamp as lastUpdateCloud
    3.b.II) staged cloud data should be overwritten IFF lastUpdateCloud is later than new DB update pull
3.5) IF in conflict -- user can edit saved data FROM CLOUDCONTROLLER. this should be saved here.
4) receive COMMIT UPDATE CALL.
  4.a) this comes from elsewhere. can be automatic or user triggered. Might come from diff editor.
  4.b) Check status
    4.b.I) IF SYNCED, ignore
    4.b.II) IF LOCALNEWER or NONE, upload local data to cloud (meta to db, data to uri), return promise
    4.b.III) IF CLOUDNEWER, UPDATE local data with cloudcontroller data. Clear cloudcontroller data.
*/

import _ from 'lodash';
import { ICloudSyncable } from './ICloudSyncable';
import { UserStore } from '@/stores';
import { downloadFromS3, updateItem, uploadToS3 } from '@/io/apis/account';

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
    return new DbItemMetadata({
      user_id: UserStore().Cognito.userId,
      sortkey: this.GenerateSortKey(),
      name: this.Parent.Name,
      uri: `${UserStore().Cognito.userId}/${this.GenerateSortKey()}.json`,
      item_modified: this.Parent.SaveController.LastModified,
    });
  }

  public async UpdateCloud() {
    const savedata = this.Parent.Serialize(this.Parent);
    // called after we're sure cloud needs to be updated
    this.Metadata.ItemModified = this.Parent.SaveController.LastModified;
    this.Metadata.Name = this.Parent.Name;
    this.Metadata.Size = JSON.stringify(savedata).length;
    // TODO: item deleted && TTL
    console.log(this.Metadata.Serialize());
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

  // should we download cloud data, but not necessarily sync?
  // public get RequiresUpdate() {
  //   if (this.CloudData && this.CloudData.save.lastModified === this.Metadata.ItemModified)
  //     return false;
  //   return this.SyncStatus !== SyncStatus.Synced;
  // }

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
}
export { CloudController, DbItemMetadata };
export type { ICloudData };
