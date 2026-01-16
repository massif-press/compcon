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
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect';

interface IMechWeaponData extends IMechEquipmentData {
  mount: WeaponSize;
  type: WeaponType | WeaponType[];
  skirmish?: boolean;
  barrage?: boolean;
  cost?: number;
  no_attack?: boolean;
  no_core_bonus?: boolean;
  on_miss?: string | IActiveEffectData;
  on_attack?: string | IActiveEffectData;
  on_hit?: string | IActiveEffectData;
  on_crit?: string | IActiveEffectData;
  damage?: IDamageData[];
  range?: IRangeData[];
  profiles?: IWeaponProfileData[];
  selected_profile: number;
  mod_type_override?: WeaponType;
  mod_size_override?: WeaponSize;
}

interface IMechWeaponSaveData extends IEquipmentData {
  mod?: IEquipmentData;
  maxUseOverride?: number;
  selectedProfile: number;
  customDamageType?: string;
  customRange?: IRangeData[];
  customWeaponType?: WeaponType;
  customTags?: ITagCompendiumData[];
  customEffect?: string;
}

interface IWeaponProfileData {
  name: string;
  effect?: string;
  skirmish?: boolean;
  barrage?: boolean;
  cost?: number;
  on_miss?: string | IActiveEffectData;
  on_attack?: string | IActiveEffectData;
  on_hit?: string | IActiveEffectData;
  on_crit?: string | IActiveEffectData;
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
  OnMiss?: ActiveEffect;
  OnAttack?: ActiveEffect;
  OnHit?: ActiveEffect;
  OnCrit?: ActiveEffect;
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
    this.Effect = pData?.effect
      ? typeof pData.effect === 'string'
        ? pData.effect
        : (pData.effect as any).description
      : '';
    if (pData.on_miss) {
      if (typeof pData.on_miss === 'string')
        this.OnMiss = new ActiveEffect({ name: 'On Miss Effect', detail: pData.on_miss }, this);
      else this.OnMiss = new ActiveEffect(pData.on_miss, this);
    }
    if (pData.on_attack) {
      if (typeof pData.on_attack === 'string')
        this.OnAttack = new ActiveEffect(
          { name: 'On Attack Effect', detail: pData.on_attack },
          this
        );
      else this.OnAttack = new ActiveEffect(pData.on_attack, this);
    }
    if (pData.on_hit) {
      if (typeof pData.on_hit === 'string')
        this.OnHit = new ActiveEffect({ name: 'On Hit Effect', detail: pData.on_hit }, this);
      else this.OnHit = new ActiveEffect(pData.on_hit, this);
    }
    if (pData.on_crit) {
      if (typeof pData.on_crit === 'string')
        this.OnCrit = new ActiveEffect({ name: 'On Crit Effect', detail: pData.on_crit }, this);
      else this.OnCrit = new ActiveEffect(pData.on_crit, this);
    }

    if (this.Damage && this.Damage.length) this.Damage.forEach((d) => d.setDamageAttributes(this));
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
  public readonly ModType: WeaponType;
  public readonly Profiles: WeaponProfile[];
  public readonly Skirmish: boolean;
  public readonly Barrage: boolean;
  public readonly NoAttack: boolean;
  public readonly NoCoreBonus: boolean;
  private _mod: WeaponMod | null;
  private _selected_profile: number;
  public _weaponTypes: WeaponType[];

  private _custom_damage_type?: string | null;
  private _custom_range?: IRangeData[] | null;
  private _custom_weapon_type?: WeaponType | null;
  private _custom_tags?: ITagCompendiumData[] | null;
  private _custom_effect?: string | null;
  public max_use_override: number = 0;

