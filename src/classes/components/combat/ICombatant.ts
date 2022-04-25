import { SaveController } from '../save/SaveController'
import { CombatController } from './CombatController'

interface ICombatant {
  SaveController: SaveController
  CombatController: CombatController
  CurrentStats: any
  Stats: any
  Items: any[]
}

export { ICombatant }
