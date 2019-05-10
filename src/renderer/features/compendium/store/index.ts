const moduleState = {
    presearch: '',
}
const mutations = {
    SET_PRESEARCH(state: AppState, payload: string) {
        state.presearch = payload
    },
}
const actions = {
    setPresearch(context: any, search: string) {
        context.commit('SET_PRESEARCH', search)
    },
    clearPresearch(context: any) {
        context.commit('SET_PRESEARCH', '')
    },
}
const getters = {
    getPresearch: (state: AppState) => {
        return state.presearch
    },
}
export default {
  state: moduleState,
  mutations,
  actions,
  getters
};
// # sourceMappingURL=compendium.js.map
