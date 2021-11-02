import { LicensedItem, MountType, ItemType, MechType, CoreSystem } from '@/class'
import { ILicensedItemData, ICoreData, ITagCompendiumData } from '@/interface'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { FrameTrait, IFrameTraitData } from './FrameTrait'

interface IFrameStats {
  size: number
  structure: number
  stress: number
  armor: number
  hp: number
  evasion: number
  edef: number
  heatcap: number
  repcap: number
  sensor_range: number
  tech_attack: number
  save: number
  speed: number
  sp: number
}

interface IFrameData extends ILicensedItemData {
  mechtype: MechType[]
  license_level: number
  mounts: MountType[]
  stats: IFrameStats
  traits: IFrameTraitData[]
  core_system: ICoreData
  specialty: boolean | { source: string; min_rank: number; cumulative?: boolean }
  variant?: string
  y_pos?: number
  image_url?: string
  other_art?: { tag?: ImageTag; src?: string; url?: string }[]
}

class Frame extends LicensedItem {
  public readonly MechType: MechType[]
  public readonly YPosition: number
  public readonly Mounts: MountType[]
  public readonly Traits: FrameTrait[]
  public readonly CoreSystem: CoreSystem
  public readonly OtherArt?: { tag?: ImageTag; src?: string; url?: string }[]
  public readonly Specialty: boolean | { source: string; min_rank: number; cumulative?: boolean }
  public readonly Variant: string
  private _image_url?: string
  private _stats: IFrameStats

  public constructor(frameData: IFrameData, packTags?: ITagCompendiumData[], packName?: string) {
    super(frameData, packTags, packName)
    this.MechType = frameData.mechtype
    this.YPosition = frameData.y_pos || 30
    this.Mounts = frameData.mounts
    this._stats = frameData.stats
    this.Traits = frameData.traits.map(x => new FrameTrait(x))
    this.CoreSystem = new CoreSystem(frameData.core_system)
    this.ItemType = ItemType.Frame
    this._image_url = frameData.image_url
    this.OtherArt = frameData.other_art
    this.Specialty = frameData.specialty || false
    this.Variant = frameData.variant || ''
  }

  public get IsVariantFrame(): boolean {
    return this.Variant != ''
  }

  public get MechTypeString(): string {
    if (this.MechType.length === 1) return this.MechType[0]
    return `${this.MechType[0]} / ${this.MechType[1]}`
  }

  public get Size(): number {
    return Number(this._stats.size)
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Size === 0.5 ? 'half' : this.Size}`
  }

  public get Armor(): number {
    return Number(this._stats.armor)
  }

  public get Structure(): number {
    return Number(this._stats.structure)
  }

  public get HP(): number {
    return Number(this._stats.hp)
  }

  public get Evasion(): number {
    return Number(this._stats.evasion)
  }

  public get EDefense(): number {
    return Number(this._stats.edef)
  }

  public get HeatStress(): number {
    return Number(this._stats.stress)
  }

  public get HeatCap(): number {
    return Number(this._stats.heatcap)
  }

  public get RepCap(): number {
    return Number(this._stats.repcap)
  }

  public get SensorRange(): number {
    return Number(this._stats.sensor_range)
  }

  public get TechAttack(): number {
    return Number(this._stats.tech_attack)
  }

  public get SaveTarget(): number {
    return Number(this._stats.save)
  }

  public get Speed(): number {
    return Number(this._stats.speed)
  }

  public get SP(): number {
    return Number(this._stats.sp)
  }

  public get DefaultImage(): string {
    if (this._image_url) return this._image_url
    return getImagePath(ImageTag.Mech, `${this.ID}.png`)
  }
}

export { Frame, IFrameData, IFrameStats }
