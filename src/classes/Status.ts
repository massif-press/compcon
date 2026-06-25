import { ContentPack } from './ContentPack'
import { localize } from '@/i18n/localize'
import { ItemType } from './enums'
import { applyLcpTracking, DEFAULT_LCP_NAME, type ILcpTracked } from './LcpItemMixin'
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
  private _name: string
  public readonly Effects: string[]
  private _terse: string
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Status
  public readonly StatusType: string = 'Status'
  private _icon: string
  private _svg: string

  public constructor(data: IStatusData, pack?: ContentPack) {
    this.ID = data.id || `${pack?.Name || DEFAULT_LCP_NAME}_${data.name}`.replace(/ /g, '_')
<<<<<<< Updated upstream
    this.InstanceID = uuid()
    this._name = data.name
=======
    this.InstanceID = crypto.randomUUID()
    this.Name = data.name
>>>>>>> Stashed changes
    this.Effects = data.effects
    if (data.terse) this._terse = data.terse
    else if (Array.isArray(data.effects)) this._terse = data.effects.join(', ')
    else this._terse = data.effects as unknown as string
    this._icon = data.icon
    this._svg = data.svg || ''
    this.StatusType = data.type
    applyLcpTracking(this, pack)
  }

  public get Name(): string { return localize(this.ID, 'name', this._name) }
  public get Terse(): string { return localize(this.ID, 'terse', this._terse) }

  public static Serialize(status: Status): IStatusData {
    return {
      id: status.ID,
      name: status._name,
      type: status.StatusType,
      icon: status._icon,
      effects: status.Effects,
      terse: status._terse,
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
