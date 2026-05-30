import { UserStore } from '@/user/store'

export type dbItemMeta = {
  user_id: string
  sortkey: string
  name: string
  author: string
  item_modified: number
  uri: string
  size?: number
  created?: number
  updated?: number
  deleted?: number
  version?: number
  code?: string
  ttl?: number
  preserve?: boolean
  _ts?: Record<string, number>
}

export interface ICloudData {
  metadata: dbItemMeta
  cloud_data: string
  _ts?: Record<string, number>
}

export class DbItemMetadata {
  public raw: dbItemMeta
  public UserId: string
  public SortKey: string
  public Name: string
  public Author: string
  public ItemModified: number
  public Uri: string
  public Size?: number
  public Created?: number
  public Updated?: number
  public Deleted?: number
  public Version?: number
  public Code?: string
  public TTL?: number

  public constructor(data: dbItemMeta) {
    this.raw = data
    this.UserId = data.user_id
    this.SortKey = data.sortkey
    this.Name = data.name
    this.Author = data.author || ''
    this.Uri = data.uri
    this.ItemModified = data.item_modified
    if (data.size) this.Size = data.size
    if (data.created) this.Created = data.created
    if (data.updated) this.Updated = data.updated
    if (data.deleted) this.Deleted = data.deleted
    if (data.version !== undefined) this.Version = data.version
    if (data.code) this.Code = data.code
    if (data.ttl) this.TTL = data.ttl
  }

  public Serialize(): dbItemMeta {
    return {
      user_id: this.UserId || UserStore().Cognito.userId || '',
      sortkey: this.SortKey,
      name: this.Name,
      author: this.Author || '',
      item_modified: this.ItemModified,
      uri: this.Uri,
      size: this.Size,
      created: this.Created,
      updated: this.Updated,
      deleted: this.Deleted,
      version: this.Version,
      code: this.Code,
      ttl: this.TTL,
    }
  }
}
