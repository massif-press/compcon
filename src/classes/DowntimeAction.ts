import { ContentPack } from './ContentPack'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import type { ISerializableStatic } from './ISerializable'
import { localize, localizeNested } from '@/i18n/localize'

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
  private readonly _name: string
  private readonly _terse: string
  private readonly _detail: string
  private readonly _table?: {
    detail: string
    die: string
    results: TableResult[]
  }
  public readonly ItemType: ItemType = ItemType.DowntimeAction
  public LcpName: string = ''
  public InLcp: boolean = false

  public constructor(data: IDowntimeActionData, pack?: ContentPack) {
    this.ID = data.id
    this._name = data.name
    this._terse = data.terse
    this._detail = data.detail
    this._table = data.table // raw (stamped) so the table getter can localize its detail
    applyLcpTracking(this, pack)
  }

  public get Name(): string {
    return localize(this.ID, 'name', this._name)
  }
  public get Terse(): string {
    return localize(this.ID, 'terse', this._terse)
  }
  public get Detail(): string {
    return localize(this.ID, 'detail', this._detail)
  }
  public get Table(): { detail: string; die: string; results: TableResult[] } | undefined {
    if (!this._table) return undefined
    return {
      detail: localizeNested(this._table, 'detail', this._table.detail),
      die: this._table.die,
      results: this._table.results,
    }
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
