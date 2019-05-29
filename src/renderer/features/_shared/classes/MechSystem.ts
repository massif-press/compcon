import store from "@/store";
import { MechEquipment, SystemType, ItemType } from "@/class";

class MechSystem extends MechEquipment {
  private system_type: SystemType;

  constructor(systemData: any) {
    super(systemData);
    this.system_type = systemData.type;
    this.item_type = ItemType.MechSystem;
  }

  public get Type(): SystemType {
    return this.system_type;
  }

  public get IsUnique(): boolean {
    return this.Tags.some(x => x.IsUnique)
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    return { id: item.ID, notes: item.Notes };
  }

  public static Deserialize(itemData: IEquipmentData): MechSystem {
    let item = store.getters.getItemById("MechSystem", itemData.id);
    item.Notes = itemData.notes;
    return item;
  }
}

export default MechSystem