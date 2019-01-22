import io from '../pilot_io'
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
  }
}

const getters = {
  getPilot: (state) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId) || {}
  },
  getAllPilots: (state) => {
    return state.Pilots || []
  },
  getPilotById: (state) => (id) => {
    return state.Pilots.find(p => p.id === id) || {}
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
