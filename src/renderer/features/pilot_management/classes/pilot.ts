import uid from '../logic/uid'
import store from '@/store'

class TestPilot {
  public gistID: string;
  public callsign: string;
  public name: string;
  public text_appearance: string;
  public notes: string;
  public quirk: string;
  public history: string;
  public active: boolean;

  private id: string;
  private level: number;
  private background: string;
  private portrait: string;
  private cloud_portrait: string;
  private active_config: string;

  public contacts: object[];
  private licenses: PilotLicense[];
  private skills: PilotSkill[];
  private invocations: PilotInvocation[];
  private talents: PilotTalent[];
  private core_bonuses: String[];
  private mechSkills: MechSkills;

  private loadouts: PilotLoadout[];

  private configs: MechConfig[];

  constructor(p?: Pilot) {
    this.id = (p && p.id) || uid.generate();
    this.level = (p && p.level) || 0;
    this.callsign = (p && p.callsign) || '';
    this.name = (p && p.name) || '';
    this.background = (p && p.background) || '';
    this.text_appearance = (p && p.text_appearance) || '';
    this.notes = (p && p.notes) || '';
    this.history = (p && p.history) || '';
    this.contacts = (p && p.contacts) || [];
    this.licenses = (p && p.licenses) || [];
    this.loadouts = (p && p.loadouts) || [];
    this.skills = (p && p.skills) || [];
    this.invocations = (p && p.invocations) || [];
    this.talents = (p && p.talents) || [];
    this.mechSkills = (p && p.mechSkills) || {
      hull: 0,
      agi: 0,
      sys: 0,
      eng: 0
    };
    this.core_bonuses = (p && p.core_bonuses) || [];
    this.configs = (p && p.configs) || [];
    this.portrait = (p && p.portrait) || '';
    this.quirk = (p && p.quirk) || '';
    this.active = (p && p.active) || false;
    this.active_config = (p && p.active_config) || '';
    this.gistID = (p && p.gistID) || '';
    this.cloud_portrait = (p && p.cloud_portrait) || '';
  }

  private findInState<T>(collection: string, id: string): any {
    return store.getters.getItemById(collection, id) as T;
  }

  public get ID(): string {
    return this.id;
  }

  public get Level(): number {
    return this.level;
  }

  public get Background(): Background {
    return this.findInState<Background>('Backgrounds', this.background);
  }

  public set Background(bg: Background) {
    this.background = bg.id;
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

  public get Skills(): PilotSkill[] {
    return this.skills;
  }

  public set Skills(skills: PilotSkill[]) {
    this.skills = skills;
  }

  public AddSkill() {
    // TODO:
  }

  public RemoveSkill() {
    // TODO:
  }

  public ClearSkills() {
    this.skills = [];
  }

  public get Invocations(): PilotInvocation[] {
    return this.invocations;
  }

  public set Invocations(invocations: PilotInvocation[]) {
    this.invocations = invocations;
  }

  public AddInvocation() {
    // TODO:
  }

  public RemoveInvocation() {
    // TODO:
  }

  public ClearInvocations() {
    this.invocations = [];
  }

  public get Talents(): PilotTalent[] {
    return this.talents;
  }

  public set Talents(talents: PilotTalent[]) {
    this.talents = talents;
  }

  public AddTalent() {
    // TODO:
  }

  public RemoveTalent() {
    // TODO:
  }

  public ClearTalents() {
    this.talents = [];
  }

  public get CoreBonuses(): String[] {
    return this.core_bonuses;
  }

  public set CoreBonuses(core_bonuses: String[]) {
    this.core_bonuses = core_bonuses;
  }

  public AddCoreBonus() {
    // TODO:
  }

  public RemoveCoreBonus() {
    // TODO:
  }

  public ClearCoreBonuses() {
    this.core_bonuses = [];
  }

  public get Licenses(): PilotLicense[] {
    return this.licenses;
  }

  public set Licenses(licenses: PilotLicense[]) {
    this.licenses = licenses;
  }

  public AddLicense() {
    // TODO:
  }

  public RemoveLicense() {
    // TODO:
  }

  public ClearLicenses() {
    this.licenses = [];
  }

  // TODO: mechskills should themselves be a class
  public get MechSkills(): MechSkills {
    return this.mechSkills
  }

  public set MechSkills(ms: MechSkills) {
    this.mechSkills = ms
  }

}

export default TestPilot