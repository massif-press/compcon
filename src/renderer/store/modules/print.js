const state = {
  printOptions: {}
}

const mutations = {
  SET_PRINT_OPTIONS (state, payload) {
    state.printOptions = payload
  }
}

const actions = {
  setPrintOptions (context, options) {
    context.commit('SET_PRINT_OPTIONS', options)
  }
}

const getters = {
  getPrintOptions: (state) => {
    return state.printOptions
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
