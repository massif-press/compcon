import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer'
import _ from 'lodash'
import { Bonus } from '../../../components/feature/bonus/Bonus'
import { Pilot } from '../../Pilot'
import { CoreBonus } from './CoreBonus'

interface ICoreBonusSaveData {
  core_bonuses: string[]
}

class CoreBonusController implements IFeatureContainer {
  public readonly Parent: Pilot
  private _core_bonuses: CoreBonus[]

  public constructor(parent: Pilot) {
    this.Parent = parent
    this._core_bonuses = []
  }

  get FeatureSource(): any[] {
    return this.CoreBonuses
  }

  public get CoreBonuses(): CoreBonus[] {
    return this._core_bonuses
  }

  public set CoreBonuses(coreBonuses: CoreBonus[]) {
    this._core_bonuses = coreBonuses
    this.Parent.SaveController.save()
  }

  public get CurrentCBPoints(): number {
    return this._core_bonuses.length
  }

  public get MaxCBPoints(): number {
    return Bonus.Int(Math.floor(this.Parent.Level / 3), 'cb_point', this.Parent)
  }

  public get IsMissingCBs(): boolean {
    return this.CurrentCBPoints < this.MaxCBPoints
  }

  public get HasCBs(): boolean {
    return this.CurrentCBPoints === this.MaxCBPoints
  }

  public AddCoreBonus(coreBonus: CoreBonus): void {
    this._core_bonuses.push(coreBonus)
    this.Parent.SaveController.save()
  }

  public RemoveCoreBonus(coreBonus: CoreBonus): void {
    const index = this._core_bonuses.findIndex(x => _.isEqual(coreBonus, x))
    if (index === -1) {
      console.error(
        `CORE Bonus "${coreBonus.Name}" does not exist on Pilot ${this.Parent.Callsign}`
      )
    } else {
      this._core_bonuses.splice(index, 1)
      this.removeCoreBonuses(coreBonus)
    }
    this.Parent.SaveController.save()
  }

  public ClearCoreBonuses(): void {
    for (let i = this._core_bonuses.length - 1; i >= 0; i--) {
      this.RemoveCoreBonus(this._core_bonuses[i])
    }
  }

  private removeCoreBonuses(coreBonus: CoreBonus): void {
    this.Parent.Mechs.forEach(mech => {
      mech.MechLoadoutController.Loadouts.forEach(loadout => {
        if (coreBonus.ID === 'cb_mount_retrofitting') loadout.RemoveRetrofitting()
        if (coreBonus.ID === 'cb_improved_armament') loadout.ImprovedArmamentMount.Clear()
        if (coreBonus.ID === 'cb_superheavy_mounting') {
          loadout.SuperheavyMount.Clear()
          loadout.AllEquippableMounts(true, true, true).forEach(mount => {
            mount.Unlock()
          })
        }
        if (coreBonus.ID === 'cb_integrated_weapon') loadout.IntegratedWeaponMount.Clear()
        loadout.AllEquippableMounts(true).forEach(mount => {
          mount.RemoveCoreBonus(coreBonus)
        })
      })
    })
  }

  public static Serialize(parent: Pilot, target: any) {
    target.core_bonuses = parent.CoreBonusController.CoreBonuses.map(x => x.ID)
  }

  public static Deserialize(parent: Pilot, data: ICoreBonusSaveData) {
    if (!parent.CoreBonusController)
      throw new Error(
        `CoreBonusController not found on parent (${typeof parent}). New CoreBonusControllers must be instantiated in the parent's constructor method.`
      )

    parent.CoreBonusController._core_bonuses = data.core_bonuses.map((x: string) =>
      CoreBonus.Deserialize(x)
    )
  }
}

export { ICoreBonusSaveData, CoreBonusController }
