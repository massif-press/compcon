import Vue from 'vue'
import Vuex from 'vuex'
import { UserStore } from './user/store'
import { NavStore } from './features/nav/store'
import { CompendiumStore } from './features/compendium/store'
import { PilotManagementStore } from './features/pilot_management/store/'
import { NpcStore } from './features/encounters/npc/store'
import { EncounterStore } from './features/encounters/encounter/store'
import { MissionStore } from './features/encounters/mission/store'
import { CharacterStore } from './features/gm/store/character_store'
import { LocationStore } from './features/gm/store/location_store'
import { FactionStore } from './features/gm/store/faction_store'
import { CampaignStore } from './features/gm/store'
import { EidolonStore } from './features/gm/store/eidolon_store'

// import gmToolkitModules from './features/encounters/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    cloud: UserStore,
    nav: NavStore,
    datastore: CompendiumStore,
    management: PilotManagementStore,
    npc: NpcStore,
    campaign: CampaignStore,
    encounter: EncounterStore,
    mission: MissionStore,
    character: CharacterStore,
    location: LocationStore,
    faction: FactionStore,
    eidolon: EidolonStore,
  },
})

export {
  store,
  UserStore,
  NavStore,
  CompendiumStore,
  CampaignStore,
  EncounterStore,
  PilotManagementStore,
  NpcStore,
  MissionStore,
  CharacterStore,
  FactionStore,
  LocationStore,
  EidolonStore,
}