  public constructor(data: IMechWeaponData, pack?: ContentPack) {
    super(data, pack);
    this.ItemType = ItemType.MechWeapon;
    this.Size = data.mount;
    this.ModSize = data.mod_size_override ? data.mod_size_override : data.mount;
    this._weaponTypes = Array.isArray(data.type) ? data.type : [data.type];
    this.ModType = data.mod_type_override
      ? data.mod_type_override
      : Array.isArray(data.type)
        ? data.type[0]
        : data.type;

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

  public get ActiveTags(): Tag[] {
    return _.uniqBy(
      this.Tags.concat(this.SelectedProfile.Tags || []).concat(this.Mod?.AddedTags || []),
      'ID'
    );
  }

  public get Reliable(): number {
    const tag = this.ActiveTags.find((t) => t.ID === 'tg_reliable');
    if (tag && tag.Value) return Number(tag.Value);
    return 0;
  }

  public get Overkill(): boolean {
    return this.ActiveTags.some((t) => t.ID === 'tg_overkill');
  }

  public get Accuracy(): number {
    let val = 0;
    const acc = this.ActiveTags.find((t) => t.ID === 'tg_accurate');
    if (acc && acc.Value) val += Number(acc.Value);
    const diff = this.ActiveTags.find((t) => t.ID === 'tg_inaccurate');
    if (diff && diff.Value) val -= Number(diff.Value);

    return val;
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

  public get ProfileIndex(): number {
    return this._selected_profile;
  }

  public set ProfileIndex(val: number) {
    this._selected_profile = val;
  }

  public get AllTags(): Tag[] {
    return _.uniqBy(
      [...this.Tags, ...this.Profiles.flatMap((p) => p.Tags), ...(this.Mod?.AddedTags || [])],
      'ID'
    );
  }

  public get Damage(): Damage[] {
    return [...(this.SelectedProfile.Damage || []), ...(this.Mod?.AddedDamage || [])];
  }

  public get MaxDamage(): number {
    if (0 === this.Damage.length) {
      return 0;
    } else {
      return this.Damage[0].Max;
    }
  }

  public get IsSmart(): boolean {
    return (
      this.SelectedProfile.Tags.some((t) => t.ID === 'tg_smart') ||
      (this.Mod && this.Mod.AddedTags.some((t) => t.ID === 'tg_smart')) ||
      false
    );
  }

  public SetOverride(
    prop: 'damage' | 'range' | 'weapon_type' | 'tags' | 'uses' | 'effect',
    val: any
  ): void {
    switch (prop) {
      case 'damage':
        this._custom_damage_type = val;
        break;
      case 'range':
        this._custom_range = val;
        break;
      case 'weapon_type':
        this._custom_weapon_type = val;
        break;
      case 'tags':
        this._custom_tags = val;
        break;
      case 'uses':
        this.max_use_override = MechWeapon.SanitizeUsesInput(val);
        break;
      case 'effect':
        this._custom_effect = val;
        break;
    }
  }

  public GetOverride(prop: 'damage' | 'range' | 'weapon_type' | 'tags' | 'uses' | 'effect'): any {
    switch (prop) {
      case 'damage':
        return this._custom_damage_type;
      case 'range':
        return this._custom_range;
      case 'weapon_type':
        return this._custom_weapon_type;
      case 'tags':
        return this._custom_tags || [];
      case 'uses':
        return this.max_use_override;
      case 'effect':
        return this._custom_effect || '';
    }
  }

  public get CustomEffect(): string {
    if (this._custom_effect) return this._custom_effect;
    return '';
  }

  public get CustomTags(): Tag[] {
    if (this._custom_tags) return Tag.Deserialize(this._custom_tags);
    return [];
  }

  public static SanitizeUsesInput(val: number): number {
    // Prevent Uses icon overflow - set reasonable limit on maximum uses
    const absoluteMax = 25;
    const absoluteMin = 0;
    return Math.max(Math.min(val, absoluteMax), absoluteMin);
  }

  public get DamageType(): DamageType[] {
    if (this._custom_damage_type) return [this._custom_damage_type as DamageType];
    return this.SelectedProfile.Damage ? this.SelectedProfile.Damage.map((x) => x.Type) : [];
  }

  public get DefaultDamageType(): DamageType {
    if (this._custom_damage_type) return this._custom_damage_type as DamageType;
    if (0 === this.DamageType.length) {
      return DamageType.Variable;
    } else {
      return this.DamageType[0];
    }
  }

  public get DamageTypeOverride(): DamageType | null {
    if (this._custom_damage_type) return this._custom_damage_type as DamageType;
    if (this.Mod && this.Mod.AddedDamage.length) {
      return this.Mod.AddedDamage[0].Type;
    }
    return null;
  }

  public get Range(): Range[] {
    if (this._custom_range) return this._custom_range.map((x) => new Range(x));
    return this.SelectedProfile.Range || [];
  }

  public get RangeType(): RangeType[] {
    if (this._custom_range) return this.Range.map((x) => x.Type);
    return this.SelectedProfile.Range ? this.SelectedProfile.Range.map((x) => x.Type) : [];
  }

  public get WeaponTypes(): WeaponType[] {
    if (this._custom_weapon_type) return [this._custom_weapon_type as WeaponType];
    return this._weaponTypes;
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

  public GetAttack(idx): 'ranged' | 'melee' | 'tech' {
    if (this.IsSmart) return 'tech';
    if (this.Range[idx]) {
      if (this.Range[idx].Type === RangeType.Threat) return 'melee';
      return 'ranged';
    }
    if (this.WeaponTypes.includes(WeaponType.Melee)) return 'melee';
    return 'ranged';
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
    const data = {
      id: item.ID,
      data: item.ItemData,
      note: item.Note,
      mod: item.Mod ? (WeaponMod.Serialize(item.Mod) as IEquipmentData) : undefined,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      selectedProfile: item._selected_profile || 0,
      customDamageType: item._custom_damage_type || undefined,
      customRange: item._custom_range || undefined,
      customWeaponType: item._custom_weapon_type || undefined,
      customTags: item._custom_tags || undefined,
      customEffect: item._custom_effect || undefined,
      maxUseOverride: MechWeapon.SanitizeUsesInput(item.max_use_override) || 0,
    };

    // combat props
    return {
      ...data,
      maxUses: item.MaxUses,
      currentUses: item.Uses,
      destroyed: item.Destroyed,
      isUsed: item.Used,
    } as IMechWeaponSaveData;
  }

  public static Deserialize(data: IMechWeaponSaveData): MechWeapon {
    let item;
    if (CompendiumStore().has('MechWeapons', data.id))
      item = CompendiumStore().instantiate('MechWeapons', data.id) as MechWeapon;
    else {
      item = new MechWeapon(data.data, data.data.pack);
      item.FromInstance = true;
    }

    item._mod = data.mod ? WeaponMod.Deserialize(data.mod) : null;
    item._note = data.note;
    item._flavor_name = data.flavorName || '';
    item._flavor_description = data.flavorDescription || '';
    item.max_use_override = MechWeapon.SanitizeUsesInput(data.maxUseOverride || 0);
    item._selected_profile = data.selectedProfile || 0;
    item._custom_damage_type = data.customDamageType || null;
    item._custom_range = data.customRange || null;
    item._custom_weapon_type = data.customWeaponType || null;
    item._custom_tags = data.customTags || null;
    item._custom_effect = data.customEffect || null;

    // combat props
    // item.MaxUses = data.maxUses || 0;
    item.Uses = data.currentUses || 0;
    item.Destroyed = data.destroyed || false;
    item.Used = data.isUsed || false;
    return item;
  }
}

export { MechWeapon };
export type { IMechWeaponData, IMechWeaponSaveData };
