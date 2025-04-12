import _ from 'lodash';
import { Mech, MechSystem, MechWeapon, WeaponType } from '@/class';
import { CompendiumItem } from '../../../CompendiumItem';
import { ItemType } from '../../../enums';

interface ISynergyData {
  locations: string[];
  detail: string;
  weapon_types?: string[];
  system_types?: string[];
  weapon_sizes?: string[];
}

class Synergy {
  public readonly Locations: string[];
  public readonly Detail: string;
  public readonly WeaponTypes: string[];
  public readonly WeaponSizes: string[];
  public readonly SystemTypes: string[];
  public readonly Origin: string;

  public constructor(data: ISynergyData, origin: string) {
    this.Origin = origin || 'UNKNOWN ORIGIN';
    this.Locations = data.locations;
    this.Detail = data.detail;
    this.WeaponTypes = data.weapon_types || ['any'];
    this.WeaponSizes = data.weapon_sizes || ['any'];
    this.SystemTypes = data.system_types || ['any'];
  }

  public static Collect(location: string, mech: Mech, item?: CompendiumItem): Synergy[] {
    let sArr = [
      ...mech.Pilot.FeatureController.Synergies.filter((s) =>
        s.Locations.includes(location.toLowerCase())
      ),
    ];

    if (item) {
      if (item.ItemType === ItemType.MechWeapon) {
        let types = (item as MechWeapon).WeaponTypes;

        if (types.includes('???' as WeaponType)) {
          types = [
            WeaponType.CQB,
            WeaponType.Cannon,
            WeaponType.Launcher,
            WeaponType.Nexus,
            WeaponType.Rifle,
          ];
        }
        if (types.includes('any' as WeaponType)) types = [WeaponType.All];

        sArr = sArr.filter((s) => {
          if (types.includes(WeaponType.All)) return true;
          return s.WeaponTypes.some((t) => types.includes(t as WeaponType));
        });

        sArr = sArr.filter((s) => {
          if (s.WeaponSizes.includes('any')) return true;
          return s.WeaponSizes.includes((item as MechWeapon).Size);
        });
      } else if (item.ItemType === ItemType.MechSystem || item.ItemType === ItemType.WeaponMod) {
        sArr = sArr.filter((s) => {
          if (s.SystemTypes.includes('any')) return true;
          return s.SystemTypes.includes((item as MechSystem).Type);
        });
      }
    }

    return _.uniq(sArr);
  }

  public static Serialize(synergy: Synergy): ISynergyData {
    return {
      locations: synergy.Locations,
      detail: synergy.Detail,
      weapon_types: synergy.WeaponTypes,
      system_types: synergy.SystemTypes,
      weapon_sizes: synergy.WeaponSizes,
    };
  }
}

export { Synergy };
export type { ISynergyData };
