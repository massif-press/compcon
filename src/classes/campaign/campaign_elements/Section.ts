import { Beat, IBeatData } from "./Beat";
import { Downtime, IDowntimeData } from "./Downtime";
import { Mission, IMissionData } from "./Mission";
import { ISubItemData, SubItem } from "./SubItem";

interface ISectionData extends ISubItemData {
  children: ISubItemData[]
}

class Section extends SubItem {
  public Children: SubItem[]

  constructor(data: ISectionData) {
    super(data)
    const children = []
    if (data.children) {
      data.children.forEach(c => {
        if (c.item_type === 'Beat') children.push(Beat.Deserialize(c as unknown as IBeatData))
        else if (c.item_type === 'Mission') children.push(Mission.Deserialize(c as unknown as IMissionData))
        else children.push(Downtime.Deserialize(c as unknown as IDowntimeData))
      });
    }
    this.Children = children
    this.ItemType = 'Section'
  }

  public AddBeat() {
    this.Children.push(new Beat({
      combats: [],
      item_type: 'Beat'
    }))
  }

  public AddMission() {
    this.Children.push(new Mission({
      beats: [],
      item_type: 'Mission'
    }))
  }

  public AddDowntime() {
    this.Children.push(new Downtime({
      item_type: 'Downtime'
    }))
  }

  public MoveChild(from: number, to: number) {
    this.Children.splice(to, 0, this.Children.splice(from, 1)[0]);
  }

  public DeleteChild(item: SubItem) {
    const idx = this.Children.findIndex(x => x.ID === item.ID)
    if (idx === -1) return
    this.Children.splice(idx, 1)
  }

  public static Serialize(s: Section): ISectionData {
    const childData = []
    s.Children.forEach(c => {
      if (c.ItemType === 'Beat') childData.push(Beat.Serialize(c as Beat))
      else if (c.ItemType === 'Mission') childData.push(Mission.Serialize(c as Mission))
      else childData.push(Downtime.Serialize(c as Downtime))
    });

    return {
      id: s.ID,
      title: s.Title,
      content: s.Content,
      children: childData,
      item_type: 'Section'
    }
  }

  public static Deserialize(data: ISectionData): Section {
    return new Section(data)
  }
}

export { ISectionData, Section }