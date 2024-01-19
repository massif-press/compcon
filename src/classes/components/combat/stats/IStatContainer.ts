import { SaveController } from '../../save/SaveController';
import { StatController } from './StatController';

interface IStatContainer {
  SaveController: SaveController;
  StatController: StatController;
  MandatoryStats: string[];
}

export type { IStatContainer };
