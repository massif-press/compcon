import { ImageTag } from '@/io/ImageManagement'
import { SaveController } from '../save/SaveController'
import { PortraitController } from './PortraitController'

interface IPortraitContainer {
  SaveController: SaveController
  PortraitController: PortraitController

  ImageTag: ImageTag
  Portrait: string
}

export { IPortraitContainer }
