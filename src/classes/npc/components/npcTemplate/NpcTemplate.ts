import { CompendiumStore } from '@/stores';
import { NpcFeature } from '../..';

export interface INpcTemplateData {
  id: string;
  name: string;
  description: string;
  allowOptional: false;
  forceOptional: boolean;
  optionalMin: number;
  optionalMax: number;
  optionalPerTier: boolean;
  forceClassOptional: boolean;
  optionalClassMin: number;
  optionalClassMax: number;
  optionalClassPerTier: boolean;
  caveat?: string;
  brew: string;
}

export class NpcTemplate {
  private _id: string;
  private _name: string;
  private _description: string;
  private _brew: string;
  public readonly AllowOptional: boolean;
  public readonly ForceOptional: boolean;
  public readonly OptionalMin: number;
  public readonly OptionalMax: number;
  public readonly OptionalPerTier: boolean;
  public readonly ForceClassOptional: boolean;
  public readonly OptionalClassMin: number;
  public readonly OptionalClassMax: number;
  public readonly OptionalClassPerTier: boolean;
  public readonly Caveat: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;

  public constructor(data: INpcTemplateData, packName?: string) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._brew = data.brew || 'CORE';
    this.LcpName = packName || 'Lancer CORE NPCs';
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false;

    this.AllowOptional = data.allowOptional;
    this.ForceOptional = data.forceOptional;
    this.OptionalMin = data.optionalMin;
    this.OptionalMax = data.optionalMax;
    this.OptionalPerTier = data.optionalPerTier;
    this.ForceClassOptional = data.forceClassOptional;
    this.OptionalClassMin = data.optionalClassMin;
    this.OptionalClassMax = data.optionalClassMax;
    this.OptionalClassPerTier = data.optionalClassPerTier;
    this.Caveat = data.caveat || '';
  }

  public get ID(): string {
    return this._id;
  }

  public get Name(): string {
    return this._name;
  }

  public get Power(): number {
    return 0;
  }

  public get Description(): string {
    return this._description;
  }

  public get FeatureSelectionInfo(): string {
    if (!this.OptionalFeatures.length || this.AllowOptional) return '';
    let out = `The ${this.Name} ${
      this.ForceOptional && this.OptionalMin ? 'takes' : 'may take'
    } `;
    if (this.OptionalMin === this.OptionalMax) out += `${this.OptionalMin} `;
    else out += `between ${this.OptionalMin} and ${this.OptionalMax} `;
    out += `optional template feature${this.OptionalMax > 1 ? 's' : ''} ${
      this.OptionalPerTier ? 'per NPC Tier' : ''
    }`;
    return out;
  }

  public get ClassFeatureSelectionInfo(): string {
    if (!this.ForceClassOptional) return '';
    let out = `The ${this.Name} takes `;
    if (this.OptionalClassMin === this.OptionalClassMax)
      out += `${this.OptionalClassMin} `;
    else
      out += `between ${this.OptionalClassMin} and ${this.OptionalClassMax} `;
    out += `additional optional class feature${
      this.OptionalClassMax > 1 ? 's' : ''
    } ${this.OptionalClassPerTier ? 'per NPC Tier' : ''}`;
    return out;
  }

  private get _features(): NpcFeature[] {
    return CompendiumStore().NpcFeatures.filter((x) => x.Origin.ID === this.ID);
  }

  public get BaseFeatures(): NpcFeature[] {
    return this._features.filter((x) => !x.Origin.Optional);
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this._features.filter((x) => x.Origin.Optional);
  }
}
