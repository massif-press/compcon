import _ from 'lodash'
import uuid from 'uuid/v1'
import {
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
  Faction,
} from '@/class'
import { rules } from 'lancer-data'
import { store } from '@/store'

class Pilot {
  private _gistID: string
  private _callsign: string
  private _name: string
  private _player_name: string
  private _status: string
  private _factionID: string
  private _text_appearance: string
  private _notes: string
  private _quirk: string
  private _history: string

  private _id: string
  private _level: number
  private _portrait: string
  private _cloud_portrait: string
  private _current_hp: number
  private _background: string

  private _licenses: PilotLicense[]
  private _skills: PilotSkill[]
  private _talents: PilotTalent[]
  private _core_bonuses: CoreBonus[]
  private _mechSkills: MechSkills

  private _reserves: Reserve[]
  private _orgs: Organization[]

  private _loadouts: PilotLoadout[]
  private _active_loadout: PilotLoadout

  private _mechs: Mech[]
  private _active_mech: string | null

  private cc_ver: string

  public constructor() {
    this._id = uuid()
    this._gistID = ''
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
    this._quirk = ''
    this._current_hp = this.MaxHP
    this._background = ''
    this._licenses = []
    this._skills = []
    this._talents = []
    this._mechSkills = new MechSkills()
    this._core_bonuses = []
    this._active_mech = null
    this._active_loadout = new PilotLoadout(0)
    this._loadouts = []
    this._mechs = []
    this._reserves = []
    this._orgs = []
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }

  // -- Utility -----------------------------------------------------------------------------------
  private save(): void {
    store.dispatch('saveData')
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

  public RenewID(): void {
    this._id = uuid()
    this._gistID = ''
    this.save()
  }

  public get Level(): number {
    return this._level
  }

  public set Level(level: number) {
    this._level = level
    this.save()
  }

  public get Background(): string {
    return this._background
  }

  public set Background(bg: string) {
    this._background = bg
    this.save()
  }

  public get GistID(): string {
    return this._gistID
  }

  public set GistID(id: string) {
    this._gistID = id
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

  public get Qirk(): string {
    return this._quirk
  }

  public set Qirk(newVal: string) {
    this._quirk = newVal
    this.save()
  }

  public RollQuirk(): void {
    const _quirks = store.getters.getItemCollection('Quirks')
    this._quirk = _quirks[Math.floor(Math.random() * _quirks.length)]
    this.save()
  }

  public get History(): string {
    return this._history
  }

  public set History(_history: string) {
    this._history = _history
    this.save()
  }

  public SetCloudPortrait(src: string): void {
    this._cloud_portrait = src
    this.save()
  }

  public get CloudPortrait(): string {
    return this._cloud_portrait
  }

  public SetLocalPortrait(src: string): void {
    this._portrait = src
    this.save()
  }

  public get LocalPortrait(): string {
    return this._portrait
  }

  public get Portrait(): string {
    if (this._cloud_portrait) return this._cloud_portrait
    else if (this._portrait)
      return `file://${store.getters.getUserPath}/img/pilot/${this._portrait}`
    else return ''
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get Grit(): number {
    return Math.ceil(this._level / 2)
  }

  public get MaxHP(): number {
    let health = rules.base_pilot_hp + this.Grit
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (x) health += x.HPBonus
      })
    }
    return health
  }

  public get CurrentHP(): number {
    return this._current_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._current_hp = this.MaxHP
    else if (hp < 0) this._current_hp = 0
    else this._current_hp = hp
    this.save()
  }

