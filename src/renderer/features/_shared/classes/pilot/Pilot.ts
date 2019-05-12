import _ from 'lodash'
import uid from "@/features/_shared/uid";
import { Contact, Background, Invocation, MechSkills, PilotLicense, PilotLoadout, PilotSkill, PilotTalent, Skill, License, Talent, CoreBonus, Mech } from '../'
import { rules } from "lancer-data";

class Pilot {
  private gistID: string;
  private callsign: string;
  private name: string;
  private text_appearance: string;
  private notes: string;
  private quirk: string;
  private history: string;
  private active: boolean;

  private id: string;
  private level: number;
  private portrait: string;
  private cloud_portrait: string;
  private current_hp: number;
  
  private background: Background;
  private contacts: Contact[];
  private licenses: PilotLicense[];
  private skills: PilotSkill[];
  private invocations: Invocation[];
  private talents: PilotTalent[];
  private core_bonuses: string[];
  private mechSkills: MechSkills;

  private loadouts: PilotLoadout[];
  private active_loadout: string | null;

  private mechs: Mech[];
  private active_mech: string | null;

  constructor() {
    this.id = uid.generate();
    this.level = 0;
    this.callsign = "";
    this.name = "";
    this.background = new Background();
    this.text_appearance = "";
    this.notes = "";
    this.history = "";
    this.contacts = [];
    this.licenses = [];
    this.loadouts = [];
    this.skills = [];
    this.invocations = [];
    this.talents = [];
    this.mechSkills = new MechSkills();
    this.core_bonuses = [];
    this.mechs = [];
    this.portrait = "";
    this.quirk = "";
    this.active = false;
    this.active_mech = null;
    this.active_loadout = null;
    this.gistID = "";
    this.cloud_portrait = "";
    this.current_hp = this.MaxHP;
  }

  // -- Utility -----------------------------------------------------------------------------------
  public has(typeName: string, id: string, rank?: number): boolean {
    if (typeName.toLowerCase() === "skill") {
      return this.skills.findIndex(x => x.Skill.ID === id) > -1;
    } else if (typeName.toLowerCase() === "CoreBonus") {
      return this.core_bonuses.findIndex(x => x === id) > -1;
    } else if (typeName.toLowerCase() === "License") {
      const index = this.licenses.findIndex(x => x.Name === id);
      return rank
        ? index > -1 && this.licenses[index].Rank >= rank
        : index > -1;
    } else if (typeName.toLowerCase() === "Talent") {
      const index = this.talents.findIndex(x => x.Talent.ID === id);
      return rank ? index > -1 && this.talents[index].Rank >= rank : index > -1;
    }
    return false;
  }

  public getTalentRank(id: string): number {
    const index = this.talents.findIndex(x => x.Talent.ID === id);
    return index > -1 ? this.talents[index].Rank : 0;
  }

  // -- Attributes --------------------------------------------------------------------------------
  public get ID(): string {
    return this.id;
  }

  public RenewID() {
    this.id = uid.generate()
    this.gistID = ""
  }

  public get IsActive() {
    return this.active
  }

  public set Active(toggle: boolean) {
    this.active = toggle
  }

  public get Level(): number {
    return this.level;
  }

  public get Background(): Background {
    return this.background;
  }

  public set Background(bg: Background) {
    this.background = bg;
  }

  public get GistID(): string {
    return this.gistID;
  }

  public get Callsign(): string {
    return this.callsign;
  }

  public get Name(): string {
    return this.name;
  }

  public get TextAppearance(): string {
    return this.text_appearance;
  }

  public get Notes(): string {
    return this.notes;
  }

  public get Qirk(): string {
    return this.quirk;
  }

  public RollQuirk() {
    //TODO: 
  }

  public get History(): string {
    return this.history;
  }

  public SetCloudPortrait(src: string) {
    this.cloud_portrait = src;
  }

  public SetLocalPortrait(src: string) {
    this.portrait = src;
  }

  public get Portrait(): string {
    if (this.cloud_portrait) return this.cloud_portrait;
    else return this.portrait;
  }

  // -- Stats -------------------------------------------------------------------------------------
  public get Grit(): number {
    return Math.ceil(this.level / 2);
  }

