import { SaveController } from '../../save/SaveController'
import { ActiveStatController } from './ActiveStatController'
import { StatController } from './StatController'

interface IStatContainer {
  SaveController: SaveController
  ActiveStatController?: ActiveStatController
  StatController: StatController
}

export { IStatContainer }
