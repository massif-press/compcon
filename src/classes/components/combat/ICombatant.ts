import { SaveController } from '../save/SaveController';
import { StatController } from './stats/StatController';

interface ICombatant {
  ID: string;
  Name: string;
  SaveController: SaveController;

  SetStats(): void;
}

export type { ICombatant };
