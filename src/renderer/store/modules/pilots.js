import io from '../data_io'
import Vue from 'vue'
import _ from 'lodash'

const state = {
  Pilots: [],
  activePilotID: '',
  activeConfigID: ''
}

const mutations = {
  SET_PILOT (state, payload) {
    state.activePilotID = payload
  },
  LOAD_ALL_PILOTS (state) {
    state.Pilots = io.loadUserData(Vue.prototype.userDataPath, 'pilots.json')
  },
  UPDATE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      _.set(state.Pilots[pilotIndex], payload.attr, payload.val)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  UPDATE_PILOT_CONFIG (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      var configIndex = state.Pilots[pilotIndex].configs.findIndex(x => x.id === payload.id)
      if (configIndex > -1) {
        _.set(state.Pilots[pilotIndex].configs[configIndex], payload.attr, payload.val)
      } else {
        throw console.error('Config not loaded!')
      }
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  SPLICE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      var arr = _.get(state.Pilots[pilotIndex], payload.attr)
      arr.splice(payload.start_index, payload.delete_count)
      _.set(state.Pilots[pilotIndex], payload.attr, arr)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  SPLICE_PILOT_CONFIG (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      var configIndex = state.Pilots[pilotIndex].configs.findIndex(x => x.id === payload.id)
      if (configIndex > -1) {
        var arr = _.get(state.Pilots[pilotIndex].configs[configIndex], payload.attr)
        arr.splice(payload.start_index, payload.delete_count)
        _.set(state.Pilots[pilotIndex].configs[configIndex], payload.attr, arr)
      } else {
        throw console.error('Config not loaded!')
      }
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  CLONE_PILOT (state) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      var newPilot = Object.assign({}, state.Pilots[pilotIndex])
      newPilot.id = io.newID()
      newPilot.name += ' (CLONE)'
      newPilot.callsign += '*'
      for (var i = 0; i < newPilot.configs.length; i++) {
        newPilot.configs[i].id = io.newID()
      }
      state.Pilots.push(newPilot)
      this.SET_PILOT(state, newPilot.id)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  ADD_PILOT (state, payload) {
    state.Pilots.push(payload)
  },
  DELETE_PILOT (state, payload) {
    var pilotIndex = state.Pilots.findIndex(x => x.id === payload)
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
  splicePilotConfig (context, payload) {
    context.commit('SPLICE_PILOT_CONFIG', payload)
  },
  clonePilot (context, payload) {
    context.commit('CLONE_PILOT', payload)
  },
  addPilot (context, payload) {
    var newPilot = {
      id: io.newID(),
      callsign: payload.callsign.replace('/r', ''),
      name: payload.name.replace('/r', ''),
      level: 0,
      background: payload.background,
      notes: '',
      history: payload.history,
      text_appearance: payload.text_appearance,
      avatar: payload.avatar,
      portrait: payload.portrait,
      contacts: [],
      licenses: [],
      loadouts: [],
      skills: payload.skills,
      talents: payload.talents,
      mechSkills: payload.mechSkills,
      core_bonuses: [],
      configs: []
    }
    context.commit('ADD_PILOT', newPilot)
  },
  addConfigToPilot (context, payload) {
    context.state.activePilotID = payload.pilot_id
    context.commit('UPDATE_PILOT', {
      attr: `configs[${context.state.Pilots.find(p => p.id === context.state.activePilotID).configs.length}]`,
      val: payload
    })
  },
  updatePilotConfig (context, payload) {
    context.commit('UPDATE_PILOT_CONFIG', payload)
  },
  importPilot (context, payload) {
    payload.id = io.newID()
    context.commit('ADD_PILOT', payload)
  },
  deletePilot (context, payload) {
    context.commit('DELETE_PILOT', payload)
  }
}

const getters = {
  getPilot: (state) => {
    return state.Pilots.find(p => p.id === state.activePilotID) || {}
  },
  getAllPilots: (state) => {
    return state.Pilots || []
  },
  getPilotById: (state) => (id) => {
    return state.Pilots.find(p => p.id === id) || {}
  },
  getRarities: (state) => {
    var pilot = state.Pilots.find(p => p.id === state.activePilotID)
    var manufacturers = io.loadData('manufacturers')
    var rarities = {}
    for (var m in manufacturers) {
      rarities[manufacturers[m].id] = pilot.licenses.filter(x => x.source === manufacturers[m].id).length
    }
    return rarities
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
