import _ from 'lodash'
import { ICloudSyncable } from './ICloudSyncable'

interface ICloudData {
  lastUpdate_cloud: string
  lastSync: string
  shareCode: string
  shareCodeExpiry: string
  isRemoteResource: boolean
  remoteIID: string
  remoteKey: string
}

enum CloudItemTypeMap {
  activemission = 'Active Mission',
  mission = 'Mission',
  encounter = 'Encounter',
  npc = 'NPC',
  pilot = 'Pilot',
}

class CloudController {
  public readonly Parent: ICloudSyncable

  public LastUpdateCloud: string
  public LastSync: string
  public ShareCode: string
  public ShareCodeExpiry: string

  private _isRemoteResource: boolean
  public RemoteIID: string
  public RemoteKey: string

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent
    this.LastSync = ''
    this.LastUpdateCloud = ''
  }

  public reset() {
    this.LastUpdateCloud = ''
    this.LastSync = ''
    this.ShareCode = ''
    this.ShareCodeExpiry = ''
    this._isRemoteResource = false
  }

  public get s3Key(): string {
    const sanitizedName = this.Parent.Name.replace(/[^a-zA-Z\d\s:]/g, ' ')
    return `${this.Parent.ItemType}/${sanitizedName}--${this.Parent.ID}--${
      this.Parent.SaveController.IsDeleted ? 'deleted' : 'active'
    }`
  }

  public get ShareCodeExpiration(): string {
    if (!this.ShareCodeExpiry) return ''
    return new Date(this.ShareCodeExpiry).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  public SetShareCode(code: string) {
    this.ShareCode = code

    const d = new Date()
    d.setDate(d.getDate() + 90)
    this.ShareCodeExpiry = d.toString()
    this.Parent.SaveController.save()
  }

  public get IsShareExpired(): boolean {
    if (!this.ShareCodeExpiry) return false
    return new Date(this.ShareCodeExpiry) < new Date()
  }

  public SetRemoteResource(iid: string, key: string) {
    this.ShareCode = ''
    this.ShareCodeExpiry = ''
    this.RemoteIID = iid
    this.RemoteKey = key
    this._isRemoteResource = true
  }

  public get IsRemoteResource(): boolean {
    return this._isRemoteResource
  }

  public MarkSync() {
    this.LastSync = new Date().toString()
    this.LastUpdateCloud = this.LastSync
    this.Parent.SaveController.save()
  }

  public ForceSync() {
    this.Parent.SaveController.save()
    this.LastSync = this.Parent.SaveController.LastModified
    this.LastUpdateCloud = this.Parent.SaveController.LastModified
  }

  public get LastUpdateLocal(): string {
    return this.Parent.SaveController.LastModified
  }

  // test against legacy saves, which were just IDs
  public static ValidateName(name: string) {
    // looking for name--id--status
    return (name.match(/--/g) || []).length === 2
  }

  // catch if the s3 key must be changed due to name or status changes
  public static IsKeyChange(oldKey: string, newItem: ICloudSyncable): Boolean {
    return oldKey === newItem.CloudController.s3Key
  }

  public static Serialize(parent: ICloudSyncable, target: any) {
    target.lastUpdate_cloud = parent.CloudController.LastUpdateCloud
    target.lastSync = parent.CloudController.LastSync
    target.shareCode = parent.CloudController.ShareCode
    target.shareCodeExpiry = parent.CloudController.ShareCodeExpiry
    target.isRemoteResource = parent.CloudController.IsRemoteResource
    target.remoteIID = parent.CloudController.RemoteIID
    target.remoteKey = parent.CloudController.RemoteKey
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    if (!parent.CloudController)
      throw new Error(
        `CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`
      )

    parent.CloudController.LastUpdateCloud = data.lastUpdate_cloud
    parent.CloudController.LastSync = data.lastSync
    parent.CloudController.ShareCode = data.shareCode
    parent.CloudController.ShareCodeExpiry = data.shareCodeExpiry
    parent.CloudController._isRemoteResource = data.isRemoteResource
    parent.CloudController.RemoteIID = data.remoteIID
    parent.CloudController.RemoteKey = data.remoteKey
  }
}
export { ICloudData, CloudController, CloudItemTypeMap }
