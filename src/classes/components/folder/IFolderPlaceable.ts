import { SaveController } from '../save/SaveController';
import { FolderController } from './FolderController';

interface IFolderPlaceable {
  FolderController: FolderController;
  SaveController: SaveController;
}

export type { IFolderPlaceable };
