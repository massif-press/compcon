import _ from 'lodash'
import lancerData from 'lancer-data'
import { getUser, UserProfile } from '@/io/User'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  License,
  CoreBonus,
  Skill,
  Frame,
  MechWeapon,
  WeaponMod,
  MechSystem,
  Tag,
  PilotWeapon,
  PilotArmor,
  PilotGear,
  Talent,
  Reserve,
  Manufacturer,
  NpcClass,
  NpcTemplate,
  NpcFeature,
  NpcWeapon,
  NpcReaction,
  NpcTrait,
  NpcSystem,
  NpcTech,
  ContentPack,
} from '@/class'
import {
  ICoreBonusData,
  ITalentData,
  IFrameData,
  IMechWeaponData,
  ISkillData,
  IPilotArmorData,
  IPilotGearData,
  IPilotWeaponData,
  IWeaponModData,
  IMechSystemData,
  IManufacturerData,
  INpcClassData,
  INpcFeatureData,
  INpcTemplateData,
  INpcWeaponData,
  INpcReactionData,
  INpcSystemData,
  INpcTechData,
  IContentPack,
} from '@/interface'
import ExtLog from '@/io/ExtLog'
import { saveData as saveUserData, loadData as loadUserData } from '@/io/Data'

export const SET_VERSIONS = 'SET_VERSIONS'
export const LOAD_DATA = 'LOAD_DATA'

export const LOAD_PACK = 'LOAD_PACK'
export const DELETE_PACK = 'DELETE_PACK'
export const SET_PACK_ACTIVE = 'SET_PACK_ACTIVE'

@Module({
  name: 'datastore',
})
export class CompendiumStore extends VuexModule {
  public LancerVersion: string = ''
  public CCVersion: string = ''
  public UserProfile: UserProfile = {} as any
  public Skills: Skill[] = []
  public Statuses: Status[] = []
  public Quirks: string[] = []
  // public Licenses: License[] = []
  public Reserves: Reserve[] = []
  public Factions: Faction[] = []
  public Environments: Environment[] = []
  public Sitreps: Sitrep[] = []

  ContentPacks: ContentPack[] = []

  private _Base_Talents: Talent[] = []
  private _Base_CoreBonuses: CoreBonus[] = []
  private _Base_Frames: Frame[] = []
  private _Base_Manufacturers: Manufacturer[] = []
  private _Base_MechWeapons: MechWeapon[] = []
  private _Base_WeaponMods: WeaponMod[] = []
  private _Base_MechSystems: MechSystem[] = []
  private _Base_PilotGear: PilotGear[] = []
  private _Base_Tags: Tag[] = []

  private _Base_NpcClasses: NpcClass[] = []
  private _Base_NpcTemplates: NpcTemplate[] = []
  private _Base_NpcFeatures: NpcFeature[] = []

