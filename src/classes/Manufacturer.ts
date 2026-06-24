import { ContentPack } from './ContentPack'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import DOMPurify from 'dompurify'
import { localize } from '@/i18n/localize'

interface IManufacturerData {
  id: string
  name: string
  description: string
  quote: string
  logo: string
  light: string
  dark: string
  logo_url?: string
  svg?: string
}

class Manufacturer implements ILcpTracked {
  public readonly ID: string
  private _name: string
  private _description: string
  private _quote: string
  public readonly Light: string
  public readonly Dark: string
  public InLcp: boolean = false
  public LcpName: string = ''
  public readonly ItemType: ItemType = ItemType.Manufacturer
  public IsHidden: boolean
  private _logo_svg: string
  private _logo: string
  private _logo_url?: string

  public constructor(data: IManufacturerData, lcp?: ContentPack) {
    this.ID = data.id.toUpperCase()
    this._name = data.name
    this._description = data.description
    this._quote = data.quote
    this.Light = data.light
    this.Dark = data.dark
    this._logo = data.logo
    this._logo_url = data.logo_url
    if (this._logo_url?.includes('?raw=1')) {
      this._logo_url = this._logo_url.split('?raw=1')[0]
      this._logo_url = this._logo_url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    }
    this._logo_svg = data.svg ? DOMPurify.sanitize(data.svg) : ''
    this.IsHidden = false
    applyLcpTracking(this, lcp)
  }

  public get Name(): string { return localize(this.ID, 'name', this._name) }
  public get Description(): string { return localize(this.ID, 'description', this._description) }
  public get Quote(): string { return localize(this.ID, 'quote', this._quote) }

  public get Color(): string {
    return this.Light ? this.Light : 'grey'
  }

  public GetColor(dark?: boolean): string {
    return dark ? this.Dark : this.Light
  }

  public get Svg(): string {
    return this._logo_svg
  }

  public get LogoIsExternal(): boolean {
    return !this.Svg && !!this._logo_url
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url
    else if (this._logo) return `/img/logo/${this._logo}.svg`
    return '/img/logo/generic.svg'
  }

  public get Icon(): string {
    return `cc:${this.ID.toLowerCase().replaceAll(/[^a-zA-Z\d]/g, '')}`
  }

  public get isExternalSvg(): boolean {
    const filenameQuery = this.Logo.split('/').slice(-1)[0]
    const filename = filenameQuery.split('?')[0]
    const isSvg = filename.endsWith('.svg')
    return isSvg
  }
}

export { Manufacturer }
export type { IManufacturerData }
