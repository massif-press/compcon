import io from '../data_io'

const state = {
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
  Licenses: []
}

function stageBrewData (userDataPath, brewDataFolder, file) {
  var info = io.loadBrewData(userDataPath, brewDataFolder, 'info')
  var bID = info ? `${info.name} v.${info.version}` : 'Unknown Content Package'
  var bArr = io.loadBrewData(userDataPath, brewDataFolder, file)
  if (bArr.length) {
    bArr = bArr.map(x => ({...x, brew: bID}))
  }
  return bArr || []
}

const mutations = {
  SET_DATA_PATH (state, userDataPath) {
    state.UserDataPath = userDataPath
  },
  LOAD_DATA (state) {
    state.Backgrounds = io.loadData('backgrounds')
    state.Talents = io.loadData('talents')
    state.Skills = io.loadData('skills')
    state.CoreBonuses = io.loadData('core_bonus')
    state.Frames = io.loadData('frames')
    state.Manufacturers = io.loadData('manufacturers')
    state.MechWeapons = io.loadData('weapons')
    state.WeaponMods = io.loadData('mods')
    state.MechSystems = io.loadData('systems')
    state.PilotGear = io.loadData('pilot_gear')
    state.Tags = io.loadData('tags')
    state.Statuses = io.loadData('statuses')
    state.Quirks = io.loadData('quirks')
    state.Brews = io.findBrewData(state.UserDataPath)
  },
  LOAD_BREWS (state) {
    var brewDataFolders = state.Brews.filter(x => x.info.active).map(x => x.dir)
    for (var i = 0; i < brewDataFolders.length; i++) {
      var dir = brewDataFolders[i]
      state.Backgrounds = state.Backgrounds.concat(stageBrewData(state.UserDataPath, dir, 'backgrounds'))
      state.Talents = state.Talents.concat(stageBrewData(state.UserDataPath, dir, 'talents'))
      state.Skills = state.Skills.concat(stageBrewData(state.UserDataPath, dir, 'skills'))
      state.CoreBonuses = state.CoreBonuses.concat(stageBrewData(state.UserDataPath, dir, 'core_bonus'))
      state.Frames = state.Frames.concat(stageBrewData(state.UserDataPath, dir, 'frames'))
      state.Manufacturers = state.Manufacturers.concat(stageBrewData(state.UserDataPath, dir, 'manufacturers'))
      state.MechWeapons = state.MechWeapons.concat(stageBrewData(state.UserDataPath, dir, 'weapons'))
      state.WeaponMods = state.WeaponMods.concat(stageBrewData(state.UserDataPath, dir, 'mods'))
      state.MechSystems = state.MechSystems.concat(stageBrewData(state.UserDataPath, dir, 'systems'))
      state.PilotGear = state.PilotGear.concat(stageBrewData(state.UserDataPath, dir, 'pilot_gear'))
      state.Tags = state.Tags.concat(stageBrewData(state.UserDataPath, dir, 'tags'))
      state.Statuses = state.Statuses.concat(stageBrewData(state.UserDataPath, dir, 'statuses'))
      state.Quirks = state.Quirks.concat(stageBrewData(state.UserDataPath, dir, 'quirks'))
    }
  },
  SET_BREW_ACTIVE (state, payload) {
    io.setBrewActive(state.UserDataPath, payload.dir, payload.active)
  },
  BUILD_LICENSES (state) {
    var licenses = []
    state.Frames.filter(x => x.source.toLowerCase() !== 'gms').forEach((frame) => {
      licenses.push({
        source: frame.source.toLowerCase(),
        license: frame.name.toLowerCase(),
        unlocks: [
          [], // level 1
          [frame], // level 2
          [] // level 3
        ],
        brew: frame.brew || null
      })
    })
    state.MechWeapons
      .concat(state.WeaponMods, state.MechSystems)
      .filter(x => x.source && x.source.toLowerCase() !== 'gms' && x.source.toLowerCase() !== '')
      .forEach((item) => {
        var idx = licenses.findIndex(x => x.license === item.license.toLowerCase())
        licenses[idx].unlocks[item.license_level - 1].push(item)
      })
    state.Licenses = licenses
  }
}

const actions = {
  setDatapath (context, userDataPath) {
    context.commit('SET_DATA_PATH', userDataPath)
  },
  setBrewActive (context, payload) {
    context.commit('SET_BREW_ACTIVE', payload)
  },
  loadData (context) {
    context.commit('LOAD_DATA')
  },
  loadBrews (context) {
    context.commit('LOAD_BREWS')
  },
  buildLicenses (context) {
    context.commit('BUILD_LICENSES')
  }
}

const getters = {
  getItemById: state => (itemType, id) => {
    return state[itemType].find(x => x.id === id) || {err: 'ID not found'}
  },
  getLicenseByName: state => license => {
    return state.Licenses.find(x => x.license === license) || {err: 'License not found'}
  },
  getItemCollection: state => itemType => {
    return state[itemType]
  },
  getState: state => {
    return state
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
