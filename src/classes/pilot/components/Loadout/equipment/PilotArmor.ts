import { PilotEquipment, ItemType } from '@/class'
import { IBonusDataContainer } from '@/classes/components/feature/bonus/IBonusDataContainer'
import { IPilotEquipmentData, ITagCompendiumData } from '@/interface'
import { Bonus } from '../../../../components/feature/bonus/Bonus'

interface IPilotArmorData extends IPilotEquipmentData {
  hp_bonus?: number
  speed?: number
  armor?: number
  edef?: number
  edef_bonus?: number
  evasion?: number
  evasion_bonus?: number
}

class PilotArmor extends PilotEquipment {
  public readonly HPBonus: string
  public readonly Speed: string
  public readonly Armor: string
  public readonly EDefense: string
  public readonly Evasion: string

  public constructor(data: IPilotArmorData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.HPBonus = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_hp')
    this.Speed = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_speed')
    this.Armor = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_armor')
    this.EDefense = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_edef')
    this.Evasion = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_evasion')
    this.ItemType = ItemType.PilotArmor
  }

  public get Icon(): string {
    return 'cci-pilot'
  }
}

export { PilotArmor, IPilotArmorData }
