declare interface ICloudSyncable {
  // (C/C) UID for import/export
  CloudID: string
  // (C/C) prepend for S3 filename (folder)
  TypePrefix: string
  // (C/C) TypePrefix/ID
  ResourceURI: string
  // (AWS) Cognito ID of owner
  CloudOwnerID: string
  // (C/C) Belongs to local user (save to user account) or not (remote update)
  IsLocallyOwned: boolean
  // (C/C) Does this object have unsynced data?
  IsDirty: boolean
  // (C/C) When did the last sync go through?
  LastSync: string
  // (C/C) Fields to ignore when syncing (eg. Pilot.Group)
  SyncIgnore: string[]
  // (C/C) atob encode for JSON.stringify([CloudOwnerID, CloudID])
  ShareCode: string

  // On import, set CloudID, renew Local ID, and set remote flag
  SetRemoteResource: (userId: string, id: string) => void

  // Sets object owner ID for S3 recovery and clear the remote flag
  SetOwnedResource: (id: string) => void

  // Replace all fields in object with data, optionally ignoring SyncIgnore properties
  Update: (data: any, ignoreProps?: boolean) => void

  // Update LastSync and unmark IsDirty
  MarkSync: () => void
}
