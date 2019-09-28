import _ from 'lodash'
import { store } from '@/store'
import {
  LicensedItem,
  MechSystem,
  Mount,
  Mech,
  Loadout,
  MountType,
  IntegratedMount,
  EquippableMount,
  MechEquipment,
  MechWeapon,
  Pilot,
} from '@/class'

class MechLoadout extends Loadout {
  private integratedMounts: IntegratedMount[]
  private equippableMounts: EquippableMount[]
  private improvedArmament: EquippableMount
  private integratedWeapon: EquippableMount
  private retrofitIndex: number | null
  private retrofitOriginalType: MountType | null
  private systems: MechSystem[]
  private integratedSystems: MechSystem[]

  constructor(mech: Mech) {
    super(mech.Loadouts.length)
    this.integratedMounts = [...mech.IntegratedMounts]
    this.equippableMounts = mech.Frame.Mounts.map(x => new EquippableMount(x))
    this.systems = []
    this.integratedSystems = mech.IntegratedSystems
    this.improvedArmament = new EquippableMount(MountType.Flex)
    this.integratedWeapon = new EquippableMount(MountType.Aux)
    this.retrofitIndex = null
    this.retrofitOriginalType = null
  }

  private save() {
    store.dispatch('saveData')
  }

  public UpdateIntegrated(mech: Mech) {
    mech.IntegratedSystems.forEach(s => {
      if (!this.integratedSystems.find(x => x.ID === s.ID)) this.integratedSystems.push(s)
    })

    this.integratedSystems.forEach((s, idx) => {
      if (!mech.IntegratedSystems.find(x => x.ID === s.ID)) this.integratedSystems.splice(idx, 1)
      s.Uses = s.MaxUses + mech.LimitedBonus
    })

    mech.IntegratedMounts.forEach(s => {
      if (!this.integratedMounts.find(x => x.ItemSource === s.ItemSource))
        this.integratedMounts.push(s)
    })

    this.integratedMounts.forEach((s, idx) => {
      if (!mech.IntegratedMounts.find(x => x.ItemSource === s.ItemSource))
        this.integratedMounts.splice(idx, 1)
      s.Weapon.Uses = s.Weapon.MaxUses + mech.LimitedBonus
    })

    this.save()
  }

  public get IntegratedMounts(): IntegratedMount[] {
    return this.integratedMounts
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

  public AllMounts(improved?: boolean, integrated?: boolean): Mount[] {
    let ms = []
    if (integrated) ms.push(this.integratedWeapon)
    if (improved && this.equippableMounts.length < 3) ms.push(this.improvedArmament)
    ms = ms.concat(this.equippableMounts).concat(this.integratedMounts)
    return ms
  }

  public AllEquippableMounts(improved?: boolean, integrated?: boolean): EquippableMount[] {
    let ms = []
    if (integrated) ms.push(this.integratedWeapon)
    if (improved && this.equippableMounts.length < 3) ms.push(this.improvedArmament)
    ms = ms.concat(this.equippableMounts)
    return ms
  }

  public RetrofitMount(mountIndex: number) {
    this.retrofitIndex = mountIndex
    this.retrofitOriginalType = this.equippableMounts[mountIndex].Type
    this.equippableMounts.splice(mountIndex, 1, new EquippableMount(MountType.MainAux))
    this.save()
  }

  public get RetrofittedMount(): EquippableMount | null {
    return this.retrofitIndex === null ? null : this.equippableMounts[this.retrofitIndex]
  }

  public RemoveRetrofitting() {
    if (this.retrofitIndex === null || this.retrofitOriginalType === null) return
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

  public get Equipment(): MechEquipment[] {
    return (this.Weapons as MechEquipment[]).concat(this.Systems as MechEquipment[])
  }

  public get Weapons(): MechWeapon[] {
    return this.AllEquippableMounts(true).flatMap(x => x.Weapons)
  }

  public ReloadAll() {
    this.Weapons.forEach(w => {
      if (w.IsLoading) w.Loaded = true
    })
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.integratedSystems
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

  public GetSystem(system_id: string): MechSystem | null {
    return this.Systems.find(x => x.ID === system_id) || null
  }

  public AddSystem(system: MechSystem, pilot: Pilot) {
    const sys = _.clone(system)
    if (sys.IsLimited) sys.Uses = sys.MaxUses + pilot.LimitedBonus
    this.systems.push(sys)
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
    let requirements = [] as ILicenseRequirement[]
    const equippedWeapons = (this.Weapons as LicensedItem[]).concat(this.Weapons.map(
      x => x.Mod
    ).filter(x => x !== null) as LicensedItem[])
    const equippedSystems = this.systems as LicensedItem[]

    equippedSystems.concat(equippedWeapons).forEach(item => {
      if (item.Source === 'GMS') {
        const GMSIndex = requirements.findIndex(x => x.source === 'GMS')
        if (GMSIndex > -1) {
          requirements[GMSIndex].items.push(item.Name)
        } else {
          requirements.push(item.RequiredLicense)
        }
      } else {
        const licenseIndex = requirements.findIndex(
          x => x.source === item.Source && x.name === item.License && x.rank === item.LicenseLevel
        )
        if (licenseIndex > -1) {
          requirements[licenseIndex].items.push(item.Name)
        } else {
          requirements.push(item.RequiredLicense)
        }
      }
    })
    return requirements
  }

  public get TotalSP(): number {
    const mountSP = [...this.equippableMounts, this.improvedArmament, this.integratedWeapon]
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
      systems: ml.systems.map(x => MechSystem.Serialize(x)),
      integratedSystems: ml.integratedSystems.map(x => MechSystem.Serialize(x)),
      mounts: ml.equippableMounts.map(x => EquippableMount.Serialize(x)),
      integratedMounts: ml.integratedMounts.map(x => IntegratedMount.Serialize(x)),
      improved_armament: EquippableMount.Serialize(ml.improvedArmament),
      integratedWeapon: EquippableMount.Serialize(ml.integratedWeapon),
      retrofitIndex: ml.retrofitIndex,
      retrofitOriginalType: ml.retrofitOriginalType,
    }
  }

  public static Deserialize(loadoutData: IMechLoadoutData, mech: Mech): MechLoadout {
    let ml = new MechLoadout(mech)
    ml.ID = loadoutData.id
    ml.Name = loadoutData.name
    ml.systems = loadoutData.systems.map(x => MechSystem.Deserialize(x))
    ml.integratedSystems = !loadoutData.integratedSystems
      ? mech.IntegratedSystems
      : loadoutData.integratedSystems.map(x => MechSystem.Deserialize(x))
    ml.equippableMounts = loadoutData.mounts.map(x => EquippableMount.Deserialize(x))
    ml.integratedMounts = !loadoutData.integratedMounts
      ? mech.IntegratedMounts
      : loadoutData.integratedMounts.map(x => IntegratedMount.Deserialize(x))
    ml.improvedArmament = EquippableMount.Deserialize(loadoutData.improved_armament)
    ml.integratedWeapon = !loadoutData.integratedWeapon
      ? new EquippableMount(MountType.Aux)
      : EquippableMount.Deserialize(loadoutData.integratedWeapon)
    ml.retrofitIndex = loadoutData.retrofitIndex
    ml.retrofitOriginalType = ml.retrofitOriginalType
      ? (loadoutData.retrofitOriginalType as MountType)
      : null
    if (!loadoutData.integratedSystems) ml.UpdateIntegrated(mech)
    return ml
  }
}

export default MechLoadout
