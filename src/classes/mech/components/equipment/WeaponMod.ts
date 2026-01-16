import { CompendiumStore } from '@/stores';
import {
  Tag,
  WeaponType,
  WeaponSize,
  ItemType,
  Damage,
  Range,
  MechEquipment,
  SystemType,
  ContentPack,
} from '@/class';
import {
  IDamageData,
  IRangeData,
  IMechEquipmentData,
  ITagCompendiumData,
  ITagData,
  IEquipmentData,
  IContentPack,
} from '@/interface';
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect';

interface IWeaponModData extends IMechEquipmentData {
  allowed_types?: WeaponType[];
  allowed_sizes?: WeaponSize[];
  restricted_types?: WeaponType[];
  restricted_sizes?: WeaponSize[];
  added_tags?: ITagData[];
  added_damage?: IDamageData[];
  added_range?: IRangeData[];
  on_miss?: string | IActiveEffectData;
  on_attack?: string | IActiveEffectData;
  on_hit?: string | IActiveEffectData;
  on_crit?: string | IActiveEffectData;
}

class WeaponMod extends MechEquipment {
  public readonly AllowedTypes: WeaponType[];
  public readonly AllowedSizes: WeaponSize[];
  public readonly RestrictedTypes: WeaponType[];
  public readonly RestrictedSizes: WeaponSize[];
  public readonly AddedTags: Tag[];
  public readonly AddedDamage: Damage[];
  public readonly AddedRange: Range[];

  public OnMiss?: ActiveEffect;
  public OnAttack?: ActiveEffect;
  public OnHit?: ActiveEffect;
  public OnCrit?: ActiveEffect;

  public constructor(data: IWeaponModData, pack?: ContentPack) {
    super(data as IMechEquipmentData, pack);
    this.AllowedTypes =
      data.allowed_types || Object.keys(WeaponType).map((k) => WeaponType[k as string]);
    this.AllowedSizes =
      data.allowed_sizes || Object.keys(WeaponSize).map((k) => WeaponSize[k as string]);
    this.RestrictedTypes = data.restricted_types || [];
    this.RestrictedSizes = data.restricted_sizes || [];
    this.AddedTags = data.added_tags
      ? Tag.Deserialize(data.added_tags, pack?.Data.tags, pack?.Name || '')
      : [];
    this.AddedDamage = data.added_damage ? data.added_damage.map((x) => new Damage(x)) : [];
    if (this.AddedDamage && this.AddedDamage.length)
      this.AddedDamage.forEach((d) => d.setDamageAttributes(this));

    this.AddedRange = data.added_range ? data.added_range.map((x) => new Range(x)) : [];

    if (data.on_miss) {
      if (typeof data.on_miss === 'string')
        this.OnMiss = new ActiveEffect({ name: 'On Miss Effect', detail: data.on_miss }, this);
      else this.OnMiss = new ActiveEffect(data.on_miss, this);
    }
    if (data.on_attack) {
      if (typeof data.on_attack === 'string')
        this.OnAttack = new ActiveEffect(
          { name: 'On Attack Effect', detail: data.on_attack },
          this
        );
      else this.OnAttack = new ActiveEffect(data.on_attack, this);
    }
    if (data.on_hit) {
      if (typeof data.on_hit === 'string')
        this.OnHit = new ActiveEffect({ name: 'On Hit Effect', detail: data.on_hit }, this);
      else this.OnHit = new ActiveEffect(data.on_hit, this);
    }
    if (data.on_crit) {
      if (typeof data.on_crit === 'string')
        this.OnCrit = new ActiveEffect({ name: 'On Crit Effect', detail: data.on_crit }, this);
      else this.OnCrit = new ActiveEffect(data.on_crit, this);
    }

    this.ItemType = ItemType.WeaponMod;
  }

  public get Color(): string {
    return 'mod';
  }

  public get Type(): SystemType {
    return SystemType.Mod;
  }

  public get PossibleTypes(): WeaponType[] {
    return this.AllowedTypes.filter(
      (x) => !this.RestrictedTypes.some((y) => y.toLowerCase() === x.toLowerCase())
    );
  }

  public get PossibleSizes(): WeaponSize[] {
    return this.AllowedSizes.filter(
      (x) => !this.RestrictedSizes.some((y) => y.toLowerCase() === x.toLowerCase())
    );
  }

  public static Serialize(item: WeaponMod): IEquipmentData {
    return {
      id: item.ID,
      data: item.ItemData,
      note: item.Note,
    };
  }

  public static Deserialize(data: IEquipmentData): WeaponMod {
    let item;
    if (CompendiumStore().has('WeaponMods', data.id))
      item = CompendiumStore().instantiate('WeaponMods', data.id) as WeaponMod;
    else {
      item = new WeaponMod(data.data, data.data.pack);
      item.FromInstance = true;
    }

    item._note = data.note;
    return item;
  }
}

export { WeaponMod };
export type { IWeaponModData };
