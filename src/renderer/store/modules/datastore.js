import io from '../data_io'

const state = {
  Backgrounds: [],
  Talents: [],
  Skills: [],
  CoreBonuses: [],
  Frames: [],
  Manufacturers: [],
  MechWeapons: [],
  WeaponMods: [],
  WeaponAmmo: [],
  MechSystems: [],
  PilotWeapons: [],
  PilotArmor: [],
  PilotGear: [],
  Tags: [],
  Licenses: []
}

const mutations = {
  LOAD_DATA (state) {
    state.Backgrounds = io.loadData('backgrounds')
    state.Talents = io.loadData('talents')
    state.Skills = io.loadData('skills')
    state.CoreBonuses = io.loadData('core_bonus')
    state.Frames = io.loadData('frames')
    state.Manufacturers = io.loadData('manufacturers')
    state.MechWeapons = io.loadData('weapons')
    var allMods = io.loadData('mods')
    state.WeaponMods = allMods.filter(x => x.ModType === 'Modification')
    state.WeaponAmmo = allMods.filter(x => x.ModType === 'Ammunition')
    state.MechSystems = io.loadData('systems')
    var allPilotItems = io.loadData('pilot_gear')
    state.PilotWeapons = allPilotItems.weapons
    state.PilotArmor = allPilotItems.armor
    state.PilotGear = allPilotItems.gear
    state.Tags = io.loadData('tags')
    state.Licenses = collectLicenses(state)

    console.log(state)
  }
}

const actions = {
  loadData (context) {
    context.commit('LOAD_DATA')
  }
}

function collectLicenses (state) {
  var licenses = []
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
    .concat(state.WeaponMods, state.WeaponAmmo, state.MechSystems)
    .filter(x => x.source.toLowerCase() !== 'gms' && x.source.toLowerCase() !== 'special')
    .forEach((item) => {
      var idx = licenses.findIndex(x => x.license === item.license.toLowerCase())
      if (idx === -1) console.log(item.id, item.license)
      licenses[idx].unlocks[item.license_level - 1].push(item)
    })
  return licenses
}

const getters = {
  getItemById: state => (itemType, id) => {
    return state[itemType].find(x => x.id === id) || {}
  },
  getLicenseByName: state => license => {
    return state.Licenses.find(x => x.license === license)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
