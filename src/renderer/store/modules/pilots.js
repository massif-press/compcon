import io from '../io'
import Vue from 'vue'

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
    console.log('in update pilot mutator')
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload.id)
    if (pilotIndex > -1) {
      state.Pilots[pilotIndex][payload.attr] = payload.val
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
  }
}

const getters = {
  getPilot: (state) => {
    return state.Pilots.find(p => p.id === state.selectedPilotId)
  },
  getPilotById: (state) => (id) => {
    return state.Pilots.find(p => p.id === id)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
