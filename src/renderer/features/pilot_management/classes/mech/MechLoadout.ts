import _ from 'lodash'
import store from '@/store'
import {
  LicensedItem,
  LicenseRequirement,
  MechSystem,
  Mount,
  Mech,
  Loadout,
  MountType,
  IntegratedMount,
  EquippableMount,
} from '@/class'
import MechWeapon from '@/features/_shared/classes/MechWeapon'

class MechLoadout extends Loadout {
  private integratedMounts: IntegratedMount[]
  private equippableMounts: EquippableMount[]
  private improvedArmament: EquippableMount
  private integratedWeapon: EquippableMount
  private retrofitIndex: number | null
  private retrofitOriginalType: MountType | null
  private systems: MechSystem[]

  constructor(mech: Mech) {
    super(mech.Loadouts.length)
    this.integratedMounts = mech.IntegratedMounts
    this.equippableMounts = mech.Frame.Mounts.map(x => new EquippableMount(x))
    this.systems = []
    this.improvedArmament = new EquippableMount(MountType.Flex)
    this.integratedWeapon = new EquippableMount(MountType.Aux)
    this.retrofitIndex = null
    this.retrofitOriginalType = null
  }

  private save() {
    store.dispatch('saveData')
  }

  public get IntegratedMounts(): IntegratedMount[] {
    return this.integratedMounts
  }

  public ResetIntegratedMounts(mech: Mech) {
    this.integratedMounts = mech.IntegratedMounts
    this.save()
  }

  public EquippableMounts(): EquippableMount[] {
    return this.equippableMounts
  }

  public get IntegratedWeaponMount(): EquippableMount {
    return this.integratedWeapon
  }

  public get ImprovedArmamentMount(): EquippableMount {
    return this.improvedArmament
  }

  public AllEquippableMounts(improved?: boolean): EquippableMount[] {
    if (improved && this.equippableMounts.length < 3)
      return this.equippableMounts.concat([this.improvedArmament])
    return this.equippableMounts
  }

  public RetrofitMount(mountIndex: number) {
    this.retrofitIndex = mountIndex
    this.retrofitOriginalType = this.equippableMounts[mountIndex].Type
    this.equippableMounts.splice(
      mountIndex,
      1,
      new EquippableMount(MountType.MainAux)
    )
    this.save()
  }

  public get RetrofittedMount(): EquippableMount | null {
    return this.retrofitIndex === null
      ? null
      : this.equippableMounts[this.retrofitIndex]
  }

  public RemoveRetrofitting() {
    if (this.retrofitIndex === null || this.retrofitOriginalType === null)
      return
    this.equippableMounts.splice(
      this.retrofitIndex,
      1,
      new EquippableMount(this.retrofitOriginalType)
    )
    this.retrofitIndex = null
    this.retrofitOriginalType = null
    this.save()
  }

  public get IsRetrofitted(): boolean {
    return this.retrofitIndex !== null
  }

  public get Mounts(): Mount[] {
    return (this.integratedMounts as Mount[]).concat(this.equippableMounts)
  }

  public get HasEmptyMounts(): boolean {
    return this.equippableMounts.some(x => x === null)
  }

  public get Weapons(): MechWeapon[] {
    return this.AllEquippableMounts(true).flatMap(x => x.Weapons)
  }

  public get Systems(): MechSystem[] {
    return this.systems
  }

  public set Systems(systems: MechSystem[]) {
    this.systems = systems
    this.save()
  }

  public HasSystem(system_id: string): boolean {
    return !!this.Systems.find(x => x.ID === system_id)
  }

  public AddSystem(system: MechSystem) {
    this.systems.push(_.clone(system))
    this.save()
  }

  public ChangeSystem(index: number, system: MechSystem) {
    this.systems.splice(index, 1, _.clone(system))
  }

  public RemoveSystem(system: MechSystem) {
    const index = this.systems.findIndex(x => _.isEqual(x, system))
    if (index > -1) this.systems.splice(index, 1)
    this.save()
  }

  public get RequiredLicenses() {
    let requirements = [] as LicenseRequirement[]
    const equippedWeapons = (this.Weapons as LicensedItem[]).concat(
      this.Weapons.map(x => x.Mod).filter(x => x !== null) as LicensedItem[]
    )
    const equippedSystems = this.systems as LicensedItem[]

    equippedSystems.concat(equippedWeapons).forEach(item => {
      if (item.Source === 'GMS') {
        const GMSIndex = requirements.findIndex(x => x.source === 'GMS')
        if (GMSIndex > -1) {
          requirements[GMSIndex].items.push(item.Name)
        } else {
          requirements.push({
            source: 'GMS',
            name: '',
            rank: 0,
            items: [item.Name],
          })
        }
      } else {
        const licenseIndex = requirements.findIndex(
          x =>
            x.source === item.Source &&
            x.name === item.License &&
            x.rank === item.LicenseLevel
        )
        if (licenseIndex > -1) {
          requirements[licenseIndex].items.push(item.Name)
        } else {
          requirements.push({
            source: item.Source,
            name: item.License,
            rank: item.LicenseLevel,
            items: [item.Name],
          })
        }
      }
    })
    return requirements
  }

  public get TotalSP(): number {
    const mountSP = [
      ...this.equippableMounts,
      this.improvedArmament,
      this.integratedWeapon,
    ]
      .flatMap(x => x.Weapons)
      .reduce(function(a, b) {
        return a + (b ? b.SP : 0)
      }, 0)

    const systemSP = this.systems.reduce(function(a, b) {
      return a + b.SP
    }, 0)
    return mountSP + systemSP
  }

  public get UniqueWeapons(): MechWeapon[] {
    return this.Weapons.filter(x => x.IsUnique)
  }

  public get UniqueSystems(): MechSystem[] {
    return this.Systems.filter(x => x.IsUnique)
  }

  public static Serialize(ml: MechLoadout): IMechLoadoutData {
    return {
      id: ml.ID,
      name: ml.Name,
      systems: ml.Systems.map(x => MechSystem.Serialize(x)),
      mounts: ml.equippableMounts.map(x => EquippableMount.Serialize(x)),
      improved_armament: EquippableMount.Serialize(ml.improvedArmament),
      integratedWeapon: EquippableMount.Serialize(ml.integratedWeapon),
      retrofitIndex: ml.retrofitIndex,
      retrofitOriginalType: ml.retrofitOriginalType,
    }
  }

  public static Deserialize(
    loadoutData: IMechLoadoutData,
    mech: Mech
  ): MechLoadout {
    let ml = new MechLoadout(mech)
    ml.ID = loadoutData.id
    ml.Name = loadoutData.name
    ml.systems = loadoutData.systems.map(x => MechSystem.Deserialize(x))
    ml.equippableMounts = loadoutData.mounts.map(x =>
      EquippableMount.Deserialize(x)
    )
    ml.improvedArmament = EquippableMount.Deserialize(
      loadoutData.improved_armament
    )
    ml.integratedWeapon = !loadoutData.integratedWeapon
      ? new EquippableMount(MountType.Aux)
      : EquippableMount.Deserialize(loadoutData.integratedWeapon)
    ml.retrofitIndex = loadoutData.retrofitIndex
    ml.retrofitOriginalType = ml.retrofitOriginalType
      ? (loadoutData.retrofitOriginalType as MountType)
      : null
    return ml
  }
}

export default MechLoadout
