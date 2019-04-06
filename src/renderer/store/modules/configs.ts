import io from '../data_io';
import Stats from '../../logic/stats';
// import _ from 'lodash'
const state = {
    activeConfigID: ''
};
// NB: As  config actions have to ultimately modify pilot store, most actions here dispatch actions
// in pilots.js, which then commit pilot mutations. Eventually this will be suffled around into a
// feature tree, so for now it's a little clunky. Sorry.
const mutations = {
    SET_CONFIG(state: AppState, payload: any) {
        state.activeConfigID = payload;
    }
};
const actions = {
    loadConfig(context: any, config: MechConfig) {
        context.dispatch('loadPilot', config.pilot_id, { root: true });
        context.commit('SET_CONFIG', config.id);
    },
    editConfig(context: any, payload: any) {
        context.dispatch('updatePilotConfig', payload, { root: true });
    },
    spliceConfig(context: any, payload: any) {
        context.dispatch('splicePilotConfig', payload, { root: true });
    },
    cloneConfig(context: any, payload: any) {
        payload.id = io.newID();
        payload.name += ' (Copy)';
        context.dispatch('addConfigToPilot', payload, { root: true });
    },
    addConfig(context: any, payload: any) {
        var newConfig = {
            id: io.newID(),
            pilot_id: payload.pilot_id,
            name: payload.name,
            frame_id: payload.frame_id,
            loadouts: []
        };
        context.dispatch('addConfigToPilot', newConfig, { root: true });
    },
    importConfig(context: any, payload: any) {
        payload.id = io.newID();
        context.dispatch('addConfigToPilot', payload, { root: true });
    },
    deleteConfig(context: any, payload: any) {
        var cIndex = context.getters.getConfigIndex(payload);
        context.dispatch('deleteConfigFromPilot', cIndex, { root: true });
    }
};
const getters = {
    getConfigLoadouts: (state: AppState, getters: any) => (configId: string) => {
        const config = getters.getPilot.configs.find((c: MechConfig) => c.id === configId);
        if (!config)
            throw new Error('config not found');
        return config.loadouts || {};
    },
    getConfig: (state: AppState, getters: any) => {
        return getters.getPilot.configs.find((c: MechConfig) => c.id === state.activeConfigID) || {};
    },
    getConfigIndex: (state: AppState, getters: any) => (id: string) => {
        console.log(state.activeConfigID);
        return getters.getPilot.configs.findIndex((c: MechConfig) => c.id === id);
    },
    getMechStats: (state: AppState, getters: any) => (id: string, loadout: MechLoadout) => {
        const config = getters.getPilot.configs.find((c: MechConfig) => c.id === id);
        if (!config)
            throw new Error('config not found');
        return Stats.mechStats(getters.getPilot, config, loadout, getters.getState);
    }
};
export default {
    state,
    mutations,
    actions,
    getters
};
//# sourceMappingURL=configs.js.map