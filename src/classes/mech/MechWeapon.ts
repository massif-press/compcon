import { store } from '@/store'
import _ from 'lodash'
import {
  Damage,
  DamageType,
  ItemType,
  MechEquipment,
  Range,
  RangeType,
  Tag,
  WeaponMod,
  WeaponSize,
  WeaponType,
} from '@/class'
import {
  IDamageData,
  IMechEquipmentData,
  IRangeData,
  ISynergyData,
  ICounterData,
  ITagCompendiumData,
} from '@/interface'
import { Action, IActionData } from '../Action'
import { IBonusData } from '../Bonus'
import { CompendiumItem, ICompendiumItemData } from '../CompendiumItem'
import { IDeployableData } from '../Deployable'

interface IMechWeaponData extends IMechEquipmentData {
  mount: WeaponSize
  type: WeaponType
  skirmish?: boolean
  barrage?: boolean
  cost?: number
  no_attack?: boolean
  no_core_bonus?: boolean
  on_attack?: string
  on_hit?: string
  on_crit?: string
  damage?: IDamageData[]
  range?: IRangeData[]
  profiles?: IWeaponProfileData[]
  selected_profile: number
}

interface IWeaponProfileData {
  name: string
  effect?: string
  skirmish?: boolean
  barrage?: boolean
  cost?: number
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
  special_equipment?: string[]
}

class WeaponProfile extends CompendiumItem {
  Damage?: Damage[]
  Range?: Range[]
  Effect?: string
  OnAttack?: string
  OnHit?: string
  OnCrit?: string
  Cost: number
  Skirmish: boolean
  Barrage: boolean

  public constructor(
    pData: IWeaponProfileData | IMechWeaponData,
    packTags?: ITagCompendiumData[],
    container: MechWeapon,
    idx?: number
  ) {
    const data = Object.assign({}, pData) as ICompendiumItemData
    if (!data.id) data.id = container.ID
    data.id += `_profile_${idx || 0}`
    super(data,packTags)
    this.Cost = pData.cost || 1
    this.Barrage = pData.barrage != undefined ? pData.barrage : container.Barrage
    this.Skirmish = pData.skirmish != undefined ? pData.skirmish : container.Skirmish
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
  public readonly Skirmish: boolean
  public readonly Barrage: boolean
  public readonly NoAttack: boolean
  public readonly NoCoreBonus: boolean
  private _mod: WeaponMod | null
  private _custom_damage_type?: string
  private _selected_profile: number

  public constructor(data: IMechWeaponData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.Size = data.mount
    this.WeaponType = data.type
    this.Skirmish =
      data.skirmish != undefined ? data.skirmish : data.mount !== WeaponSize.Superheavy
    this.Barrage = data.barrage != undefined ? data.skirmish : true
    this.NoAttack = data.no_attack
    this.NoCoreBonus = data.no_core_bonus
    if (data.profiles) {
      this.Profiles = data.profiles.map((x, i) => new WeaponProfile(x, packTags, this, i))
    } else {
      this.Profiles = [new WeaponProfile(data, packTags, this)]
    }
    this._selected_profile = 0
    this._mod = null
    this.ItemType = ItemType.MechWeapon
    this.max_use_override = 0
    this._custom_damage_type = null
  }

  public get TotalSP(): number {
    if (!this.Mod) return this.SP
    return this.Mod.SP + this.SP
  }

  public get ModSP(): number {
    return this.Mod ? this.Mod.SP : 0
  }

  public get Cost(): number {
    return this.SelectedProfile.Cost
  }

  public get CanSkirmish(): boolean {
    return this.SelectedProfile.Skirmish && this.CheckUsable(this.Cost)
  }

  public get CanBarrage(): boolean {
    return this.SelectedProfile.Barrage && this.CheckUsable(this.Cost)
  }

  public get SelectedProfile(): WeaponProfile {
    return this.Profiles[this._selected_profile]
  }

  public get SizeInt(): number {
    switch (this.Size.toLowerCase()) {
      case 'superheavy':
        return 4
      case 'heavy':
        return 3
      case 'main':
        return 2
      case 'auxiliary':
        return 1
      default:
        return 0
    }
  }

  public SetProfileSelection(val: number, temp: boolean): void {
    this._selected_profile = val
    if (!temp) this.save()
  }

  public get ProfileIndex(): number {
    return this._selected_profile
  }

  public get ProfileEffect(): string {
    return this.SelectedProfile.Effect || ''
  }

  public get ProfileOnAttack(): string {
    return this.SelectedProfile.OnAttack || ''
  }

  public get ProfileOnHit(): string {
    return this.SelectedProfile.OnHit || ''
  }

  public get ProfileOnCrit(): string {
    return this.SelectedProfile.OnCrit || ''
  }

  public get ProfileTags(): Tag[] {
    return this.SelectedProfile.Tags || []
  }

  public get ProfileHeatCost(): number {
    const selfHeatTag = this.ProfileTags.find(x => x.IsHeatCost)
    return Number(selfHeatTag ? selfHeatTag.Value : 0)
  }

  public get ProfileActions(): Action[] {
    return this.SelectedProfile.Actions
  }

  public get ProfileDeployables(): IDeployableData[] {
    return this.SelectedProfile.Deployables
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
    const safeVal = MechWeapon.SanitizeUsesInput(val)
    this.max_use_override = safeVal
    this._missing_uses = 0
    this.save()
  }

  public static SanitizeUsesInput(val: number): number {
    // Prevent Uses icon overflow - set reasonable limit on maximum uses
    const absoluteMax = 25
    const absoluteMin = 0
    return Math.max(Math.min(val, absoluteMax), absoluteMin)
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
      destroyed: item.Destroyed,
      cascading: item.IsCascading,
      loaded: item.Loaded,
      note: item.Note,
      mod: item.Mod ? WeaponMod.Serialize(item.Mod) : null,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || null,
      maxUseOverride: MechWeapon.SanitizeUsesInput(item.max_use_override) || 0,
      uses: MechWeapon.SanitizeUsesInput(item.Uses) || 0,
      selectedProfile: item._selected_profile || 0,
    }
  }

  public static Deserialize(data: IMechWeaponSaveData): MechWeapon {
    const item = store.getters.instantiate('MechWeapons', data.id) as MechWeapon
    item._destroyed = data.destroyed || false
    item._cascading = data.cascading || false
    item._loaded = data.loaded || true
    item._mod = data.mod ? WeaponMod.Deserialize(data.mod) : null
    item._note = data.note
    item._flavor_name = data.flavorName
    item._flavor_description = data.flavorDescription
    item._custom_damage_type = data.customDamageType || null
    item.max_use_override = MechWeapon.SanitizeUsesInput(data.maxUseOverride) || 0
    item.Uses = MechWeapon.SanitizeUsesInput(data.uses) || 0
    item._selected_profile = data.selectedProfile || 0
    return item
  }
}

export { MechWeapon, IMechWeaponData }
