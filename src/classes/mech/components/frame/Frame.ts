import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { LicensedItem } from '../../../../class';
import { ILicensedItemData } from '../../../../interface';
import { ImageTag, getImagePath } from '../../../../io/ImageManagement';
import { MechType, MountType, ItemType } from '../../../enums';
import { ITagCompendiumData } from '../../../Tag';
import { ICoreData, CoreSystem } from './CoreSystem';
import { FrameTrait, IFrameTraitData } from './FrameTrait';

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
  public static readonly EvasionMultiplier: number = 3;
  public static readonly EdefenseMultiplier: number = 2;

  public static readonly MainMultiplier: number = 2;
  public static readonly HeavyMultiplier: number = 3.5;
  public static readonly AuxAuxMultiplier: number = 1.5;
  public static readonly AuxMultiplier: number = 1;
  public static readonly MainAuxMultiplier: number = 2.5;
  public static readonly FlexMultiplier: number = 3;
  public static readonly IntegratedMultiplier: number = 2;

  public Survivability: number = 1;
  public readonly SurvivabilityRaw: number;
  public Mobility: number = 1;
  public readonly MobilityRaw: number;
  public Offense: number = 1;
  public readonly OffenseRaw: number;
  public Utility: number = 1;
  public readonly UtilityRaw: number;

  public HP: number = 1;
  public Evasion: number = 1;
  public EDefense: number = 1;
  public HeatCap: number = 1;
  public SensorRange: number = 1;
  public TechAttack: number = 1;
  public RepCap: number = 1;
  public SaveTarget: number = 1;
  public Speed: number = 1;
  public SP: number = 1;

  public constructor(frame: Frame) {
    this.SurvivabilityRaw =
      (frame.HP * frame.Armor * frame.Structure +
        frame.HP * frame.RepCap +
        frame.HeatCap * frame.HeatStress +
        frame.Evasion * FrameComparison.EvasionMultiplier +
        frame.EDefense *
          FrameComparison.EdefenseMultiplier *
          Math.max(frame.SaveTarget - 10, 0.9)) /
      (Math.max(frame.Size, 0.8) * 0.9);
    this.MobilityRaw = frame.Speed * (frame.HeatCap * frame.HeatStress);
    this.OffenseRaw =
      frame.TechAttack * 5 +
      frame.SP * 3 +
      frame.Mounts.map((x) => this.mScore(frame, x)).reduce((a, b) => a + b, 0);
    this.UtilityRaw =
      frame.SensorRange * 3 + frame.RepCap * 2 + frame.SP * 5 * Math.max(frame.TechAttack, 1);
  }

  mScore(frame: Frame, mountType: MountType) {
    return (
      frame.Mounts.filter((x) => x === mountType).length *
      FrameComparison[`${mountType.replace('/', '')}Multiplier`]
    );
  }

  public static NormalizeReferenceSet(Frames: Frame[]) {
    const normalize = (val, valMin, valMax, min, max) =>
      ((val - valMin) / (valMax - valMin)) * (max - min) + min + 1;

    const combatVals = ['Survivability', 'Mobility', 'Offense', 'Utility'];
    combatVals.forEach((v) => {
      const vMax = Math.max(...Frames.map((x) => x.Comparator![`${v}Raw`]));
      const vMin = Math.min(...Frames.map((x) => x.Comparator![`${v}Raw`]));
      Frames.forEach((x) => {
        x.Comparator![v] = x.Comparator![v] = normalize(x.Comparator![`${v}Raw`], vMin, vMax, 0, 1);
      });
    });

    const statVals = [
      'HP',
      'Armor',
      'Evasion',
      'EDefense',
      'HeatCap',
      'SensorRange',
      'TechAttack',
      'RepCap',
      'SaveTarget',
      'Speed',
      'SP',
    ];
    statVals.forEach((v) => {
      const vMax = Math.max(...Frames.map((x) => x[v]));
      const vMin = Math.min(...Frames.map((x) => x[v]));
      Frames.forEach((x) => {
        x.Comparator![v] = Math.floor(normalize(x[v], vMin, vMax, 0, 100) + 10);
      });
    });
  }
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

  public constructor(frameData: IFrameData, packTags?: ITagCompendiumData[], packName?: string) {
    super(frameData, packTags, packName);
    this.MechType = frameData.mechtype;
    this.YPosition = frameData.y_pos || 30;
    this.Mounts = frameData.mounts;
    this._stats = frameData.stats;
    this.Traits = frameData.traits.map((x) => new FrameTrait(x));
    this.CoreSystem = new CoreSystem(frameData.core_system);
    this.ItemType = ItemType.Frame;
    this._image_url = frameData.image_url;
    this.OtherArt = frameData.other_art;
    this.Specialty = frameData.specialty || false;
    this.Variant = frameData.variant || '';
    this.Comparator = new FrameComparison(this);
  }

  get FeatureSource(): any[] {
    return [this as any, this.CoreSystem].concat(this.Traits.flatMap((x) => x as any));
  }

  public get IsVariantFrame(): boolean {
    return this.Variant != '';
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
}

export { Frame, FrameComparison };
export type { IFrameData, IFrameStats };
