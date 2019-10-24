// This should be called every app load to manage all housekeeping stuff.
// To the extent possible, the actual work should be kept in the relevant
// class/module, this should be mostly for organization's sake.
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'
import { validateImageFolders } from './ImageManagement'

export default function(userDataPath: string, lancerVer: string, ccVer: string, store: any): void {
  const s = getModule(CompendiumStore, store)
  s.setDatapath(userDataPath)
  s.setVersions(lancerVer, ccVer)
  validateImageFolders()
  s.loadData()
  s.buildLicenses()
}
