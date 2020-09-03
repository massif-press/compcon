import { store } from '@/store'
import _ from 'lodash'
import {
  Damage,
  DamageType,
  ItemType,
  Mech,
  MechEquipment,
  Range,
  RangeType,
  WeaponMod,
  WeaponSize,
  WeaponType,
} from '@/class'
import {
  IDamageData,
  IMechEquipmentData,
  IRangeData,
  ISynergyData,
  IDeployableData,
  ICounterData,
} from '@/interface'
import { IActionData } from '../Action'
import { IBonusData } from '../Bonus'
import { CompendiumItem, ICompendiumItemData } from '../CompendiumItem'

interface IMechWeaponData extends IMechEquipmentData {
  mount: WeaponSize
  type: WeaponType
  on_attack?: string
  on_hit?: string
  on_crit?: string
  damage?: IDamageData[]
  range?: IRangeData[]
  profiles?: IWeaponProfileData[]
  selected_profile: number
}

interface IWeaponProfileData {
  name?: string
  effect?: string
  on_attack?: string
  on_hit?: string
  on_crit?: string
  damage?: IDamageData[]
  range?: IRangeData[]
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
}

class WeaponProfile extends CompendiumItem {
  Damage?: Damage[]
  Range?: Range[]
  Effect?: string
  OnAttack?: string
  OnHit?: string
  OnCrit?: string

  public constructor(pData: IWeaponProfileData | IMechWeaponData, originId?: string, idx?: number) {
    const data = Object.assign({}, pData) as ICompendiumItemData
    if (!data.id) data.id = originId
    data.id += `_profile_${idx || 0}`
    super(data)
    if (pData.damage) this.Damage = pData.damage.map(x => new Damage(x))
    if (pData.range) this.Range = pData.range.map(x => new Range(x))
    if (pData.effect) this.Effect = pData.effect
    if (pData.on_attack) this.OnAttack = pData.on_attack
    if (pData.on_hit) this.OnHit = pData.on_hit
    if (pData.on_crit) this.OnCrit = pData.on_crit
  }
}

class MechWeapon extends MechEquipment {
  public readonly Size: WeaponSize
  public readonly WeaponType: WeaponType
  public readonly Profiles: WeaponProfile[]
  private _mod: WeaponMod | null
  private _custom_damage_type?: string
  private _selected_profile: number

  public constructor(data: IMechWeaponData) {
    super(data)
    this.Size = data.mount
    this.WeaponType = data.type
    if (data.profiles) {
      this.Profiles = data.profiles.map(x => new WeaponProfile(x))
    } else {
      this.Profiles = [new WeaponProfile(data)]
    }
    this._selected_profile = 0
    this._mod = null
    this.ItemType = ItemType.MechWeapon
  }

  public get TotalSP(): number {
    if (!this.Mod) return this.SP
    return this.Mod.SP + this.SP
  }

  public get ModSP(): number {
    return this.Mod ? this.Mod.SP : 0
  }

  public get SelectedProfile(): WeaponProfile {
    return this.Profiles[this._selected_profile]
  }

  public SetProfileSelection(val: number): void {
    this._selected_profile = val
    this.save()
  }

  public get Damage(): Damage[] {
    if (this.SelectedProfile.Damage && this.Mod && this.Mod.AddedDamage)
      return this.SelectedProfile.Damage.concat(this.Mod.AddedDamage)
    return this.SelectedProfile.Damage || []
  }

  public get MaxDamage(): number {
    if (0 === this.Damage.length) {
      return 0
    } else {
      return this.Damage[0].Max
    }
  }

  public get DamageTypeOverride(): string {
    return this._custom_damage_type || null
  }

  public set DamageTypeOverride(val: string) {
    this._custom_damage_type = val
    this.save()
  }

  public set MaxUseOverride(val: number) {
    this.max_use_override = val
    this.save()
  }

  public get DamageType(): DamageType[] {
    return this.SelectedProfile.Damage.map(x => x.Type)
  }

  public get DefaultDamageType(): DamageType {
    if (0 === this.DamageType.length) {
      return DamageType.Variable
    } else {
      return this.DamageType[0]
    }
  }

  public get Range(): Range[] {
    return this.SelectedProfile.Range || []
  }

  public getTotalRange(mech: Mech): Range[] {
    return Range.AddBonuses(this.Range, mech.Bonuses)
  }

  public get RangeType(): RangeType[] {
    return this.SelectedProfile.Range.map(x => x.Type)
  }

  public set Mod(_mod: WeaponMod | null) {
    this._mod = _.cloneDeep(_mod)
  }

  public get Mod(): WeaponMod | null {
    return this._mod || null
  }

  public get Color(): string {
    return 'mech-weapon'
  }

  public static Serialize(item: MechWeapon): IMechWeaponSaveData {
    return {
      id: item.ID,
      uses: item.Uses || 0,
      destroyed: item.Destroyed,
      cascading: item.IsCascading,
      loaded: item.Loaded,
      note: item.Note,
      mod: item.Mod ? WeaponMod.Serialize(item.Mod) : null,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || null,
      maxUseOverride: item.max_use_override || 0,
      selectedProfile: item._selected_profile || 0,
    }
  }

  public static Deserialize(data: IMechWeaponSaveData): MechWeapon {
    const item = store.getters.instantiate('MechWeapons', data.id) as MechWeapon
    item._uses = data.uses || 0
    item._destroyed = data.destroyed || false
    item._cascading = data.cascading || false
    item._loaded = data.loaded || true
    item._mod = data.mod ? WeaponMod.Deserialize(data.mod) : null
    item._note = data.note
    item._flavor_name = data.flavorName
    item._flavor_description = data.flavorDescription
    item._custom_damage_type = data.customDamageType || null
    item.max_use_override = data.maxUseOverride || 0
    item._selected_profile = data.selectedProfile || 0
    return item
  }
}

export { MechWeapon, IMechWeaponData }