  public get Armor(): number {
    let armor = 0
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (x) armor += x.Armor
      })
    }
    return armor
  }

  public get Speed(): number {
    let speed = rules.base_pilot_speed
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (!x) return
        if (x.Speed) speed = x.Speed
        speed += x.SpeedBonus
      })
    }
    return speed
  }

  public get Evasion(): number {
    let evasion = rules.base_pilot_evasion
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (!x) return
        if (x.Evasion) evasion = x.Evasion
        evasion += x.EvasionBonus
      })
    }
    return evasion
  }

  public get EDefense(): number {
    let edef = rules.base_pilot_edef
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (!x) return
        if (x.EDefense) edef = x.EDefense
        edef += x.EDefenseBonus
      })
    }
    return edef
  }

  //TODO: collect passives, eg:
  public get LimitedBonus(): number {
    let bonus = Math.floor(this.MechSkills.Eng / 2)
    if (this._core_bonuses.find(x => x.ID === 'ammofeeds')) {
      bonus += 2
    }
    return bonus
  }

  // -- Skills ------------------------------------------------------------------------------------
  public get Skills(): PilotSkill[] {
    return this._skills
  }

  public set Skills(skills: PilotSkill[]) {
    this._skills = skills
    this.save()
  }

  public get CurrentSkillPoints(): number {
    return this._skills.reduce((sum, skill) => sum + skill.Rank, 0)
  }

  public get MaxSkillPoints(): number {
    return rules.minimum_pilot_skills + this._level
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
    if (this._level === 0) {
      return this._skills.length < rules.minimum_pilot_skills && !this.has('Skill', skill.ID)
    } else {
      const underLimit = this.CurrentSkillPoints < this.MaxSkillPoints
      if (!this.has('Skill', skill.ID) && underLimit) return true
      const pSkill = this._skills.find(x => x.Skill.ID === skill.ID)
      return underLimit && pSkill && pSkill.Rank < rules.max_trigger_rank
    }
  }

  public AddSkill(skill: Skill | CustomSkill): void {
    const index = this._skills.findIndex(x => _.isEqual(x.Skill, skill))
    if (index === -1) {
      this._skills.push(new PilotSkill(skill))
    } else {
      this._skills[index].Increment()
    }
    this.save()
  }

  public AddCustomSkill(skill: string): void {
    this.AddSkill(new CustomSkill(skill))
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
    this.save()
  }

  public get CurrentTalentPoints(): number {
    return this._talents.reduce((sum, talent) => sum + talent.Rank, 0)
  }

  public get MaxTalentPoints(): number {
    return rules.minimum_pilot_talents + this._level
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
    const index = this._talents.findIndex(x => _.isEqual(x.Talent, talent))
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
    const index = this._talents.findIndex(x => _.isEqual(x.Talent, talent))
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
    this._talents = this._talents.sort(function(a, b) {
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
    return Math.floor(this._level / 3)
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
      this.removeCoreBonusEffects(coreBonus)
    }
    this.save()
  }

  public ClearCoreBonuses(): void {
    for (let i = this._core_bonuses.length - 1; i >= 0; i--) {
      this.RemoveCoreBonus(this._core_bonuses[i])
    }
  }

  private removeCoreBonusEffects(coreBonus: CoreBonus): void {
    this._mechs.forEach(mech => {
      mech.Loadouts.forEach(loadout => {
        if (coreBonus.ID === 'retrofit') loadout.RemoveRetrofitting()
        if (coreBonus.ID === 'imparm') loadout.ImprovedArmamentMount.Clear()
        if (coreBonus.ID === 'intweapon') loadout.IntegratedWeaponMount.Clear()
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
    return this._level
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
    const index = this._licenses.findIndex(x => _.isEqual(x.License, license))
    if (index === -1) {
      this._licenses.push(new PilotLicense(license, 1))
    } else {
      this._licenses[index].Increment()
    }
    this.save()
  }

  public RemoveLicense(license: License): void {
    const index = this._licenses.findIndex(x => _.isEqual(x.License, license))
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

  public get CurrentHASEPoints(): number {
    return this._mechSkills.Sum
  }

  public get MaxHASEPoints(): number {
    return rules.minimum_mech_skills + this._level
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

  public RemoveOrganization(index: number): void {
    this._orgs.splice(index, 1)
    this.save()
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadouts(): PilotLoadout[] {
    return this._loadouts
  }

  public set Loadouts(loadouts: PilotLoadout[]) {
    this._loadouts = loadouts
    this.save()
  }

  public get ActiveLoadout(): PilotLoadout {
    return this._active_loadout
  }

  public set ActiveLoadout(loadout: PilotLoadout) {
    this._active_loadout = loadout
    this.save()
  }

  public AddLoadout(): void {
    this._loadouts.push(new PilotLoadout(this._loadouts.length))
    this.ActiveLoadout = this.Loadouts[this._loadouts.length - 1]
    this.save()
  }

  public RemoveLoadout(): void {
    if (this._loadouts.length === 1) {
      console.error(`Cannot remove last Pilot Loadout`)
    } else {
      const index = this._loadouts.findIndex(x => x.ID === this.ActiveLoadout.ID)
      this._active_loadout = this._loadouts[index + index === 0 ? 1 : -1]
      this._loadouts.splice(index, 1)
      this.save()
    }
  }

  public CloneLoadout(): void {
    const index = this._loadouts.findIndex(x => x.ID === this.ActiveLoadout.ID)
    let newLoadout = PilotLoadout.Deserialize(PilotLoadout.Serialize(this.ActiveLoadout))
    newLoadout.RenewID()
    newLoadout.Name += ' (Copy)'
    this._loadouts.splice(index + 1, 0, newLoadout)
    this._active_loadout = this._loadouts[index + 1]
    this.save()
  }

  // -- Mechs -----------------------------------------------------------------------------------
  public get Mechs(): Mech[] {
    return this._mechs
  }

  public AddMech(mech: Mech): void {
    this._mechs.push(mech)
    this.save()
  }

  public RemoveMech(mech: Mech): void {
    const index = this._mechs.findIndex(x => _.isEqual(x, mech))
    if (index === -1) {
      console.error(`Loadout "${mech.Name}" does not exist on Pilot ${this._callsign}`)
    } else {
      this._mechs.splice(index, 1)
    }
    this.save()
  }

  public CloneMech(mech: Mech): void {
    const mechData = Mech.Serialize(mech)
    const clone = Mech.Deserialize(mechData, this)
    clone.RenewID()
    this._mechs.push(clone)
    this.save()
  }

  public get ActiveMech(): Mech | null {
    return this._mechs.find(x => x.ID === this._active_mech) || null
  }

  public set ActiveMech(config: Mech | null) {
    this._mechs.forEach(m => {
      m.Active = false
    })

    if (!config) {
      this.save()
      return
    }
    config.Active = true
    this._active_mech = config.ID
    this.save()
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(p: Pilot): IPilotData {
    return {
      id: p.ID,
      gistID: p.GistID,
      level: p.Level,
      callsign: p.Callsign,
      name: p.Name,
      player_name: p.PlayerName,
      status: p.Status,
      factionID: p._factionID,
      text_appearance: p.TextAppearance,
      notes: p.Notes,
      history: p.History,
      portrait: p._portrait,
      cloud_portrait: p._cloud_portrait,
      quirk: p.Qirk,
      current_hp: p.CurrentHP,
      reserves: p.Reserves.length ? p.Reserves.map(x => Reserve.Serialize(x)) : [],
      orgs: p.Organizations.length ? p.Organizations.map(x => Organization.Serialize(x)) : [],
      background: p.Background,
      mechSkills: MechSkills.Serialize(p.MechSkills),
      licenses: p.Licenses.map(x => PilotLicense.Serialize(x)),
      skills: p.Skills.map(x => PilotSkill.Serialize(x)),
      talents: p.Talents.map(x => PilotTalent.Serialize(x)),
      core_bonuses: p.CoreBonuses.map(x => x.ID),
      loadouts: p.Loadouts.map(x => PilotLoadout.Serialize(x)),
      active_loadout_index: p.Loadouts.findIndex(x => x.ID === p.ActiveLoadout.ID),
      mechs: p.Mechs.length ? p.Mechs.map(x => Mech.Serialize(x)) : [],
      active_mech: p.ActiveMech ? p.ActiveMech.ID : null,
      cc_ver: p.cc_ver,
    }
  }

  public static Deserialize(pilotData: IPilotData): Pilot {
    let p = new Pilot()
    p._gistID = pilotData.gistID
    p._id = pilotData.id
    p._level = pilotData.level
    p._callsign = pilotData.callsign
    p._name = pilotData.name
    p._player_name = pilotData.player_name
    p._status = pilotData.status || 'ACTIVE'
    p._factionID = pilotData.factionID
    p._text_appearance = pilotData.text_appearance
    p._notes = pilotData.notes
    p._history = pilotData.history
    p._portrait = pilotData.portrait
    p._cloud_portrait = pilotData.cloud_portrait
    p._quirk = pilotData.quirk
    p._current_hp = pilotData.current_hp
    p._background = pilotData.background
    p._mechSkills = MechSkills.Deserialize(pilotData.mechSkills)
    p._licenses = pilotData.licenses.map((x: IRankedData) => PilotLicense.Deserialize(x))
    p._skills = pilotData.skills.map((x: IRankedData) => PilotSkill.Deserialize(x))
    p._talents = pilotData.talents.map((x: IRankedData) => PilotTalent.Deserialize(x))
    p.CoreBonuses = pilotData.core_bonuses.map((x: string) => CoreBonus.Deserialize(x))
    p._loadouts = pilotData.loadouts.length
      ? pilotData.loadouts.map((x: IPilotLoadoutData) => PilotLoadout.Deserialize(x))
      : [new PilotLoadout(0)]
    p.Reserves = pilotData.reserves
      ? pilotData.reserves.map((x: IReserveData) => Reserve.Deserialize(x))
      : []
    p.Organizations = pilotData.orgs
      ? pilotData.orgs.map((x: IOrganizationData) => Organization.Deserialize(x))
      : []
    p._active_loadout = pilotData.active_loadout_index
      ? p._loadouts[pilotData.active_loadout_index]
      : p._loadouts[0]
    p._mechs = pilotData.mechs.length
      ? pilotData.mechs.map((x: IMechData) => Mech.Deserialize(x, p))
      : []
    p._active_mech = pilotData.active_mech
    p.cc_ver = pilotData.cc_ver || ''
    return p
  }
}

export default Pilot
