import { getImagePath, ImageTag } from '@/io/ImageManagement'

interface IManufacturerData {
  id: string
  name: string
  description: string
  quote: string
  logo: string
  light: string
  dark: string
  logo_url?: string
}

class Manufacturer {
  public readonly ID: string
  public readonly Name: string
  public readonly Description: string
  public readonly Quote: string
  public readonly Light: string
  public readonly Dark: string
  public IsHidden: boolean
  private _logo: string
  private _logo_url?: string

  public constructor(data: IManufacturerData) {
    this.ID = data.id.toUpperCase()
    this.Name = data.name
    this.Description = data.description
    this.Quote = data.quote
    this.Light = data.light
    this.Dark = data.dark
    this._logo = data.logo
    this._logo_url = data.logo_url
  }

  public get Color(): string {
    return this.Light ? this.Light : 'grey'
  }

  public GetColor(dark?: boolean): string {
    return dark ? this.Dark : this.Light
  }

  public get LogoIsExternal(): boolean {
    return !!this._logo_url
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url
    else if (this._logo) return getImagePath(ImageTag.Logo, `${this._logo}.svg`)
    else return '' // TODO: placeholder logo?
  }
}

export { Manufacturer, IManufacturerData }
