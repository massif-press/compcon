const state = {
  printOptions: {}
}

const mutations = {
  SET_PRINT_OPTIONS(state: AppState, payload: object) {
    state.printOptions = payload
  }
}

const actions = {
  setPrintOptions(context: AppContext, options: object) {
    context.commit('SET_PRINT_OPTIONS', options)
  }
}

const getters = {
  getPrintOptions: (state: AppState) => {
    return state.printOptions
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
