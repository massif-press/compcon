import _ from 'lodash'
import { store } from '../../../../store'
import { Manufacturer } from '../../../Manufacturer'
import { Frame } from '../../../mech/components/frame/Frame'
import { Pilot } from '../../Pilot'
import { LicensedItem } from './LicensedItem'

class License {
  public readonly Name: string
  public readonly Source: string
  public readonly FrameID: string
  public readonly Brew: string
  public readonly Unlocks: LicensedItem[][]
  public readonly Specialty: boolean
  public readonly Prerequisite?: { source: string; min_rank: number; cumulative?: boolean }
  public readonly Hidden: boolean

  public constructor(frame: Frame, variants?: Frame[]) {
    this.Name = frame.Name
    this.Source = frame.Source
    this.FrameID = frame.ID
    this.Brew = frame.Brew || 'Core'

    function licenseMatch(licenseItem: LicensedItem, licenseFrame: Frame): boolean {
      if (!!licenseItem.LicenseID) {
        return licenseItem.LicenseID === licenseFrame.ID
      } else {
        return (
          licenseItem.License.toUpperCase() === licenseFrame.Name.toUpperCase() &&
          licenseItem.Source.toUpperCase() === licenseFrame.Source.toUpperCase()
        )
      }
    }

    const items: LicensedItem[] = _.cloneDeep(store.getters.getItemCollection('MechWeapons'))
      .concat(
        store.getters.getItemCollection('WeaponMods'),
        store.getters.getItemCollection('MechSystems')
      )
      .filter((x: LicensedItem) => licenseMatch(x, frame))

    const lls = [...items].map(i => i.LicenseLevel)

    const max = lls.length ? Math.max(...lls) : frame.LicenseLevel

    this.Unlocks = new Array<LicensedItem[]>(max).fill([])

    for (let i = 0; i < this.Unlocks.length; i++) {
      this.Unlocks[i] = items.filter(x => x.LicenseLevel === i + 1)
    }

    this.Specialty = !!frame.Specialty
    if (typeof frame.Specialty !== 'boolean') {
      this.Prerequisite = frame.Specialty
    }

    if (frame.LicenseLevel && !this.Specialty) this.Unlocks[frame.LicenseLevel - 1].unshift(frame)

    if (variants && variants.length) {
      variants.forEach(v => {
        this.Unlocks[v.LicenseLevel - 1].push(v)
      })
    }

    if (frame.IsVariantFrame) this.Hidden = true
  }

  public CanSelect(pilot: Pilot): boolean {
    if (!pilot.LicenseController.IsMissingLicenses) return false
    if (!this.Specialty || !this.Prerequisite) return true
    if (this.Prerequisite.cumulative) {
      const rankTotal = pilot.LicenseController.Licenses.filter(
        x => x.License.Source === this.Prerequisite.source && x.Rank
      ).reduce((a, b) => +a + +b.Rank, 0)
      return rankTotal >= this.Prerequisite.min_rank
    }
    return pilot.LicenseController.Licenses.some(
      x => x.License.Source === this.Prerequisite.source && x.Rank >= this.Prerequisite.min_rank
    )
  }

  public get Manufacturer(): Manufacturer {
    return store.getters.referenceByID('Manufacturers', this.Source)
  }

  public get MaxRank(): number {
    return this.Unlocks.length
  }

  public UnlockByRank(rank: number): LicensedItem[] {
    return this.Unlocks[rank - 1]
  }

  public UnlocksByTotalRank(rank: number): LicensedItem[] {
    let out = this.Unlocks.flatMap(x => x)
    out = out.filter(x => x.LicenseLevel <= rank)
    return out
  }

  public ToString(): string {
    return `${this.Source} ${this.Name}`
  }

  public static Deserialize(frameId: string): License {
    return new License(store.getters.referenceByID('Frames', frameId))
  }
}

export default License