  public get NpcClasses(): NpcClass[] {
    return [
      ...this._Base_NpcClasses,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcClasses),
    ]
  }
  public get NpcTemplates(): NpcTemplate[] {
    return [
      ...this._Base_NpcTemplates,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcTemplates),
    ]
  }
  public get NpcFeatures(): NpcFeature[] {
    return [
      ...this._Base_NpcFeatures,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcFeatures),
    ]
  }

  public get Talents(): Talent[] {
    return [
      ...this._Base_Talents,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.Talents),
    ]
  }
  public get CoreBonuses(): CoreBonus[] {
    return [
      ...this._Base_CoreBonuses,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.CoreBonuses),
    ]
  }
  public get Frames(): Frame[] {
    return [
      ...this._Base_Frames,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.Frames),
    ]
  }
  public get Manufacturers(): Manufacturer[] {
    return [
      ...this._Base_Manufacturers,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.Manufacturers),
    ]
  }
  public get MechWeapons(): MechWeapon[] {
    return [
      ...this._Base_MechWeapons,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.MechWeapons),
    ]
  }
  public get WeaponMods(): WeaponMod[] {
    return [
      ...this._Base_WeaponMods,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.WeaponMods),
    ]
  }
  public get MechSystems(): MechSystem[] {
    return [
      ...this._Base_MechSystems,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.MechSystems),
    ]
  }
  public get PilotGear(): PilotGear[] {
    return [
      ...this._Base_PilotGear,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.PilotGear),
    ]
  }
  public get Tags(): Tag[] {
    return [
      ...this._Base_Tags,
      ...this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.Tags),
    ]
  }

  public get Licenses(): License[] {
    return this.Frames.filter(x => x.Source !== 'GMS').map(frame => new License(frame))
  }

  // TODO: just set as part of the data loader
  @Mutation
  private [SET_VERSIONS](lancer: string, cc: string): void {
    this.LancerVersion = lancer
    this.CCVersion = cc
  }

  @Mutation
  private [LOAD_DATA](): void {
    getUser().then(profile => (this.UserProfile = profile))

    this.Skills = lancerData.skills.map((x: ISkillData) => new Skill(x))
    this.Reserves = lancerData.reserves.map((x: IReserveData) => new Reserve(x))
    this.Statuses = lancerData.statuses
    this.Quirks = lancerData.quirks
    this.Environments = lancerData.environments
    this.Sitreps = lancerData.sitreps

    this._Base_CoreBonuses = lancerData.core_bonuses.map((x: ICoreBonusData) => new CoreBonus(x))
    this._Base_Talents = lancerData.talents.map((x: ITalentData) => new Talent(x))
    this._Base_Frames = lancerData.frames.map((x: IFrameData) => new Frame(x))
    this._Base_MechWeapons = lancerData.weapons.map((x: IMechWeaponData) => new MechWeapon(x))
    this._Base_WeaponMods = lancerData.mods.map((x: IWeaponModData) => new WeaponMod(x))
    this._Base_MechSystems = lancerData.systems.map((x: IMechSystemData) => new MechSystem(x))
    this._Base_Tags = lancerData.tags.map((x: ITagData) => new Tag(x))
    // TODO: use type guards
    this._Base_PilotGear = lancerData.pilot_gear.map(function(x: any) {
      if (x.type === 'weapon') return new PilotWeapon(x as IPilotWeaponData)
      else if (x.type === 'armor') return new PilotArmor(x as IPilotArmorData)
      return new PilotGear(x as IPilotGearData)
    })
    this._Base_Manufacturers = lancerData.manufacturers.map(
      (x: IManufacturerData) => new Manufacturer(x)
    )
    // TODO: use type guards
    this._Base_NpcFeatures = lancerData.npc_features.map(function(x: any) {
      if (x.type.toLowerCase() === 'weapon') return new NpcWeapon(x as INpcWeaponData)
      else if (x.type.toLowerCase() === 'reaction') return new NpcReaction(x as INpcReactionData)
      else if (x.type.toLowerCase() === 'trait') return new NpcTrait(x as INpcFeatureData)
      else if (x.type.toLowerCase() === 'system') return new NpcSystem(x as INpcSystemData)
      return new NpcTech(x as INpcTechData)
    })
    this._Base_NpcClasses = lancerData.npc_classes.map((x: INpcClassData) => new NpcClass(x))
    this._Base_NpcTemplates = lancerData.npc_templates.map(
      (x: INpcTemplateData) => new NpcTemplate(x)
    )
  }

  @Mutation
  private [LOAD_PACK](packData: IContentPack): void {
    const pack = new ContentPack(packData)
    this.ContentPacks = [...this.ContentPacks, pack]
  }

  @Mutation
  private [DELETE_PACK](packID: string): void {
    this.ContentPacks = this.ContentPacks.filter(pack => pack.ID !== packID)
  }

  @Mutation
  private [SET_PACK_ACTIVE](payload: { packID: string; active: boolean }): void {
    const { packID, active } = payload
    this.ContentPacks.find(pack => pack.ID === packID).SetActive(active)
    this.ContentPacks = [...this.ContentPacks]
  }

  @Action
  public async setPackActive(payload: { packID: string; active: boolean }): Promise<void> {
    this.context.commit(SET_PACK_ACTIVE, payload)
    await saveUserData(
      'extra_content.json',
      this.ContentPacks.map(pack => pack.Serialize())
    )
  }

  @Action
  public async installContentPack(pack: IContentPack): Promise<void> {
    if (this.packAlreadyInstalled(pack.id)) {
      ExtLog(`pack ${pack.manifest.name} [${pack.id}] already exists, deleting original...`)
      await this.deleteContentPack(pack.id)
    }
    this.context.commit(LOAD_PACK, pack)
    await saveUserData(
      'extra_content.json',
      this.ContentPacks.map(pack => pack.Serialize())
    )
  }

  @Action
  public async deleteContentPack(packID: string): Promise<void> {
    this.context.commit(DELETE_PACK, packID)
    await saveUserData(
      'extra_content.json',
      this.ContentPacks.map(pack => pack.Serialize())
    )
  }

  @Action
  public async loadExtraContent(): Promise<void> {
    const content = await loadUserData('extra_content.json')
    content.forEach(c => this.context.commit(LOAD_PACK, c))
  }

  public get packAlreadyInstalled(): any {
    return (packID: string) => this.ContentPacks.map(pak => pak.ID).includes(packID)
  }

  private nfErr = { err: 'ID not found' }

  public get instantiate(): any | { err: string } {
    return (itemType: string, id: string) => {
      if (this[itemType] && this[itemType] instanceof Array) {
        const i = this[itemType].find((x: any) => x.ID === id || x.id === id)
        return i ? _.cloneDeep(i) : this.nfErr
      }
      return { err: 'Invalid Item Type' }
    }
  }

  public get referenceByID(): any | { err: string } {
    return (itemType: string, id: string) => {
      if (this[itemType] && this[itemType] instanceof Array) {
        const i = this[itemType].find((x: any) => x.ID === id || x.id === id)
        return i ? i : this.nfErr
      }
      return { err: 'Invalid Item Type' }
    }
  }

  public get getItemCollection(): any {
    return (itemType: string) => {
      return this[itemType]
    }
  }

  public get getUserProfile(): UserProfile {
    return this.UserProfile
  }

  public get getVersion(): string {
    return this.CCVersion
  }

  @Action
  public loadData(): void {
    this.context.commit(LOAD_DATA)
  }

  @Action
  public setVersions(lancerVer: string, ccVer: string): void {
    this.context.commit(SET_VERSIONS, { lancerVer, ccVer })
  }
}
