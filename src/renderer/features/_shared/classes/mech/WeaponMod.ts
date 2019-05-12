import store from "@/store";
import { LicensedItem, Tag } from '..'

class WeaponMod extends LicensedItem {
  private sp: number;
  private applied_to: WeaponType[];
  private applied_string: string;
  private effect: string;
  private restricted_sizes: WeaponSize[];
  private tags: Tag[];

  constructor(id: string) {
    const weaponModData = store.getters.getItemById("WeaponMods", id);
    super(weaponModData);
    this.sp = weaponModData.sp;
    this.applied_to = weaponModData.applied_to;
    this.applied_string = weaponModData.applied_string;
    this.effect = weaponModData.effect;
    this.description = weaponModData.description;
    this.restricted_sizes = weaponModData.restricted_sizes;
    this.tags = weaponModData.tags;
    this.item_type = ItemType.Mod;
  }

  public get SP(): number {
    return this.sp;
  }

  public get AppliedTo(): WeaponType[] {
    return this.applied_to;
  }

  public get AppliedString(): string {
    return this.applied_string;
  }

  public get Effect(): string {
    return this.effect;
  }

  public get Restricted(): WeaponSize[] {
    return this.restricted_sizes;
  }

  public get Tags(): Tag[] {
    return this.tags;
  }

}

export default WeaponMod