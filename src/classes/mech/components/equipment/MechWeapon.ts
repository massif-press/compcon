import { CompendiumStore } from '@/stores';
import _ from 'lodash';
import {
  CompendiumItem,
  ContentPack,
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
} from '@/class';
import {
  IDamageData,
  IMechEquipmentData,
  IRangeData,
  ISynergyData,
  ICounterData,
  ITagCompendiumData,
  Action,
  ICompendiumItemData,
  IEquipmentData,
  IContentPack,
} from '@/interface';
import { IActionData } from '@/classes/Action';
import { IBonusData } from '@/classes/components';
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable';

interface IMechWeaponData extends IMechEquipmentData {
  mount: WeaponSize;
  type: WeaponType;
  skirmish?: boolean;
  barrage?: boolean;
  cost?: number;
  no_attack?: boolean;
  no_core_bonus?: boolean;
  on_attack?: string;
  on_hit?: string;
  on_crit?: string;
  damage?: IDamageData[];
  range?: IRangeData[];
  profiles?: IWeaponProfileData[];
  selected_profile: number;
  mod_type_override?: WeaponType;
  mod_size_override?: WeaponSize;
}

interface IMechWeaponSaveData extends IEquipmentData {
  mod?: IEquipmentData;
  customDamageType?: string;
  maxUseOverride?: number;
  selectedProfile: number;
}

interface IWeaponProfileData {
  name: string;
  effect?: string;
  skirmish?: boolean;
  barrage?: boolean;
  cost?: number;
  on_attack?: string;
  on_hit?: string;
  on_crit?: string;
  damage?: IDamageData[];
  range?: IRangeData[];
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  integrated?: string[];
  special_equipment?: string[];
}

class WeaponProfile extends CompendiumItem {
  Damage?: Damage[];
  Range?: Range[];
  Effect?: string;
  OnAttack?: string;
  OnHit?: string;
  OnCrit?: string;
  Cost: number;
  Skirmish: boolean;
  Barrage: boolean;

  public constructor(
    pData: IWeaponProfileData | IMechWeaponData,
    container: MechWeapon,
    pack?: ContentPack,
    idx?: number
  ) {
    const data = Object.assign({}, pData) as ICompendiumItemData;
    if (!data.id) data.id = container.ID;
    data.id += `_profile_${idx || 0}`;
    super(data, pack);
    this.Cost = parseInt(pData.cost as any) || 1;
    this.Barrage = pData.barrage != undefined ? pData.barrage : container.Barrage;
    this.Skirmish = pData.skirmish != undefined ? pData.skirmish : container.Skirmish;
    if (pData.damage) this.Damage = pData.damage.map((x) => new Damage(x));
    if (pData.range) this.Range = pData.range.map((x) => new Range(x));
    if (pData.effect) this.Effect = pData.effect;
    if (pData.on_attack) this.OnAttack = pData.on_attack;
    if (pData.on_hit) this.OnHit = pData.on_hit;
    if (pData.on_crit) this.OnCrit = pData.on_crit;
  }

  public DamageSum(type?: DamageType) {
    if (!this.Damage) return 0;
    return this.Damage.reduce((a, b) => a + b.ToNumber(type), 0);
  }

  public RangeSum(type?: RangeType) {
    if (!this.Range) return 0;
    if (!type) return Math.max(...this.Range.map((r) => r.Max));
    return this.Range.find((x) => x.Type === type)?.Max || 0;
  }
}

class MechWeapon extends MechEquipment {
  public readonly Size: WeaponSize;
  public readonly ModSize: WeaponSize;
  public readonly WeaponType: WeaponType;
  public readonly ModType: WeaponType;
  public readonly Profiles: WeaponProfile[];
  public readonly Skirmish: boolean;
  public readonly Barrage: boolean;
  public readonly NoAttack: boolean;
  public readonly NoCoreBonus: boolean;
  private _mod: WeaponMod | null;
  private _custom_damage_type?: string | null;
  private _selected_profile: number;

  public constructor(data: IMechWeaponData, pack?: ContentPack) {
    super(data, pack);
    this.Size = data.mount;
    this.ModSize = data.mod_size_override ? data.mod_size_override : data.mount;
    this.WeaponType = data.type;
    this.ModType = data.mod_type_override ? data.mod_type_override : data.type;
    this.Skirmish =
      data.skirmish != undefined ? data.skirmish : data.mount !== WeaponSize.Superheavy;
    this.Barrage = data.barrage != undefined ? (data.skirmish ?? false) : true;
    this.NoAttack = data.no_attack || false;
    this.NoCoreBonus = data.no_core_bonus || false;
    if (data.profiles && data.profiles.length) {
      this.Profiles = data.profiles.map((x, i) => new WeaponProfile(x, this, pack, i));
    } else {
      this.Profiles = [new WeaponProfile(data, this, pack)];
    }
    this._selected_profile = 0;
    this._mod = null;
    this.ItemType = ItemType.MechWeapon;
    this.max_use_override = 0;
    this._custom_damage_type = null;
  }

  public get TotalSP(): number {
    if (!this.Mod) return this.SP;
    return this.Mod.SP + this.SP;
  }

  public get ModSP(): number {
    return this.Mod ? this.Mod.SP : 0;
  }

