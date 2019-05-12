import store from "@/store";
import { LicensedItem, Damage, Range, WeaponMod, Tag } from "..";

// TODO:
class WeaponAmmo {}

class MechWeapon extends LicensedItem {
  private sp: number;
  private size: WeaponSize;
  private weapon_type: WeaponType;
  private damage?: Damage[];
  private range?: Range[];
  private tags: Tag[];
  private effect: string;
  private integrated: boolean;

  private mod?: WeaponMod | null;
  private ammo?: WeaponAmmo | null;

  constructor(id: string) {
    const weaponData = store.getters.getItemById("MechWeapons", id);
    super(weaponData);
    this.sp = weaponData.sp || 0;
    this.size = weaponData.size;
    this.weapon_type = weaponData.type;
    this.damage = weaponData.damage.map((x: any) => new Damage(x));
    this.range = weaponData.range.map((x: any) => new Range(x));
    this.tags = weaponData.tags;
    this.effect = weaponData.effect;
    this.integrated = weaponData.frame_id;
    this.item_type = ItemType.MechWeapon;
  }

  public get SP(): number {
    return this.sp;
  }

  public get Size(): WeaponSize {
    return this.size;
  }

  public get Type(): WeaponType {
    return this.weapon_type;
  }

  public get Damage(): Damage[] {
    return this.damage || [];
  }

  public get Range(): Range[] {
    return this.range || [];
  }

  public get Tags(): Tag[] {
    return this.tags;
  }

  public get Effect(): string {
    return this.effect;
  }

  public get IsIntegrated(): boolean {
    return this.integrated;
  }

  public set Mod(mod: WeaponMod | null) {
    this.mod = mod;
  }

  public get Mod(): WeaponMod | null {
    return this.mod || null;
  }

  public set Ammo(ammo: WeaponAmmo | null) {
    this.ammo = ammo;
  }

  public get Ammo(): WeaponAmmo | null {
    return this.ammo || null;
  }
}

export default MechWeapon;