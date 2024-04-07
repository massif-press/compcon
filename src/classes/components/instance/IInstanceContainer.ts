import { SaveController } from '../save/SaveController';
import { InstanceController } from './InstanceController';

interface IInstanceContainer {
  InstanceController: InstanceController;
  SaveController: SaveController;
}

export type { IInstanceContainer };
