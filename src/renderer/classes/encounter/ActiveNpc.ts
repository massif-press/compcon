import { Npc, NpcStats } from '@/class'
import { store } from '@/store'
import { NpcItem } from '../npc'

// on create: clone npc, set stats
// serialize/deserialize: handle current stat tracking, destroyed, npc item status

class ActiveNpc {
  private _npc: Npc
  private _currentStats: NpcStats
  private _destroyed: boolean
  private _note: string
  private _side: string
  private _feature_map: NpcItem[]
}
