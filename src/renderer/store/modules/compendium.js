const state = {
  presearch: ''
}

const mutations = {
  SET_PRESEARCH (state, payload) {
    state.presearch = payload
  }
}

const actions = {
  setPresearch (context, search) {
    context.commit('SET_PRESEARCH', search)
  },
  clearPresearch (context) {
    context.commit('SET_PRESEARCH', '')
  }
}

const getters = {
  getPresearch: (state) => {
    return state.presearch
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
