import { CompendiumItem, ItemType } from '@/class'
import store from '@/store'

class CoreBonus extends CompendiumItem {
  private source: string
  private effect: string
  private mounted_effect: string

  constructor(cbData?: any) {
    super(cbData)
    this.source = cbData.source
    this.effect = cbData.effect
    this.mounted_effect = cbData.mounted_effect || ''
    this.item_type = ItemType.CoreBonus
  }

  public get Source(): string {
    return this.source
  }

  public get Effect(): string {
    return this.effect
  }

  public get MountedEffect(): string {
    return this.mounted_effect
  }

  public static Deserialize(id: string): CoreBonus {
    return store.getters.getItemById('CoreBonuses', id)
  }
}

export default CoreBonus
