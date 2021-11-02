import Vue from 'vue'
import _ from 'lodash'
import uuid from 'uuid/v4'
import {
  Rules,
  Reserve,
  MechSkills,
  PilotLicense,
  PilotLoadout,
  PilotSkill,
  PilotTalent,
  Skill,
  License,
  Talent,
  CoreBonus,
  Mech,
  CustomSkill,
  Organization,
  CompendiumItem,
  ContentPack,
  Synergy,
  MechWeapon,
} from '@/class'
import { store } from '@/store'
import gistApi from '@/io/apis/gist'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { ICounterData, Action } from '@/interface'
import { ActiveState, IActiveStateData, ICombatStats } from '../mech/ActiveState'
import { Bonus } from '../Bonus'
import { IReserveData } from './reserves/Reserve'
import { MechSystem } from '../mech/MechSystem'
import { IMechData } from '../mech/Mech'
import { IDeployableData } from '../Deployable'
import { ItemType } from '../enums'

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

interface IPilotData {
  id: string
  group: string
  sort_index: number
  cloudID: string
  cloudOwnerID: string
  gistCode: string
  gistOwner: string
  isLocal: boolean
  lastSync: string
  level: number
  callsign: string
  name: string
  player_name: string
  status: string
  factionID: string
  text_appearance: string
  notes: string
  history: string
  portrait: string
  cloud_portrait: string
  quirks: string[]
  current_hp: number
  background: string
  mechSkills: number[]
  special_equipment: IUnlockData
  licenses: IRankedData[]
  skills: IRankedData[]
  talents: IRankedData[]
  core_bonuses: string[]
  reserves: IReserveData[]
  orgs: IOrganizationData[]
  loadout: IPilotLoadoutData
  mechs: IMechData[]
  cc_ver: string
  counter_data: ICounterSaveData[]
  custom_counters: object[]
  brews: string[]
  state: IActiveStateData
  combat_history: ICombatStats
  dead: boolean
}

class Pilot implements ICloudSyncable {
  public readonly TypePrefix: string = 'pilot'
  public readonly SyncIgnore: string[] = ['group', 'sortIndex']
  public IsLocallyOwned: boolean
  public LastSync: string
  public CloudID: string
  public CloudOwnerID: string
  public IsDirty: boolean

  private _gistCode: string
  private _gistOwner: string

  private _cloud_portrait: string

  private _callsign: string
  private _name: string
  private _player_name: string
  private _status: string
  private _factionID: string
  private _text_appearance: string
  private _notes: string
  private _quirks: string[]
  private _history: string

  private _group: string
  private _sortIndex: number

  private _id: string
  private _level: number
  private _portrait: string
  private _missing_hp: number
  private _background: string

  private _special_equipment: CompendiumItem[]
  private _licenses: PilotLicense[]
  private _skills: PilotSkill[]
  private _talents: PilotTalent[]
  private _core_bonuses: CoreBonus[]
  private _mechSkills: MechSkills

  private _reserves: Reserve[]
  private _orgs: Organization[]

  private _loadout: PilotLoadout

  private _mechs: Mech[]
  private _state: ActiveState
  private _combat_history: ICombatStats
  private _dead: boolean

  private cc_ver: string
  private _brews: string[]

  public constructor() {
    this._id = uuid()
    this._level = 0
    this._callsign = ''
    this._name = ''
    this._player_name = ''
    this._status = 'Active'
    this._text_appearance = ''
    this._notes = ''
    this._history = ''
    this._portrait = ''
    this._cloud_portrait = ''
    this._quirks = []
    this._missing_hp = 0
    this._loadout = new PilotLoadout(0)
    this._background = ''
    this._special_equipment = []
    this._licenses = []
    this._skills = []
    this._talents = []
    this._mechSkills = new MechSkills(this)
    this._core_bonuses = []
    this._mechs = []
    this._reserves = []
    this._orgs = []
    this._brews = []
    this._group = ''
    this._sortIndex = 0
    this._dead = false
    this._state = new ActiveState(this)
    this._combat_history = ActiveState.NewCombatStats()
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
    this.IsDirty = false
    this.IsLocallyOwned = true
    this.LastSync = new Date('1-1-1000').toJSON()
  }

