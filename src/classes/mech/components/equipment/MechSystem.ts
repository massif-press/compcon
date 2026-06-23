import { CompendiumStore } from '@/features/compendium/store'
import { ContentPack } from '../../../ContentPack'
import { SystemType, ItemType, ActivationType } from '../../../enums'
import { IEquipmentData, IMechEquipmentData, MechEquipment } from './MechEquipment'

interface IMechSystemData extends IMechEquipmentData {
  type: SystemType
}

class MechSystem extends MechEquipment {
  private _system_type: SystemType

  public constructor(data: IMechSystemData, pack?: ContentPack) {
    super(data, pack)
    this._system_type = data.type || SystemType.System
    this.ItemType = ItemType.MechSystem
  }

  public get Type(): SystemType {
    if (this.Tags.length) {
      let mType
      if (this.Tags.some(x => x.ID === 'tg_grenade')) mType = SystemType.Grenade
      else if (this.Tags.some(x => x.ID === 'tg_mine')) mType = SystemType.Mine
      else if (this.Tags.some(x => x.ID === 'tg_shield')) mType = SystemType.Shield

      if (mType) return mType as SystemType
    }

    if (this.Actions.some(a => a.Activation === ActivationType.Invade))
      this._system_type = SystemType.Invade

    return this._system_type
  }

  public get Color(): string {
    return 'system'
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    const data = {
      id: item.ID,
      data: item.ItemData,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
    }

    // combat props
    return {
      ...data,
      maxUses: item.MaxUses,
      currentUses: item.Uses,
      destroyed: item.Destroyed,
      isUsed: item.Used,
    } as IEquipmentData
  }

  public static Deserialize(data: IEquipmentData): MechSystem {
    let item
    if (CompendiumStore().has('MechSystems', data.id))
      item = CompendiumStore().instantiate('MechSystems', data.id) as MechSystem
    else {
      if (!data.data)
        throw new Error(`LCP item "${data.id}" is not installed and no instance data was saved`)
      item = new MechSystem(data.data, data.data.pack)
      item.FromInstance = true
    }

    item._note = data.note
    item._flavor_name = data.flavorName || ''
    item._flavor_description = data.flavorDescription || ''

    item.Uses = data.currentUses || 0
    item.Destroyed = data.destroyed || false
    item.Used = data.isUsed || false

    return item
  }
}

export { MechSystem }
export type { IMechSystemData }
