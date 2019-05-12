import store from "@/store";
import { LicensedItem, Tag } from '..';

class MechSystem extends LicensedItem {
  private system_type: SystemType
  private sp: number
  private tags: Tag[]
  private effect: string
  private integrated: boolean;

  constructor(id: string) {
    const systemData = store.getters.getItemById("MechSystems", id);
    super(systemData);
    this.sp = systemData.sp || 0;
    this.system_type = systemData.type;
    this.tags = systemData.tags;
    this.effect = systemData.effect;
    this.integrated = systemData.talent_item || false
    this.item_type = ItemType.MechSystem;
  }

  public get SP(): number {
    return this.sp;
  }

  public get Type(): SystemType {
    return this.system_type;
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

}

export default MechSystem