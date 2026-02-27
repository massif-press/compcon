import { ContentPack } from './ContentPack'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import type { ISerializableStatic } from './ISerializable'

interface IDowntimeActionData {
  id: string
  name: string
  terse: string
  detail: string
  table?: {
    detail: string
    die: string
    results: TableResult[]
  }
}

type TableResult = {
  min: number
  max: number
  text: string
}

class DowntimeAction implements ILcpTracked {
  public readonly ID: string
  public readonly Name: string
  public readonly Terse: string
  public readonly Detail: string
  public readonly Table?: {
    detail: string
    die: string
    results: TableResult[]
  }
  public readonly ItemType: ItemType = ItemType.DowntimeAction
  public LcpName: string = ''
  public InLcp: boolean = false

  public constructor(data: IDowntimeActionData, pack?: ContentPack) {
    this.ID = data.id
    this.Name = data.name
    this.Terse = data.terse
    this.Detail = data.detail
    if (data.table) {
      this.Table = {
        detail: data.table.detail,
        die: data.table.die,
        results: data.table.results,
      }
    }
    applyLcpTracking(this, pack)
  }

  public static Serialize(action: DowntimeAction): IDowntimeActionData {
    return {
      id: action.ID,
      name: action.Name,
      terse: action.Terse,
      detail: action.Detail,
      table: action.Table,
    }
  }

  public static Deserialize(data: IDowntimeActionData, pack?: ContentPack): DowntimeAction {
    return new DowntimeAction(data, pack)
  }

  public get Icon(): string {
    return 'cc:downtime'
  }
}

// Compile-time check: DowntimeAction satisfies ISerializableStatic
const _checkSerializable: ISerializableStatic<IDowntimeActionData, DowntimeAction> = DowntimeAction
void _checkSerializable

export { DowntimeAction }
export type { IDowntimeActionData }
