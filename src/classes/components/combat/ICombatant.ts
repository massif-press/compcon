import { SaveController } from '../save/SaveController';
import { StatController } from './stats/StatController';

interface ICombatant {
  SaveController: SaveController;

  SetStats(): void;
}

export type { ICombatant };
