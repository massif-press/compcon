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
} from '@/interface'

// function stageBrewData(userDataPath: string, brewDataFolder: string, file: string): void {
//   const info = io.loadBrewData(userDataPath, brewDataFolder, 'info')
//   const bID = info ? `${info.name} v.${info.version}` : 'Unknown Content Package'
//   let bArr = io.loadBrewData(userDataPath, brewDataFolder, file)
//   if (bArr.length) {
//     bArr = bArr.map((x: object) => ({ ...x, brew: bID }))
//   }
//   return bArr || []
// }

export const SET_VERSIONS = 'SET_VERSIONS'
export const BUILD_LICENSES = 'BUILD_LICENSES'
export const LOAD_DATA = 'LOAD_DATA'

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
  // Brews: Brew[] = []

  // TODO: just set as part of the data loader
  @Mutation
  private [SET_VERSIONS](lancer: string, cc: string): void {
    this.LancerVersion = lancer
    this.CCVersion = cc
  }

  @Mutation
  // private [SET_BREW_ACTIVE](dir: string, active: boolean): void {
  //   io.setBrewActive(this.UserDataPath, dir, active)
  // }
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
    this.NpcClasses = lancerData.npc_classes.map((x: INpcClassData) => new NpcClass(x))
    this.NpcFeatures = lancerData.npc_features.map(function(x: any) {
      if (x.type.toLowerCase() === 'weapon') return new NpcWeapon(x as INpcWeaponData)
      else if (x.type.toLowerCase() === 'reaction') return new NpcReaction(x as INpcReactionData)
      else if (x.type.toLowerCase() === 'trait') return new NpcTrait(x as INpcFeatureData)
      else if (x.type.toLowerCase() === 'system') return new NpcSystem(x as INpcSystemData)
      return new NpcTech(x as INpcTechData)
    })
    this.NpcTemplates = lancerData.npc_templates.map((x: INpcTemplateData) => new NpcTemplate(x))
    // this.Brews = io.findBrewData(this.UserDataPath)
  }

  // @Mutation
  // private [LOAD_BREWS](): void {
  //   const brewDataFolders = this.Brews.filter((x: any) => x.info.active).map(x => x.dir)
  //   for (const dir of brewDataFolders) {
  //     this.Backgrounds = this.Backgrounds.concat(
  //       stageBrewData(this.UserDataPath, dir, 'backgrounds')
  //     )
  //     this.Talents = this.Talents.concat(stageBrewData(this.UserDataPath, dir, 'talents'))
  //     this.Skills = this.Skills.concat(stageBrewData(this.UserDataPath, dir, 'skills'))
  //     this.CoreBonuses = this.CoreBonuses.concat(
  //       stageBrewData(this.UserDataPath, dir, 'core_bonus')
  //     )
  //     this.Frames = this.Frames.concat(stageBrewData(this.UserDataPath, dir, 'frames'))
  //     this.Manufacturers = this.Manufacturers.concat(
  //       stageBrewData(this.UserDataPath, dir, 'manufacturers')
  //     )
  //     this.MechWeapons = this.MechWeapons.concat(stageBrewData(this.UserDataPath, dir, 'weapons'))
  //     this.WeaponMods = this.WeaponMods.concat(stageBrewData(this.UserDataPath, dir, 'mods'))
  //     this.MechSystems = this.MechSystems.concat(stageBrewData(this.UserDataPath, dir, 'systems'))
  //     this.PilotGear = this.PilotGear.concat(stageBrewData(this.UserDataPath, dir, 'pilot_gear'))
  //     this.Tags = this.Tags.concat(stageBrewData(this.UserDataPath, dir, 'tags'))
  //     this.Statuses = this.Statuses.concat(stageBrewData(this.UserDataPath, dir, 'statuses'))
  //     this.Quirks = this.Quirks.concat(stageBrewData(this.UserDataPath, dir, 'quirks'))
  //   }
  // }

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
