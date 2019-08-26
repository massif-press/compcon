import store from '@/store'
import { rules } from 'lancer-data'
import { LicensedItem, MechWeapon, Tag, MountType, ItemType, MechType } from '@/class'

class Frame extends LicensedItem {
  private mechtype: MechType[]
  private y_pos: number
  private mounts: MountType[]
  private size: number
  private armor: number
  private structuremod: number
  private hp: number
  private evasion: number
  private edef: number
  private stressmod: number
  private heatcap: number
  private repcap: number
  private sensor_range: number
  private tech_attack: number
  private save: number
  private speed: number
  private sp: number
  private traits: Trait[]
  private core_system: CoreSystem

  constructor(frameData: any) {
    super(frameData)
    this.mechtype = frameData.mechtype
    this.y_pos = frameData.y_pos || 30
    this.mounts = frameData.mounts
    this.size = frameData.stats.size
    this.armor = frameData.stats.armor
    this.structuremod = frameData.stats.structuremod || 0
    this.hp = frameData.stats.hp
    this.evasion = frameData.stats.evasion
    this.edef = frameData.stats.edef
    this.stressmod = frameData.stats.stressmod || 0
    this.heatcap = frameData.stats.heatcap
    this.repcap = frameData.stats.repcap
    this.sensor_range = frameData.stats.sensor_range
    this.tech_attack = frameData.stats.tech_attack
    this.save = frameData.stats.save
    this.speed = frameData.stats.speed
    this.sp = frameData.stats.sp
    this.traits = frameData.traits
    this.core_system = new CoreSystem(frameData.core_system)
    this.item_type = ItemType.Frame
  }

  public get Mechtype(): MechType[] {
    return this.mechtype
  }

  public get YPosition(): number {
    return this.y_pos
  }

  public get MechTypeString(): string {
    if (this.mechtype.length === 1) return this.mechtype[0]
    return `${this.mechtype[0]} / ${this.mechtype[1]}`
  }

  public get Mounts(): MountType[] {
    return this.mounts
  }

  public get Size(): number {
    return this.size
  }

  public get Armor(): number {
    return this.armor
  }

  public get Structure(): number {
    return rules.base_structure + this.structuremod
  }

  public get HP(): number {
    return this.hp
  }

  public get Evasion(): number {
    return this.evasion
  }

  public get EDefense(): number {
    return this.edef
  }

  public get HeatStress(): number {
    return rules.base_stress + this.stressmod
  }

  public get HeatCap(): number {
    return this.heatcap
  }

  public get RepCap(): number {
    return this.repcap
  }

  public get SensorRange(): number {
    return this.sensor_range
  }

  public get TechAttack(): number {
    return this.tech_attack
  }

  public get Save(): number {
    return this.save
  }

  public get Speed(): number {
    return this.speed
  }

  public get SP(): number {
    return this.sp
  }

  public get Traits(): Trait[] {
    return this.traits
  }

  public get CoreSystem(): CoreSystem {
    return this.core_system
  }

  public get DefaultImage(): string {
    return `file://${store.getters.getUserPath}/img/default_frames/${this.ID}.png`
  }
}

interface Trait {
  name: string
  description: string
}

class CoreSystem {
  private name: string
  private description: string
  private integrated: string | null
  private passive?: string
  private active_name: string
  private effect: string
  private tags: ITagData[]

  constructor(coreData: any) {
    this.name = coreData.name
    this.description = coreData.description
    this.integrated = coreData.integrated ? coreData.integrated.id : null
    this.passive = coreData.passive
    this.active_name = coreData.active_name
    this.effect = coreData.effect
    this.tags = coreData.tags
  }

  public get Name(): string {
    return this.name
  }

  public get Description(): string {
    return this.description
  }

  public get Integrated(): MechWeapon | null {
    if (!this.integrated) return null
    return store.getters.getItemById('MechWeapons', this.integrated)
  }

  public get Passive(): string | null {
    return this.passive || null
  }

  public get Active(): string {
    return this.active_name
  }

  public get Effect(): string {
    return this.effect
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }
}

export default Frame
