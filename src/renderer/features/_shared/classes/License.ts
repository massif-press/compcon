import { store } from '@/store'
import _ from 'lodash'
import { LicensedItem, Frame } from '@/class'

class License {
  private frame_id: string
  private source: string
  private name: string
  private unlocks: LicensedItem[][]
  private brew: string

  constructor(frame: Frame) {
    this.frame_id = frame.ID
    this.source = frame.Source
    this.name = frame.Name
    this.brew = frame.Brew || 'Core'

    let items: LicensedItem[] = _.clone(store.getters.getItemCollection('MechWeapons'))
      .concat(
        store.getters.getItemCollection('WeaponMods'),
        store.getters.getItemCollection('MechSystems')
      )
      .filter((x: LicensedItem) => x.License.toUpperCase() === this.Name.toUpperCase())

    this.unlocks = [
      items.filter(x => x.LicenseLevel === 1),
      items.filter(x => x.LicenseLevel === 2),
      items.filter(x => x.LicenseLevel === 3),
    ]

    // add frame unlock as the first item of LL2
    this.unlocks[1].unshift(frame)
  }

  public get Name(): string {
    return this.name
  }

  public get Source(): string {
    return this.source
  }

  public get FrameID(): string {
    return this.frame_id
  }

  public get Brew(): string {
    return this.brew
  }

  public get Unlocks(): LicensedItem[][] {
    return this.unlocks
  }

  public UnlockByRank(rank: number): LicensedItem[] {
    return this.unlocks[rank - 1]
  }

  public ToString(): string {
    return `${this.source} ${this.name}`
  }

  public static Deserialize(frame_id: string): License {
    return new License(store.getters.getItemById('Frames', frame_id))
  }
}

export default License
