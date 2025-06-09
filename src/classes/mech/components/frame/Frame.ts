import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { ContentPack, LicensedItem } from '../../../../class';
import { IContentPack, ILicensedItemData } from '../../../../interface';
import { ImageTag, getImagePath } from '../../../../io/ImageManagement';
import { MechType, MountType, ItemType } from '../../../enums';
import { ICoreData, CoreSystem } from './CoreSystem';
import { FrameTrait, IFrameTraitData } from './FrameTrait';
import { CompendiumStore } from '@/stores';

interface IFrameStats {
  size: number;
  structure: number;
  stress: number;
  armor: number;
  hp: number;
  evasion: number;
  edef: number;
  heatcap: number;
  repcap: number;
  sensor_range: number;
  tech_attack: number;
  save: number;
  speed: number;
  sp: number;
}

interface IFrameData extends ILicensedItemData {
  mechtype: MechType[];
  license_level: number;
  mounts: MountType[];
  stats: IFrameStats;
  traits: IFrameTraitData[];
  core_system: ICoreData;
  specialty: boolean | { source: string; min_rank: number; cumulative?: boolean };
  variant?: string;
  y_pos?: number;
  image_url?: string;
  other_art?: { tag?: ImageTag; src?: string; url?: string }[];
}

class FrameComparison {
  public HP: number = 0;
  public Evasion: number = 0;
  public EDefense: number = 0;
  public HeatCap: number = 0;
  public SensorRange: number = 0;
  public TechAttack: number = 0;
  public RepCap: number = 0;
  public SaveTarget: number = 0;
  public Speed: number = 0;
  public SP: number = 0;
}

class Frame extends LicensedItem implements IFeatureContainer {
  public readonly MechType: MechType[];
  public readonly YPosition: number;
  public readonly Mounts: MountType[];
  public readonly Traits: FrameTrait[];
  public readonly CoreSystem: CoreSystem;
  public readonly OtherArt?: { tag?: ImageTag; src?: string; url?: string }[];
  public readonly Specialty: boolean | { source: string; min_rank: number; cumulative?: boolean };
  public readonly Variant: string;
  private _image_url?: string;
  private _stats: IFrameStats;
  public Comparator?: FrameComparison;

  public constructor(frameData: IFrameData, pack?: ContentPack) {
    super(frameData, pack);
    this.MechType = frameData.mechtype;
    this.YPosition = frameData.y_pos || 30;
    this.Mounts = frameData.mounts;
    this._stats = frameData.stats;
    this.Traits = frameData.traits
      .map((x) => new FrameTrait(x))
      .sort((a, b) => a.weight + b.weight);
    this.CoreSystem = new CoreSystem(frameData.core_system);
    this.ItemType = ItemType.Frame;
    this._image_url = frameData.image_url;
    this.OtherArt = frameData.other_art;
    this.Specialty = frameData.specialty || false;
    this.Variant = frameData.variant || '';
    this.Comparator = new FrameComparison();
  }

  get FeatureSource(): any[] {
    return [this as any, this.CoreSystem].concat(this.Traits.flatMap((x) => x as any));
  }

  public get MechTypeString(): string {
    if (this.MechType.length === 1) return this.MechType[0];
    return `${this.MechType[0]} / ${this.MechType[1]}`;
  }

  public get Stats(): IFrameStats {
    return this._stats;
  }

  public get Size(): number {
    return Number(this._stats.size);
  }

  public get SizeIcon(): string {
    return `cc:size_${this.Size === 0.5 ? 'half' : this.Size}`;
  }

  public get Armor(): number {
    return Number(this._stats.armor);
  }

  public get Structure(): number {
    return Number(this._stats.structure);
  }

  public get HP(): number {
    return Number(this._stats.hp);
  }

  public get Evasion(): number {
    return Number(this._stats.evasion);
  }

  public get EDefense(): number {
    return Number(this._stats.edef);
  }

  public get HeatStress(): number {
    return Number(this._stats.stress);
  }

  public get HeatCap(): number {
    return Number(this._stats.heatcap);
  }

  public get RepCap(): number {
    return Number(this._stats.repcap);
  }

  public get SensorRange(): number {
    return Number(this._stats.sensor_range);
  }

  public get TechAttack(): number {
    return Number(this._stats.tech_attack);
  }

  public get SaveTarget(): number {
    return Number(this._stats.save);
  }

  public get Speed(): number {
    return Number(this._stats.speed);
  }

  public get SP(): number {
    return Number(this._stats.sp);
  }

  public get DefaultImage(): string {
    if (this._image_url) return this._image_url;
    return getImagePath(ImageTag.Mech, `${this.ID}.png`);
  }

  public NormalizedStats() {
    const Frames = CompendiumStore().Frames.filter((x) => !x.IsHidden);
    const output = {
      HP: 0,
      Armor: 0,
      RepCap: 0,
      Evasion: 0,
      Speed: 0,
      EDefense: 0,
      TechAttack: 0,
      SP: 0,
      HeatCap: 0,
      SensorRange: 0,
      SaveTarget: 0,
    };

    const normalize = (val, min, max) => {
      if (max === min) return 10;
      return ((val - min) / (max - min)) * 90 + 10;
    };

    Object.keys(output).forEach((v) => {
      const vMax = Math.max(...Frames.map((x) => x[v]));
      const vMin = Math.min(...Frames.map((x) => x[v]));
      output[v] = normalize(this[v], vMin, vMax);
    });
    return output;
  }
}

export { Frame, FrameComparison };
export type { IFrameData, IFrameStats };
