import { v4 as uuid } from 'uuid'
import { ContentPack } from './ContentPack'
import { ItemType } from './enums'
import { applyLcpTracking, type ILcpTracked } from './LcpItemMixin'
import type { ISerializableStatic } from './ISerializable'

interface IStatusData {
  id?: string
  name: string
  type: string
  icon: string
  effects: string[]
  terse?: string
  svg?: string
}

class Status implements ILcpTracked {
  public readonly ID: string
  public readonly InstanceID: string
  public readonly Name: string
  public readonly Effects: string[]
  public readonly Terse: string
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Status
  public readonly StatusType: string = 'Status'
  private _icon: string
  private _svg: string

  public constructor(data: IStatusData, pack?: ContentPack) {
    this.ID = data.id || `${pack?.Name || 'Lancer Core Book'}_${data.name}`.replace(/ /g, '_')
    this.InstanceID = uuid()
    this.Name = data.name
    this.Effects = data.effects
    if (data.terse) this.Terse = data.terse
    else if (Array.isArray(data.effects)) this.Terse = data.effects.join(', ')
    else this.Terse = data.effects
    this._icon = data.icon
    this._svg = data.svg || ''
    this.StatusType = data.type
    applyLcpTracking(this, pack)
  }

  public static Serialize(status: Status): IStatusData {
    return {
      id: status.ID,
      name: status.Name,
      type: status.StatusType,
      icon: status._icon,
      effects: status.Effects,
      terse: status.Terse,
      svg: status._svg,
    }
  }

  public static Deserialize(data: IStatusData, pack?: ContentPack): Status {
    return new Status(data, pack)
  }

  public get Svg(): string {
    return this._svg
  }

  public get Icon(): string {
    if (!this._icon) return 'cc:talent'
    return `cc:${this.StatusType.toLowerCase()}_${this._icon.replaceAll(/-|_/g, '').toLowerCase()}`
  }
}

// Compile-time check: Status satisfies ISerializableStatic
const _checkSerializable: ISerializableStatic<IStatusData, Status> = Status
void _checkSerializable

export { Status }
export type { IStatusData }
