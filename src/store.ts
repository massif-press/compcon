import Vue from 'vue'
import Vuex from 'vuex'
import { CompendiumStore } from './features/compendium/store'
import { PilotManagementStore } from './features/pilot_management/store/'
import { NpcStore } from './features/encounters/npc/store'
import { EncounterStore } from './features/encounters/encounter/store'
import { MissionStore } from './features/encounters/mission/store'

// import gmToolkitModules from './features/encounters/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    datastore: CompendiumStore,
    management: PilotManagementStore,
    npc: NpcStore,
    encounter: EncounterStore,
    mission: MissionStore,
  },
})

export { store, CompendiumStore, EncounterStore, PilotManagementStore, NpcStore, MissionStore }
