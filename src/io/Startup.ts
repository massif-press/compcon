// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import { SetTheme } from '@/classes/utility/ThemeManager'
import {
  CompendiumStore,
  PilotManagementStore,
  NpcStore,
  EncounterStore,
  MissionStore,
  UserStore,
  CharacterStore,
  LocationStore,
  FactionStore,
} from '@/store'
import { Auth } from '@aws-amplify/auth'
import { getModule } from 'vuex-module-decorators'

export default async function (
  lancerVer: string,
  ccVer: string,
  store: any,
  vuetify?: any
): Promise<void> {
  navigator.storage.estimate().then(res => console.log(res))
  const hasPersist = await navigator.storage.persist()
  // TODO: throw toast
  if (!hasPersist) console.error('No storage persistance!')

  // TODO: if c/c items exist in localstorage, move them into localforage

  const dataStore = getModule(CompendiumStore, store)
  const userstore = getModule(UserStore, store)
  const pilotStore = getModule(PilotManagementStore, store)
  const npcStore = getModule(NpcStore, store)
  const encounterStore = getModule(EncounterStore, store)
  const missionStore = getModule(MissionStore, store)
  const characterStore = getModule(CharacterStore, store)
  const locationStore = getModule(LocationStore, store)
  const factionStore = getModule(FactionStore, store)

  await dataStore.setVersions(lancerVer, ccVer)

  Auth.currentAuthenticatedUser()
    .then(cognitoUser => {
      userstore.setAws({ cognitoUser }).then(() => {
        if (vuetify) SetTheme(userstore.UserProfile.Theme, vuetify.framework)
      })
    })
    .catch(() => {
      userstore.loadUser().then(() => {
        if (vuetify) SetTheme(userstore.UserProfile.Theme, vuetify.framework)
      })
    })

  await dataStore.refreshExtraContent()
  const missing = { pilots: [], npcs: [] }
  await pilotStore.loadPilots()
  missing.pilots = pilotStore.MissingPilots
  await npcStore.loadNpcs()
  missing.npcs = npcStore.MissingNpcs
  await dataStore.setMissingContent(missing)

  await encounterStore.loadEncounters()
  await missionStore.loadMissions()
  await missionStore.loadActiveMissions()
  await characterStore.loadCharacters()
  await locationStore.loadLocations()
  await factionStore.loadFactions()

  console.info('loading complete')
}
