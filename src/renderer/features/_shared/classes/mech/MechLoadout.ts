import _ from 'lodash'
import { LicensedItem, LicenseRequirement, MechSystem, Mount, Mech, Loadout } from '..';
import store from "@/store";

class MechLoadout extends Loadout {
  private mounts: Mount[];
  private improvedArmament: Mount;
  private systems: MechSystem[];

  constructor(mech: Mech) {
    super(mech.Loadouts.length);
    this.mounts = mech.IntegratedMounts.concat(
      mech.Frame.Mounts.map(x => new Mount(x))
    );
    this.systems = mech.IntegratedSystems;
    this.improvedArmament = new Mount(MountType.Flex);
  }

  public get Mounts(): Mount[] {
    if (store.getters.getPilot.has("CoreBonus", "imparm"))
      return this.mounts.concat([this.improvedArmament]);
    else return this.mounts;
  }

  public get Systems(): MechSystem[] {
    return this.systems;
  }

  public HasSystem(system_id: string): boolean {
    return !!this.Systems.find(x => x.ID === system_id);
  }

  public AddSystem(system_id: string) {
    this.systems.push(new MechSystem(system_id))
  }

  public RemoveSystem(system: MechSystem) {
    const index = this.systems.findIndex(x => _.isEqual(x, system))
    if (index > -1) this.systems.splice(index, 1)
  }

  public get RequiredLicenses() {
    let requirements = [] as LicenseRequirement[];
    const equippedWeapons = _.flatten(
      this.mounts.map(x => x.Weapons)
    ) as LicensedItem[];
    const equippedSystems = this.systems as LicensedItem[];

    equippedSystems.concat(equippedWeapons).forEach(item => {
      if (item.Source === "GMS") {
        const GMSIndex = requirements.findIndex(x => x.name === "GMS");
        if (GMSIndex > -1) {
          requirements[GMSIndex].items.push(item.Name);
        } else {
          requirements.push({
            name: "GMS",
            rank: 0,
            items: [item.Name]
          });
        }
      } else {
        const licenseIndex = requirements.findIndex(
          x =>
            x.name === `${item.Source} ${item.License}` &&
            x.rank === item.LicenseLevel
        );
        if (licenseIndex > -1) {
          requirements[licenseIndex].items.push(item.Name);
        } else {
          requirements.push({
            name: `${item.Source} ${item.License}`,
            rank: item.LicenseLevel,
            items: [item.Name]
          });
        }
      }
    });
    return requirements;
  }

  public get TotalSP(): number {
    const mountSP = this.mounts
      .flatMap(x => x.Weapons)
      .reduce(function(a, b) {
        return a + (b ? b.SP : 0);
      }, 0);
    const systemSP = this.systems.reduce(function(a, b) {
      return a + b.SP;
    }, 0);
    return mountSP + systemSP;
  }
}

export default MechLoadout;