  public get Cost(): number {
    return this.SelectedProfile.Cost;
  }

  public get SelectedProfile(): WeaponProfile {
    return this.Profiles[this._selected_profile];
  }

  public get SizeInt(): number {
    switch (this.Size.toLowerCase()) {
      case 'superheavy':
        return 4;
      case 'heavy':
        return 3;
      case 'main':
        return 2;
      case 'auxiliary':
        return 1;
      default:
        return 0;
    }
  }

  public SetProfileSelection(val: number): void {
    // TODO: recognize when this is instantiated on an existing mech so we can correctly call the save function from the setter
    this._selected_profile = val;
    // this.save();
  }

  public get ProfileIndex(): number {
    return this._selected_profile;
  }

  public set ProfileIndex(val: number) {
    this._selected_profile = val;
  }

  public get AllTags(): Tag[] {
    return _.uniqBy([...this.Tags, ...this.Profiles.flatMap((p) => p.Tags)], 'ID');
  }

  public get Damage(): Damage[] {
    if (this.SelectedProfile.Damage && this.Mod && this.Mod.AddedDamage)
      return this.SelectedProfile.Damage.concat(this.Mod.AddedDamage);
    return this.SelectedProfile.Damage || [];
  }

  public get MaxDamage(): number {
    if (0 === this.Damage.length) {
      return 0;
    } else {
      return this.Damage[0].Max;
    }
  }

  public get DamageTypeOverride(): string | null {
    return this._custom_damage_type || null;
  }

  public set DamageTypeOverride(val: string | null) {
    this._custom_damage_type = val;
    // this.save();
  }

  public set MaxUseOverride(val: number) {
    const safeVal = MechWeapon.SanitizeUsesInput(val);
    this.max_use_override = safeVal;
    // this.save();
  }

  public static SanitizeUsesInput(val: number): number {
    // Prevent Uses icon overflow - set reasonable limit on maximum uses
    const absoluteMax = 25;
    const absoluteMin = 0;
    return Math.max(Math.min(val, absoluteMax), absoluteMin);
  }

  public get DamageType(): DamageType[] {
    return this.SelectedProfile.Damage ? this.SelectedProfile.Damage.map((x) => x.Type) : [];
  }

  public get DefaultDamageType(): DamageType {
    if (0 === this.DamageType.length) {
      return DamageType.Variable;
    } else {
      return this.DamageType[0];
    }
  }

  public get Range(): Range[] {
    return this.SelectedProfile.Range || [];
  }

  public get RangeType(): RangeType[] {
    return this.SelectedProfile.Range ? this.SelectedProfile.Range.map((x) => x.Type) : [];
  }

  public set Mod(mod: WeaponMod | null) {
    if (mod) {
      const m = _.clone(mod);
      this._mod = m;
    } else {
      this._mod = null;
    }
  }

  public get Mod(): WeaponMod | null {
    return this._mod;
  }

  public get Color(): string {
    return 'mech-weapon';
  }

  // for scatter and comparators
  public get StatsByProfile() {
    return this.Profiles.map((p) => {
      return {
        Name: p.Name && p.Name !== this.Name ? `${this.Name} (${p.Name})` : this.Name,
        Source: this.Source,
        LcpName: this.LcpName,
        ID: this.ID,
        Stats: {
          range: p.RangeSum(),
          threat: p.RangeSum(RangeType.Threat),
          thrown: p.RangeSum(RangeType.Thrown),
          line: p.RangeSum(RangeType.Line),
          cone: p.RangeSum(RangeType.Cone),
          blast: p.RangeSum(RangeType.Blast),
          burst: p.RangeSum(RangeType.Burst),
          damage: p.DamageSum(),
          kineticDamage: p.DamageSum(DamageType.Kinetic),
          energyDamage: p.DamageSum(DamageType.Energy),
          heatDamage: p.DamageSum(DamageType.Heat),
          explosiveDamage: p.DamageSum(DamageType.Explosive),
          burnDamage: p.DamageSum(DamageType.Burn),
          variableDamage: p.DamageSum(DamageType.Variable),
        },
      };
    });
  }

  public get Stats() {
    return this.StatsByProfile[0].Stats;
  }

  public static Serialize(item: MechWeapon): IMechWeaponSaveData {
    return {
      id: item.ID,
      note: item.Note,
      mod: item.Mod ? (WeaponMod.Serialize(item.Mod) as IEquipmentData) : undefined,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || undefined,
      maxUseOverride: MechWeapon.SanitizeUsesInput(item.max_use_override) || 0,
      selectedProfile: item._selected_profile || 0,
    };
  }

  public static Deserialize(data: IMechWeaponSaveData): MechWeapon {
    const item = CompendiumStore().instantiate('MechWeapons', data.id) as MechWeapon;
    item._mod = data.mod ? WeaponMod.Deserialize(data.mod) : null;
    item._note = data.note;
    item._flavor_name = data.flavorName || '';
    item._flavor_description = data.flavorDescription || '';
    item._custom_damage_type = data.customDamageType || null;
    item.max_use_override = MechWeapon.SanitizeUsesInput(data.maxUseOverride || 0);
    item._selected_profile = data.selectedProfile || 0;
    return item;
  }
}

export { MechWeapon };
export type { IMechWeaponData, IMechWeaponSaveData };
