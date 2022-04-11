import _ from 'lodash'
import uuid from 'uuid/v4'
import { Rules, Mech, CompendiumItem, PilotLoadout } from '../../class'
import { IOrganizationData, IPilotLoadoutData, IRankedData } from '../../interface'
import { ActiveState, IActiveStateData, ICombatStats } from '../mech/ActiveState'
import { Bonus } from '../components/feature/bonus/Bonus'
import {
  CoreBonusController,
  ILicenseSaveData,
  IReserveData,
  ISkillsData,
  ITalentsData,
  LicenseController,
  ReservesController,
  SkillsController,
  TalentsController,
  ICoreBonusSaveData,
} from './components/'
import { IMechData } from '../mech/Mech'
import { ItemType } from '../enums'
import { PilotManagementStore, store } from '../../store'
import {
  CloudController,
  CounterController,
  GroupController,
  ICloudData,
  ICloudSyncable,
  ICollectionGroupable,
  ICounterCollection,
  ICounterContainer,
  IGroupData,
  IHASEContainer,
  IMechSkillsData,
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  MechSkillsController,
  PortraitController,
  SaveController,
} from '../components/'
import { ImageTag } from '@/io/ImageManagement'
import { IFeatureController } from '../components/feature/IFeatureController'
import { FeatureController } from '../components/feature/FeatureController'
import { PilotLoadoutController } from './components/Loadout/PilotLoadoutController'
import { getModule } from 'vuex-module-decorators'
import { BrewController, BrewInfo, IBrewData } from '../components/brew/BrewController'
import { IBrewable } from '../components/brew/IBrewable'
import { BondController, Burden, IPilotBondData } from './components/bond/BondController'
import { IClockData } from '../components/clocks/Clock'
import { BondPower } from './components/bond/Bond'

interface IUnlockData {
  PilotArmor: string[]
  PilotWeapons: string[]
  PilotGear: string[]
  Frames: string[]
  MechWeapons: string[]
  WeaponMods: string[]
  MechSystems: string[]
  SystemMods: string[]
}

class PilotData
  implements
    ISaveData,
    ICloudData,
    ISkillsData,
    ITalentsData,
    IMechSkillsData,
    ICounterCollection,
    ICoreBonusSaveData,
    ILicenseSaveData,
    IGroupData,
    IPortraitData,
    IBrewData,
    IPilotBondData
{
  bondId?: string
  xp: number
  stress: number
  isBroken: boolean
  burdens: Burden[]
  bondPowers: BondPower[]
  clocks: IClockData[]
  pilotBond: IPilotBondData
  remoteIID: string
  remoteKey: string
  shareCodeExpiry: string
  shareCode: string
  isRemoteResource: boolean
  deleteTime: string
  id: string
  level: number
  callsign: string
  name: string
  player_name: string
  status: string
  text_appearance: string
  notes: string
  history: string
  quirks: string[]
  current_hp: number
  background: string

  resistances: string[]
  special_equipment: IUnlockData
  mechs: IMechData[]
  cc_ver: string
  brews: BrewInfo[]
  state: IActiveStateData
  combat_history: ICombatStats
  dead: boolean

  // SaveController
  lastModified: string
  isDeleted: boolean
  expireTime: string

  // PortraitController
  portrait: string
  cloud_portrait: string

  // CloudController
  lastUpdate_cloud: string
  resourceUri: string
  lastSync: string

  // SkillsController
  skills: IRankedData[]

  // TalentsController
  talents: IRankedData[]

  // MechSkillsController
  mechSkills: number[]

  // CounterController
  custom_counters: any[]
  counter_data: ICounterSaveData[]

  // CoreBonusController
  core_bonuses: string[]

  // LicenseController
  licenses: IRankedData[]

  // ReservesController
  reserves: IReserveData[]
  orgs: IOrganizationData[]

  // GroupConteroller
  group: string
  sort_index: number

  // PilotLoadoutController
  loadout: IPilotLoadoutData
}

