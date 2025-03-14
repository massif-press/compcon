import { SaveController } from '../../save/SaveController';
import { StatController } from './StatController';

interface IStatContainer {
  StatController: StatController;
  MandatoryStats: string[];

  SaveController: SaveController;
}

export type { IStatContainer };
