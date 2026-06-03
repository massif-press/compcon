import { inject, type InjectionKey } from 'vue'
import type { Status } from '@/classes/Status'
import type { Frame } from '@/classes/mech/components/frame/Frame'
import type { NpcClass } from '@/classes/npc/class/NpcClass'
import type { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import type { ContentPack } from '@/classes/ContentPack'
import type { CompendiumItem } from '@/classes/CompendiumItem'
import type { UserProfile } from '@/user'

export interface CompendiumDataProvider {
  readonly Statuses: Status[]
  readonly Frames: Frame[]
  readonly NpcClasses: NpcClass[]
  readonly NpcFeatures: NpcFeature[]
  readonly ContentPacks: ContentPack[]
  getItemCollection(itemType: string): CompendiumItem[]
  referenceLink(item: CompendiumItem, internal?: boolean): string
}

export const CompendiumDataKey: InjectionKey<CompendiumDataProvider> = Symbol('CompendiumData')

export interface UserDataProvider {
  readonly User: UserProfile
  readonly IsLoggedIn: boolean
  readonly CloudImages: any[]
  readonly CloudStorageUsed: number
  readonly MaxCloudStorage: number
  readonly CloudStorageFull: boolean
  downloadLcp(pack: any): Promise<void>
  refreshDbData(): Promise<void>
}

export const UserDataKey: InjectionKey<UserDataProvider> = Symbol('UserData')

export function useCompendiumData(): CompendiumDataProvider {
  const provider = inject(CompendiumDataKey)
  if (!provider) throw new Error('CompendiumDataProvider was not provided by the host application')
  return provider
}

export function useUserData(): UserDataProvider {
  const provider = inject(UserDataKey)
  if (!provider) throw new Error('UserDataProvider was not provided by the host application')
  return provider
}
