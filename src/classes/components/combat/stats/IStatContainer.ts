import { SaveController } from '../../save/SaveController';
import { StatController } from './StatController';

interface IStatContainer {
  StatController: StatController;
  AdditionalStats?: string[];
  SaveController: SaveController;
}

export type { IStatContainer };
