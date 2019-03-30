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
  Brews: [],
  Licenses: []
}

function stageBrewData (userDataPath, brewDataFolder, file) {
  var info = io.loadBrewData(userDataPath, brewDataFolder, 'info')
  var bID = info ? `${info.name} ${info.version}` : 'Unknown Content Package'
  var bArr = io.loadBrewData(userDataPath, brewDataFolder, file)
  if (bArr.length) {
    bArr.map(x => ({...x, brew: bID}))
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
    state.Brews = io.findBrewData(state.UserDataPath)
  },
  LOAD_BREWS (state, brewDataFolders) {
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
    }
  },
  SET_BREW_ACTIVE (state, payload) {
    io.setBrewActive(state.UserDataPath, payload.dir, payload.active)
  },
  BUILD_LICENSES (state) {
    var licenses = []
    console.log(state.Frames)
    state.Frames.filter(x => x.source.toLowerCase() !== 'gms').forEach((frame) => {
      licenses.push({
        source: frame.source.toLowerCase(),
        license: frame.name.toLowerCase(),
        unlocks: [
          [], // level 1
          [frame], // level 2
          [] // level 3
        ]
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
    console.log(payload)
    context.commit('SET_BREW_ACTIVE', payload)
    context.commit('LOAD_DATA')
    context.commit('BUILD_LICENSES')
  },
  loadData (context) {
    context.commit('LOAD_DATA')
    var activeBrews = context.state.Brews.filter(x => x.info.active).map(x => x.dir)
    context.commit('LOAD_BREWS', activeBrews)
    context.commit('BUILD_LICENSES')
  },
  buildLicenses (context) {
    context.commit('BUILD_LICENSES')
  }
}

const getters = {
  getItemById: state => (itemType, id) => {
    return state[itemType].find(x => x.id === id) || {}
  },
  getLicenseByName: state => license => {
    return state.Licenses.find(x => x.license === license)
  },
  getItemCollection: state => itemType => {
    return state[itemType]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
