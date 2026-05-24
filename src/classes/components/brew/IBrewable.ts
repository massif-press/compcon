import { CompendiumItem } from '../../CompendiumItem'
import { BrewController } from './BrewController';
import { SaveController } from '../save/SaveController';

interface IBrewable {
  SaveController: SaveController;
  BrewController: BrewController;
  BrewableCollection: CompendiumItem[];
}

export type { IBrewable };
