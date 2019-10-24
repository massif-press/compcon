import { store } from '@/store'
import { rules } from 'lancer-data'
import { LicensedItem, MechWeapon, Tag, MountType, ItemType, MechType } from '@/class'

interface Trait {
  name: string
  description: string
}

class CoreSystem {
  private _name: string
  private _description: string
  private _integrated: string | null
  private _passive?: string
  private _active_name: string
  private _effect: string
  private _tags: ITagData[]

  public constructor(coreData: any) {
    this._name = coreData.name
    this._description = coreData.description
    this._integrated = coreData.integrated ? coreData.integrated.id : null
    this._passive = coreData.passive
    this._active_name = coreData.active_name
    this._effect = coreData.effect
    this._tags = coreData.tags
  }

  public get Name(): string {
    return this._name
  }

  public get Description(): string {
    return this._description
  }

  public get Integrated(): MechWeapon | null {
    if (!this._integrated) return null
    return store.getters.referenceByID('MechWeapons', this._integrated)
  }

  public getIntegrated(): MechWeapon | null {
    if (!this._integrated) return null
    return store.getters.referenceByID('MechWeapons', this._integrated)
  }

  public get Passive(): string | null {
    return this._passive || null
  }

  public get Active(): string {
    return this._active_name
  }

  public get Effect(): string {
    return this._effect
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }
}

class Frame extends LicensedItem {
  private _mechtype: MechType[]
  private _y_pos: number
  private _mounts: MountType[]
  private _size: number
  private _armor: number
  private _structuremod: number
  private _hp: number
  private _evasion: number
  private _edef: number
  private _stressmod: number
  private _heatcap: number
  private _repcap: number
  private _sensor_range: number
  private _tech_attack: number
  private _save: number
  private _speed: number
  private _sp: number
  private _traits: Trait[]
  private _core_system: CoreSystem

  public constructor(frameData: any) {
    super(frameData)
    this._mechtype = frameData.mechtype
    this._y_pos = frameData.y_pos || 30
    this._mounts = frameData.mounts
    this._size = frameData.stats.size
    this._armor = frameData.stats.armor
    this._structuremod = frameData.stats.structuremod || 0
    this._hp = frameData.stats.hp
    this._evasion = frameData.stats.evasion
    this._edef = frameData.stats.edef
    this._stressmod = frameData.stats.stressmod || 0
    this._heatcap = frameData.stats.heatcap
    this._repcap = frameData.stats.repcap
    this._sensor_range = frameData.stats.sensor_range
    this._tech_attack = frameData.stats.tech_attack
    this._save = frameData.stats.save
    this._speed = frameData.stats.speed
    this._sp = frameData.stats.sp
    this._traits = frameData.traits
    this._core_system = new CoreSystem(frameData.core_system)
    this._item_type = ItemType.Frame
  }

  public get Mechtype(): MechType[] {
    return this._mechtype
  }

  public get YPosition(): number {
    return this._y_pos
  }

  public get MechTypeString(): string {
    if (this._mechtype.length === 1) return this._mechtype[0]
    return `${this._mechtype[0]} / ${this._mechtype[1]}`
  }

  public get Mounts(): MountType[] {
    return this._mounts
  }

  public get Size(): number {
    return this._size
  }

  public get Armor(): number {
    return this._armor
  }

  public get Structure(): number {
    return rules.base_structure + this._structuremod
  }

  public get HP(): number {
    return this._hp
  }

  public get Evasion(): number {
    return this._evasion
  }

  public get EDefense(): number {
    return this._edef
  }

  public get HeatStress(): number {
    return rules.base_stress + this._stressmod
  }

  public get HeatCap(): number {
    return this._heatcap
  }

  public get RepCap(): number {
    return this._repcap
  }

  public get SensorRange(): number {
    return this._sensor_range
  }

  public get TechAttack(): number {
    return this._tech_attack
  }

  public get SaveTarget(): number {
    return this._save
  }

  public get Speed(): number {
    return this._speed
  }

  public get SP(): number {
    return this._sp
  }

  public get Traits(): Trait[] {
    return this._traits
  }

  public get CoreSystem(): CoreSystem {
    return this._core_system
  }

  public get DefaultImage(): string {
    return `file://${store.getters.getUserPath}/img/default_frame/${this.ID}.png`
  }
}

export default Frame
