import _ from 'lodash'
import Vue from 'vue'
import io from '../data_io'
import uid from '../../logic/uid'

const moduleState = {
  Pilots: [],
  activePilotID: '',
  activeConfigID: '',
}

const mutations = {
  SET_PILOT(state: AppState, payload: string) {
    state.activePilotID = payload
  },
  LOAD_ALL_PILOTS(state: AppState) {
    state.Pilots = io.loadUserData(Vue.prototype.userDataPath, 'pilots.json')
  },
  UPDATE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      const pilot = _.set(state.Pilots[pilotIndex], payload.attr, payload.val)
      Vue.set(state.Pilots, pilotIndex, pilot)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  UPDATE_PILOT_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      const configIndex = state.Pilots[pilotIndex].configs.findIndex((x) => x.id === payload.id)
      if (configIndex > -1) {
        _.set(state.Pilots[pilotIndex].configs[configIndex], payload.attr, payload.val)
      } else {
        throw console.error('Config not loaded!')
      }
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  SPLICE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      const arr = _.get(state.Pilots[pilotIndex], payload.attr)
      arr.splice(payload.start_index, payload.delete_count)
      _.set(state.Pilots[pilotIndex], payload.attr, arr)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  SPLICE_PILOT_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      const configIndex = state.Pilots[pilotIndex].configs.findIndex((x) => x.id === payload.id)
      if (configIndex > -1) {
        const arr = _.get(state.Pilots[pilotIndex].configs[configIndex], payload.attr)
        arr.splice(payload.start_index, payload.delete_count)
        _.set(state.Pilots[pilotIndex].configs[configIndex], payload.attr, arr)
      } else {
        throw console.error('Config not loaded!')
      }
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  CLONE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === payload.id)
    if (pilotIndex > -1) {
      const newPilot: Pilot = JSON.parse(JSON.stringify(state.Pilots[pilotIndex]))
      newPilot.id = uid.generate()
      newPilot.name += ' (CLONE)'
      newPilot.callsign += '*'
      for (const config of newPilot.configs) {
        config.id = uid.generate()
        config.pilot_id = newPilot.id
      }
      if (payload.quirk) { newPilot.quirk = payload.quirk }
      state.Pilots.push(newPilot)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  ADD_PILOT(state: AppState, payload: any) {
    state.Pilots.push(payload)
  },
  DELETE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === payload)
    if (pilotIndex > -1) {
      state.Pilots.splice(pilotIndex, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
  DELETE_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex((x) => x.id === state.activePilotID)
    if (pilotIndex > -1) {
      state.Pilots[pilotIndex].configs.splice(payload, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }
  },
}

const actions = {
  loadAllPilots(context: AppContext) {
    context.commit('LOAD_ALL_PILOTS')
  },
  loadPilot(context: AppContext, pilotId: string) {
    context.commit('SET_PILOT', pilotId)
  },
  editPilot(context: AppContext, payload: any) {
    // remove mount-based core bonuses on cb change
    // also: fuckin' gross
    if (payload.attr === 'core_bonuses') {
      const missingCb = ['hardpoints', 'burnout', 'intweapon', 'retrofit'].filter((x) => !payload.val.includes(x))
      const pilotIndex = context.state.Pilots.findIndex((x) => x.id === context.state.activePilotID)
      for (let i = 0; i < context.state.Pilots[pilotIndex].configs.length; i++) {
        for (let j = 0; j < context.state.Pilots[pilotIndex].configs[i].loadouts.length; j++) {
          for (let k = 0; k < context.state.Pilots[pilotIndex].configs[i].loadouts[j].mounts.length; k++) {
            const m = context.state.Pilots[pilotIndex].configs[i].loadouts[j].mounts[k]
            if (m.bonuses && _.intersection(missingCb, m.bonuses)) {
              context.commit('UPDATE_PILOT', {
                attr: ['configs', i, 'loadouts', j, 'mounts', k, 'bonuses'],
                val: [],
              })
            }
          }
        }
      }
    }
    context.commit('UPDATE_PILOT', payload)
  },
  splicePilot(context: AppContext, payload: any) {
    context.commit('SPLICE_PILOT', payload)
  },
  splicePilotConfig(context: AppContext, payload: any) {
    context.commit('SPLICE_PILOT_CONFIG', payload)
  },
  clonePilot(context: AppContext, payload: any) {
    context.commit('CLONE_PILOT', payload)
  },
  addPilot(context: AppContext, payload: any) {
    const newPilot: Pilot = {
      id: uid.generate(),
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
      configs: [],
    }
    context.commit('ADD_PILOT', newPilot)
    context.commit('SET_PILOT', newPilot.id)
  },
  addConfigToPilot(context: AppContext, payload: any) {
    payload.pilot_id = context.state.activePilotID
    const pilot = context.state.Pilots.find((p) => p.id === context.state.activePilotID)
    if (!pilot) { throw new Error('pilot not found!') }
    context.commit('UPDATE_PILOT', {
      attr: `configs[${pilot.configs.length}]`,
      val: payload,
    })
  },
  updatePilotConfig(context: AppContext, payload: any) {
    context.commit('UPDATE_PILOT_CONFIG', payload)
  },
  importPilot(context: AppContext, payload: Pilot) {
    payload.id = uid.generate()
    for (const config of payload.configs) {
      config.pilot_id = payload.id
    }
    context.commit('ADD_PILOT', payload)
  },
  deletePilot(context: AppContext, payload: any) {
    context.commit('DELETE_PILOT', payload)
  },
  deleteConfigFromPilot(context: AppContext, payload: any) {
    context.commit('DELETE_CONFIG', payload)
  },
}

const getters = {
  getPilot: (state: AppState) => {
    return state.Pilots.find((p) => p.id === state.activePilotID) || {}
  },
  getAllPilots: (state: AppState) => {
    return state.Pilots || []
  },
}

export default {
  state: moduleState,
  mutations,
  actions,
  getters,
}
