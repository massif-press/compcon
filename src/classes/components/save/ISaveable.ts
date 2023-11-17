import { SaveController } from './SaveController';

interface ISaveable {
  SaveController: SaveController;

  Name: string;
  ID: string;
  ItemType: string;
  StorageType: string;

  Clone(): ISaveable;
  Serialize(): Object;
}

export type { ISaveable };
