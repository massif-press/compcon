import io from '../data_io'
import Stats from '../../logic/stats'
import _ from 'lodash'

const state = {
  activeConfigID: ''
}

const mutations = {
  SET_CONFIG (state, payload) {
    state.activeConfigID = payload
  },
  UPDATE_CONFIG (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    var configIndex = state.Pilots[pilotIndex].configs.findIndex(x => x.id === payload.id)
    if (configIndex > -1) {
      _.set(state.Pilots[pilotIndex].configs[configIndex], payload.attr, payload.val)
    } else {
      throw console.error('Config not loaded!')
    }
  },
  SPLICE_CONFIG (state, payload) {
    console.log(state, payload)
    // var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    // if (pilotIndex > -1) {
    //   var arr = _.get(state.Pilots[pilotIndex], payload.attr)
    //   arr.splice(payload.start_index, payload.delete_count)
    //   _.set(state.Pilots[pilotIndex], payload.attr, arr)
    // } else {
    //   throw console.error('Pilot not loaded!')
    // }
  },
  CLONE_CONFIG (state) {
    console.log(state)
    // var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    // if (pilotIndex > -1) {
    //   var newPilot = Object.assign({}, state.Pilots[pilotIndex])
    //   newPilot.id = io.newID()
    //   newPilot.name += ' (CLONE)'
    //   newPilot.callsign += '*'
    //   for (var i = 0; i < newPilot.configs.length; i++) {
    //     newPilot.configs[i].id = io.newID()
    //   }
    //   state.Pilots.push(newPilot)
    //   this.SET_PILOT(state, newPilot.id)
    // } else {
    //   throw console.error('Pilot not loaded!')
    // }
  },
  ADD_CONFIG (state, payload) {
    console.log(state, payload)
    // state.Pilots.push(payload)
  },
  DELETE_CONFIG (state, payload) {
    console.log(state, payload)
  //   var pilotIndex = state.Pilots.findIndex(x => x.id === payload)
  //   if (pilotIndex > -1) {
  //     state.Pilots.splice(pilotIndex, 1)
  //   } else {
  //     throw console.error('Pilot not loaded!')
  //   }
  // }
  }
}

const actions = {
  loadConfig (context, configID) {
    context.commit('SET_CONFIG', configID)
  },
  editConfig (context, payload) {
    context.commit('UPDATE_CONFIG', payload)
  },
  spliceConfig (context, payload) {
    context.commit('SPLICE_CONFIG', payload)
  },
  cloneConfig (context, payload) {
    context.commit('CLONE_CONFIG', payload)
  },
  addConfig (context, payload) {
    console.log(context, payload)
    // var newConfig = {
    //   id: io.newID(),

    // }
    // context.commit('ADD_CONFIG', newConfig)
  },
  importConfig (context, payload) {
    payload.id = io.newID()
    context.commit('ADD_CONFIG', payload)
  },
  deleteConfig (context, payload) {
    context.commit('DELETE_CONFIG', payload)
  }
}

const getters = {
  getConfigLoadouts: (state, getters, rootState) => (configId) => {
    return getters.getPilot.configs.find(c => c.id === configId).loadouts || {}
  },
  getConfig: (state, getters, rootState) => {
    console.log(getters.getPilot)
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
