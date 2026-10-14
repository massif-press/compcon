import { UserStore } from '@/stores'
import type { PlayMode } from '@/classes/encounter/EncounterInstance'

const PLAY_MODE_VIEW_KEY = 'activeModePlayMode'

export function defaultPlayMode(): PlayMode {
  return UserStore().User.View(PLAY_MODE_VIEW_KEY, 'full')
}

export function setDefaultPlayMode(mode: PlayMode): void {
  UserStore().User.SetView(PLAY_MODE_VIEW_KEY, mode)
}
