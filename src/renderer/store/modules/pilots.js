const state = {
  activePilotId: 'cio'
}

const mutations = {
  SET_ACTIVE_PILOT (state, payload) {
    state.activePilotId = payload
  }
}

const actions = {
  loadPilot (context) {
    console.log(context)
    // state.activePilotId = id
  }
}

const getters = {
  activePilot: (state, getters, rootState) => {
    console.log(state.activePilotId)
    if (state.activePilotId) {
      return rootState.Pilots.find(p => p.id === state.activePilotId)
    } else {
      return {}
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
