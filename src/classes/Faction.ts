import { getImagePath, ImageTag } from '@/io/ImageManagement'

interface IFactionData {
  id: string
  name: string
  description: string
  logo: string
  color: string
  logo_url?: string
}

class Faction {
  private _id: string
  private _name: string
  private _description: string
  private _logo: string
  private _color: string
  private _logo_url?: string

  public constructor(data: IFactionData) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
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

  public get Color(): string {
    return this._color
  }

  public get LogoIsExternal(): boolean {
    return !!this._logo_url
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url
    else if (this._logo) return getImagePath(ImageTag.Logo, `${this._logo}.svg`, true)
    else return '' // TODO: placeholder logo?
  }
}

export { Faction, IFactionData }
