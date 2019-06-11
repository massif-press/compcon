import _ from 'lodash'
import uid from '@/features/_shared/uid'
import {
  Contact,
  Background,
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
} from '@/class'
import { rules } from 'lancer-data'
import store from '@/store'

class Pilot {
  private gistID: string
  private callsign: string
  private name: string
  private text_appearance: string
  private notes: string
  private quirk: string
  private history: string
  private active: boolean

  private id: string
  private level: number
  private portrait: string
  private cloud_portrait: string
  private current_hp: number

  private background: Background
  private contacts: Contact[]
  private licenses: PilotLicense[]
  private skills: PilotSkill[]
  private talents: PilotTalent[]
  private core_bonuses: CoreBonus[]
  private mechSkills: MechSkills

  private loadouts: PilotLoadout[]
  private active_loadout: string | null

  private mechs: Mech[]
  private active_mech: string | null
  private loaded_mech: Mech | null

  private cc_ver: string

  constructor() {
    this.id = uid.generate()
    this.gistID = ''
    this.level = 0
    this.callsign = ''
    this.name = ''
    this.text_appearance = ''
    this.notes = ''
    this.history = ''
    this.portrait = ''
    this.cloud_portrait = ''
    this.quirk = ''
    this.current_hp = this.MaxHP
    this.contacts = []
    this.background = new Background()
    this.licenses = []
    this.skills = []
    this.talents = []
    this.mechSkills = new MechSkills()
    this.core_bonuses = []
    this.active = false
    this.active_mech = null
    this.active_loadout = null
    this.loadouts = []
    this.mechs = []
    this.loaded_mech = null
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }

  // -- Utility -----------------------------------------------------------------------------------
  private save() {
    store.dispatch('saveData')
  }

  public has(typeName: string, id: string, rank?: number): boolean {
    if (typeName.toLowerCase() === 'skill') {
      return this.skills.findIndex(x => x.Skill.ID === id) > -1
    } else if (typeName.toLowerCase() === 'corebonus') {
      return this.core_bonuses.findIndex(x => x.ID === id) > -1
    } else if (typeName.toLowerCase() === 'license') {
      const index = this.licenses.findIndex(x => x.License.Name === id)
      return rank ? index > -1 && this.licenses[index].Rank >= rank : index > -1
    } else if (typeName.toLowerCase() === 'talent') {
      const index = this.talents.findIndex(x => x.Talent.ID === id)
      return rank ? index > -1 && this.talents[index].Rank >= rank : index > -1
    }
    return false
  }

