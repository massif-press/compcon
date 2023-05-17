import Vue from 'vue'
import _ from 'lodash'
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
  WeaponMod,
} from '@/class'

interface IMechLoadoutData {
  id: string
  name: string
  systems: IEquipmentData[]
  integratedSystems: IEquipmentData[]
  mounts: IMountData[]
  integratedMounts: { weapon: IMechWeaponSaveData }[]
  improved_armament: IMountData
  superheavy_mounting: IMountData
  integratedWeapon: IMountData
}

class MechLoadout extends Loadout {
  private Parent: Mech
  private _integratedMounts: IntegratedMount[]
  private _equippableMounts: EquippableMount[]
  private _improvedArmament: EquippableMount
  private _superheavyMounting: EquippableMount
  private _integratedWeapon: EquippableMount
  private _systems: MechSystem[]
  private _integratedSystems: MechSystem[]

  public constructor(mech: Mech) {
    super(mech.MechLoadoutController ? mech.MechLoadoutController.Loadouts.length : 0)
    this.Parent = mech
    this._equippableMounts = mech.Frame.Mounts.map(x => new EquippableMount(x, this))
    this._integratedMounts = []
    this._systems = []
    this._integratedSystems = []
    this._improvedArmament = new EquippableMount(MountType.Flex, this)
    this._superheavyMounting = new EquippableMount(MountType.Superheavy, this)
    this._integratedWeapon = new EquippableMount(MountType.Aux, this)
  }

  public saveMechLoadout() {
    this.save()
    this.Parent.SaveController.save()
  }

  public SetAllIntegrated(save?: boolean) {
    const im = [
      ...this.Parent.FeatureController.IntegratedWeapons.map(x => new IntegratedMount(x, this)),
      ...this.Parent.Pilot.FeatureController.IntegratedWeapons.map(
        x => new IntegratedMount(x, this)
      ),
    ]
    const is = [
      ...this.Parent.FeatureController.IntegratedSystems,
      ...this.Parent.Pilot.FeatureController.IntegratedSystems,
    ]
    Vue.set(this, '_integratedSystems', is)
    Vue.set(this, '_integratedMounts', im)
    if (save) this.saveMechLoadout()
  }

  public get IntegratedMounts(): IntegratedMount[] {
    return this._integratedMounts
  }

  public get EquippableMounts(): EquippableMount[] {
    return this._equippableMounts
  }

  public get IntegratedWeaponMount(): EquippableMount {
    return this._integratedWeapon
  }

  public get ImprovedArmamentMount(): EquippableMount {
    return this._improvedArmament
  }

  public get SuperheavyMount(): EquippableMount {
    return this._superheavyMounting
  }

  public AllMounts(improved?: boolean, integrated?: boolean, superheavy?: boolean): Mount[] {
    let ms = []
    if (integrated) ms.push(this._integratedWeapon)
    if (improved && this._equippableMounts.length < 3) ms.push(this._improvedArmament)
    if (superheavy && this._equippableMounts.length < 3) ms.push(this._superheavyMounting)
    ms = ms.concat(this._equippableMounts).concat(this._integratedMounts)
    return ms
  }

  public AllEquippableMounts(
    improved?: boolean,
    integrated?: boolean,
    superheavy?: boolean
  ): EquippableMount[] {
    let ms = []
    if (integrated) ms.push(this._integratedWeapon)
    if (improved && this._equippableMounts.length < 3) ms.push(this._improvedArmament)
    if (superheavy && this._equippableMounts.length < 3) ms.push(this._superheavyMounting)
    ms = ms.concat(this._equippableMounts)
    return ms
  }

  public AllActiveMounts(m: Mech): Mount[] {
    let ms = [] as Mount[]
    if (m.Pilot.has('CoreBonus', 'cb_integrated_weapon')) ms.push(this.IntegratedWeaponMount)
    if (m.Pilot.has('CoreBonus', 'cb_improved_armament') && this.EquippableMounts.length < 3)
      ms.push(this.ImprovedArmamentMount)
    if (m.Pilot.has('CoreBonus', 'cb_superheavy_mounting') && this.EquippableMounts.length < 3)
      ms.push(this.SuperheavyMount)
    ms = ms.concat(this.EquippableMounts).concat(this.IntegratedMounts)
    return ms.filter(x => x.Weapons.length)
  }

  public get Mounts(): Mount[] {
    return (this._integratedMounts as Mount[]).concat(this._equippableMounts)
  }

  public get HasEmptyMounts(): boolean {
    return this._equippableMounts
      .filter(x => !x.IsLocked)
      .flatMap(x => x.Slots)
      .some(y => y.Weapon === null)
  }

  public RemoveRetrofitting(): void {
    this.AllEquippableMounts(true, true).forEach(x => {
      if (x.Bonuses.some(x => x.ID === 'cb_mount_retrofitting')) x.ClearBonuses()
    })
  }

  public get Equipment(): MechEquipment[] {
    const mods = this.Weapons.map(x => x.Mod).filter(x => x != null)
    const equip = (this.Weapons as MechEquipment[])
      .concat(this.Systems as MechEquipment[])
      .concat(this.IntegratedSystems as MechEquipment[])
    if (mods.length > 0) return equip.concat(mods as MechEquipment[])
    else return equip
  }

  public get Weapons(): MechWeapon[] {
    return this.AllMounts(true, true)
      .filter(x => !x.IsLocked)
      .flatMap(x => x.Weapons)
      .filter(x => x != null)
  }

  public ReloadAll(): void {
    this.Weapons.forEach(w => {
      if (w.IsLoading) w.Loaded = true
    })
  }

