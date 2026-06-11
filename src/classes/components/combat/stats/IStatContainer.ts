import { SaveController } from '../../save/SaveController'
import { StatController } from './StatController'

interface IStatContainer {
  StatController: StatController
  AdditionalStats?: string[]
  SaveController: SaveController
  Parent?: any
}

export type { IStatContainer }
