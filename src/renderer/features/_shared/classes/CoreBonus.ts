import store from '@/store';
import { CompendiumItem } from '.'

class CoreBonus extends CompendiumItem {
  private source: string
  private effect: string
  private mounted_effect: string
  
  constructor(id: string) {
    const cbData = store.getters.getItemById('CoreBonuses', id)
    super(cbData)
    this.source = cbData.detail
    this.effect = cbData.detail
    this.mounted_effect = cbData.mounted_effect || ''
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

}

export default CoreBonus