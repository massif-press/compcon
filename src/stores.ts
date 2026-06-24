import { UserStore } from './user/store'
import { CompendiumStore, ContentPackStore, ContentCollectionStore } from './features/compendium/store'
import { PilotStore, PilotSheetStore, PilotGroupStore } from './features/pilot_management/store'
import { NpcStore } from './features/gm/store/npc_store'
import { EncounterStore } from './features/gm/store/encounter_store'
import { NarrativeStore } from './features/gm/store/narrative_store'
import { CampaignStore } from './features/gm/store/campaign_store'

export { NavStore } from '@/stores/nav'
export type { IndexItem } from '@/stores/nav'
export { LocalizationStore } from '@/stores/localization'

export { AuthStore } from './user/store/AuthStore'
export { UserMetadataStore } from './user/store/UserMetadataStore'
export { CloudDataStore } from './user/store/CloudDataStore'
export { NotificationStore } from './user/store/NotificationStore'
export { RemoteItemStore } from './user/store/RemoteItemStore'
export { CollectionStore } from './user/store/CollectionStore'
export { BackupStore } from './user/store/BackupStore'
export { SyncStore } from './user/store/SyncStore'

export {
  UserStore,
  CompendiumStore,
  ContentPackStore,
  ContentCollectionStore,
  CampaignStore,
  PilotStore,
  PilotSheetStore,
  PilotGroupStore,
  NpcStore,
  NarrativeStore,
  EncounterStore,
}
