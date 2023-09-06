import { SaveController } from './SaveController';

interface ISaveable {
  SaveController: SaveController;

  Name: string;
  ID: string;
  ItemType: string;

  Clone(): ISaveable;
}

export type { ISaveable };
