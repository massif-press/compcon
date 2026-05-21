import { CompendiumStore } from '@/features/compendium/store'
import { ContentPack } from '../../../../ContentPack'
import { IPilotEquipmentData, PilotEquipment } from './PilotEquipment'
import { PilotArmor } from './PilotArmor'
import { PilotGear } from './PilotGear'
import { IPilotWeaponData, PilotWeapon } from './PilotWeapon'
import { IEquipmentData } from '@/classes/mech/components/equipment/MechEquipment'

function PilotEquipmentFactory<T>(data: IPilotEquipmentData, pack?: ContentPack): T {
  if ((data as any).InstanceID) return data as T
  if (data.type?.toLowerCase() === 'armor') return new PilotArmor(data, pack) as T
  if (data.type?.toLowerCase() === 'weapon')
    return new PilotWeapon(data as IPilotWeaponData, pack) as T
  return new PilotGear(data) as T
}

function DeserializePilotEquipment(itemData: IEquipmentData): PilotEquipment | null {
  if (!itemData) return null
  let item
  if (CompendiumStore().has('PilotGear', itemData.id))
    item = CompendiumStore().instantiate('PilotGear', itemData.id)
  else {
    item = PilotEquipmentFactory(itemData.data) as PilotEquipment
    item.FromInstance = true
  }
  item._note = itemData.note
  item._flavor_name = itemData.flavorName
  item._flavor_description =
    itemData.flavorDescription === item._description ? '' : itemData.flavorDescription
  item._custom_damage_type = itemData.customDamageType || null

  if (itemData.maxUses) item.max_use_override = itemData.maxUses
  if (itemData.currentUses) item.Uses = itemData.currentUses
  if (itemData.destroyed) item.Destroyed = itemData.destroyed
  if (itemData.isUsed) item.Used = itemData.isUsed

  return item
}

export { PilotEquipmentFactory, DeserializePilotEquipment }
