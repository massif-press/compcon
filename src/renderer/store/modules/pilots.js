import io from '../data_io'
import Stats from '../../logic/stats'
import Vue from 'vue'
import _ from 'lodash'

const state = {
  Pilots: [],
  selectedPilotId: ''
}

const mutations = {
  SET_PILOT (state, payload) {
    state.selectedPilotId = payload
  },
  LOAD_ALL_PILOTS (state) {
    state.Pilots = io.loadUserData(Vue.prototype.userDataPath, 'pilots.json')
  },
  UPDATE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload.id)
    if (pilotIndex > -1) {
      _.set(state.Pilots[pilotIndex], payload.attr, payload.val)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  SPLICE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload.id)
    if (pilotIndex > -1) {
      var arr = _.get(state.Pilots[pilotIndex], payload.attr)
      arr.splice(payload.start_index, payload.delete_count)
      _.set(state.Pilots[pilotIndex], payload.attr, arr)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  CLONE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload.id)
    if (pilotIndex > -1) {
      var newPilot = Object.assign({}, state.Pilots[pilotIndex])
      state.Pilots.push(newPilot)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  ADD_PILOT (state, payload) {
    state.Pilots.push(payload.pilot)
  },
  DELETE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload.id)
    if (pilotIndex > -1) {
      state.Pilots.splice(pilotIndex, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }
  }
}

const actions = {
  loadAllPilots (context) {
    context.commit('LOAD_ALL_PILOTS')
  },
  loadPilot (context, pilotId) {
    context.commit('SET_PILOT', pilotId)
  },
  editPilot (context, payload) {
    context.commit('UPDATE_PILOT', payload)
  },
  splicePilot (context, payload) {
    context.commit('SPLICE_PILOT', payload)
  },
  clonePilot (context, payload) {
    context.commit('CLONE_PILOT', payload)
  },
  addPilot (context, payload) {
    context.commit('ADD_PILOT', payload)
  },
  deletePilot (context, payload) {
    context.commit('DELETE_PILOT', payload)
  }
}

const getters = {
  getPilot: (state) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId) || {}
  },
  getLoadouts: (state) => () => {
    return state.Pilots.find(p => p.id === state.selectedPilotId).loadouts || {}
  },
  getLoadoutById: (state) => (id) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId).loadouts.find(l => l.id === id) || {}
  },
  getLoadoutByIndex: (state) => (idx) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId).loadouts[idx] || {}
  },
  getAllPilots: (state) => {
    return state.Pilots || []
  },
  getPilotById: (state) => (id) => {
    return state.Pilots.find(p => p.id === id) || {}
  },
  getConfigById: (state) => (id) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId).configs.find(c => c.id === id) || {}
  },
  getConfigIndex: (state) => (id) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId).configs.findIndex(c => c.id === id)
  },
  getMechStats: (state) => id => {
    var pilot = state.Pilots.find(p => p.id === state.selectedPilotId)
    return Stats.mechStats(pilot, pilot.configs.find(c => c.id === id))
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
