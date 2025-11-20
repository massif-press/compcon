import { FeatureController } from '../feature/FeatureController';
import { SaveController } from '../save/SaveController';
import { CombatController } from './CombatController';

interface ICombatant {
  ID: string;
  Name: string;
  ItemType: string;
  SaveController: SaveController;
  FeatureController: FeatureController;
  CombatController: CombatController;

  SetStats(): void;
}

export type { ICombatant };
