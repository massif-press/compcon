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
  // NpcWeapon,
  // NpcReaction,
  // NpcTrait,
  // NpcSystem,
  // NpcTech,
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
  // INpcClassData,
  // INpcFeatureData,
  // INpcTemplateData,
  // INpcWeaponData,
  // INpcReactionData,
  // INpcSystemData,
  // INpcTechData,
} from '@/interface'
import {
  IContentPack,
  saveContentPack,
  loadSavedContent,
  IContentPackInfo,
  removeContentPack,
  getPackID,
} from '@/io/ExtraContent'
import { CompendiumItem } from '@/classes/CompendiumItem'

export const SET_VERSIONS = 'SET_VERSIONS'
export const BUILD_LICENSES = 'BUILD_LICENSES'
export const LOAD_DATA = 'LOAD_DATA'

export const LOAD_PACK = 'LOAD_PACK'
export const DELETE_PACK = 'DELETE_PACK'

@Module({
  name: 'datastore',
})
export class CompendiumStore extends VuexModule {
  public LancerVersion: string = ''
  public CCVersion: string = ''
  public UserProfile: UserProfile = {} as any
  public Talents: Talent[] = []
  public Skills: Skill[] = []
  public CoreBonuses: CoreBonus[] = []
  public Frames: Frame[] = []
  public Manufacturers: Manufacturer[] = []
  public MechWeapons: MechWeapon[] = []
  public WeaponMods: WeaponMod[] = []
  public MechSystems: MechSystem[] = []
  public PilotGear: PilotGear[] = []
  public Tags: Tag[] = []
  public Statuses: Status[] = []
  public Quirks: string[] = []
  public Licenses: License[] = []
  public Reserves: Reserve[] = []
  public Factions: Faction[] = []
  public NpcClasses: NpcClass[] = []
  public NpcTemplates: NpcTemplate[] = []
  public NpcFeatures: NpcFeature[] = []
  ContentPacks: IContentPackInfo[] = []

  // TODO: just set as part of the data loader
  @Mutation
  private [SET_VERSIONS](lancer: string, cc: string): void {
    this.LancerVersion = lancer
    this.CCVersion = cc
  }

  @Mutation
  private [BUILD_LICENSES](): void {
    const licenses: License[] = []
    this.Frames.filter(x => x.Source !== 'GMS').forEach(frame => {
      licenses.push(new License(frame))
    })
    this.Licenses = licenses
  }

  @Mutation
  private [LOAD_DATA](): void {
    getUser().then(profile => (this.UserProfile = profile))
    this.CoreBonuses = lancerData.core_bonuses.map((x: ICoreBonusData) => new CoreBonus(x))
    this.Talents = lancerData.talents.map((x: ITalentData) => new Talent(x))
    this.Skills = lancerData.skills.map((x: ISkillData) => new Skill(x))
    this.Frames = lancerData.frames.map((x: IFrameData) => new Frame(x))
    this.MechWeapons = lancerData.weapons.map((x: IMechWeaponData) => new MechWeapon(x))
    this.WeaponMods = lancerData.mods.map((x: IWeaponModData) => new WeaponMod(x))
    this.MechSystems = lancerData.systems.map((x: IMechSystemData) => new MechSystem(x))
    this.Tags = lancerData.tags.map((x: ITagData) => new Tag(x))
    this.PilotGear = lancerData.pilot_gear.map(function(x: any) {
      if (x.type === 'weapon') return new PilotWeapon(x as IPilotWeaponData)
      else if (x.type === 'armor') return new PilotArmor(x as IPilotArmorData)
      return new PilotGear(x as IPilotGearData)
    })
    this.Manufacturers = lancerData.manufacturers.map((x: IManufacturerData) => new Manufacturer(x))
    this.Reserves = lancerData.reserves.map((x: IReserveData) => new Reserve(x))
    this.Statuses = lancerData.statuses
    this.Quirks = lancerData.quirks
    // this.NpcClasses = lancerData.npc_classes.map((x: INpcClassData) => new NpcClass(x))
    // this.NpcFeatures = lancerData.npc_features.map(function(x: any) {
    //   if (x.type.toLowerCase() === 'weapon') return new NpcWeapon(x as INpcWeaponData)
    //   else if (x.type.toLowerCase() === 'reaction') return new NpcReaction(x as INpcReactionData)
    //   else if (x.type.toLowerCase() === 'trait') return new NpcTrait(x as INpcFeatureData)
    //   else if (x.type.toLowerCase() === 'system') return new NpcSystem(x as INpcSystemData)
    //   return new NpcTech(x as INpcTechData)
    // })
    // this.NpcTemplates = lancerData.npc_templates.map((x: INpcTemplateData) => new NpcTemplate(x))
  }

