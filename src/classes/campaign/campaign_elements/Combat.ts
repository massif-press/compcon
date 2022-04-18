import { ISubItemData, SubItem } from "./SubItem";

interface ICombatData extends ISubItemData {
}

class Combat extends SubItem {

  constructor(data: ICombatData) {
    super(data)
    this.ItemType = 'Combat'
  }

  public static Serialize(b: Combat): ICombatData {
    return {
      id: b.ID,
      title: b.Title,
      content: b.Content,
      item_type: 'Combat'
    }
  }

  public static Deserialize(data: ICombatData): Combat {
    return new Combat(data)
  }
}

export { ICombatData, Combat }