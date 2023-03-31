import { SaveController } from '../save/SaveController';
import { CombatController } from './CombatController';
import { IStateController } from './IStateController';

interface ICombatant {
  SaveController: SaveController;
  CombatController: CombatController;
  StateController: IStateController;
  CurrentStats: any;
  Stats: any;
  Items: any[];
}

export type { ICombatant };
