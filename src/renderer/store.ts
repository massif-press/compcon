import Vue from 'vue'
import Vuex from 'vuex'
import { CompendiumStore } from './features/_shared/store/'
import { Global } from './features/_shared/store/global'
import { PilotManagementStore } from './features/pilot_management/store/'
import { NpcStore } from './features/encounters/npc/store'

// import gmToolkitModules from './features/encounters/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    global: Global,
    datastore: CompendiumStore,
    management: PilotManagementStore,
    npc: NpcStore,
    // ...gmToolkitModules,
  },
})

export { store, Global, CompendiumStore, PilotManagementStore, NpcStore }
