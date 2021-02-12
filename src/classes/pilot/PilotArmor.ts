import { PilotEquipment, ItemType } from '@/class'
import { IPilotEquipmentData, ITagCompendiumData } from '@/interface'

interface IPilotArmorData extends IPilotEquipmentData {
  hp_bonus?: number
  speed?: number
  speed_bonus?: number
  armor?: number
  edef?: number
  edef_bonus?: number
  evasion?: number
  evasion_bonus?: number
}

class PilotArmor extends PilotEquipment {
  public readonly HPBonus: number
  public readonly Speed: number
  public readonly SpeedBonus: number
  public readonly Armor: number
  public readonly EDefense: number
  public readonly EDefenseBonus: number
  public readonly Evasion: number
  public readonly EvasionBonus: number

  public constructor(data: IPilotArmorData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.HPBonus = data.hp_bonus || 0
    this.Speed = data.speed || 0
    this.SpeedBonus = data.speed_bonus || 0
    this.Armor = data.armor || 0
    this.EDefense = data.edef || 0
    this.EDefenseBonus = data.edef_bonus || 0
    this.Evasion = data.evasion || 0
    this.EvasionBonus = data.evasion_bonus || 0
    this.ItemType = ItemType.PilotArmor
  }
}

export { PilotArmor, IPilotArmorData }
