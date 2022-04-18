import uuid from 'uuid/v4'
import { Clock } from '../Clock'
import { RollableTable } from '../RollableTable'

interface ISubItemData {
  id?: string
  title?: string
  item_number?: string
  content?: any[]
  item_type: string
}

interface ILinkedContent {
  item_id: string
  options: string[]
  item_type: string
}

abstract class SubItem {
  public readonly ID: string
  public Title: string
  public ItemNumber: string
  public Content: any[]
  public ItemType: string

  constructor(data: ISubItemData) {
    this.ID = data.id || uuid()
    this.Title = data.title || `New ${data.item_type || 'Item'}`
    this.ItemNumber = data.item_number || ''
    this.Content = data.content || []
  }

  public AddTextArea() {
    this.Content.push({
      title: 'New Text Area'
    })
  }

  public AddClock() {
    this.Content.push(new Clock({}))
  }

  public AddTable() {
    this.Content.push(new RollableTable({}))
  }

  public AddLink(item: ILinkedContent) {
    this.Content.push(item)
  }

  public MoveItem(from: number, to: number) {
    this.Content.splice(to, 0, this.Content.splice(from, 1)[0]);
  }

  public DeleteItem(index: number) {
    this.Content.splice(index, 1)
  }

}

export { ISubItemData, SubItem }