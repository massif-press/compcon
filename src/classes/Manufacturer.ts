import { getImagePath, ImageTag } from '@/io/ImageManagement';
import { ContentPack } from './ContentPack';
import DOMPurify from 'dompurify';

interface IManufacturerData {
  id: string;
  name: string;
  description: string;
  quote: string;
  logo: string;
  light: string;
  dark: string;
  logo_url?: string;
  svg?: string;
}

class Manufacturer {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly Quote: string;
  public readonly Light: string;
  public readonly Dark: string;
  public readonly InLcp: boolean;
  public readonly LcpName: string;
  public IsHidden: boolean;
  private _logo_svg: string;
  private _logo: string;
  private _logo_url?: string;
  private _is_cors_safe: boolean;

  public constructor(data: IManufacturerData, lcp?: ContentPack) {
    this.ID = data.id.toUpperCase();
    this.Name = data.name;
    this.Description = data.description;
    this.Quote = data.quote;
    this.Light = data.light;
    this.Dark = data.dark;
    this._logo = data.logo;
    this._logo_url = data.logo_url;
    this._logo_svg = data.svg ? DOMPurify.sanitize(data.svg) : '';
    this._is_cors_safe = false;
    this.IsHidden = false;
    this.InLcp = !!lcp;
    this.LcpName = lcp?.Name || 'Lancer Core Book';
  }

  public get Color(): string {
    return this.Light ? this.Light : 'grey';
  }

  public GetColor(dark?: boolean): string {
    return dark ? this.Dark : this.Light;
  }

  public get Svg(): string {
    return this._logo_svg;
  }

  public get LogoIsExternal(): boolean {
    return !this.Svg && !!this._logo_url;
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url;
    else if (this._logo) return `/img/logo/${this._logo}.svg`;
    // else if (this._logo) return this._logo
    return ''; // TODO: placeholder logo?
  }

  public get Icon(): string {
    return `cc:${this.ID.toLowerCase().replaceAll(/[^a-zA-Z\d]/g, '')}`;
  }

  public get isExternalSvg(): boolean {
    const filenameQuery = this.Logo.split('/').slice(-1)[0];
    const filename = filenameQuery.split('?')[0];
    const isSvg = filename.endsWith('.svg');
    return isSvg;
  }

  public get isCorsSafe(): boolean {
    return this._is_cors_safe;
  }

  async setCorsSafe() {
    try {
      const response = await fetch(this.Logo);
      this._is_cors_safe = response.ok;
    } catch (e) {
      this._is_cors_safe = false;
    }
  }
}

export { Manufacturer };
export type { IManufacturerData };