  @Mutation
  private [LOAD_PACK](pack: IContentPack): void {
    const { info, data: contentData } = pack

    this.CoreBonuses = [...this.CoreBonuses, ...contentData.coreBonuses.map(x => new CoreBonus(x))]
    this.Talents = [...this.Talents, ...contentData.talents.map(x => new Talent(x))]
    this.Frames = [...this.Frames, ...contentData.frames.map(x => new Frame(x))]
    this.MechWeapons = [...this.MechWeapons, ...contentData.weapons.map(x => new MechWeapon(x))]
    this.WeaponMods = [...this.WeaponMods, ...contentData.mods.map(x => new WeaponMod(x))]
    this.MechSystems = [...this.MechSystems, ...contentData.systems.map(x => new MechSystem(x))]
    this.Tags = [...this.Tags, ...contentData.tags.map(x => new Tag(x))]
    this.PilotGear = [
      ...this.PilotGear,
      ...contentData.pilotGear.map((x: any) => {
        if (x.type === 'weapon') return new PilotWeapon(x as IPilotWeaponData)
        else if (x.type === 'armor') return new PilotArmor(x as IPilotArmorData)
        return new PilotGear(x as IPilotGearData)
      }),
    ] as any
    this.Manufacturers = [
      ...this.Manufacturers,
      ...contentData.manufacturers.map(x => new Manufacturer(x)),
    ]
    this.ContentPacks = [...this.ContentPacks, info]
  }

  @Mutation
  private [DELETE_PACK](packID: string): void {
    if (
      !this.ContentPacks.map(p => p.id)
        .includes(packID)
    ) throw new Error(`Cannot delete pack with ID ${packID} as it does not exist`);
    [
      'CoreBonuses',
      'Talents',
      'Frames',
      'MechWeapons',
      'WeaponMods',
      'MechSystems',
      'PilotGear',
      'Tags',
      'Manufacturers',
    ].forEach(category => {
      this[category] = this[category].filter((item: CompendiumItem) => item.Brew !== packID)
    })
    this.ContentPacks = this.ContentPacks.filter(pack => pack.id !== packID)
  }

  @Action
  public async addContentPack(pack: IContentPack): Promise<void> {
    if (
      this.ContentPacks.map(p => p.id)
        .includes(pack.info.id)
    ) throw new Error(`Pack with ID ${pack.info.id} already exists, replace it instead`)
    this.context.commit(LOAD_PACK, pack)
    this.context.commit(BUILD_LICENSES)
    await saveContentPack(pack)
  }

  @Action
  public async deleteContentPack(packID: string): Promise<void> {
    this.context.commit(DELETE_PACK, packID)
    this.context.commit(BUILD_LICENSES)
    await removeContentPack(packID)
  }

  @Action
  public async replaceContentPack(newPack: IContentPack): Promise<void> { 
    const packID = await getPackID(newPack.info.manifest)

    this.context.commit(DELETE_PACK, packID)
    this.context.commit(LOAD_PACK, newPack)
    this.context.commit(BUILD_LICENSES)

  }

  @Action
  public async loadExtraContent(): Promise<void> {
    const content = await loadSavedContent()
    content.forEach(c => this.context.commit(LOAD_PACK, c))
    this.context.commit(BUILD_LICENSES)
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

  @Action
  public buildLicenses(): void {
    this.context.commit(BUILD_LICENSES)
  }
}
