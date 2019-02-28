import io from '../data_io'
import Stats from '../../logic/stats'
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
  SET_CONFIG (state, payload) {
    state.activeConfigID = payload
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
  loadConfig (context, configID) {
    context.commit('SET_CONFIG', configID)
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
    var newPilot = {
      id: io.newID(),
      callsign: payload.callsign,
      name: payload.name,
      level: 0,
      background: payload.background,
      notes: '',
      history: payload.history,
      text_appearance: payload.text_appearance,
      img_portrait: '',
      img_appearance: '',
      contacts: [],
      licenses: [],
      loadouts: [],
      skills: payload.skills,
      talents: payload.talents,
      mechSkills: payload.mechSkills,
      core_bonuses: [],
      configs: []
    }
    console.log(newPilot)
    context.commit('ADD_PILOT', newPilot)
  },
  deletePilot (context, payload) {
    context.commit('DELETE_PILOT', payload)
  }
}

const getters = {
  getPilot: (state) => {
    return state.Pilots.find(p => p.id === state.activePilotID) || {}
  },
  getConfigLoadouts: (state) => (configId) => {
    return state.Pilots.find(p => p.id === state.activePilotID).configs.find(c => c.id === configId).loadouts || {}
  },
  getConfigLoadoutById: (state) => (configId, loadoutId) => {
    return state.Pilots.find(p => p.id === state.activePilotID)
      .configs.find(c => c.id === configId)
      .loadouts.find(l => l.id === loadoutId) || {}
  },
  getConfigLoadoutByIndex: (state) => (configId, loadoutIdx) => {
    return state.Pilots.find(p => p.id === state.activePilotID)
      .configs.find(c => c.id === configId)
      .loadouts[loadoutIdx] || {}
  },
  getAllPilots: (state) => {
    return state.Pilots || []
  },
  getPilotById: (state) => (id) => {
    return state.Pilots.find(p => p.id === id) || {}
  },
  getConfig: state => {
    return state.Pilots.find(p => p.id === state.activePilotID).configs.find(c => c.id === state.activeConfigID) || {}
  },
  getConfigIndex: (state) => (id) => {
    return state.Pilots.find(p => p.id === state.activePilotID).configs.findIndex(c => c.id === id)
  },
  getMechStats: (state) => (id, loadout) => {
    var pilot = state.Pilots.find(p => p.id === state.activePilotID)
    return Stats.mechStats(pilot, pilot.configs.find(c => c.id === id), loadout)
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
