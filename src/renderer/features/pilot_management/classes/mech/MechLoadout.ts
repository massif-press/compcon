import _ from 'lodash'
import { LicensedItem, LicenseRequirement, MechSystem, Mount, Mech, Loadout, MountType, IntegratedMount, EquippableMount } from '@/class';
import store from "@/store";

class MechLoadout extends Loadout {
  private integratedMounts: IntegratedMount[];
  private equippableMounts: EquippableMount[];
  private improvedArmament: EquippableMount;
  private systems: MechSystem[];

  constructor(mech: Mech) {
    super(mech.Loadouts.length);
    this.integratedMounts = mech.IntegratedMounts
    this.equippableMounts = mech.Frame.Mounts.map(x => new EquippableMount(x))
    this.systems = mech.IntegratedSystems;
    this.improvedArmament = new EquippableMount(MountType.Flex);
  }

  public get Mounts(): Mount[] {
    const allMounts = this.integratedMounts.concat(this.equippableMounts)
    if (store.getters.getPilot.has("CoreBonus", "imparm"))
      return allMounts.concat([this.improvedArmament]);
    else return allMounts;
  }

  public get Systems(): MechSystem[] {
    return this.systems;
  }

  public set Systems(systems: MechSystem[]) {
    this.systems = systems;
  }

  public HasSystem(system_id: string): boolean {
    return !!this.Systems.find(x => x.ID === system_id);
  }

  public AddSystem(system_id: string) {
    this.systems.push(new MechSystem(system_id));
  }

  public RemoveSystem(system: MechSystem) {
    const index = this.systems.findIndex(x => _.isEqual(x, system));
    if (index > -1) this.systems.splice(index, 1);
  }

  public get RequiredLicenses() {
    let requirements = [] as LicenseRequirement[];
    const equippedWeapons = _.flatten(
      this.equippableMounts.map(x => x.Weapons)
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
    const mountSP = this.equippableMounts
      .flatMap(x => x.Weapons)
      .reduce(function(a, b) {
        return a + (b ? b.SP : 0);
      }, 0);
    const systemSP = this.systems.reduce(function(a, b) {
      return a + b.SP;
    }, 0);
    return mountSP + systemSP;
  }

  public static Serialize(ml: MechLoadout): IMechLoadoutData {
    return {
      id: ml.ID,
      name: ml.Name,
      systems: ml.Systems.map(x => MechSystem.Serialize(x)),
      mounts: ml.equippableMounts.map(x => EquippableMount.Serialize(x)),
      improved_armament: EquippableMount.Serialize(ml.improvedArmament)
    };
  }

  public static Deserialize(loadoutData: IMechLoadoutData, mech: Mech): MechLoadout {
    let ml = new MechLoadout(mech);
    ml.ID = loadoutData.id;
    ml.Name = loadoutData.name;
    ml.systems = loadoutData.systems.map(x => MechSystem.Deserialize(x));
    ml.equippableMounts = loadoutData.mounts.map(x => EquippableMount.Deserialize(x))
    ml.improvedArmament = EquippableMount.Deserialize(loadoutData.improved_armament)
    return ml;
  }
}

export default MechLoadout;