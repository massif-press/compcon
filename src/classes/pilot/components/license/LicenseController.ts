import * as _ from 'lodash-es'
import type { IControllerStatic } from '@/classes/ISerializable'
import { Pilot } from '../../Pilot'
import License, { IRankedData } from './License'
import { PilotLicense } from './PilotLicense'
import { ItemType } from '../../../enums'
import { LicensedItem } from './LicensedItem'
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent'
import logger from '@/user/logger'
import { assertController } from '../../../utility/assertController'
import { RankedCollectionController } from '../RankedCollectionController'

interface ILicenseSaveData {
  licenses: IRankedData[]
}

class LicenseController extends RankedCollectionController<License, PilotLicense> {
  protected _findIndex(raw: License): number {
    return this._collection.findIndex(
      x => x.License?.FrameID === raw.FrameID || (x as any).Stub?.ID === raw.FrameID
    )
  }

  protected _createWrapper(raw: License): PilotLicense {
    return new PilotLicense(raw, 1)
  }

  protected _getRaw(wrapper: PilotLicense): License | null {
    return wrapper.License ?? null
  }

  protected _afterAdd(raw: License): void {
    if (!this.Parent.IsLevelEdit) {
      const index = this._findIndex(raw)
      if (index === -1) return
      const source = this._collection[index].License!.Source.toLowerCase()
      const level = this._collection[index].Rank

      if (level === 3) {
        AchievementEventSystem.emit('ll_any_single', 3)
        AchievementEventSystem.emit(`ll_${source}_single`, 3)
      }

      if (this.Parent.Level === 12 && !this.IsMissing) {
        if (!this._collection.filter(license => license.Rank === 3).length) {
          AchievementEventSystem.emit('multiclass')
        }

        if (this._collection.filter(license => license.Rank === 3).length === 4) {
          AchievementEventSystem.emit('rank_4_total', 4)
        }

        const sourceLevels = this._collection
          .filter(l => l.License)
          .reduce(
            (acc, license) => {
              const src = license.License!.Source.toLowerCase()
              if (!acc[src]) acc[src] = 0
              acc[src] += license.Rank
              return acc
            },
            {} as Record<string, number>
          )

        if (Object.keys(sourceLevels).length === 1 && Object.values(sourceLevels)[0] === 12) {
          switch (Object.keys(sourceLevels)[0]) {
            case 'ips-n':
              AchievementEventSystem.emit('ll_ips-n', 12)
              break
            case 'ssc':
              AchievementEventSystem.emit('ll_ssc', 12)
              break
            case 'ha':
              AchievementEventSystem.emit('ll_ha', 12)
              break
            case 'horus':
              AchievementEventSystem.emit('ll_horus', 12)
              break
          }
        }
      }
    }
  }

  public get MaxPoints(): number {
    const bonus = this.Parent.ReservesController.Reserves.filter(
      x => x.ID === 'reserve_license'
    ).length
    return this.Parent.Level + bonus
  }

  public get Licenses(): PilotLicense[] {
    return this._collection
  }

  public get LicensedItems(): LicensedItem[] {
    let arr = this._collection
      .filter(x => x.License)
      .flatMap(x => x.License!.UnlocksByTotalRank(x.Rank))
      .concat(this.Parent.SpecialEquipment as LicensedItem[])
      .concat(LicensedItem.AllUnlicensedItems(this.Parent))

    if (this.Parent.LcpConfig) {
      arr = arr.filter(
        x =>
          !x.InLcp ||
          this.Parent.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
          this.Parent.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
      )
    }

    return arr
  }

  public AllowedItems(type: ItemType): LicensedItem[] {
    const unlocked = this.LicensedItems.filter(x => x.ItemType === type)
    const special = this.Parent.SpecialEquipment.filter(x => x.ItemType === type) as LicensedItem[]
    return unlocked.concat(special)
  }

  public set Licenses(licenses: PilotLicense[]) {
    this._collection = licenses
    this.Parent.SaveController.save()
  }

  public LicenseLevel(manufacturerID: string): number {
    return this.Licenses.filter(
      x => x.License && x.License.Source.toLowerCase() === manufacturerID.toLowerCase()
    ).reduce((a, b) => +a + +b.Rank, 0)
  }

  public get CurrentLicensePoints(): number {
    return this.CurrentPoints
  }

  public get MaxLicensePoints(): number {
    return this.MaxPoints
  }

  public get IsMissingLicenses(): boolean {
    return this.IsMissing
  }

  public get HasLicenses(): boolean {
    return this.HasFull
  }

  public getLicenseRank(_name: string): number {
    const index = this._collection.findIndex(x => x.License && x.License.Name === _name)
    return index > -1 ? this._collection[index].Rank : 0
  }

  public AddLicense(license: License): void {
    this._addItem(license)
  }

  public get MissingLicenses(): PilotLicense[] {
    return this.Licenses.filter(x => !x.License)
  }

  public RemoveLicense(license: License): void {
    if (this._findIndex(license) === -1) {
      logger.error(
        `License "${license.ToString()}" does not exist on Pilot ${this.Parent.Callsign}`,
        this
      )
    }
    this._removeItem(license)
  }

  public ClearLicenses(): void {
    this._clearCollection()
  }

  public static Serialize(parent: Pilot, target: any) {
    target.licenses = parent.LicenseController.Licenses.map(x => PilotLicense.Serialize(x))
  }

  public static Deserialize(parent: Pilot, data: ILicenseSaveData) {
    assertController(parent.LicenseController, 'LicenseController')
    parent.LicenseController._collection = data.licenses.map((x: IRankedData) =>
      PilotLicense.Deserialize(x)
    )
  }
}

const _checkController: IControllerStatic<Pilot, ILicenseSaveData> = LicenseController
export { LicenseController }
export type { ILicenseSaveData }
