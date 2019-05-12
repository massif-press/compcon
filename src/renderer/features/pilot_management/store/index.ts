import _ from 'lodash'
import Vue from 'vue'
import io from '../../_shared/data_io'
import uid from '../../_shared/uid'
import {AppContext, AppState, Pilot, Mech, MechLoadout} from '@/features/_shared/classes'

const moduleState = {
  Pilots: [],
  activePilotID: "",
  activeConfigID: "",
  printOptions: {}
};

const mutations = {
  SET_PILOT(state: AppState, payload: string) {
    state.activePilotID = payload;
  },
  SET_CONFIG(state: AppState, payload: string) {
    state.activeConfigID = payload;
  },
  LOAD_ALL_PILOTS(state: AppState) {
    state.Pilots = io.loadUserData(Vue.prototype.userDataPath, "pilots.json");
  },
  UPDATE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(
      x => x.ID === state.activePilotID
    );
    if (pilotIndex > -1) {
      const pilot = _.set(state.Pilots[pilotIndex], payload.attr, payload.val);
      Vue.set(state.Pilots, pilotIndex, pilot);
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  UPDATE_PILOT_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(
      x => x.ID === state.activePilotID
    );
    if (pilotIndex > -1) {
      const configIndex = state.Pilots[pilotIndex].Configs.findIndex(
        x => x.ID === payload.ID
      );
      if (configIndex > -1) {
        _.set(
          state.Pilots[pilotIndex].Configs[configIndex],
          payload.attr,
          payload.val
        );
      } else {
        throw console.error("Config not loaded!");
      }
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  SPLICE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(
      x => x.ID === state.activePilotID
    );
    if (pilotIndex > -1) {
      const arr = _.get(state.Pilots[pilotIndex], payload.attr);
      arr.splice(payload.start_index, payload.delete_count);
      _.set(state.Pilots[pilotIndex], payload.attr, arr);
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  SPLICE_PILOT_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(
      x => x.ID === state.activePilotID
    );
    if (pilotIndex > -1) {
      const configIndex = state.Pilots[pilotIndex].Configs.findIndex(
        x => x.ID === payload.ID
      );
      if (configIndex > -1) {
        const arr = _.get(
          state.Pilots[pilotIndex].Configs[configIndex],
          payload.attr
        );
        arr.splice(payload.start_index, payload.delete_count);
        _.set(state.Pilots[pilotIndex].Configs[configIndex], payload.attr, arr);
      } else {
        throw console.error("Config not loaded!");
      }
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  CLONE_PILOT(state: AppState, payload: any) {
    // TODO:
    console.error("TODO")
    // const pilotIndex = state.Pilots.findIndex(x => x.ID === payload.ID);
    // if (pilotIndex > -1) {
    //   const newPilot: Pilot = JSON.parse(
    //     JSON.stringify(state.Pilots[pilotIndex])
    //   );
    //   newPilot.ID = uid.generate();
    //   newPilot.name += " (CLONE)";
    //   newPilot.callsign += "*";
    //   for (const config of newPilot.Configs) {
    //     config.ID = uid.generate();
    //     config.pilot_id = newPilot.ID;
    //   }
    //   if (payload.quirk) {
    //     newPilot.quirk = payload.quirk;
    //   }
    //   state.Pilots.push(newPilot);
    // } else {
    //   throw console.error("Pilot not loaded!");
    // }
  },
  ADD_PILOT(state: AppState, payload: any) {
    state.Pilots.push(payload);
  },
  DELETE_PILOT(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(x => x.ID === payload);
    if (pilotIndex > -1) {
      state.Pilots.splice(pilotIndex, 1);
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  DELETE_CONFIG(state: AppState, payload: any) {
    const pilotIndex = state.Pilots.findIndex(
      x => x.ID === state.activePilotID
    );
    if (pilotIndex > -1) {
      state.Pilots[pilotIndex].Configs.splice(payload, 1);
    } else {
      throw console.error("Pilot not loaded!");
    }
  },
  SET_PRINT_OPTIONS(state: AppState, payload: object) {
    state.printOptions = payload;
  }
};

const actions = {
  loadAllPilots(context: AppContext) {
    context.commit("LOAD_ALL_PILOTS");
  },
  loadPilot(context: AppContext, pilotId: string) {
    context.commit("SET_PILOT", pilotId);
  },
  editPilot(context: AppContext, payload: any) {
    console.error("TODO")
    // TODO:
    // remove mount-based core bonuses on cb change
    // also: fuckin' gross
    // if (payload.attr === "core_bonuses") {
    //   const missingCb = [
    //     "hardpoints",
    //     "burnout",
    //     "intweapon",
    //     "retrofit"
    //   ].filter(x => !payload.val.includes(x));
    //   const pilotIndex = context.state.Pilots.findIndex(
    //     x => x.ID === context.state.activePilotID
    //   );
    //   for (
    //     let i = 0;
    //     i < context.state.Pilots[pilotIndex].Configs.length;
    //     i++
    //   ) {
    //     for (
    //       let j = 0;
    //       j < context.state.Pilots[pilotIndex].Configs[i].Loadouts.length;
    //       j++
    //     ) {
    //       for (
    //         let k = 0;
    //         k <
    //         context.state.Pilots[pilotIndex].Configs[i].Loadouts[j].Mounts
    //           .length;
    //         k++
    //       ) {
    //         const m =
    //           context.state.Pilots[pilotIndex].Configs[i].Loadouts[j].Mounts[k];
    //         if (m.bonuses && _.intersection(missingCb, m.bonuses)) {
    //           context.commit("UPDATE_PILOT", {
    //             attr: ["configs", i, "Loadouts", j, "Mounts", k, "bonuses"],
    //             val: []
    //           });
    //         }
    //       }
    //     }
    //   }
    // }
    // context.commit("UPDATE_PILOT", payload);
  },
  splicePilot(context: AppContext, payload: any) {
    context.commit("SPLICE_PILOT", payload);
  },
  splicePilotConfig(context: AppContext, payload: any) {
    context.commit("SPLICE_PILOT_CONFIG", payload);
  },
  clonePilot(context: AppContext, payload: any) {
    context.commit("CLONE_PILOT", payload);
  },
  addPilot(context: AppContext, payload: any) {
    const newPilot: Pilot = new Pilot()
    context.commit("ADD_PILOT", newPilot);
    context.commit("SET_PILOT", newPilot.ID);
  },
  addConfigToPilot(context: AppContext, payload: any) {
    payload.pilot_id = context.state.activePilotID;
    const pilot = context.state.Pilots.find(
      p => p.ID === context.state.activePilotID
    );
    if (!pilot) {
      throw new Error("pilot not found!");
    }
    context.commit("UPDATE_PILOT", {
      attr: `configs[${pilot.Configs.length}]`,
      val: payload
    });
  },
  updatePilotConfig(context: AppContext, payload: any) {
    context.commit("UPDATE_PILOT_CONFIG", payload);
  },
  importPilot(context: AppContext, payload: Pilot) {
    payload.RenewID()
    for (const config of payload.Configs) {
      config.RenewID();
    }
    context.commit("ADD_PILOT", payload);
  },
  deletePilot(context: AppContext, payload: any) {
    context.commit("DELETE_PILOT", payload);
  },
  deleteConfigFromPilot(context: AppContext, payload: any) {
    context.commit("DELETE_CONFIG", payload);
  },
  loadConfig(context: AppContext, configID: string) {
    context.commit("SET_CONFIG", configID);
  },
  editConfig(context: AppContext, payload: any) {
    context.dispatch("updatePilotConfig", payload, { root: true });
  },
  spliceConfig(context: AppContext, payload: any) {
    context.dispatch("splicePilotConfig", payload, { root: true });
  },
  cloneConfig(context: AppContext, payload: any) {
    payload.ID = uid.generate();
    payload.name += " (Copy)";
    context.dispatch("addConfigToPilot", payload, { root: true });
  },
  addConfig(context: AppContext, payload: any) {
    const newConfig = new Mech(payload.frame_id, payload.pilot)
    // const newConfig = {
    //   id: uid.generate(),
    //   pilot_id: payload.pilot_id,
    //   name: payload.name,
    //   frame_id: payload.frame_id,
    //   Loadouts: []
    // };
    context.dispatch("addConfigToPilot", newConfig, { root: true });
  },
  importConfig(context: AppContext, payload: Mech) {
    payload.RenewID()
    context.dispatch("addConfigToPilot", payload, { root: true });
  },
  deleteConfig(context: AppContext, payload: any) {
    const cIndex = context.getters.getConfigIndex(payload);
    context.dispatch("deleteConfigFromPilot", cIndex, { root: true });
  },
  setPrintOptions(context: AppContext, options: object) {
    context.commit("SET_PRINT_OPTIONS", options);
  }
};

const getters = {
  getPilot: (state: AppState) => {
    return state.Pilots.find(p => p.ID === state.activePilotID) || {};
  },
  getAllPilots: (state: AppState) => {
    return state.Pilots || [];
  },
  getConfigLoadouts: (state: AppState, getters: any) => (configId: string) => {
    return (
      getters.getPilot.Configs.find((c: Mech) => c.ID === configId)
        .Loadouts || {}
    );
  },
  getConfig: (state: AppState, getters: any) => {
    return (
      getters.getPilot.Configs.find(
        (c: Mech) => c.ID === state.activeConfigID
      ) || {}
    );
  },
  getConfigIndex: (state: AppState, getters: any) => (id: string) => {
    return getters.getPilot.Configs.findIndex((c: Mech) => c.ID === id);
  },
  // getMechStats: (state: AppState, getters: any) => (
  //   id: string,
  //   loadout: MechLoadout
  // ) => {
  //   return Stats.mechStats(
  //     getters.getPilot,
  //     getters.getPilot.Configs.find((c: Mech) => c.ID === id),
  //     loadout,
  //     getters.getState
  //   );
  // },
  getPrintOptions: (state: AppState) => {
    return state.printOptions;
  }
};

export default {
  state: moduleState,
  mutations,
  actions,
  getters,
}
