import { getImagePath, ImageTag } from '@/io/ImageManagement';
import { ContentPack } from './ContentPack';

interface IManufacturerData {
  id: string;
  name: string;
  description: string;
  quote: string;
  logo: string;
  light: string;
  dark: string;
  logo_url?: string;
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

  public get LogoIsExternal(): boolean {
    return !!this._logo_url;
  }

  public get Logo(): string {
    if (this._logo_url) return this._logo_url;
    else if (this._logo) return getImagePath(ImageTag.Logo, `${this._logo}.svg`);
    // else if (this._logo) return this._logo
    return ''; // TODO: placeholder logo?
  }

  public get Icon(): string {
    return `cc:${this.ID.toLowerCase().replaceAll(/[^a-zA-Z\d]/g, '')}`;
  }

  public get isSvg(): boolean {
    const filenameQuery = this.Logo.split('/').slice(-1)[0];
    const filename = filenameQuery.split('?')[0];
    const isSvg = filename.endsWith('.svg');
    return isSvg;
  }

  public get isCorsSafe(): boolean {
    return this._is_cors_safe;
  }

  async setCorsSafe() {
    let corsSafe = false;
    try {
      const response = await fetch(this.Logo);
      corsSafe = response.ok;
    } catch (e) {
      corsSafe = false;
    }
    // Vue.set(this, '_is_cors_safe', corsSafe);
    return corsSafe;
  }
}

export { Manufacturer };
export type { IManufacturerData };
