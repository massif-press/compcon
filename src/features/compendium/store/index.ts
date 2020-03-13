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
  ContentPack,
  CompendiumItem,
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
  IContentPack,
  ITagCompendiumData,
} from '@/interface'
import ExtLog from '@/io/ExtLog'
import { saveData as saveUserData, loadData as loadUserData } from '@/io/Data'

export const SET_VERSIONS = 'SET_VERSIONS'
export const LOAD_DATA = 'LOAD_DATA'

export const LOAD_PACK = 'LOAD_PACK'
export const DELETE_PACK = 'DELETE_PACK'
export const SET_PACK_ACTIVE = 'SET_PACK_ACTIVE'

function Brewable<T extends CompendiumItem>(base: () => T[]): Function {
  return function(self: CompendiumStore, name: string) {
    const baseName = `__Base_${name}`

    Object.defineProperty(self, baseName, {
      get: base,
    })
    Object.defineProperty(self, name, {
      get: function() {
        return [
          ...this[baseName],
          ...this.ContentPacks.filter(pack => pack.Active).flatMap(
            pack => pack[name]
            // .forEach((item: T /* ? */) => item._brew = pack.ID)
          ),
        ]
      },
    })
  }
}

@Module({
  name: 'datastore',
})
export class CompendiumStore extends VuexModule {
  public LancerVersion = ''
  public CCVersion = ''
  public UserProfile: UserProfile = {} as any
  public Skills: Skill[] = []
  public Statuses: Status[] = []
  public Quirks: string[] = []
  // public Licenses: License[] = []
  public Reserves: Reserve[] = []
  public Factions: Faction[] = []
  public Environments: Environment[] = []
  public Sitreps: Sitrep[] = []

  public ContentPacks: ContentPack[] = []

  public get NpcClasses(): NpcClass[] {
    return this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcClasses)
  }
  public get NpcTemplates(): NpcTemplate[] {
    return this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcTemplates)
  }
  public get NpcFeatures(): NpcFeature[] {
    return this.ContentPacks.filter(pack => pack.Active).flatMap(pack => pack.NpcFeatures)
  }

  @Brewable(() => lancerData.talents.map((x: ITalentData) => new Talent(x)))
  Talents: Talent[]
  @Brewable(() => lancerData.core_bonuses.map((x: ICoreBonusData) => new CoreBonus(x)))
  CoreBonuses: CoreBonus[]
  @Brewable(() => lancerData.frames.map((x: IFrameData) => new Frame(x)))
  Frames: Frame[]
  @Brewable(() => lancerData.manufacturers.map((x: IManufacturerData) => new Manufacturer(x)))
  Manufacturers: Manufacturer[]
  @Brewable(() => lancerData.weapons.map((x: IMechWeaponData) => new MechWeapon(x)))
  MechWeapons: MechWeapon[]
  @Brewable(() => lancerData.mods.map((x: IWeaponModData) => new WeaponMod(x)))
  WeaponMods: WeaponMod[]
  @Brewable(() => lancerData.systems.map((x: IMechSystemData) => new MechSystem(x)))
  MechSystems: MechSystem[]
  @Brewable(() =>
    lancerData.pilot_gear.map(function(x: any) {
      if (x.type === 'weapon') return new PilotWeapon(x as IPilotWeaponData)
      else if (x.type === 'armor') return new PilotArmor(x as IPilotArmorData)
      return new PilotGear(x as IPilotGearData)
    })
  )
  PilotGear: PilotGear[]
  @Brewable(() => lancerData.tags.map((x: ITagCompendiumData) => new Tag(x))) Tags: Tag[]

  get Licenses(): License[] {
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

  get packAlreadyInstalled(): any {
    return (packID: string) => this.ContentPacks.map(pak => pak.ID).includes(packID)
  }

  private nfErr = { err: 'ID not found' }

  get instantiate(): any | { err: string } {
    return (itemType: string, id: string) => {
      if (this[itemType] && this[itemType] instanceof Array) {
        const i = this[itemType].find((x: any) => x.ID === id || x.id === id)
        return i ? _.cloneDeep(i) : this.nfErr
      }
      return { err: 'Invalid Item Type' }
    }
  }

  get referenceByID(): any | { err: string } {
    return (itemType: string, id: string) => {
      if (this[itemType] && this[itemType] instanceof Array) {
        const i = this[itemType].find((x: any) => x.ID === id || x.id === id)
        return i ? i : this.nfErr
      }
      return { err: 'Invalid Item Type' }
    }
  }

  get getItemCollection(): any {
    return (itemType: string) => {
      return this[itemType]
    }
  }

  get getUserProfile(): UserProfile {
    return this.UserProfile
  }

  get getVersion(): string {
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
