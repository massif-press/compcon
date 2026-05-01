import { UserStore } from './user/store'
import { CompendiumStore } from './features/compendium/store'
import { PilotStore } from './features/pilot_management/store'
import { NpcStore } from './features/gm/store/npc_store'
import { EncounterStore } from './features/gm/store/encounter_store'
import { NarrativeStore } from './features/gm/store/narrative_store'
import { CampaignStore } from './features/gm/store/campaign_store'

export { NavStore } from '@/stores/nav'
export type { IndexItem } from '@/stores/nav'

export {
  UserStore,
  CompendiumStore,
  CampaignStore,
  PilotStore,
  NpcStore,
  NarrativeStore,
  EncounterStore,
}
