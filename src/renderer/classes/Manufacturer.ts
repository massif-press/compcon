import { store } from '@/store'

interface IManufacturerData {
  id: string
  name: string
  description: string
  quote: string
  logo: string
  color: string
}

class Manufacturer {
  private _id: string
  private _name: string
  private _description: string
  private _quote: string
  private _logo: string
  private _color: string

  public constructor(data: IManufacturerData) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
    this._quote = data.quote
    this._logo = data.logo
    this._color = data.color
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

  public get Logo(): string {
    return `${store.getters.getUserPath}/img/default_logo/${this._logo}.svg`
  }

  public get LogoSRC(): string {
    return `file://${store.getters.getUserPath}/img/default_logo/${this._logo}.svg`
  }
}

export { Manufacturer, IManufacturerData }
