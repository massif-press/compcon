import { ICloudSyncable } from './ICloudSyncable'

interface ICloudData {
  lastUpdate_cloud: string
  lastSync: string
  resourceUri: string
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

  LastUpdateCloud: string
  LastSync: string
  ResourceURI: string

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent
    this.LastSync = ''
    this.LastUpdateCloud = ''
  }

  public get s3Key(): string {
    const sanitizedName = this.Parent.Name.replace(/[^a-zA-Z\d\s:]/g, ' ')
    return `${this.Parent.ItemType}/${sanitizedName}--${this.Parent.ID}--${
      this.Parent.SaveController.IsDeleted ? 'deleted' : 'active'
    }`
  }

  public get ShareCode(): string {
    return 'TODO'
  }

  public MarkSync() {
    this.LastSync = new Date().toString()
    this.LastUpdateCloud = this.LastSync
    this.Parent.SaveController.save()
  }

  public get LastUpdateLocal(): string {
    return this.Parent.SaveController.LastModified
  }

  // test against legacy saves, which were just IDs
  public static ValidateName(name: string) {
    // looking for name--id--status
    return (name.match(/--/g) || []).length === 2
  }

  public static Serialize(parent: ICloudSyncable, target: any) {
    target.lastUpdate_cloud = parent.CloudController.LastUpdateCloud
    target.lastSync = parent.CloudController.LastSync
    target.resourceUri = parent.CloudController.ResourceURI
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    if (!parent.CloudController)
      throw new Error(
        `CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`
      )

    parent.CloudController.LastUpdateCloud = data.lastUpdate_cloud
    parent.CloudController.LastSync = data.lastSync
    parent.CloudController.ResourceURI = data.resourceUri
  }
}
export { ICloudData, CloudController, CloudItemTypeMap }
