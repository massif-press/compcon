import * as _ from 'lodash-es'
import { WeaponType } from '../../../enums'
import type { MechSystem } from '../../../mech/components/equipment/MechSystem'
import type { MechWeapon } from '../../../mech/components/equipment/MechWeapon'
import type { CompendiumItem } from '../../../CompendiumItem'
import { ItemType } from '../../../enums'
import { FeatureController } from '../FeatureController'
import { IFeatureController } from '../IFeatureController'
import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'

interface ISynergyData {
  locations: string[]
  detail: string
  weapon_types?: string[]
  system_types?: string[]
  weapon_sizes?: string[]
}

class Synergy {
  public readonly Locations: string[]
  private _detail: string
  private _lkey?: string
  public readonly WeaponTypes: string[]
  public readonly WeaponSizes: string[]
  public readonly SystemTypes: string[]
  public readonly Origin: string

  public constructor(data: ISynergyData, origin: string) {
    this.Origin = origin || 'UNKNOWN ORIGIN'
    this.Locations = data.locations
    this._detail = data.detail
    this._lkey = keyPrefixes.get(data as object)
    this.WeaponTypes = data.weapon_types || ['any']
    this.WeaponSizes = data.weapon_sizes || ['any']
    this.SystemTypes = data.system_types || ['any']
  }

  public get Detail(): string {
    return this._lkey ? localize(this._lkey, 'detail', this._detail) : this._detail
  }

  public EvaluatedDetail(controller: FeatureController): string {
    return controller.EvaluateSpecial(this.Detail, true) as string
  }

  public static Collect(
    location: string,
    container: IFeatureController,
    item?: CompendiumItem
  ): Synergy[] {
    if (!container.FeatureController) return []
    let sArr = [
      ...container.FeatureController.Synergies.filter(s =>
        s.Locations.includes(location.toLowerCase())
      ),
    ]

    if (item) {
      if (item.ItemType === ItemType.MechWeapon) {
        let types = (item as MechWeapon).WeaponTypes

        if (types.includes('???' as WeaponType)) {
          types = [
            WeaponType.CQB,
            WeaponType.Cannon,
            WeaponType.Launcher,
            WeaponType.Nexus,
            WeaponType.Rifle,
          ]
        }
        if (types.includes('any' as WeaponType)) types = [WeaponType.All]

        sArr = sArr.filter(s => {
          if (types.includes(WeaponType.All)) return true
          return s.WeaponTypes.some(t => types.includes(t as WeaponType))
        })

        sArr = sArr.filter(s => {
          if (s.WeaponSizes.includes('any')) return true
          return s.WeaponSizes.includes((item as MechWeapon).Size)
        })
      } else if (item.ItemType === ItemType.MechSystem || item.ItemType === ItemType.WeaponMod) {
        sArr = sArr.filter(s => {
          if (s.SystemTypes.includes('any')) return true
          return s.SystemTypes.includes((item as MechSystem).Type)
        })
      }
    }

    return _.uniq(sArr)
  }

  public static Serialize(synergy: Synergy): ISynergyData {
    return {
      locations: synergy.Locations,
      detail: synergy.Detail,
      weapon_types: synergy.WeaponTypes,
      system_types: synergy.SystemTypes,
      weapon_sizes: synergy.WeaponSizes,
    }
  }
}

export { Synergy }
export type { ISynergyData }