  public UnequipSuperheavy(): void {
    this.AllEquippableMounts(true, true).forEach(x => x.Unlock())
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integratedSystems
  }

  public get Systems(): MechSystem[] {
    return this._systems
  }

  public set Systems(systems: MechSystem[]) {
    this._systems = systems
    this.saveMechLoadout()
  }

  public get AllActiveSystems(): MechSystem[] {
    return this.IntegratedSystems.concat(this.Systems)
  }

  public HasSystem(systemID: string): boolean {
    return !!this.Systems.find(x => x.ID === systemID)
  }

  public GetSystem(systemID: string): MechSystem | null {
    return this.Systems.find(x => x.ID === systemID) || null
  }

  public AddSystem(system: MechSystem): void {
    const sys = _.cloneDeep(system)
    this._systems.push(sys)
    this.saveMechLoadout()
  }

  public ChangeSystem(index: number, system: MechSystem): void {
    this._systems.splice(index, 1, _.cloneDeep(system))
    this.saveMechLoadout()
  }

  public RemoveSystem(system: MechSystem): void {
    const index = this._systems.findIndex(x => _.isEqual(x, system))
    if (index > -1) this._systems.splice(index, 1)
    this.saveMechLoadout()
  }

  public get RequiredLicenses(): ILicenseRequirement[] {
    const requirements = [] as ILicenseRequirement[]
    const equippedWeapons = (this.Weapons as LicensedItem[]).concat(
      this.Weapons.map(x => x.Mod).filter(x => x !== null) as LicensedItem[]
    )
    const equippedSystems = this._systems as LicensedItem[]

    equippedSystems.concat(equippedWeapons).forEach(item => {
      //TODO: change from GMS to LL0
      if (item.Source === 'GMS') {
        const GMSIndex = requirements.findIndex(x => x.source === 'GMS')
        if (GMSIndex > -1) {
          requirements[GMSIndex].items.push(item.Name)
        } else {
          requirements.push(item.RequiredLicense)
        }
      } else {
        const licenseIndex = requirements.findIndex(
          x => x.license_id === item.LicenseID && x.rank === item.LicenseLevel
        )
        if (licenseIndex > -1) {
          requirements[licenseIndex].items.push(item.Name)
        } else {
          if (item.RequiredLicense.name !== '' && item.RequiredLicense.rank > 0) {
            requirements.push(item.RequiredLicense)
          }
        }
      }
    })
    return requirements
  }

  public get TotalSP(): number {
    const mountSP = [
      ...this._equippableMounts,
      this._improvedArmament,
      this._integratedWeapon,
      this._superheavyMounting,
    ]
      .flatMap(x => x.Weapons)
      .reduce(function (a, b) {
        return a + (b ? b.TotalSP : 0)
      }, 0)

    const systemSP = this._systems.reduce(function (a, b) {
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

  public get UniqueMods(): WeaponMod[] {
    return this.Weapons.map(x => x.Mod).filter(y => y && y.IsUnique)
  }

  public get UniqueItems(): MechEquipment[] {
    return (this.UniqueWeapons as MechEquipment[])
      .concat(this.UniqueSystems as MechEquipment[])
      .concat(this.UniqueMods as MechEquipment[])
  }

  public get AICount(): number {
    return this.Equipment.filter(x => x.IsAI).length
  }

  public static Serialize(ml: MechLoadout): IMechLoadoutData {
    return {
      id: ml.ID,
      name: ml.Name,
      systems: ml._systems.map(x => MechSystem.Serialize(x)),
      integratedSystems: ml._integratedSystems.map(x => MechSystem.Serialize(x)),
      mounts: ml._equippableMounts.map(x => EquippableMount.Serialize(x)),
      integratedMounts: ml._integratedMounts.map(x => IntegratedMount.Serialize(x)),
      improved_armament: EquippableMount.Serialize(ml._improvedArmament),
      superheavy_mounting: EquippableMount.Serialize(ml._superheavyMounting),
      integratedWeapon: EquippableMount.Serialize(ml._integratedWeapon),
    }
  }

  public static Deserialize(loadoutData: IMechLoadoutData, mech: Mech): MechLoadout {
    const ml = new MechLoadout(mech)
    ml.ID = loadoutData.id
    ml._name = loadoutData.name
    ml._systems = loadoutData.systems.map(x => MechSystem.Deserialize(x))
    ml._integratedSystems = !loadoutData.integratedSystems
      ? mech.Frame.IntegratedSystems
      : loadoutData.integratedSystems.map(x => MechSystem.Deserialize(x))
    ml._equippableMounts = loadoutData.mounts.map(x => EquippableMount.Deserialize(x, ml))
    ml._integratedMounts = !loadoutData.integratedMounts
      ? mech.Frame.IntegratedWeapons.map(x => new IntegratedMount(x, ml))
      : loadoutData.integratedMounts.map(x => IntegratedMount.Deserialize(x, ml))
    ml._improvedArmament = EquippableMount.Deserialize(loadoutData.improved_armament, ml)
    ml._superheavyMounting = loadoutData.superheavy_mounting
      ? EquippableMount.Deserialize(loadoutData.superheavy_mounting, ml)
      : new EquippableMount(MountType.Superheavy, ml)
    ml._integratedWeapon = !loadoutData.integratedWeapon
      ? new EquippableMount(MountType.Aux, ml)
      : EquippableMount.Deserialize(loadoutData.integratedWeapon, ml)
    if (!loadoutData.integratedSystems) ml.SetAllIntegrated()
    return ml
  }
}

export { MechLoadout, IMechLoadoutData }
