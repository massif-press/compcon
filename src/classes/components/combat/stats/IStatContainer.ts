import { StatController } from './StatController';

interface IStatContainer {
  StatController: StatController;
  MandatoryStats: string[];
}

export type { IStatContainer };
