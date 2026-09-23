import type { Mech } from '../../mech/Mech'
import { ImageTag } from '@/io/ImageManagement'
import type { IPortraitContainer } from './IPortraitContainer'
import { assertController } from '../../utility/assertController'
import type { IControllerStatic } from '@/classes/ISerializable'

interface IPortraitData {
  portrait: string
  avatar?: any
  cloud_portrait: string
}

interface IImageContainer {
  SetCloudImage(): any
  Image: string
}

class PortraitController {
  public readonly Parent: IPortraitContainer

  private _portrait: string
  private _avatar?: any
  private _cloud_portrait: string

  public constructor(parent: IPortraitContainer) {
    this.Parent = parent
    this._portrait = ''
    this._cloud_portrait = ''
  }

  public static NewPortraitData(): IPortraitData {
    return {
      portrait: '',
      avatar: undefined,
      cloud_portrait: '',
    }
  }

  public get HasImage(): boolean {
    return this._portrait !== '' || this._cloud_portrait !== ''
  }

  public get Image(): string {
    return this.Portrait
  }

  public get Avatar(): any {
    return this._avatar
  }

  public set Avatar(data: any) {
    this._avatar = data
    this.Parent.SaveController.save()
  }

  public get Portrait(): string {
    if (this._cloud_portrait) return this._cloud_portrait
    if (!this.Parent.ImageTag) return '/img/pilot/nodata.webp'
    else if (this._portrait) return this._portrait
    else if (this.Parent.ImageTag === ImageTag.Mech) {
      return (this.Parent as Mech).Frame.DefaultImage
    } else return '/img/pilot/nodata.webp'
  }

  public get CloudImage(): string {
    return this._cloud_portrait
  }

  public set CloudImage(src: string) {
    this._cloud_portrait = src
    this.Parent.SaveController.save()
  }

  public SetCloudImage(src: string): void {
    this._cloud_portrait = src
    this.Parent.SaveController.save()
  }

  public Clear(): void {
    this._portrait = ''
    this._cloud_portrait = ''
    this._avatar = undefined
    this.Parent.SaveController.save()
  }

  public static Serialize(parent: IPortraitContainer, target: any) {
    if (!target.img) target.img = {}
    target.img.portrait = parent.PortraitController._portrait
    target.img.avatar = parent.PortraitController._avatar
    target.img.cloud_portrait = parent.PortraitController._cloud_portrait
  }

  public static Deserialize(parent: IPortraitContainer, data: IPortraitData) {
    assertController(parent.PortraitController, 'PortraitController')

    if (!data) return

    parent.PortraitController._portrait = data.portrait || ''
    parent.PortraitController._avatar = data.avatar ? data.avatar : undefined
    parent.PortraitController._cloud_portrait = data.cloud_portrait || ''
  }
}

PortraitController satisfies IControllerStatic<IPortraitContainer, IPortraitData>
export { PortraitController }
export type { IPortraitData, IImageContainer }
