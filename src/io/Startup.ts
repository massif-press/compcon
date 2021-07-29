// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import {
  CompendiumStore,
  PilotManagementStore,
  NpcStore,
  EncounterStore,
  MissionStore,
  UserStore,
} from '@/store'
import { Auth } from '@aws-amplify/auth'
import { getModule } from 'vuex-module-decorators'

export default async function (lancerVer: string, ccVer: string, store: any): Promise<void> {
  const dataStore = getModule(CompendiumStore, store)
  const userstore = getModule(UserStore, store)
  const pilotStore = getModule(PilotManagementStore, store)
  const npcStore = getModule(NpcStore, store)
  const encounterStore = getModule(EncounterStore, store)
  const missionStore = getModule(MissionStore, store)

  await dataStore.setVersions(lancerVer, ccVer)

  await Auth.currentAuthenticatedUser()
    .then(user => {
      userstore.setAws(user, 'appLoad')
    })
    .catch(() => {
      userstore.loadUser()
    })

  await dataStore.loadExtraContent()
  await pilotStore.loadPilots()
  await npcStore.loadNpcs()
  await encounterStore.loadEncounters()
  await missionStore.loadMissions()
  await missionStore.loadActiveMissions()
  await store.dispatch('character/loadCharacters')
  await store.dispatch('location/loadLocations')
  await store.dispatch('faction/loadFactions')


  console.info('loading complete')
}
