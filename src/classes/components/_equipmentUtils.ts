import { CompendiumStore } from '@/features/compendium/store'
import { CompendiumItem } from '../CompendiumItem'
import { MechEquipment } from '../mech/components/equipment/MechEquipment'

export function resolveSpecialEquipment(ids: string[]): CompendiumItem[] {
  if (!ids) return []
  const res = ids.map(x => {
    const w = CompendiumStore().MechWeapons.find(item => item.ID === x)
    if (w) return w
    const s = CompendiumStore().MechSystems.find(item => item.ID === x)
    if (s) return s
    const wm = CompendiumStore().WeaponMods.find(item => item.ID === x)
    if (wm) return wm
    const pg = CompendiumStore().PilotGear.find((item: any) => item.ID === x)
    if (pg) return pg
    return false
  })
  return res as CompendiumItem[]
}

export function resolveIntegratedEquipment(ids: string[]): MechEquipment[] {
  if (!ids) return []
  return ids.map(x => {
    const w = CompendiumStore().MechWeapons.find(item => item.ID === x)
    if (w) return w as MechEquipment
    return CompendiumStore().MechSystems.find(item => item.ID === x) as MechEquipment
  }) as MechEquipment[]
}
