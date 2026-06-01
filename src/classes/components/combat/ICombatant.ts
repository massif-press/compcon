import { FeatureController } from '../feature/FeatureController';
import { SaveController } from '../save/SaveController';
import { CombatController } from './CombatController';

interface ICombatant {
  IsEncounterInstance: boolean;
  ID: string;
  Name: string;
  ItemType: string;
  SaveController: SaveController;
  FeatureController: FeatureController;
  CombatController: CombatController;

  SetStats(): void;

  Callsign?: string;
  Icon?: string;
  Portrait?: string;
  Tag?: string;
  TagIcon?: string;
  Mechname?: string;
  PlaceholderType?: string;
  Notes?: string;
  DefaultName?: string;
  Tier?: number;
  ActiveLayerIndex?: number;
  IsLinked?: boolean;
  IsNameless?: boolean;
  StatController?: any;
  ActiveMech?: any;
  ActiveLayer?: any;
  Layers?: any;
  Mechs?: any;
  Loadout?: any;
  Class?: any;
  LcpConfig?: any;
  NpcClassController?: any;
  NpcFeatureController?: any;
  NpcTemplateController?: any;
  PilotLoadoutController?: any;
  MechLoadoutController?: any;
  ReservesController?: any;
  PortraitController?: any;
  GetLinkedItem?: (...args: any[]) => any;
  SetLayerHp?: (...args: any[]) => any;
}

export type { ICombatant };
