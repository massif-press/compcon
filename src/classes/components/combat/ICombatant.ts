import { SaveController } from '../save/SaveController';
import { StatController } from './stats/StatController';

interface ICombatant {
  StatController: StatController;
  SaveController: SaveController;
}

export type { ICombatant };
