import _ from 'lodash'
import io from '../data_io'
import lancerData from 'lancer-data'
import {
  License,
  CoreBonus,
  Background,
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
  Status,
  Brew,
} from '@/class'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';


function stageBrewData(userDataPath: string, brewDataFolder: string, file: string) {
  const info = io.loadBrewData(userDataPath, brewDataFolder, 'info')
  const bID = info ? `${info.name} v.${info.version}` : 'Unknown Content Package'
  let bArr = io.loadBrewData(userDataPath, brewDataFolder, file)
  if (bArr.length) {
    bArr = bArr.map((x: object) => ({ ...x, brew: bID }))
  }
  return bArr || []
}

export const SET_DATA_PATH = 'SET_DATA_PATH'
export const SET_BREW_ACTIVE = 'SET_BREW_ACTIVE'
export const BUILD_LICENSES = 'BUILD_LICENSES'
export const LOAD_DATA = 'LOAD_DATA'
export const LOAD_BREWS = 'LOAD_BREWS'

@Module({
  name: "datastore",
})
export class ModuleStore extends VuexModule {
  UserDataPath = ''
  Backgrounds: Array<Background> = []
  Talents: Array<Talent> = []
  Skills: Array<Skill> = []
  CoreBonuses: Array<CoreBonus> = []
  Frames: Array<Frame> = []
  Manufacturers: Array<Manufacturer> = []
  MechWeapons: Array<MechWeapon> = []
  WeaponMods: Array<WeaponMod> = []
  MechSystems: Array<MechSystem> = []
  PilotGear: Array<PilotGear> = []
  Tags: Array<Tag> = []
  Statuses: Array<Status> = []
  Quirks: Array<string> = []
  Brews: Array<Brew> = []
  Licenses: Array<License> = []
  Reserves: Array<Reserve> = []

  @Mutation
  [SET_DATA_PATH](userDataPath: string) {
    this.UserDataPath = userDataPath
    io.checkFolders(userDataPath)
  }

  @Mutation
  [SET_BREW_ACTIVE](dir: string, active: boolean) {
    io.setBrewActive(this.UserDataPath, dir, active)
  }

  @Mutation
  [BUILD_LICENSES]() {
    const licenses: License[] = []
    this.Frames.filter(x => x.Source !== 'GMS').forEach(frame => {
      licenses.push(new License(frame))
    })
    this.Licenses = licenses
  }

  @Mutation
  [LOAD_DATA]() {
    this.Backgrounds = lancerData.backgrounds.map((x: any) => new Background(x))
    this.CoreBonuses = lancerData.core_bonuses.map((x: any) => new CoreBonus(x))
    this.Talents = lancerData.talents.map((x: any) => new Talent(x))
    this.Skills = lancerData.skills.map((x: any) => new Skill(x))
    this.Frames = lancerData.frames.map((x: any) => new Frame(x))
    this.MechWeapons = lancerData.weapons.map((x: any) => new MechWeapon(x))
    this.WeaponMods = lancerData.mods.map((x: any) => new WeaponMod(x))
    this.MechSystems = lancerData.systems.map((x: any) => new MechSystem(x))
    this.Tags = lancerData.tags.map((x: any) => new Tag(x))
    this.PilotGear = lancerData.pilot_gear.map(function(x: any) {
      if (x.type === 'weapon') return new PilotWeapon(x)
      else if (x.type === 'armor') return new PilotArmor(x)
      return new PilotGear(x)
    })
    this.Manufacturers = lancerData.manufacturers
    this.Statuses = lancerData.statuses
    this.Quirks = lancerData.quirks
    this.Reserves = lancerData.reserves.map((x: any) => new Reserve(x))
    this.Brews = io.findBrewData(this.UserDataPath)
  }

  @Mutation
  [LOAD_BREWS]() {
    const brewDataFolders = this.Brews.filter((x: any) => x.info.active).map(x => x.dir)
    for (const dir of brewDataFolders) {
      this.Backgrounds = this.Backgrounds.concat(
        stageBrewData(this.UserDataPath, dir, 'backgrounds')
      )
      this.Talents = this.Talents.concat(stageBrewData(this.UserDataPath, dir, 'talents'))
      this.Skills = this.Skills.concat(stageBrewData(this.UserDataPath, dir, 'skills'))
      this.CoreBonuses = this.CoreBonuses.concat(
        stageBrewData(this.UserDataPath, dir, 'core_bonus')
      )
      this.Frames = this.Frames.concat(stageBrewData(this.UserDataPath, dir, 'frames'))
      this.Manufacturers = this.Manufacturers.concat(
        stageBrewData(this.UserDataPath, dir, 'manufacturers')
      )
      this.MechWeapons = this.MechWeapons.concat(
        stageBrewData(this.UserDataPath, dir, 'weapons')
      )
      this.WeaponMods = this.WeaponMods.concat(stageBrewData(this.UserDataPath, dir, 'mods'))
      this.MechSystems = this.MechSystems.concat(
        stageBrewData(this.UserDataPath, dir, 'systems')
      )
      this.PilotGear = this.PilotGear.concat(stageBrewData(this.UserDataPath, dir, 'pilot_gear'))
      this.Tags = this.Tags.concat(stageBrewData(this.UserDataPath, dir, 'tags'))
      this.Statuses = this.Statuses.concat(stageBrewData(this.UserDataPath, dir, 'statuses'))
      this.Quirks = this.Quirks.concat(stageBrewData(this.UserDataPath, dir, 'quirks'))
    }
  }

  get getItemById() {
    return (itemType: string, id: string) => {
      const err = { err: 'ID not found' }
      let match: any // TODO: narrow this down, or refactor method entirely
      if (this[itemType] && this[itemType] instanceof Array) {
        match = this[itemType].find((x: any) => x.id === id)
      }
      return match || err
    }
  }

  get getItemCollection() {
    return (itemType: string) => {
      return this[itemType]
    }
  }

  get getUserPath() {
    return this.UserDataPath
  }

  @Action
  public loadData() {
    this.context.commit(LOAD_DATA)
  }

  @Action
  public loadBrews() { 
    this.context.commit(LOAD_BREWS)
  }

  @Action
  public setDatapath(userDataPath: string) {
    this.context.commit(SET_DATA_PATH, userDataPath)
  }

  @Action
  public setBrewActive(dir: string, active: boolean) {
    this.context.commit(SET_BREW_ACTIVE, {dir, active})
  }

  @Action
  public buildLicenses() {
    this.context.commit(BUILD_LICENSES)
  }

}

