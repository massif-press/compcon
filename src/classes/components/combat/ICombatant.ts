import { SaveController } from '../save/SaveController'
import { CombatController } from './CombatController'

interface ICombatant {
  CombatController: CombatController
  SaveController: SaveController
  CurrentStats: any
  Stats: any
  Items: any[]
}

export { ICombatant }
