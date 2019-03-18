import io from '../data_io'
import Stats from '../../logic/stats'
// import _ from 'lodash'

const state = {
  activeConfigID: ''
}

// NB: As  config actions have to ultimately modify pilot store, most actions here dispatch actions
// in pilots.js, which then commit pilot mutations. Eventually this will be suffled around into a
// feature tree, so for now it's a little clunky. Sorry.

const mutations = {
  SET_CONFIG (state, payload) {
    state.activeConfigID = payload
  }
}

const actions = {
  loadConfig (context, configID) {
    context.commit('SET_CONFIG', configID)
  },
  editConfig (context, payload) {
    context.dispatch('updatePilotConfig', payload, { root: true })
  },
  spliceConfig (context, payload) {
    context.dispatch('splicePilotConfig', payload, { root: true })
  },
  cloneConfig (context, payload) {
    payload.id = io.newID()
    payload.name += ' (Copy)'
    context.dispatch('addConfigToPilot', payload, { root: true })
  },
  addConfig (context, payload) {
    var newConfig = {
      id: io.newID(),
      pilot_id: payload.pilot_id,
      name: payload.name,
      frame_id: payload.frame_id,
      loadouts: []
    }
    context.dispatch('addConfigToPilot', newConfig, { root: true })
  },
  importConfig (context, payload) {
    payload.id = io.newID()
    context.dispatch('addConfigToPilot', payload, { root: true })
  },
  deleteConfig (context, payload) {
    var cIndex = context.getters.getConfigIndex(payload)
    context.dispatch('deleteConfigFromPilot', cIndex, { root: true })
  }
}

const getters = {
  getConfigLoadouts: (state, getters, rootState) => (configId) => {
    return getters.getPilot.configs.find(c => c.id === configId).loadouts || {}
  },
  getConfig: (state, getters, rootState) => {
    return getters.getPilot.configs.find(c => c.id === state.activeConfigID) || {}
  },
  getConfigIndex: (state, getters, rootState) => (id) => {
    return getters.getPilot.configs.findIndex(c => c.id === id)
  },
  getMechStats: (state, getters, rootState) => (id, loadout) => {
    return Stats.mechStats(getters.getPilot, getters.getPilot.configs.find(c => c.id === id), loadout)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
