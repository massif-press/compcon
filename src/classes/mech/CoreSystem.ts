import { store } from '@/store'
import { MechWeapon, Tag } from '@/class'

interface ICoreData {
  name: string
  description: string
  integrated?: { id: string }
  passive?: string
  active_name: string
  effect: string
  tags: ITagData[]
}

class CoreSystem {
  private _name: string
  private _description: string
  private _integrated: string | null
  private _passive?: string
  private _active_name: string
  private _effect: string
  private _tags: ITagData[]

  public constructor(coreData: ICoreData) {
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
    return store.getters.instantiate('MechWeapons', this._integrated)
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

export { CoreSystem, ICoreData }