  public get MaxHP(): number {
    let health = rules.base_pilot_hp + this.Grit;
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        health += x.HPBonus;
      });
    }
    return health;
  }

  public get CurrentHP(): number {
    if (this.active && this.current_hp) return this.current_hp;
    return this.MaxHP;
  }

  public get Armor(): number {
    let armor = 0;
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        armor += x.Armor;
      });
    }
    return armor;
  }

  public get Speed(): number {
    let speed = rules.base_pilot_speed;
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (x.Speed && x.Speed > speed) speed = x.Speed;
        speed += x.SpeedBonus;
      });
    }
    return speed;
  }

  public get Evasion(): number {
    let evasion = rules.base_pilot_evasion;
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (x.Evasion && x.Evasion > evasion) evasion = x.Evasion;
        evasion += x.EvasionBonus;
      });
    }
    return evasion;
  }

  public get EDef(): number {
    let edef = rules.base_pilot_edef;
    if (this.ActiveLoadout) {
      this.ActiveLoadout.Armor.forEach(x => {
        if (x.EDefense && x.EDefense > edef) edef = x.EDefense;
        edef += x.EDefenseBonus;
      });
    }
    return edef;
  }

  //TODO: collect passives, eg:
  public get LimitedBonus(): number {
    let bonus = Math.floor(this.MechSkills.Eng / 2);
    if (this.core_bonuses.includes("ammofeeds")) {
      bonus += 2;
    }
    return bonus;
  }

  // -- Skills ------------------------------------------------------------------------------------
  public get Skills(): PilotSkill[] {
    return this.skills;
  }

  public set Skills(skills: PilotSkill[]) {
    this.skills = skills;
  }

  public AddSkill(skill: Skill) {
    const index = this.skills.findIndex(x => _.isEqual(x.Skill, skill));
    if (index === -1) {
      this.skills.push(new PilotSkill(skill.ID));
    } else {
      this.skills[index].Increment();
    }
  }

  public RemoveSkill(skill: Skill) {
    const index = this.skills.findIndex(x => _.isEqual(x.Skill, skill));
    if (index === -1) {
      console.error(
        `Skill Trigger "${skill.Name}" does not exist on Pilot ${this.callsign}`
      );
    } else {
      if (this.skills[index].Rank > 1) {
        this.skills[index].Decrement();
      } else {
        this.skills.splice(index, 1);
      }
    }
  }

  public ClearSkills() {
    this.skills = [];
  }

  //  --Invocations -------------------------------------------------------------------------------
  public get Invocations(): Invocation[] {
    return this.invocations;
  }

  public set Invocations(invocations: Invocation[]) {
    this.invocations = invocations;
  }

  public AddInvocation(invocation: Invocation) {
    this.invocations.push(invocation);
  }

  public RemoveInvocation(invocation: Invocation) {
    const index = this.invocations.findIndex(x => _.isEqual(x, invocation));
    if (index > -1) {
      this.invocations.splice(index, 1);
    }
  }

  public ClearInvocations() {
    this.invocations = [];
  }

  // -- Talents -----------------------------------------------------------------------------------
  public get Talents(): PilotTalent[] {
    return this.talents;
  }

  public set Talents(talents: PilotTalent[]) {
    this.talents = talents;
  }

  public AddTalent(talent: Talent) {
    const index = this.talents.findIndex(x => _.isEqual(x.Talent, talent));
    if (index === -1) {
      this.talents.push(new PilotTalent(talent.ID));
    } else {
      this.talents[index].Increment();
    }
  }

  public RemoveTalent(talent: Talent) {
    const index = this.talents.findIndex(x => _.isEqual(x.Talent, talent));
    if (index === -1) {
      console.error(
        `Talent "${talent.Name}" does not exist on Pilot ${this.callsign}`
      );
    } else {
      if (this.talents[index].Rank > 1) {
        this.talents[index].Decrement();
      } else {
        this.talents.splice(index, 1);
      }
    }
  }

  public ClearTalents() {
    this.talents = [];
  }

  // -- Core Bonuses ------------------------------------------------------------------------------
  public get CoreBonuses(): CoreBonus[] {
    return this.core_bonuses.map(x => new CoreBonus(x));
  }

  public set CoreBonuses(coreBonuses: CoreBonus[]) {
    this.core_bonuses = coreBonuses.map(x => x.ID);
  }

  public AddCoreBonus(core_bonus: string) {
    this.core_bonuses.push(core_bonus);
  }

  public RemoveCoreBonus(coreBonus: CoreBonus) {
    const index = this.core_bonuses.findIndex(x => x === coreBonus.ID);
    if (index === -1) {
      console.error(
        `CORE Bonus "${coreBonus.Name}" does not exist on Pilot ${
          this.callsign
        }`
      );
    } else {
      this.core_bonuses.splice(index, 1);
    }
  }

  public ClearCoreBonuses() {
    this.core_bonuses = [];
  }

  // -- Licenses ----------------------------------------------------------------------------------
  public get Licenses(): PilotLicense[] {
    return this.licenses;
  }

  public set Licenses(licenses: PilotLicense[]) {
    this.licenses = licenses;
  }

  public AddLicense(license: License) {
    const index = this.licenses.findIndex(x => _.isEqual(x.License, license));
    if (index === -1) {
      this.licenses.push(
        new PilotLicense(license.FrameID, 1)
      );
    } else {
      this.licenses[index].Increment();
    }
  }

  public RemoveLicense(license: License) {
    const index = this.licenses.findIndex(x => _.isEqual(x.License, license));
    if (index === -1) {
      console.error(
        `License "${license.ToString()}" does not exist on Pilot ${
          this.callsign
        }`
      );
    } else {
      if (this.licenses[index].Rank > 1) {
        this.licenses[index].Decrement();
      } else {
        this.licenses.splice(index, 1);
      }
    }
  }

  public ClearLicenses() {
    this.licenses = [];
  }

  // -- Mech Skills -------------------------------------------------------------------------------
  public get MechSkills(): MechSkills {
    return this.mechSkills;
  }

  public set MechSkills(mechskills: MechSkills) {
    this.mechSkills = mechskills;
  }

  // -- Loadouts ----------------------------------------------------------------------------------
  public get Loadouts(): PilotLoadout[] {
    return this.loadouts;
  }

  public set Loadouts(loadouts: PilotLoadout[]) {
    this.loadouts = loadouts;
  }

  public get ActiveLoadout(): PilotLoadout | null {
    return this.loadouts.find(x => x.ID === this.active_loadout) || null;
  }

  public set ActiveLoadout(loadout: PilotLoadout | null) {
    this.active_loadout = (loadout && loadout.ID) || "";
  }

  public AddLoadout() {
    this.loadouts.push(new PilotLoadout(this.loadouts.length));
  }

  public RemoveLoadout(loadout: PilotLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout));
    if (index === -1) {
      console.error(
        `Loadout"${loadout.Name}" does not exist on Pilot ${this.callsign}`
      );
    } else {
      this.loadouts.splice(index, 1);
    }
  }

  public CloneLoadout(loadout: PilotLoadout) {
    const index = this.loadouts.findIndex(x => _.isEqual(x, loadout));
    if (index === -1) {
      console.error(
        `Loadout "${loadout.Name}" does not exist on Pilot ${this.callsign}`
      );
    } else {
      this.loadouts.splice(
        index + 1,
        0,
        new PilotLoadout(this.loadouts.length)
      );
    }
  }

  // -- Configs -----------------------------------------------------------------------------------
  public get Mechs(): Mech[] {
    return this.mechs;
  }

  public get Configs(): Mech[] {
    return this.mechs;
  }

  public get ActiveMech(): Mech | null {
    return this.mechs.find(x => x.ID === this.active_mech) || null;
  }

  public get ActiveConfig(): Mech | null {
    return this.mechs.find(x => x.ID === this.active_mech) || null;
  }

  public set ActiveMech(config: Mech | null) {
    this.active_mech = config ? config.ID : null;
  }

  public set ActiveConfig(config: Mech | null) {
    this.active_mech = config ? config.ID : null;
  }
}

export default Pilot;
