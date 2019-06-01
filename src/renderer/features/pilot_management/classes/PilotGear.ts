import store from "@/store";
import { CompendiumItem, Range, Damage, Tag, ItemType } from '@/class'

abstract class PilotEquipment extends CompendiumItem {
  private tags: ITagData[];
  private notes: string[];

  constructor(equipmentData: any) {
    super(equipmentData);
    this.tags = equipmentData.tags || [];
    this.notes = [];
  }

  public get Notes(): string[] {
    return this.notes;
  }

  public set Notes(notes: string[]) {
    this.notes = notes;
  }

  public AddNote(note: string) {
    this.notes.push(note);
  }

  public DeleteNote(index: number) {
    if (this.notes.length >= index) {
      this.notes.splice(index, 1);
    }
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags);
  }

  public static Serialize(item: PilotEquipment | null): IEquipmentData | null {
    if (!item) return null;
    return {
      id: item.ID,
      notes: item.Notes
    };
  }

  public static Deserialize(
    itemData: IEquipmentData | null
  ): PilotEquipment | null {
    if (!itemData) return null;
    const item = store.getters.getItemById("PilotGear", itemData.id);
    item.Notes = itemData.notes;
    return item;
  }
}

class PilotArmor extends PilotEquipment {
  private hp_bonus: number;
  private speed: number;
  private speed_bonus: number;
  private armor: number;
  private edef: number;
  private edef_bonus: number;
  private evasion: number;
  private evasion_bonus: number;

  constructor(armorData: any) {
    super(armorData);
    this.hp_bonus = armorData.hp_bonus || 0;
    this.speed = armorData.speed || 0;
    this.speed_bonus = armorData.speed_bonus || 0;
    this.armor = armorData.armor || 0;
    this.edef = armorData.edef || 0;
    this.edef_bonus = armorData.edef_bonus || 0;
    this.evasion = armorData.evasion || 0;
    this.evasion_bonus = armorData.evasion_bonus || 0;
    this.item_type = ItemType.PilotArmor;
  }

  public get HPBonus(): number {
    return this.hp_bonus;
  }

  public get Speed(): number {
    return this.speed;
  }

  public get SpeedBonus(): number {
    return this.speed_bonus;
  }

  public get Armor(): number {
    return this.armor;
  }

  public get EDefense(): number {
    return this.edef;
  }

  public get EDefenseBonus(): number {
    return this.edef_bonus;
  }

  public get Evasion(): number {
    return this.evasion;
  }

  public get EvasionBonus(): number {
    return this.evasion_bonus;
  }
}

class PilotWeapon extends PilotEquipment {
  private range: Range;
  private damage: Damage;
  private effect: string;

  constructor(weaponData: any) {
    super(weaponData);
    this.range = weaponData.range.map((x: any) => new Range(x));
    this.damage = weaponData.damage.map((x: any) => new Damage(x));
    this.effect = weaponData.effect || "";
    this.item_type = ItemType.PilotWeapon
  }

  public get Range(): Range {
    return this.range;
  }

  public get Damage(): Damage {
    return this.damage;
  }

  public get Effect(): string {
    return this.effect;
  }
}

class PilotGear extends PilotEquipment {
  private uses?: number;

  constructor(gearData: any) {
    super(gearData);
    this.uses = gearData.uses || null;
    this.item_type = ItemType.PilotGear;
  }

  public get Uses(): number | null {
    return this.uses || null;
  }
}

export {
  PilotEquipment,
  PilotArmor,
  PilotWeapon,
  PilotGear,
}