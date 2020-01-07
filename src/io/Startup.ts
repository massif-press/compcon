// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import {
  CompendiumStore,
  PilotManagementStore,
  NpcStore,
  EncounterStore,
  MissionStore,
} from '@/store'
import { getModule } from 'vuex-module-decorators'
import { validateImageFolders } from './ImageManagement'
import { ensureDataDir } from './Data'

export default function(lancerVer: string, ccVer: string, store: any): void {
  ensureDataDir()

  const dataStore = getModule(CompendiumStore, store)
  dataStore.setVersions(lancerVer, ccVer)
  dataStore.loadData()
  dataStore.loadExtraContent()

  validateImageFolders()

  const pilotStore = getModule(PilotManagementStore, store)
  pilotStore.loadPilots()

  const npcStore = getModule(NpcStore, store)
  npcStore.loadNpcs()

  const encounterStore = getModule(EncounterStore, store)
  encounterStore.loadEncounters()

  const missionStore = getModule(MissionStore, store)
  missionStore.loadMissions()
  missionStore.loadActiveMissions()

  // TODO: In browser, save active pilot & mech IDs, reconstitute them here
  // TODO: Move GM toolkit data loading here
}
