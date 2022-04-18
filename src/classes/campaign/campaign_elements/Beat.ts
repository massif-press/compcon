import { Combat, ICombatData } from "./Combat";
import { ISubItemData, SubItem } from "./SubItem";

interface IBeatData extends ISubItemData {
  combats: ICombatData[]
}

class Beat extends SubItem {
  public Combats: Combat[]

  constructor(data: IBeatData) {
    super(data)
    this.Combats = data.combats.map(c => Combat.Deserialize(c))
    this.ItemType = 'Beat'
  }

  public get Children(): Combat[] {
    return this.Combats
  }

  public AddCombat() {
    this.Combats.push(new Combat({
      item_type: 'Combat'
    }))
  }

  public MoveCombat(from: number, to: number) {
    this.Combats.splice(to, 0, this.Combats.splice(from, 1)[0]);
  }

  public DeleteCombat(item: SubItem) {
    const idx = this.Combats.findIndex(x => x.ID === item.ID)
    if (idx === -1) return
    this.Combats.splice(idx, 1)
  }

  public static Serialize(b: Beat): IBeatData {
    return {
      id: b.ID,
      title: b.Title,
      content: b.Content,
      combats: b.Combats.map(c => Combat.Serialize(c)),
      item_type: 'Beat'
    }
  }

  public static Deserialize(data: IBeatData): Beat {
    return new Beat(data)
  }
}

export { IBeatData, Beat }