  // -- Utility -----------------------------------------------------------------------------------
  public save(skip = false): void {
    if (skip) return
    if (this.IsLocallyOwned) this.IsDirty = true
    store.dispatch('saveData')
  }

  public SetBrewData(): void {
    const packs = store.getters.getItemCollection('ContentPacks') as ContentPack[]

    function collectBrewGroup(items: CompendiumItem[]): string[] {
      return items
        .filter(x => x != null)
        .map(i => i.Brew)
        .filter(x => x.toLowerCase() !== 'core')
    }

    let brews = collectBrewGroup(this._loadout.Items)
    this._mechs.forEach(m => {
      brews = _.union(brews, collectBrewGroup([m.Frame]))
      m.Loadouts.forEach(ml => {
        brews = _.union(brews, collectBrewGroup(ml.Weapons))
        brews = _.union(brews, collectBrewGroup(ml.Systems))
      })
    })
    brews = brews.map(x => packs.find(y => y.ID === x)).map(z => `${z.Name} @ ${z.Version}`)
    this._brews = brews
  }

  //TODO: don't extract id or type at call, just pass object and deal with it w/ instanceof/typeof
  public has(typeName: string, id: string, rank?: number): boolean {
    if (typeName.toLowerCase() === 'skill') {
      return this._skills.findIndex(x => x.Skill.Name === id || x.Skill.ID === id) > -1
    } else if (typeName.toLowerCase() === 'corebonus') {
      return this._core_bonuses.findIndex(x => x.ID === id) > -1
    } else if (typeName.toLowerCase() === 'license') {
      const index = this._licenses.findIndex(x => x.License.Name === id)
      return rank ? index > -1 && this._licenses[index].Rank >= rank : index > -1
    } else if (typeName.toLowerCase() === 'talent') {
      const index = this._talents.findIndex(x => x.Talent.ID === id)
      return rank ? index > -1 && this._talents[index].Rank >= rank : index > -1
    } else if (typeName.toLowerCase() === 'reserve') {
      const e = this.Reserves.find(x => x.ID === `reserve_${id}`)
      return e && !e.Used
    }
    return false
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get ID(): string {
    return this._id
  }

  public get ResourceURI(): string {
    return `${this.TypePrefix}/${this.IsLocallyOwned ? this._id : this.CloudID}`
  }

  public get ShareCode(): string {
    if (!this.ResourceURI || !this.CloudOwnerID) return 'ERR: PERFORM MANUAL SYNC AND RETRY'
    return `${this.CloudOwnerID.split(':')[1]}//${this.ResourceURI.split('/')[1]}`
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Level(): number {
    return this._level
  }

  public set Level(level: number) {
    this._level = level
    this.save()
  }

  public ApplyLevel(update: IPilotData): void {
    this.Update(update)
    this.CurrentHP = this.MaxHP
    this.save()
  }

  public get Power(): number {
    return (this.Level + 1) * 100
  }

  public get Background(): string {
    return this._background
  }

  public set Background(bg: string) {
    this._background = bg
    this.save()
  }

  public get Callsign(): string {
    return this._callsign
  }

  public set Callsign(newVal: string) {
    this._callsign = newVal
    this.save()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(newVal: string) {
    this._name = newVal
    this.save()
  }

  public get PlayerName(): string {
    return this._player_name
  }

  public set PlayerName(newVal: string) {
    this._player_name = newVal
    this.save()
  }

  public get IsDownAndOut(): boolean {
    return this.CurrentHP === 0
  }

  public get IsDead(): boolean {
    return this._dead
  }

  public set IsDead(val: boolean) {
    this._dead = val
    this.save()
  }

  public get Status(): string {
    return this._status
  }

  public set Status(newVal: string) {
    this._status = newVal
    this.save()
  }

  public get Faction(): Faction {
    const factions = store.getters.getItemCollection('Factions')
    return factions.find((x: Faction) => x.id === this._factionID)
  }

  public set Faction(faction: Faction) {
    this._factionID = faction.id
    this.save()
  }

  public get HasIdent(): boolean {
    return !!(this.Name && this.Callsign)
  }

  public get TextAppearance(): string {
    return this._text_appearance
  }

  public set TextAppearance(newVal: string) {
    this._text_appearance = newVal
    this.save()
  }

  public get Notes(): string {
    return this._notes
  }

  public set Notes(newVal: string) {
    this._notes = newVal
    this.save()
  }

  public get Quirks(): string[] {
    return this._quirks
  }

  public set Quirks(val: string[]) {
    this._quirks = val
    this.save()
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
    this.save()
  }

  public SetLocalImage(src: string): void {
    this._portrait = src
    this.save()
  }

  public get LocalImage(): string {
    return this._portrait
  }

  public get Image(): string {
    return this.Portrait
  }

  public get Portrait(): string {
    if (this._cloud_portrait) return this._cloud_portrait
    else if (this._portrait) return getImagePath(ImageTag.Pilot, this._portrait)
    else return getImagePath(ImageTag.Pilot, 'nodata.png')
  }

  // -- Cloud -------------------------------------------------------------------------------------

  public MarkSync(): void {
    this.LastSync = new Date().toJSON()
    this.IsDirty = false
  }

  public SetRemoteResource(userCognitoId: string, itemCloudId: string): void {
    console.log('pilot call, set remote resource')
    this.CloudID = itemCloudId
    this.CloudOwnerID = userCognitoId
    this.IsLocallyOwned = false
    this.RenewID()
  }

  public SetOwnedResource(userCognitoId: string): void {
    console.log('pilot call, set owned resource')
    Vue.set(this, 'CloudID', this.ID)
    Vue.set(this, 'CloudOwnerID', userCognitoId)
    this.IsLocallyOwned = true
    this.save()
  }

  public get CloudImage(): string {
    return this._cloud_portrait
  }

  public set CloudImage(src: string) {
    this._cloud_portrait = src
    this.save()
  }

  // old gist stuff:

  public get GistOwner(): string {
    return this._gistOwner
  }

  public set GistOwner(val: string) {
    this._gistOwner = val
    this.save()
  }

  public get GistCode(): string {
    return this._gistCode
  }

  public set GistCode(val: string) {
    this._gistCode = val
    this.save()
  }

  public get IsUserOwned(): boolean {
    return this.GistOwner === store.getters.getUserProfile.UserID
  }

  public SetCloudImage(src: string): void {
    this._cloud_portrait = src
    this.save()
  }

  public async CloudSave(): Promise<any> {
    this.SetBrewData()
    this.GistOwner = store.getters.getUserProfile.UserID
    if (!this.GistCode) {
      return gistApi.newPilot(this).then((response: any) => {
        this.setCloudInfo(response.id)
      })
    } else {
      return gistApi.savePilot(this).then((response: any) => {
        this.setCloudInfo(response.id)
      })
    }
  }

  public async CloudLoad(): Promise<any> {
    if (!this.GistCode) return Promise.reject('No Cloud ID')
    return gistApi.loadPilot(this.GistCode).then((gist: any) => {
      this.Update(gist)
      this.MarkSync()
    })
  }

  public CloudCopy(): Promise<any> {
    this.GistCode = ''
    this.GistOwner = ''
    return this.CloudSave()
  }

  public setCloudInfo(id: string): void {
    this.GistCode = id
    this.GistOwner = store.getters.getUserProfile.UserID
    this.MarkSync()
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get Grit(): number {
    return Math.ceil(this._level / 2)
  }

  public get MaxHP(): number {
    return Bonus.IntPilot(Rules.BasePilotHP + this.Grit, 'pilot_hp', this)
  }

  public get CurrentHP(): number {
    return this.MaxHP - this._missing_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._missing_hp = 0
    else if (hp < 0) this._missing_hp = this.MaxHP
    else this._missing_hp = this.MaxHP - hp
    this.save()
  }

  public Heal(): void {
    this._dead = false
    this.CurrentHP = this.MaxHP
    this.Status = 'Active'
  }

  public get Armor(): number {
    return Bonus.IntPilot(0, 'pilot_armor', this)
  }

  public get Speed(): number {
    return Bonus.IntPilot(Rules.BasePilotSpeed, 'pilot_speed', this)
  }

  public get Evasion(): number {
    return Bonus.IntPilot(Rules.BasePilotEvasion, 'pilot_evasion', this)
  }

  public get EDefense(): number {
    return Bonus.IntPilot(Rules.BasePilotEdef, 'pilot_edef', this)
  }

  public get LimitedBonus(): number {
    return Bonus.IntPilot(Math.floor(this.MechSkills.Eng / 2), 'limited_bonus', this)
  }

  // -- Skills ------------------------------------------------------------------------------------
  public get Skills(): PilotSkill[] {
    return this._skills
  }

  public set Skills(skills: PilotSkill[]) {
    this._skills = skills
    this.skillSort()
    this.save()
  }

  private skillSort(): void {
    this._skills = this._skills.sort(function (a, b) {
      return a.Title > b.Title ? 1 : -1
    })
  }

  public get CurrentSkillPoints(): number {
    return this._skills.reduce((sum, skill) => sum + skill.Rank, 0)
  }

  public get MaxSkillPoints(): number {
    return Bonus.IntPilot(Rules.MinimumPilotSkills + this._level, 'skill_point', this)
  }

  public get IsMissingSkills(): boolean {
    return this.CurrentSkillPoints < this.MaxSkillPoints
  }

  public get TooManySkills(): boolean {
    return this.CurrentSkillPoints > this.MaxSkillPoints
  }

  public get HasFullSkills(): boolean {
    return this.CurrentSkillPoints === this.MaxSkillPoints
  }

  public CanAddSkill(skill: Skill | CustomSkill): boolean {
    const hasMinSkills = this._skills.length >= Rules.MinimumPilotSkills
    return this.IsMissingSkills && (
      !this.has('Skill', skill.ID) || (
        hasMinSkills && 
        this._skills.find(x => x.Skill.ID === skill.ID).Rank < Rules.MaxTriggerRank
      )
    )
  }

  public AddSkill(skill: Skill | CustomSkill): void {
    const index = this._skills.findIndex(x => x.Skill.ID === skill.ID)
    if (index === -1) {
      this._skills.push(new PilotSkill(skill))
    } else {
      this._skills[index].Increment()
    }
    this.skillSort()
    this.save()
  }

  public AddCustomSkill(cs: { skill: string; description: string; detail: string }): void {
    this.AddSkill(new CustomSkill(cs.skill, cs.description, cs.detail))
  }

  public CanRemoveSkill(skill: Skill | CustomSkill): boolean {
    return this.has('Skill', skill.ID)
  }

  public RemoveSkill(skill: Skill | CustomSkill): void {
    const index = this._skills.findIndex(x => x.Skill.ID === skill.ID)
    if (index === -1) {
      console.error(`Skill Trigger "${skill.Name}" does not exist on Pilot ${this._callsign}`)
    } else {
      if (this._skills[index].Rank > 1) {
        this._skills[index].Decrement()
      } else {
        this._skills.splice(index, 1)
      }
    }
    this.skillSort()
    this.save()
  }

  public ClearSkills(): void {
    for (let i = this._skills.length - 1; i >= 0; i--) {
      while (this._skills[i]) {
        this.RemoveSkill(this._skills[i].Skill)
      }
    }
  }

  // -- Talents -----------------------------------------------------------------------------------
  public get Talents(): PilotTalent[] {
    return this._talents
  }

  public set Talents(talents: PilotTalent[]) {
    this._talents = talents
    this.talentSort()
    this.save()
  }

  public get CurrentTalentPoints(): number {
    return this._talents.reduce((sum, talent) => sum + talent.Rank, 0)
  }

  public get MaxTalentPoints(): number {
    return Bonus.IntPilot(Rules.MinimumPilotTalents + this._level, 'talent_point', this)
  }

  public get IsMissingTalents(): boolean {
    return this.CurrentTalentPoints < this.MaxTalentPoints
  }

  public get TooManyTalents(): boolean {
    return this.CurrentTalentPoints > this.MaxTalentPoints
  }

  public get HasFullTalents(): boolean {
    return this.CurrentTalentPoints === this.MaxTalentPoints
  }

  public getTalentRank(id: string): number {
    const index = this._talents.findIndex(x => x.Talent.ID === id)
    return index > -1 ? this._talents[index].Rank : 0
  }

  public AddTalent(talent: Talent): void {
    const index = this._talents.findIndex(x => x.Talent.ID === talent.ID)
    if (index === -1) {
      this._talents.push(new PilotTalent(talent))
    } else {
      this._talents[index].Increment()
    }
    this.talentSort()
    this.updateIntegratedTalents()
    this.save()
  }

  public RemoveTalent(talent: Talent): void {
    const index = this._talents.findIndex(x => x.Talent.ID === talent.ID)
    if (index === -1) {
      console.error(`Talent "${talent.Name}" does not exist on Pilot ${this._callsign}`)
    } else {
      if (this._talents[index].Rank > 1) {
        this._talents[index].Decrement()
      } else {
        this._talents.splice(index, 1)
      }
    }
    this.talentSort()
    this.updateIntegratedTalents()
    this.save()
  }

  public ClearTalents(): void {
    for (let i = this._talents.length - 1; i >= 0; i--) {
      while (this._talents[i]) {
        this.RemoveTalent(this._talents[i].Talent)
      }
    }
  }

  private talentSort(): void {
    this._talents = this._talents.sort(function (a, b) {
      return a.Rank === b.Rank ? 0 : a.Rank > b.Rank ? -1 : 1
    })
  }

  private updateIntegratedTalents(): void {
    this._mechs.forEach(mech => {
      mech.UpdateLoadouts()
    })
  }

  // -- Core Bonuses ------------------------------------------------------------------------------
  public get CoreBonuses(): CoreBonus[] {
    return this._core_bonuses
  }

  public set CoreBonuses(coreBonuses: CoreBonus[]) {
    this._core_bonuses = coreBonuses
    this.save()
  }

  public get CurrentCBPoints(): number {
    return this._core_bonuses.length
  }

  public get MaxCBPoints(): number {
    return Bonus.IntPilot(Math.floor(this._level / 3), 'cb_point', this)
  }

  public get IsMissingCBs(): boolean {
    return this.CurrentCBPoints < this.MaxCBPoints
  }

  public get TooManyCBs(): boolean {
    return this.CurrentCBPoints > this.MaxCBPoints
  }

  public get HasCBs(): boolean {
    return this.CurrentCBPoints === this.MaxCBPoints
  }

  public AddCoreBonus(coreBonus: CoreBonus): void {
    this._core_bonuses.push(coreBonus)
    this.save()
  }

  public RemoveCoreBonus(coreBonus: CoreBonus): void {
    const index = this._core_bonuses.findIndex(x => _.isEqual(coreBonus, x))
    if (index === -1) {
      console.error(`CORE Bonus "${coreBonus.Name}" does not exist on Pilot ${this._callsign}`)
    } else {
      this._core_bonuses.splice(index, 1)
      this.removeCoreBonuses(coreBonus)
    }
    this.save()
  }

  public ClearCoreBonuses(): void {
    for (let i = this._core_bonuses.length - 1; i >= 0; i--) {
      this.RemoveCoreBonus(this._core_bonuses[i])
    }
  }

  private removeCoreBonuses(coreBonus: CoreBonus): void {
    this._mechs.forEach(mech => {
      mech.Loadouts.forEach(loadout => {
        if (coreBonus.ID === 'cb_mount_retrofitting') loadout.RemoveRetrofitting()
        if (coreBonus.ID === 'cb_improved_armament') loadout.ImprovedArmamentMount.Clear()
        if (coreBonus.ID === 'cb_integrated_weapon') loadout.IntegratedWeaponMount.Clear()
        loadout.AllEquippableMounts(true).forEach(mount => {
          mount.RemoveCoreBonus(coreBonus)
        })
      })
    })
  }

  // -- Licenses ----------------------------------------------------------------------------------
  public get Licenses(): PilotLicense[] {
    return this._licenses
  }

  public set Licenses(licenses: PilotLicense[]) {
    this._licenses = licenses
    this.save()
  }

  public LicenseLevel(manufacturerID: string): number {
    return this.Licenses.filter(
      x => x.License.Source.toLowerCase() === manufacturerID.toLowerCase()
    ).reduce((a, b) => +a + +b.Rank, 0)
  }

  public get CurrentLicensePoints(): number {
    return this._licenses.reduce((sum, license) => sum + license.Rank, 0)
  }

  public get MaxLicensePoints(): number {
    const bonus = this.Reserves.filter(x => x.ID === 'reserve_license').length
    return this._level + bonus
  }

  public get IsMissingLicenses(): boolean {
    return this.CurrentLicensePoints < this.MaxLicensePoints
  }

  public get TooManyLicenses(): boolean {
    return this.CurrentLicensePoints > this.MaxLicensePoints
  }

  public get HasLicenses(): boolean {
    return this.CurrentLicensePoints === this.MaxLicensePoints
  }

  public getLicenseRank(_name: string): number {
    const index = this._licenses.findIndex(x => x.License.Name === _name)
    return index > -1 ? this._licenses[index].Rank : 0
  }

  public AddLicense(license: License): void {
    const index = this._licenses.findIndex(x => x.License.FrameID === license.FrameID)
    if (index === -1) {
      this._licenses.push(new PilotLicense(license, 1))
    } else {
      this._licenses[index].Increment()
    }
    this.save()
  }

  public RemoveLicense(license: License): void {
    const index = this._licenses.findIndex(x => x.License.FrameID === license.FrameID)
    if (index === -1) {
      console.error(`License "${license.ToString()}" does not exist on Pilot ${this._callsign}`)
    } else {
      if (this._licenses[index].Rank > 1) {
        this._licenses[index].Decrement()
      } else {
        this._licenses.splice(index, 1)
      }
    }
    this.save()
  }

  public ClearLicenses(): void {
    for (let i = this._licenses.length - 1; i >= 0; i--) {
      while (this._licenses[i]) {
        this.RemoveLicense(this._licenses[i].License)
      }
    }
  }

  // -- Mech Skills -------------------------------------------------------------------------------
  public get MechSkills(): MechSkills {
    return this._mechSkills
  }

  public set MechSkills(mechskills: MechSkills) {
    this._mechSkills = mechskills
    this.save()
  }

  public resetHASE(): void {
    this._mechSkills.Reset()
  }

  public get CurrentHASEPoints(): number {
    return this._mechSkills.Sum
  }

  public get MaxHASEPoints(): number {
    return Bonus.IntPilot(Rules.MinimumMechSkills + this._level, 'mech_skill_point', this)
  }

  public get IsMissingHASE(): boolean {
    return this.CurrentHASEPoints < this.MaxHASEPoints
  }

  public get TooManyHASE(): boolean {
    return this.CurrentHASEPoints > this.MaxHASEPoints
  }

  public get HasFullHASE(): boolean {
    return this.CurrentHASEPoints === this.MaxHASEPoints
  }

  // -- Downtime Reserves -------------------------------------------------------------------------
  public get Reserves(): Reserve[] {
    return this._reserves
  }

  public set Reserves(reserves: Reserve[]) {
    this._reserves = reserves
    this.save()
  }

  public AddReserve(reserve: Reserve): void {
    this._reserves.push(reserve)
    this.save()
  }

  public RemoveReserve(index: number): void {
    this._reserves.splice(index, 1)
    this.save()
  }

  public get Organizations(): Organization[] {
    return this._orgs
  }

  public set Organizations(orgs: Organization[]) {
    this._orgs = orgs
    this.save()
  }

  public AddOrganization(org: Organization): void {
    this._orgs.push(org)
    this.save()
  }

  public RemoveOrganization(index: number): void {
    this._orgs.splice(index, 1)
    this.save()
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadout(): PilotLoadout {
    return this._loadout
  }

  public set Loadout(l: PilotLoadout) {
    this._loadout = l
    this.save()
  }

  // -- Exotics and Other Equipment ---------------------------------------------------------------
  public get SpecialEquipment(): CompendiumItem[] {
    return this.IntegratedSpecialEquipment.concat(this._special_equipment)
  }

  public set SpecialEquipment(data: CompendiumItem[]) {
    this._special_equipment = data
  }

  public AddSpecialEquipment(data: CompendiumItem): void {
    this._special_equipment.push(data)
    this.save()
  }

  public RemoveSpecialEquipment(data: CompendiumItem): void {
    const idx = this._special_equipment.findIndex(x => x.ID === data.ID)
    if (idx > -1) this._special_equipment.splice(idx, 1)
    this.save()
  }

  // -- Mechs -------------------------------------------------------------------------------------
  public get Mechs(): Mech[] {
    return this._mechs
  }

  public AddMech(mech: Mech): void {
    this._mechs.push(mech)
    store.dispatch('cloudSync', { callback: null, condition: 'mechCreate' })
    this.save()
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
      store.dispatch('cloudSync', { callback: null, condition: 'mechDelete' })
    }
    this.save()
  }

  public CloneMech(mech: Mech): void {
    const mechData = Mech.Serialize(mech)
    const clone = Mech.Deserialize(mechData, this)
    clone.RenewID()
    clone.Name += '*'
    this._mechs.push(clone)
    this.save()
  }

  public get ActiveMech(): Mech | null {
    return this._state.ActiveMech
  }

  public set ActiveMech(mech: Mech | null) {
    this._state = new ActiveState(this)
    this._state.ActiveMech = mech
  }

  // -- COUNTERS ----------------------------------------------------------------------------------

  private _counterSaveData = []

  public get CounterSaveData(): ICounterSaveData[] {
    return this._counterSaveData
  }
  public saveCounter(inputData: ICounterSaveData): void {
    const index = this._counterSaveData.findIndex(datum => datum.id === inputData.id)
    if (index < 0) {
      this._counterSaveData = [...this._counterSaveData, inputData]
    } else {
      this._counterSaveData[index] = inputData
      this._counterSaveData = [...this._counterSaveData]
    }
    this.save()
  }

  private _customCounters: ICounterData[] = []

  public get CustomCounterData(): ICounterData[] {
    return this._customCounters || []
  }

  public createCustomCounter(name: string): void {
    const counter = {
      name,
      id: uuid(),
      custom: true,
    }
    this._customCounters = [...this._customCounters, counter]
    this.save()
  }

  public deleteCustomCounter(id: string): void {
    const index = this._customCounters.findIndex(c => c.custom && c.id === id)
    if (index > -1) {
      this._customCounters.splice(index, 1)
      this._customCounters = [...this._customCounters]
    }
    this.save()
  }

  public get CounterData(): ICounterData[] {
    return [...this.Counters, ...this.CustomCounterData].flat().filter(x => x)
  }

  // -- Organization ------------------------------------------------------------------------------
  public get Group(): string {
    return this._group
  }

  public set Group(val: string) {
    this._group = val
    this.save()
  }

  public get SortIndex(): number {
    return this._sortIndex
  }

  public set SortIndex(val: number) {
    this._sortIndex = val
    this.save()
  }

  // -- Active Mode -------------------------------------------------------------------------------
  public SpecialEval(val: number | string): number {
    if (typeof val === 'number') return val
    let valStr = val as string
    valStr = valStr.replaceAll(`{ll}`, this.Level.toString())
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

  public FullRestore(): void {
    this.Restore()
    this.CurrentHP = this.MaxHP
  }

  // -- Bonuses, Actions, Synergies, etc. ---------------------------------------------------------
  private features<T>(p: string): T[] {
    if (!this.Loadout) return []

    return this._loadout.Items.filter(i => !!i)
      .flatMap(x => x[p])
      .concat(this._core_bonuses.flatMap(x => x[p]))
      .concat(this._reserves.filter(x => !x.Used).flatMap(y => y[p]))
      .concat(this._talents.flatMap(x => x.UnlockedRanks.flatMap(y => y[p])))
  }

  public get Bonuses(): Bonus[] {
    return this.features('Bonuses')
  }

  public get Synergies(): Synergy[] {
    return this.features('Synergies')
  }

  public get Actions(): Action[] {
    return this.features('Actions')
  }

  public get Deployables(): IDeployableData[] {
    return this.features('Deployables')
  }

  public get Counters(): ICounterData[] {
    let counters: ICounterData[] = this.features('Counters')
    if (this.ActiveMech) counters = counters.concat(this.ActiveMech.CountersOnlyMech)
    return counters
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.features('IntegratedWeapons')
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.features('IntegratedSystems')
  }

  public get IntegratedSpecialEquipment(): CompendiumItem[] {
    return this.features('SpecialEquipment')
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

  public static Serialize(p: Pilot): IPilotData {
    return {
      id: p.ID,
      group: p.Group,
      sort_index: p.SortIndex,
      isLocal: p.IsLocallyOwned,
      cloudID: p.CloudID,
      cloudOwnerID: p.CloudOwnerID,
      gistCode: p.GistCode,
      gistOwner: p.GistOwner,
      lastSync: p.LastSync,
      level: p.Level,
      callsign: p.Callsign,
      name: p.Name,
      player_name: p.PlayerName,
      status: p.Status,
      dead: p.IsDead,
      factionID: p._factionID,
      text_appearance: p.TextAppearance,
      notes: p.Notes,
      history: p.History,
      portrait: p._portrait,
      cloud_portrait: p._cloud_portrait,
      quirks: p.Quirks,
      current_hp: p.CurrentHP,
      reserves: p.Reserves.length ? p.Reserves.map(x => Reserve.Serialize(x)) : [],
      orgs: p.Organizations.length ? p.Organizations.map(x => Organization.Serialize(x)) : [],
      background: p.Background,
      mechSkills: MechSkills.Serialize(p.MechSkills),
      licenses: p.Licenses.map(x => PilotLicense.Serialize(x)),
      skills: p.Skills.map(x => PilotSkill.Serialize(x)),
      talents: p.Talents.map(x => PilotTalent.Serialize(x)),
      core_bonuses: p.CoreBonuses.map(x => x.ID),
      loadout: PilotLoadout.Serialize(p.Loadout),
      mechs: p.Mechs.length ? p.Mechs.map(x => Mech.Serialize(x)) : [],
      cc_ver: p.cc_ver,
      counter_data: p.CounterSaveData,
      custom_counters: p.CustomCounterData,
      special_equipment: this.serializeSE(p._special_equipment),
      combat_history: p.State.Stats,
      state: ActiveState.Serialize(p.State),
      brews: p._brews || [],
    }
  }

  public static Deserialize(pilotData: IPilotData): Pilot {
    const p = new Pilot()
    try {
      p.Update(pilotData)
      return p
    } catch (err) {
      console.error(err)
    }
  }

  public Update(data: IPilotData, sync?: boolean): void {
    if (sync) {
      for (const key in data) {
        if (this.SyncIgnore.includes(key)) data[key] = null
      }
    }
    else {
      this._group = data.group || ''
      this._sortIndex = data.sort_index || 0
    }

    this._gistCode = data.gistCode || ''
    this._gistOwner = data.gistOwner || ''
    this.IsLocallyOwned = data.isLocal
    this.CloudID = data.cloudID || ''
    this.CloudOwnerID = data.cloudOwnerID || ''
    this.LastSync = data.lastSync || ''
    this._id = data.id
    this._loadout = data.loadout ? PilotLoadout.Deserialize(data.loadout) : new PilotLoadout(0)
    this._combat_history = data.combat_history ? data.combat_history : ActiveState.NewCombatStats()
    this._level = data.level
    this._callsign = data.callsign
    this._name = data.name
    this._dead = data.dead || false
    this._player_name = data.player_name
    this._status = data.status || 'ACTIVE'
    this._factionID = data.factionID
    this._text_appearance = data.text_appearance
    this._notes = data.notes
    this._history = data.history
    this._portrait = data.portrait
    this._cloud_portrait = data.cloud_portrait
    this._quirks = data.quirks ? data.quirks : (data as any).quirk ? [(data as any).quirk] : []
    this.CurrentHP = data.current_hp
    this._background = data.background
    this._mechSkills = MechSkills.Deserialize(this, data.mechSkills)
    this._licenses = data.licenses.map((x: IRankedData) => PilotLicense.Deserialize(x))
    this._skills = data.skills.map((x: IRankedData) => PilotSkill.Deserialize(x))
    this._talents = data.talents.map((x: IRankedData) => PilotTalent.Deserialize(x))
    this._core_bonuses = data.core_bonuses.map((x: string) => CoreBonus.Deserialize(x))
    this._reserves = data.reserves
      ? data.reserves.map((x: IReserveData) => Reserve.Deserialize(x))
      : []
    this._orgs = data.orgs
      ? data.orgs.map((x: IOrganizationData) => Organization.Deserialize(x))
      : []
    this._mechs = data.mechs.length
      ? data.mechs.map((x: IMechData) => Mech.Deserialize(x, this))
      : []
    this._special_equipment = data.special_equipment
      ? Pilot.deserializeSE(data.special_equipment)
      : []
    if (sync && data.state) {
      this._state.Update(this, data.state, sync)
    } else {
      this._state = data.state ? ActiveState.Deserialize(this, data.state) : new ActiveState(this)
    }
    this.cc_ver = data.cc_ver || ''
    this._counterSaveData = data.counter_data || []
    this._customCounters = (data.custom_counters as ICounterData[]) || []
    this._brews = data.brews || []
  }
}

export { Pilot, IPilotData }
