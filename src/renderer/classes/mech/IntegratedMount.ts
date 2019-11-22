import { Mount, MechWeapon, MountType } from '@/class'

class IntegratedMount extends Mount {
  private _item_source: string

  public constructor(intWeapon: MechWeapon, itemSource: string) {
    super(MountType.Integrated)
    this.slots[0].EquipWeapon(intWeapon)
    this._item_source = itemSource
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon
  }

  public get ItemSource(): string {
    return this._item_source
  }

  public static Serialize(m: IntegratedMount): { weapon: IMechWeaponSaveData; source: string } {
    return {
      weapon: MechWeapon.Serialize(m.Weapon),
      source: m.ItemSource,
    }
  }

  public static Deserialize(mountData: any): IntegratedMount {
    const im = new IntegratedMount(MechWeapon.Deserialize(mountData.weapon), mountData.source)
    im.getID()
    return im
  }
}

export default IntegratedMount
