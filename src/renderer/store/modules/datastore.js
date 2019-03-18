import io from '../data_io'
import licenses from '../licenses'

const state = {
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
    state.WeaponMods = io.loadData('mods')
    state.MechSystems = io.loadData('systems')
    state.PilotGear = io.loadData('pilot_gear')
    state.Tags = io.loadData('tags')
    state.Licenses = licenses.collect(state)
  }
}

const actions = {
  loadData (context) {
    context.commit('LOAD_DATA')
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
