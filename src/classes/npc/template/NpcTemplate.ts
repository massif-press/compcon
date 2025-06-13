import { CompendiumStore } from '@/stores';
import { NpcFeature } from '../feature/NpcFeature';
import _ from 'lodash';
import { ContentPack } from '@/class';

interface INpcTemplateData {
  id: string;
  name: string;
  description?: string;
  tactics?: string;
  forceTag?: string;
  prohibitTemplates?: string[];

  optionalMin?: number;
  optionalMax?: number;
  optionalPerTier?: number;
  optionalClassMin?: number;
  optionalClassMax?: number;
  optionalClassPerTier?: number;

  caveat?: string;
  brew?: string;
}

class NpcTemplate {
  public readonly Data: INpcTemplateData;

  public InLcp: boolean = true;
  public readonly ItemType = 'NpcTemplate';
  private _id: string;
  private _name: string;
  private _description: string;
  private _tactics: string;
  public readonly ForceTag: string;
  public readonly ProhibitTemplates: string[];

  public readonly OptionalMin: number;
  public readonly OptionalMax: number;
  public readonly OptionalPerTier: number;
  public readonly OptionalClassMin: number;
  public readonly OptionalClassMax: number;
  public readonly OptionalClassPerTier: number;
  public readonly FreeOptions: boolean;
  public readonly LcpName: string;

  public constructor(data: INpcTemplateData, pack?: ContentPack) {
    this.Data = data;
    this._id = data.id;
    this._name = data.name;
    this._description = data.description || '';
    this._tactics = data.tactics || '';

    this.ForceTag = data.forceTag || '';
    this.ProhibitTemplates = data.prohibitTemplates || [];

    this.LcpName = pack?.Name || 'LANCER Core NPCs';

    this.OptionalMin = data.optionalMin || 0;
    this.OptionalMax = data.optionalMax || 0;
    this.OptionalPerTier = data.optionalPerTier || 0;
    this.OptionalClassMin = data.optionalClassMin || 0;
    this.OptionalClassMax = data.optionalClassMax || 0;
    this.OptionalClassPerTier = data.optionalClassPerTier || 0;

    this.FreeOptions = !this.OptionalMin && !this.OptionalMax && !this.OptionalPerTier;
  }

  public get ID(): string {
    return this._id;
  }

  public get Name(): string {
    return this._name;
  }

  public get Description(): string {
    return this._description;
  }

  public get Terse(): string {
    return this.Description.split('.').slice(0, 2).join(' ') + '.';
  }

  public get Tactics(): string {
    return this._tactics;
  }

  public get FeatureSelectionInfo(): string {
    let out = '';
    if (!this.OptionalFeatures.length) return out;
    if (!this.OptionalMax && !this.OptionalMin)
      out += `When choosing optional systems, the ${this.Name} can also choose from the ${this.Name} Template Optional Features list.`;
    else {
      out += `The ${this.Name} ${this.OptionalMax ? 'chooses' : 'may choose'} `;
      if (this.OptionalMin === this.OptionalMax) out += `${this.OptionalMin} `;
      else out += `between ${this.OptionalMin} and ${this.OptionalMax} `;
      out += `option${this.OptionalMax > 1 ? 's' : ''} from the ${
        this.Name
      } Template Optional Features list`;
    }

    if (this.OptionalPerTier) {
      out += ` The ${this.Name} can choose ${
        this.OptionalPerTier > 1
          ? `${this.OptionalPerTier} additional optional features`
          : 'an additional optional feature'
      } per NPC Tier`;
    }

    return out;
  }

  public get ClassFeatureSelectionInfo(): string {
    if (!this.OptionalClassMin) return '';
    let out = `The ${this.Name} chooses `;
    if (this.OptionalClassMin === this.OptionalClassMax) out += `${this.OptionalClassMin} `;
    else out += `between ${this.OptionalClassMin} and ${this.OptionalClassMax} `;
    out += `additional optional feature${this.OptionalClassMax > 1 ? 's' : ''} from their class ${
      this.OptionalClassPerTier ? 'per NPC Tier' : ''
    }`;

    return out;
  }

  public get Features(): NpcFeature[] {
    return CompendiumStore()
      .getItemCollection('NpcFeatures')
      .filter((x) => x.Origin.ID === this.ID);
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.Features.filter((x) => x.Base && !x.Deprecated);
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this.Features.filter((x) => !x.Base && !x.Deprecated);
  }

  public get Icon(): string {
    return 'cc:npc_template';
  }
}

export { NpcTemplate };
export type { INpcTemplateData };
