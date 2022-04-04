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
    .then(cognitoUser => {
      userstore.setAws({ cognitoUser })
    })
    .catch(() => {
      userstore.loadUser()
    })

  await dataStore.refreshExtraContent()
  const missing = { pilots: [], npcs: [] }
  await pilotStore.loadPilots()
  missing.pilots = pilotStore.MissingContent
  await npcStore.loadNpcs()
  missing.npcs = npcStore.MissingContent
  await dataStore.setMissingContent(missing)
  console.log(dataStore.MissingContent)

  await encounterStore.loadEncounters()
  await missionStore.loadMissions()
  await missionStore.loadActiveMissions()

  console.info('loading complete')
}
