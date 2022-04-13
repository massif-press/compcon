import { CompendiumItem } from '@/class'
import { BrewController } from './BrewController'

interface IBrewable {
  BrewController: BrewController
  BrewableCollection: CompendiumItem[]
}

export { IBrewable }
