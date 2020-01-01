import { getImagePath, ImageTag } from '@/io/ImageManagement'

interface IManufacturerData {
  id: string
  name: string
  description: string
  quote: string
  logo: string
  color: string
  logo_url?: string
}

class Manufacturer {
  private _id: string
  private _name: string
  private _description: string
  private _quote: string
  private _logo: string
  private _color: string
  private _logo_url?: string

  public constructor(data: IManufacturerData) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
    this._quote = data.quote
    this._logo = data.logo
    this._color = data.color
    this._logo_url = data.logo_url
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Description(): string {
    return this._description
  }

  public get Quote(): string {
    return this._quote
  }

  public get Color(): string {
    return this._color
  }

  public get LogoIsExternal(): boolean {
    return !!this._logo_url
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url
    return getImagePath(ImageTag.Logo, `${this._logo}.svg`, true)
  }
}

export { Manufacturer, IManufacturerData }
