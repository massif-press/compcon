import _ from 'lodash'
import io from '../data_io'
import lancerData from 'lancer-data'
import {
  AppContext,
  AppState,
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
  CompendiumItem,
  Talent,
} from '@/class'

const moduleState = {
  UserDataPath: '',
  Backgrounds: [],
  Talents: [],
  Skills: [],
  CoreBonuses: [],
  Frames: [],
  Manufacturers: [],
  MechWeapons: [],
  WeaponMods: [],
  MechSystems: [],
  PilotGear: [],
  Tags: [],
  Statuses: [],
  Quirks: [],
  Brews: [],
  Licenses: [],
}

function stageBrewData(
  userDataPath: string,
  brewDataFolder: string,
  file: string
) {
  const info = io.loadBrewData(userDataPath, brewDataFolder, 'info')
  const bID = info
    ? `${info.name} v.${info.version}`
    : 'Unknown Content Package'
  let bArr = io.loadBrewData(userDataPath, brewDataFolder, file)
  if (bArr.length) {
    bArr = bArr.map((x: object) => ({ ...x, brew: bID }))
  }
  return bArr || []
}

const mutations = {
  SET_DATA_PATH(state: AppState, userDataPath: string) {
    state.UserDataPath = userDataPath
    io.checkFolders(userDataPath)
  },
  LOAD_DATA(state: AppState) {
    state.Backgrounds = lancerData.backgrounds.map(
      (x: any) => new Background(x)
    )
    state.CoreBonuses = lancerData.core_bonuses.map(
      (x: any) => new CoreBonus(x)
    )
    state.Talents = lancerData.talents.map((x: any) => new Talent(x))
    state.Skills = lancerData.skills.map((x: any) => new Skill(x))
    state.Frames = lancerData.frames.map((x: any) => new Frame(x))
    state.MechWeapons = lancerData.weapons.map((x: any) => new MechWeapon(x))
    state.WeaponMods = lancerData.mods.map((x: any) => new WeaponMod(x))
    state.MechSystems = lancerData.systems.map((x: any) => new MechSystem(x))
    state.Tags = lancerData.tags.map((x: any) => new Tag(x))
    state.PilotGear = lancerData.pilot_gear.map(function(x: any) {
      if (x.type === 'weapon') return new PilotWeapon(x)
      else if (x.type === 'armor') return new PilotArmor(x)
      return new PilotGear(x)
    })
    state.Manufacturers = lancerData.manufacturers
    state.Statuses = lancerData.statuses
    state.Quirks = lancerData.quirks
    state.Brews = io.findBrewData(state.UserDataPath)
  },
  LOAD_BREWS(state: AppState) {
    const brewDataFolders = state.Brews.filter((x: any) => x.info.active).map(
      x => x.dir
    )
    for (const dir of brewDataFolders) {
      state.Backgrounds = state.Backgrounds.concat(
        stageBrewData(state.UserDataPath, dir, 'backgrounds')
      )
      state.Talents = state.Talents.concat(
        stageBrewData(state.UserDataPath, dir, 'talents')
      )
      state.Skills = state.Skills.concat(
        stageBrewData(state.UserDataPath, dir, 'skills')
      )
      state.CoreBonuses = state.CoreBonuses.concat(
        stageBrewData(state.UserDataPath, dir, 'core_bonus')
      )
      state.Frames = state.Frames.concat(
        stageBrewData(state.UserDataPath, dir, 'frames')
      )
      state.Manufacturers = state.Manufacturers.concat(
        stageBrewData(state.UserDataPath, dir, 'manufacturers')
      )
      state.MechWeapons = state.MechWeapons.concat(
        stageBrewData(state.UserDataPath, dir, 'weapons')
      )
      state.WeaponMods = state.WeaponMods.concat(
        stageBrewData(state.UserDataPath, dir, 'mods')
      )
      state.MechSystems = state.MechSystems.concat(
        stageBrewData(state.UserDataPath, dir, 'systems')
      )
      state.PilotGear = state.PilotGear.concat(
        stageBrewData(state.UserDataPath, dir, 'pilot_gear')
      )
      state.Tags = state.Tags.concat(
        stageBrewData(state.UserDataPath, dir, 'tags')
      )
      state.Statuses = state.Statuses.concat(
        stageBrewData(state.UserDataPath, dir, 'statuses')
      )
      state.Quirks = state.Quirks.concat(
        stageBrewData(state.UserDataPath, dir, 'quirks')
      )
    }
  },
  SET_BREW_ACTIVE(state: AppState, payload: any) {
    io.setBrewActive(state.UserDataPath, payload.dir, payload.active)
  },
  BUILD_LICENSES(state: AppState) {
    const licenses: License[] = []
    state.Frames.filter(x => x.Source !== 'GMS').forEach(frame => {
      licenses.push(new License(frame))
    })
    state.Licenses = licenses
  },
}

const actions = {
  setDatapath(context: AppContext, userDataPath: string) {
    context.commit('SET_DATA_PATH', userDataPath)
  },
  setBrewActive(context: AppContext, payload: any) {
    context.commit('SET_BREW_ACTIVE', payload)
  },
  loadData(context: AppContext) {
    context.commit('LOAD_DATA')
  },
  loadBrews(context: AppContext) {
    context.commit('LOAD_BREWS')
  },
  buildLicenses(context: AppContext) {
    context.commit('BUILD_LICENSES')
  },
}

const getters = {
  getItemById: (state: any) => (itemType: string, id: string) => {
    return (
      state[itemType].find((x: any) => x.id === id) || {
        err: 'ID not found',
      }
    )
  },
  getItemCollection: (state: any) => (itemType: string) => {
    return state[itemType]
  },
  getState: (state: AppState) => {
    return state
  },
  getUserPath: (state: AppState) => {
    return state.UserDataPath
  },
}

export default {
  state: moduleState,
  mutations,
  actions,
  getters,
}
