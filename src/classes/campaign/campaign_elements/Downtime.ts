import { ISubItemData, SubItem } from "./SubItem";

interface IDowntimeData extends ISubItemData {
}

class Downtime extends SubItem {

  constructor(data: IDowntimeData) {
    super(data)
    this.ItemType = 'Downtime'
  }

  public static Serialize(d: Downtime): IDowntimeData {
    return {
      id: d.ID,
      title: d.Title,
      content: d.Content,
      item_type: 'Downtime'
    }
  }

  public static Deserialize(data: IDowntimeData): Downtime {
    return new Downtime(data)
  }
}

export { IDowntimeData, Downtime }