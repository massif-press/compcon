import { ICloudSyncable } from "./ICloudSyncable"

interface ICloudData {
  lastUpdate_cloud: string
  lastSync: string
  resourceUri: string
}

class CloudController {
  public readonly Parent: ICloudSyncable

  LastUpdateCloud: string
  LastSync: string
  ResourceURI: string

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent
    this.LastSync = new Date('1-1-1000').toString()
  }

  public get ShareCode(): string {
    return 'TODO'
  }

  public MarkSync() {
    this.LastSync = new Date().toString()
  }

  public get LastUpdateLocal(): string {
    return this.Parent.SaveController.LastModified
  }

  public static Serialize(parent: ICloudSyncable, target: any) {
    target.lastUpdate_cloud = parent.CloudController.LastUpdateCloud
    target.lastSync = parent.CloudController.LastSync
    target.resourceUri = parent.CloudController.ResourceURI
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    if (!parent.CloudController) throw new Error(`CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`);

    parent.CloudController.LastUpdateCloud = data.lastUpdate_cloud
    parent.CloudController.LastSync = data.lastSync
    parent.CloudController.ResourceURI = data.resourceUri
  }
}
export {
  ICloudData,
  CloudController,
}