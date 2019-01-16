const state = {
  selectedPilotId: ''
}

const mutations = {
  SET_PILOT (state, payload) {
    state.selectedPilotId = payload
  }
}

const actions = {
  loadPilot (context, pilotId) {
    context.commit('SET_PILOT', pilotId)
  }
}

const getters = {
  getPilot: (state, getters, rootState) => {
    return rootState.Pilots.find(p => p.id === state.selectedPilotId)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