class Pilot
  implements
    ICloudSyncable,
    ISaveable,
    IHASEContainer,
    ICounterContainer,
    ICollectionGroupable,
    IPortraitContainer,
    IFeatureController,
    IBrewable
{
  public readonly ItemType: string = 'pilot'

  public SaveController: SaveController
  public CloudController: CloudController
  public SkillsController: SkillsController
  public TalentsController: TalentsController
  public MechSkillsController: MechSkillsController
  public CounterController: CounterController
  public CoreBonusController: CoreBonusController
  public LicenseController: LicenseController
  public ReservesController: ReservesController
  public BondController: BondController
  public GroupController: GroupController
  public PortraitController: PortraitController
  public ImageTag = ImageTag.Pilot
  public FeatureController: FeatureController
  public PilotLoadoutController: PilotLoadoutController
  public BrewController: BrewController

  private _callsign: string
  private _name: string
  private _player_name: string
  private _status: string
  private _text_appearance: string
  private _notes: string
  private _quirks: string[]
  private _history: string

  private _id: string
  private _level: number
  private _missing_hp: number
  private _background: string
  private _resistances: string[]

  private _special_equipment: CompendiumItem[]

  private _mechs: Mech[]
  private _state: ActiveState
  private _combat_history: ICombatStats
  private _dead: boolean

  private cc_ver: string
  private _brews: string[]

  public constructor() {
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)
    this.PortraitController = new PortraitController(this)
    this.SkillsController = new SkillsController(this)
    this.TalentsController = new TalentsController(this)
    this.MechSkillsController = new MechSkillsController(this)
    this.CounterController = new CounterController(this)
    this.CoreBonusController = new CoreBonusController(this)
    this.LicenseController = new LicenseController(this)
    this.ReservesController = new ReservesController(this)
    this.BondController = new BondController(this)
    this.GroupController = new GroupController(this)
    this.FeatureController = new FeatureController(this)
    this.PilotLoadoutController = new PilotLoadoutController(this)
    this.BrewController = new BrewController(this)

    this.FeatureController.Register(
      this.TalentsController,
      this.CoreBonusController,
      this.ReservesController,
      this.PilotLoadoutController
    )

    this._level = 0
    this._callsign = ''
    this._name = ''
    this._player_name = ''
    this._status = 'Active'
    this._text_appearance = ''
    this._notes = ''
    this._history = ''
    this._quirks = []
    this._missing_hp = 0
    this._background = ''
    this._resistances = []
    this._special_equipment = []
    this._mechs = []
    this._brews = []
    this._dead = false
    this._state = new ActiveState(this)
    this._combat_history = ActiveState.NewCombatStats()
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }

  // -- Utility -----------------------------------------------------------------------------------

  public has(typeName: string, id: string, rank?: number): boolean {
    if (typeName.toLowerCase() === 'skill') {
      return (
        this.SkillsController.Skills.findIndex(x => x.Skill.Name === id || x.Skill.ID === id) > -1
      )
    } else if (typeName.toLowerCase() === 'corebonus') {
      return this.CoreBonusController.CoreBonuses.findIndex(x => x.ID === id) > -1
    } else if (typeName.toLowerCase() === 'license') {
      const index = this.LicenseController.Licenses.findIndex(x => x.License.Name === id)
      return rank ? index > -1 && this.LicenseController.Licenses[index].Rank >= rank : index > -1
    } else if (typeName.toLowerCase() === 'talent') {
      const index = this.TalentsController.Talents.findIndex(x => x.Talent.ID === id)
      return rank ? index > -1 && this.TalentsController.Talents[index].Rank >= rank : index > -1
    } else if (typeName.toLowerCase() === 'reserve') {
      const e = this.ReservesController.Reserves.find(x => x.ID === `reserve_${id}`)
      return e && !e.Used
    }
    return false
  }

  // -- Passthroughs ----------------------------------------------------------------------

  public get Loadout(): PilotLoadout {
    return this.PilotLoadoutController.Loadout
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public get BrewableCollection(): CompendiumItem[] {
    return [
      ...this.Mechs.flatMap(m => m.BrewableItems),
      this.PilotLoadoutController.Loadout.Items,
    ] as CompendiumItem[]
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.SaveController.save()
  }

  public get Level(): number {
    return this._level
  }

  public set Level(level: number) {
    this._level = level
    this.SaveController.save()
  }

  public ApplyLevel(update: PilotData): void {
    this.Update(update)
    this.CurrentHP = this.MaxHP
    this.SaveController.save()
  }

  public get Background(): string {
    return this._background
  }

  public set Background(bg: string) {
    this._background = bg
    this.SaveController.save()
  }

  public get Callsign(): string {
    return this._callsign
  }

  public set Callsign(newVal: string) {
    this._callsign = newVal
    this.SaveController.save()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(newVal: string) {
    this._name = newVal
    this.SaveController.save()
  }

  public get PlayerName(): string {
    return this._player_name
  }

  public set PlayerName(newVal: string) {
    this._player_name = newVal
    this.SaveController.save()
  }

  public get IsDownAndOut(): boolean {
    return this.CurrentHP === 0
  }

  public get IsDead(): boolean {
    return this._dead
  }

  public set IsDead(val: boolean) {
    this._dead = val
    this.SaveController.save()
  }

  public get Status(): string {
    return this._status
  }

  public set Status(newVal: string) {
    this._status = newVal
    this.SaveController.save()
  }

  public get Resistances(): string[] {
    return this._resistances
  }

  public set Resistances(resistances: string[]) {
    this._resistances = resistances
    this.SaveController.save()
  }

  public get HasIdent(): boolean {
    return !!(this.Name && this.Callsign)
  }

  public get TextAppearance(): string {
    return this._text_appearance
  }

  public set TextAppearance(newVal: string) {
    this._text_appearance = newVal
    this.SaveController.save()
  }

  public get Notes(): string {
    return this._notes
  }

  public set Notes(newVal: string) {
    this._notes = newVal
    this.SaveController.save()
  }

  public get Quirks(): string[] {
    return this._quirks
  }

  public set Quirks(val: string[]) {
    this._quirks = val
    this.SaveController.save()
  }

  public AddQuirk(val: string): void {
    this._quirks.push(val)
  }

  public RemoveQuirk(idx: number): void {
    this._quirks.splice(idx, 1)
  }

  public get History(): string {
    return this._history
  }

  public set History(_history: string) {
    this._history = _history
    this.SaveController.save()
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get Grit(): number {
    return Math.ceil(this._level / 2)
  }

  public get MaxHP(): number {
    return Bonus.Int(Rules.BasePilotHP + this.Grit, 'pilot_hp', this)
  }

  public get CurrentHP(): number {
    return this.MaxHP - this._missing_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._missing_hp = 0
    else if (hp < 0) this._missing_hp = this.MaxHP
    else this._missing_hp = this.MaxHP - hp
    this.SaveController.save()
  }

  public get Armor(): number {
    return Bonus.Int(0, 'pilot_armor', this)
  }

  public get Speed(): number {
    return Bonus.Int(Rules.BasePilotSpeed, 'pilot_speed', this)
  }

  public get Evasion(): number {
    return Bonus.Int(Rules.BasePilotEvasion, 'pilot_evasion', this)
  }

  public get EDefense(): number {
    return Bonus.Int(Rules.BasePilotEdef, 'pilot_edef', this)
  }

  public get LimitedBonus(): number {
    return Bonus.Int(
      Math.floor(this.MechSkillsController.MechSkills.Eng / 2),
      'limited_bonus',
      this
    )
  }

  // -- Exotics and Other Equipment ---------------------------------------------------------------
  public get SpecialEquipment(): CompendiumItem[] {
    return this.FeatureController.IntegratedSpecialEquipment.concat(this._special_equipment)
  }

  public set SpecialEquipment(data: CompendiumItem[]) {
    this._special_equipment = data
  }

  public AddSpecialEquipment(data: CompendiumItem): void {
    this._special_equipment.push(data)
    this.SaveController.save()
  }

  public RemoveSpecialEquipment(data: CompendiumItem): void {
    const idx = this._special_equipment.findIndex(x => x.ID === data.ID)
    if (idx > -1) this._special_equipment.splice(idx, 1)
    this.SaveController.save()
  }

  // -- Mechs -------------------------------------------------------------------------------------
  public get Mechs(): Mech[] {
    return this._mechs
  }

  public AddMech(mech: Mech): void {
    this._mechs.push(mech)
    this.SaveController.save()
  }

  public RemoveMech(mech: Mech): void {
    const index = this._mechs.findIndex(x => x.ID === mech.ID)
    if (index === -1) {
      console.error(`Loadout "${mech.Name}" does not exist on Pilot ${this._callsign}`)
    } else {
      if (
        !this.State.ActiveMech ||
        !this.State.ActiveMech.ID ||
        (this.State.ActiveMech && this.State.ActiveMech.ID === mech.ID)
      ) {
        this._state = new ActiveState(this)
      }
      this._mechs.splice(index, 1)
    }
    this.SaveController.save()
  }

  public CloneMech(mech: Mech): void {
    const mechData = Mech.Serialize(mech)
    const clone = Mech.Deserialize(mechData, this)
    clone.RenewID()
    clone.Name += '*'
    this._mechs.push(clone)
    this.SaveController.save()
  }

  public get ActiveMech(): Mech | null {
    return this._state.ActiveMech
  }

  public set ActiveMech(mech: Mech | null) {
    this._state = new ActiveState(this)
    this._state.ActiveMech = mech
  }

  // -- Active Mode -------------------------------------------------------------------------------
  public SpecialEval(val: number | string): number {
    if (typeof val === 'number') return val
    let valStr = val as string
    // @ts-ignore
    valStr = valStr.replaceAll(`{ll}`, this.Level.toString())
    // @ts-ignore
    valStr = valStr.replaceAll(`{grit}`, this.Grit.toString())
    valStr = valStr.replace(/[^-()\d/*+.]/g, '')
    return Math.ceil(eval(valStr))
  }

  public get State(): ActiveState {
    return this._state
  }

  public UpdateCombatStats(ms: ICombatStats): void {
    for (const k in this._combat_history) {
      if (ms[k]) this._combat_history[k] += ms[k]
    }
  }

  public get CombatHistory(): ICombatStats {
    return this._combat_history
  }

  public Kill(): void {
    this._status = 'KIA'
    this.IsDead = true
    this.CurrentHP = 0
  }

  public Restore(): void {
    this.CurrentHP = 1
    this._dead = false
    this._status = 'Active'
  }

  public Heal(): void {
    this._dead = false
    this.CurrentHP = this.MaxHP
    this.Status = 'Active'
  }

  public FullRestore(): void {
    this.Restore()
    this.CurrentHP = this.MaxHP
  }

  // -- I/O ---------------------------------------------------------------------------------------
  private static serializeSE(equipment: CompendiumItem[]): IUnlockData {
    return {
      PilotArmor: equipment.filter(x => x.ItemType === ItemType.PilotArmor).map(i => i.ID),
      PilotWeapons: equipment.filter(x => x.ItemType === ItemType.PilotWeapon).map(i => i.ID),
      PilotGear: equipment.filter(x => x.ItemType === ItemType.PilotGear).map(i => i.ID),
      Frames: equipment.filter(x => x.ItemType === ItemType.Frame).map(i => i.ID),
      MechWeapons: equipment.filter(x => x.ItemType === ItemType.MechWeapon).map(i => i.ID),
      WeaponMods: equipment.filter(x => x.ItemType === ItemType.WeaponMod).map(i => i.ID),
      MechSystems: equipment.filter(x => x.ItemType === ItemType.MechSystem).map(i => i.ID),
      SystemMods: equipment.filter(x => x.ItemType === ItemType.SystemMod).map(i => i.ID),
    }
  }

  private static deserializeSE(equipment: IUnlockData): CompendiumItem[] {
    if (!equipment) return []
    const items = []
    Object.keys(equipment).forEach(key => {
      equipment[key].forEach(id => items.push(store.getters.referenceByID(key, id)))
    })
    return items
  }

  public static Serialize(p: Pilot): PilotData {
    const data = {
      id: p.ID,
      level: p.Level,
      callsign: p.Callsign,
      name: p.Name,
      player_name: p.PlayerName,
      status: p.Status,
      dead: p.IsDead,
      text_appearance: p.TextAppearance,
      notes: p.Notes,
      history: p.History,
      quirks: p.Quirks,
      current_hp: p.CurrentHP,
      background: p.Background,
      resistances: p.Resistances,
      mechs: p.Mechs.length ? p.Mechs.map(x => Mech.Serialize(x)) : [],
      cc_ver: p.cc_ver,
      special_equipment: this.serializeSE(p._special_equipment),
      combat_history: p._combat_history,
      state: ActiveState.Serialize(p.State),
    }

    SaveController.Serialize(p, data)
    CloudController.Serialize(p, data)
    SkillsController.Serialize(p, data)
    TalentsController.Serialize(p, data)
    MechSkillsController.Serialize(p, data)
    CounterController.Serialize(p, data)
    CoreBonusController.Serialize(p, data)
    LicenseController.Serialize(p, data)
    ReservesController.Serialize(p, data)
    BondController.Serialize(p, data)
    GroupController.Serialize(p, data)
    PortraitController.Serialize(p, data)
    PilotLoadoutController.Serialize(p, data)
    BrewController.Serialize(p, data)

    return data as PilotData
  }

  public Serialize(): PilotData {
    return Pilot.Serialize(this)
  }

  public static AddNew(data: PilotData, sync?: boolean): Pilot {
    const p = Pilot.Deserialize(data)
    if (sync) p.CloudController.MarkSync()
    getModule(PilotManagementStore, store).addPilot(p)
    return p
  }

  public static Deserialize(pilotData: PilotData): Pilot {
    const p = new Pilot()
    try {
      p.Update(pilotData)
      p.SaveController.SetLoaded()
      return p
    } catch (err) {
      console.error(err)
    }
  }

  public Update(data: PilotData, sync?: boolean): void {
    this._id = data.id
    this._combat_history = data.combat_history ? data.combat_history : ActiveState.NewCombatStats()
    this._level = data.level
    this._callsign = data.callsign
    this._name = data.name
    this._dead = data.dead || false
    this._player_name = data.player_name
    this._status = data.status || 'ACTIVE'
    this._text_appearance = data.text_appearance
    this._notes = data.notes
    this._history = data.history
    this._quirks = data.quirks ? data.quirks : (data as any).quirk ? [(data as any).quirk] : []
    this.CurrentHP = data.current_hp
    this._background = data.background
    this._resistances = data.resistances || []
    this._mechs = data.mechs.length
      ? data.mechs.map((x: IMechData) => Mech.Deserialize(x, this))
      : []
    this._special_equipment = data.special_equipment
      ? Pilot.deserializeSE(data.special_equipment)
      : []

    this.cc_ver = data.cc_ver || ''

    MechSkillsController.Deserialize(this, data)
    SaveController.Deserialize(this, data)
    CloudController.Deserialize(this, data)
    SkillsController.Deserialize(this, data)
    TalentsController.Deserialize(this, data)
    CounterController.Deserialize(this, data)
    CoreBonusController.Deserialize(this, data)
    LicenseController.Deserialize(this, data)
    ReservesController.Deserialize(this, data)
    BondController.Deserialize(this, data)
    GroupController.Deserialize(this, data)
    PortraitController.Deserialize(this, data)
    PilotLoadoutController.Deserialize(this, data)
    BrewController.Deserialize(this, data)

    if (sync && data.state) {
      this._state.Update(this, data.state, sync)
    } else {
      this._state = data.state ? ActiveState.Deserialize(this, data.state) : new ActiveState(this)
    }
  }
}

export { Pilot, PilotData, IUnlockData }
