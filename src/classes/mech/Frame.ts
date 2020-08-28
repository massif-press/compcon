import { LicensedItem, MountType, ItemType, MechType, CoreSystem, Duration } from '@/class'
import { ILicensedItemData, ICoreData, IDeployableData, ICounterData } from '@/interface'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { IActionData } from '../Action'
import { IBonusData } from '../Bonus'
import { ISynergyData } from '../Synergy'

interface FrameTrait {
  name: string
  description: string
  use?: Duration
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  integrated?: string[]
  counters?: ICounterData[]
}

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
  traits: FrameTrait[]
  core_system: ICoreData
  y_pos?: number
  image_url?: string
  other_art?: { tag?: ImageTag; src?: string; url?: string }[]
}

class Frame extends LicensedItem {
  private _mechtype: MechType[]
  private _y_pos: number
  private _mounts: MountType[]
  private _stats: IFrameStats
  private _traits: FrameTrait[]
  private _core_system: CoreSystem
  private _image_url?: string
  private _other_art?: { tag?: ImageTag; src?: string; url?: string }[]

  public constructor(frameData: IFrameData) {
    super(frameData)
    this._mechtype = frameData.mechtype
    this._y_pos = frameData.y_pos || 30
    this._mounts = frameData.mounts
    this._stats = frameData.stats
    this._traits = frameData.traits
    this._core_system = new CoreSystem(frameData.core_system)
    this.ItemType = ItemType.Frame
    this._image_url = frameData.image_url
    this._other_art = frameData.other_art
  }

  public get Mechtype(): MechType[] {
    return this._mechtype
  }

  public get YPosition(): number {
    return this._y_pos
  }

  public get OtherArt(): { tag?: ImageTag; src?: string; url?: string }[] {
    return this._other_art
  }

  public get MechTypeString(): string {
    if (this._mechtype.length === 1) return this._mechtype[0]
    return `${this._mechtype[0]} / ${this._mechtype[1]}`
  }

  public get Mounts(): MountType[] {
    return this._mounts
  }

  public get Size(): number {
    return this._stats.size
  }

  public get SizeIcon(): string {
    return `cci-size-${this.Size === 0.5 ? 'half' : this.Size}`
  }

  public get Armor(): number {
    return this._stats.armor
  }

  public get Structure(): number {
    return this._stats.structure
  }

  public get HP(): number {
    return this._stats.hp
  }

  public get Evasion(): number {
    return this._stats.evasion
  }

  public get EDefense(): number {
    return this._stats.edef
  }

  public get HeatStress(): number {
    return this._stats.stress
  }

  public get HeatCap(): number {
    return this._stats.heatcap
  }

  public get RepCap(): number {
    return this._stats.repcap
  }

  public get SensorRange(): number {
    return this._stats.sensor_range
  }

  public get TechAttack(): number {
    return this._stats.tech_attack
  }

  public get SaveTarget(): number {
    return this._stats.save
  }

  public get Speed(): number {
    return this._stats.speed
  }

  public get SP(): number {
    return this._stats.sp
  }

  public get Traits(): FrameTrait[] {
    return this._traits
  }

  public get CoreSystem(): CoreSystem {
    return this._core_system
  }

  public get DefaultImage(): string {
    if (this._image_url) return this._image_url
    return getImagePath(ImageTag.Frame, `${this.ID}.png`, true)
  }
}

export { Frame, IFrameData, IFrameStats }
