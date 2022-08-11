import { FeatureController } from '../../feature/FeatureController'
import { SaveController } from '../../save/SaveController'
import { CounterController } from './CounterController'

interface ICounterContainer {
  CounterController: CounterController
  SaveController: SaveController
}

export { ICounterContainer }