  public getTalentRank(id: string): number {
    const index = this.talents.findIndex(x => x.Talent.ID === id)
    return index > -1 ? this.talents[index].Rank : 0
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get ID(): string {
    return this.id
  }

  public RenewID() {
    this.id = uid.generate()
    this.gistID = ''
    this.save()
  }

  public get IsActive() {
    return this.active
  }

  public set Active(toggle: boolean) {
    this.active = toggle
    this.save()
  }

  public get Level(): number {
    return this.level
  }

  public set Level(level: number) {
    this.level = level
    this.save()
  }

  public get Background(): Background {
    return this.background
  }

  public set Background(bg: Background) {
    this.background = bg
    this.save()
  }

  public get GistID(): string {
    return this.gistID
  }

  public set GistID(id: string) {
    this.gistID = id
    this.save()
  }

  public get Callsign(): string {
    return this.callsign
  }

  public set Callsign(newVal: string) {
    this.callsign = newVal
    this.save()
  }

  public get Name(): string {
    return this.name
  }

  public set Name(newVal: string) {
    this.name = newVal
    this.save()
  }

  public get TextAppearance(): string {
    return this.text_appearance
  }

  public set TextAppearance(newVal: string) {
    this.text_appearance = newVal
    this.save()
  }

  public get Notes(): string {
    return this.notes
  }

  public set Notes(newVal: string) {
    this.notes = newVal
    this.save()
  }

  public get Qirk(): string {
    return this.quirk
  }

  public set Qirk(newVal: string) {
    this.quirk = newVal
    this.save()
  }

  public RollQuirk() {
    const quirks = store.getters.getItemCollection('Quirks')
    this.quirk = quirks[Math.floor(Math.random() * quirks.length)]
    this.save()
  }

  public get History(): string {
    return this.history
  }

  public set History(history: string) {
    this.history = history
    this.save()
  }

  public SetCloudPortrait(src: string) {
    this.cloud_portrait = src
    this.save()
  }

  public get CloudPortrait(): string {
    return this.cloud_portrait
  }

  public SetLocalPortrait(src: string) {
    this.portrait = src
    this.save()
  }

  public get LocalPortrait(): string {
    return this.portrait
  }

  public get Portrait(): string {
    if (this.cloud_portrait) return this.cloud_portrait
    else if (this.portrait)
      return `file://${store.getters.getUserPath}/img/portrait/${this.portrait}`
    else return ''
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get Grit(): number {
    return Math.ceil(this.level / 2)
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
    if (this.active && this.current_hp) return this.current_hp
    return this.MaxHP
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
        if (x.Speed && x.Speed > speed) speed = x.Speed
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
        if (x.Evasion && x.Evasion > evasion) evasion = x.Evasion
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
        if (x.EDefense && x.EDefense > edef) edef = x.EDefense
        edef += x.EDefenseBonus
      })
    }
    return edef
  }

  //TODO: collect passives, eg:
  public get LimitedBonus(): number {
    let bonus = Math.floor(this.MechSkills.Eng / 2)
    if (this.core_bonuses.find(x => x.ID === 'ammofeeds')) {
      bonus += 2
    }
    return bonus
  }

  // -- Skills ------------------------------------------------------------------------------------
  public get Skills(): PilotSkill[] {
    return this.skills
  }

  public set Skills(skills: PilotSkill[]) {
    this.skills = skills
    this.save()
  }

  public AddSkill(skill: Skill) {
    const index = this.skills.findIndex(x => _.isEqual(x.Skill, skill))
    if (index === -1) {
      this.skills.push(new PilotSkill(skill))
    } else {
      this.skills[index].Increment()
    }
    this.save()
  }

  public RemoveSkill(skill: Skill) {
    const index = this.skills.findIndex(x => _.isEqual(x.Skill, skill))
    if (index === -1) {
      console.error(
        `Skill Trigger "${skill.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      if (this.skills[index].Rank > 1) {
        this.skills[index].Decrement()
      } else {
        this.skills.splice(index, 1)
      }
    }
    this.save()
  }

  public ClearSkills() {
    for (let i = this.skills.length - 1; i >= 0; i--) {
      while (this.skills[i]) {
        this.RemoveSkill(this.skills[i].Skill)
      }
    }
  }

  // -- Talents -----------------------------------------------------------------------------------
  public get Talents(): PilotTalent[] {
    return this.talents
  }

  public set Talents(talents: PilotTalent[]) {
    this.talents = talents
    this.save()
  }

  public AddTalent(talent: Talent) {
    const index = this.talents.findIndex(x => _.isEqual(x.Talent, talent))
    if (index === -1) {
      this.talents.push(new PilotTalent(talent))
    } else {
      this.talents[index].Increment()
    }
    this.talentSort()
    this.resetIntegratedTalents()
    this.save()
  }

  public RemoveTalent(talent: Talent) {
    const index = this.talents.findIndex(x => _.isEqual(x.Talent, talent))
    if (index === -1) {
      console.error(
        `Talent "${talent.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      if (this.talents[index].Rank > 1) {
        this.talents[index].Decrement()
      } else {
        this.talents.splice(index, 1)
      }
    }
    this.talentSort()
    this.resetIntegratedTalents()
    this.save()
  }

  public ClearTalents() {
    for (let i = this.talents.length - 1; i >= 0; i--) {
      while (this.talents[i]) {
        this.RemoveTalent(this.talents[i].Talent)
      }
    }
  }

  private talentSort() {
    this.talents = this.talents.sort(function(a, b) {
      return a.Rank === b.Rank ? 0 : a.Rank > b.Rank ? -1 : 1
    })
  }

  private resetIntegratedTalents() {
    this.mechs.forEach(mech => {
      mech.Loadouts.forEach(loadout => {
        loadout.ResetIntegratedMounts(mech)
      })
    })
  }

  // -- Core Bonuses ------------------------------------------------------------------------------
  public get CoreBonuses(): CoreBonus[] {
    return this.core_bonuses
  }

  public set CoreBonuses(coreBonuses: CoreBonus[]) {
    this.core_bonuses = coreBonuses
    this.save()
  }

  public AddCoreBonus(coreBonus: CoreBonus) {
    this.core_bonuses.push(coreBonus)
    this.save()
  }

  public RemoveCoreBonus(coreBonus: CoreBonus) {
    const index = this.core_bonuses.findIndex(x => _.isEqual(coreBonus, x))
    if (index === -1) {
      console.error(
        `CORE Bonus "${coreBonus.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      this.core_bonuses.splice(index, 1)
      this.removeCoreBonusEffects(coreBonus)
    }
    this.save()
  }

  public ClearCoreBonuses() {
    for (let i = this.core_bonuses.length - 1; i >= 0; i--) {
      this.RemoveCoreBonus(this.core_bonuses[i])
    }
  }

  private removeCoreBonusEffects(coreBonus: CoreBonus) {
    this.mechs.forEach(mech => {
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
    return this.licenses
  }

  public set Licenses(licenses: PilotLicense[]) {
    this.licenses = licenses
    this.save()
  }

  public AddLicense(license: License) {
    const index = this.licenses.findIndex(x => _.isEqual(x.License, license))
    if (index === -1) {
      this.licenses.push(new PilotLicense(license, 1))
    } else {
      this.licenses[index].Increment()
    }
    this.save()
  }

  public RemoveLicense(license: License) {
    const index = this.licenses.findIndex(x => _.isEqual(x.License, license))
    if (index === -1) {
      console.error(
        `License "${license.ToString()}" does not exist on Pilot ${
          this.callsign
        }`
      )
    } else {
      if (this.licenses[index].Rank > 1) {
        this.licenses[index].Decrement()
      } else {
        this.licenses.splice(index, 1)
      }
    }
    this.save()
  }

  public ClearLicenses() {
    for (let i = this.licenses.length - 1; i >= 0; i--) {
      while (this.licenses[i]) {
        this.RemoveLicense(this.licenses[i].License)
      }
    }
  }

  // -- Mech Skills -------------------------------------------------------------------------------
  public get MechSkills(): MechSkills {
    return this.mechSkills
  }

  public set MechSkills(mechskills: MechSkills) {
    this.mechSkills = mechskills
    this.save()
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadouts(): PilotLoadout[] {
    return this.loadouts
  }

  public set Loadouts(loadouts: PilotLoadout[]) {
    this.loadouts = loadouts
    this.save()
  }

  public get ActiveLoadout(): PilotLoadout | null {
    if (!this.active_loadout) return null
    return this.loadouts.find(x => x.ID === this.active_loadout) || null
  }

  public set ActiveLoadout(loadout: PilotLoadout | null) {
    this.active_loadout = (loadout && loadout.ID) || ''
    this.save()
  }

  public AddLoadout() {
    this.loadouts.push(new PilotLoadout(this.loadouts.length))
    this.ActiveLoadout = this.Loadouts[this.loadouts.length - 1]
    this.save()
  }

  public RemoveLoadout(loadout: PilotLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout))
    if (index === -1) {
      console.error(
        `Loadout"${loadout.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      if (loadout.ID === this.active_loadout) this.active_loadout = null
      this.loadouts.splice(index, 1)
    }
    this.save()
  }

  public CloneLoadout(loadout: PilotLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout))
    if (index === -1) {
      console.error(
        `Loadout "${loadout.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      let newLoadout = new PilotLoadout(this.loadouts.length)
      newLoadout.Name = loadout.Name + ' (Copy)'
      this.loadouts.splice(index + 1, 0, newLoadout)
    }
    this.save()
  }

  // -- Mechs -----------------------------------------------------------------------------------
  public get Mechs(): Mech[] {
    return this.mechs
  }

  public AddMech(mech: Mech) {
    this.mechs.push(mech)
    this.save()
  }

  public RemoveMech(mech: Mech) {
    const index = this.mechs.findIndex(x => _.isEqual(x, mech))
    if (index === -1) {
      console.error(
        `Loadout "${mech.Name}" does not exist on Pilot ${this.callsign}`
      )
    } else {
      this.mechs.splice(index, 1)
    }
    this.save()
  }

  public CloneMech(mech: Mech) {
    const mechData = Mech.Serialize(mech)
    const clone = Mech.Deserialize(mechData, this)
    clone.RenewID()
    this.mechs.push(clone)
    this.save()
  }

  public get ActiveMech(): Mech | null {
    return this.mechs.find(x => x.ID === this.active_mech) || null
  }

  public get ActiveConfig(): Mech | null {
    return this.mechs.find(x => x.ID === this.active_mech) || null
  }

  public set ActiveMech(config: Mech | null) {
    this.mechs.forEach(m => {
      m.Active = false
    })

    if (!config) {
      this.save()
      return
    }
    config.Active = true
    this.active_mech = config.ID
    this.save()
  }

  public get LoadedMech(): Mech | null {
    return this.loaded_mech
  }

  public set LoadedMech(mech: Mech | null) {
    this.loaded_mech = mech
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(p: Pilot): IPilotData {
    return {
      id: p.ID,
      gistID: p.GistID,
      level: p.Level,
      callsign: p.Callsign,
      name: p.Name,
      text_appearance: p.TextAppearance,
      notes: p.Notes,
      history: p.History,
      portrait: p.portrait,
      cloud_portrait: p.cloud_portrait,
      quirk: p.Qirk,
      current_hp: p.CurrentHP,
      active: p.IsActive,
      // contacts: p.contacts,
      background: Background.Serialize(p.Background),
      mechSkills: MechSkills.Serialize(p.MechSkills),
      licenses: p.Licenses.map(x => PilotLicense.Serialize(x)),
      skills: p.Skills.map(x => PilotSkill.Serialize(x)),
      talents: p.Talents.map(x => PilotTalent.Serialize(x)),
      core_bonuses: p.CoreBonuses.map(x => x.ID),
      loadouts: p.Loadouts.map(x => PilotLoadout.Serialize(x)),
      active_loadout: p.ActiveLoadout ? p.ActiveLoadout.ID : null,
      mechs: p.Mechs.length ? p.Mechs.map(x => Mech.Serialize(x)) : [],
      active_mech: p.ActiveMech ? p.ActiveMech.ID : null,
      cc_ver: p.cc_ver,
    }
  }

  public static Deserialize(pilotData: IPilotData): Pilot {
    let p = new Pilot()
    p.gistID = pilotData.gistID
    p.id = pilotData.id
    p.level = pilotData.level
    p.callsign = pilotData.callsign
    p.name = pilotData.name
    p.text_appearance = pilotData.text_appearance
    p.notes = pilotData.notes
    p.history = pilotData.history
    p.portrait = pilotData.portrait
    p.cloud_portrait = pilotData.cloud_portrait
    p.quirk = pilotData.quirk
    p.current_hp = pilotData.current_hp
    p.active = pilotData.active
    // p.contacts = pilotData.contacts
    p.background = Background.Deserialize(pilotData.background)
    p.mechSkills = MechSkills.Deserialize(pilotData.mechSkills)
    p.licenses = pilotData.licenses.map((x: IRankedData) =>
      PilotLicense.Deserialize(x)
    )
    p.skills = pilotData.skills.map((x: IRankedData) =>
      PilotSkill.Deserialize(x)
    )
    p.talents = pilotData.talents.map((x: IRankedData) =>
      PilotTalent.Deserialize(x)
    )
    p.CoreBonuses = pilotData.core_bonuses.map((x: string) =>
      CoreBonus.Deserialize(x)
    )
    p.loadouts = pilotData.loadouts.map((x: IPilotLoadoutData) =>
      PilotLoadout.Deserialize(x)
    )
    p.active_loadout = pilotData.active_loadout
    p.mechs = pilotData.mechs.length
      ? pilotData.mechs.map((x: IMechData) => Mech.Deserialize(x, p))
      : []
    p.active_mech = pilotData.active_mech
    p.cc_ver = pilotData.cc_ver || ''
    return p
  }
}

export default Pilot
