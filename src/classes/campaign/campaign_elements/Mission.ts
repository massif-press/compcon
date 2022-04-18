import { Beat, IBeatData } from "./Beat";
import { ISubItemData, SubItem } from "./SubItem";

interface IMissionData extends ISubItemData {
  beats: IBeatData[]
}

class Mission extends SubItem {
  public Beats: Beat[]

  constructor(data: IMissionData) {
    super(data)
    this.Beats = data.beats.map(c => Beat.Deserialize(c))
    this.ItemType = 'Mission'
  }

  public get Children(): Beat[] {
    return this.Beats
  }

  public AddBeat() {
    this.Beats.push(new Beat({
      combats: [],
      item_type: 'Beat'
    }))
  }

  public MoveBeat(from: number, to: number) {
    this.Beats.splice(to, 0, this.Beats.splice(from, 1)[0]);
  }

  public DeleteBeat(item: SubItem) {
    const idx = this.Beats.findIndex(x => x.ID === item.ID)
    if (idx === -1) return
    this.Beats.splice(idx, 1)
  }

  public static Serialize(m: Mission): IMissionData {
    return {
      id: m.ID,
      title: m.Title,
      content: m.Content,
      beats: m.Beats.map(c => Beat.Serialize(c)),
      item_type: 'Mission'
    }
  }

  public static Deserialize(data: IMissionData): Mission {
    return new Mission(data)
  }
}

export { IMissionData, Mission }