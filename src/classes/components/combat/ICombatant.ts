import { Mech } from '@/classes/mech/Mech'
import { FeatureController } from '../feature/FeatureController'
import { SaveController } from '../save/SaveController'
import { CombatController } from './CombatController'
import { MechLoadoutController } from '@/classes/mech/components/loadout/MechLoadoutController'
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer'
import { NpcFeatureController } from '@/classes/npc/feature/NpcFeatureController'
import { NpcTemplateController } from '@/classes/npc/template/NpcTemplateController'
import { ReservesController } from '@/classes/pilot/components'
import { PilotLoadoutController } from '@/classes/pilot/components/Loadout/PilotLoadoutController'
import { LcpConfig } from '@/user'
import { PortraitController } from '../portrait/PortraitController'
import { StatController } from './stats/StatController'
import { NpcClassController } from '@/classes/npc/class/NpcClassController'
import { NpcClass } from '@/classes/npc/class/NpcClass'
import { MechLoadout } from '@/classes/mech/components/loadout/MechLoadout'
import { PilotLoadout } from '@/classes/pilot/components/Loadout/PilotLoadout'

interface ICombatant {
  IsEncounterInstance: boolean
  ID: string
  Name: string
  ItemType: string
  SaveController: SaveController
  FeatureController: FeatureController
  CombatController: CombatController
  StatController: StatController

  SetStats(): void

  Callsign?: string
  Icon?: string
  Portrait?: string
  Tag?: string
  TagIcon?: string
  Mechname?: string
  PlaceholderType?: string
  Notes?: string
  DefaultName?: string
  Tier?: number
  ActiveLayerIndex?: number
  IsLinked?: boolean
  IsNameless?: boolean
  ActiveMech?: Mech
  Mechs?: Mech[]
  ActiveLayer?: EidolonLayer
  Layers?: EidolonLayer[]
  Loadout?: MechLoadout | PilotLoadout
  Class?: NpcClass
  LcpConfig?: LcpConfig | null
  NpcClassController?: NpcClassController
  NpcFeatureController?: NpcFeatureController
  NpcTemplateController?: NpcTemplateController
  PilotLoadoutController?: PilotLoadoutController
  MechLoadoutController?: MechLoadoutController
  ReservesController?: ReservesController
  PortraitController?: PortraitController
  GetLinkedItem?: (...args: any[]) => any
  SetLayerHp?: (...args: any[]) => any
  Serialize?: (includeInstance?: boolean) => any
}

export type { ICombatant }
