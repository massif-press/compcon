import { SaveController } from './SaveController'

interface ISaveable {
  SaveController: SaveController

  Name: string
  ID: string
  ItemType: string

}

export { ISaveable }