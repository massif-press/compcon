import { Commit } from 'vuex';
export default {
  state: () => ({
    NavMode: '',
    Errors: [] as any[],
  }),
  mutations: {
    SET_NAV_MODE(state, mode) {
      state.NavMode = mode;
    },
    LOG_ERROR(state, error) {
      state.Errors = [error, ...state.Errors];
    },
  },
  actions: {
    setNavMode({ commit }: { commit: Function }, payload: any) {
      commit('SET_NAV_MODE', payload);
    },
    logError({ commit }: { commit: Function }, payload: any) {
      commit('LOG_ERROR', payload);
    },
  },
};
