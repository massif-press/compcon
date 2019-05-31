import _ from "lodash";
import Vue from "vue";
import io from "../../_shared/data_io";
import uid from "../../_shared/uid";
import { AppContext, AppState, Pilot, Mech, MechLoadout } from "@/class";

const moduleState = {
  Pilots: [],
  ActivePilot: {},
  // ActiveMech: {},
  printOptions: {}
};

function savePilots(pilots: Pilot[]) {
  const serialized = pilots.map(x => Pilot.Serialize(x))
  io.saveUserData(
    Vue.prototype.userDataPath,
    "pilots.json",
    serialized,
    () => {
      console.info("Data Saved");
    }
  );
}

const mutations = {
  SET_PILOT(state: AppState, payload: Pilot) {
    state.ActivePilot = payload;
  },
  UPDATE_PILOT(state: AppState, payload: Pilot) {
    const index = state.Pilots.findIndex(x => x.ID === state.ActivePilot.ID)
    if (index > -1 ) {
      Vue.set(state.Pilots, index, payload)
      state.ActivePilot = payload;
    }
  },
  LOAD_PILOTS(state: AppState) {
    state.Pilots = io
      .loadUserData(Vue.prototype.userDataPath, "pilots.json")
      .map(x => Pilot.Deserialize(x));
  },
  // UPDATE_PILOT_CONFIG(state: AppState, payload: any) {
  //   const pilotIndex = state.Pilots.findIndex(
  //     x => x.ID === state.activePilotID
  //   );
  //   if (pilotIndex > -1) {
  //     const configIndex = state.Pilots[pilotIndex].Configs.findIndex(
  //       x => x.ID === payload.ID
  //     );
  //     if (configIndex > -1) {
  //       _.set(
  //         state.Pilots[pilotIndex].Configs[configIndex],
  //         payload.attr,
  //         payload.val
  //       );
  //     } else {
  //       throw console.error("Config not loaded!");
  //     }
  //   } else {
  //     throw console.error("Pilot not loaded!");
  //   }
  // },
  // SPLICE_PILOT(state: AppState, payload: any) {
  //   const pilotIndex = state.Pilots.findIndex(
  //     x => x.ID === state.activePilotID
  //   );
  //   if (pilotIndex > -1) {
  //     const arr = _.get(state.Pilots[pilotIndex], payload.attr);
  //     arr.splice(payload.start_index, payload.delete_count);
  //     _.set(state.Pilots[pilotIndex], payload.attr, arr);
  //   } else {
  //     throw console.error("Pilot not loaded!");
  //   }
  // },
  // SPLICE_PILOT_CONFIG(state: AppState, payload: any) {
  //   const pilotIndex = state.Pilots.findIndex(
  //     x => x.ID === state.activePilotID
  //   );
  //   if (pilotIndex > -1) {
  //     const configIndex = state.Pilots[pilotIndex].Configs.findIndex(
  //       x => x.ID === payload.ID
  //     );
  //     if (configIndex > -1) {
  //       const arr = _.get(
  //         state.Pilots[pilotIndex].Configs[configIndex],
  //         payload.attr
  //       );
  //       arr.splice(payload.start_index, payload.delete_count);
  //       _.set(state.Pilots[pilotIndex].Configs[configIndex], payload.attr, arr);
  //     } else {
  //       throw console.error("Config not loaded!");
  //     }
  //   } else {
  //     throw console.error("Pilot not loaded!");
  //   }
  // },
  ADD_PILOT(state: AppState, payload: Pilot) {
    state.Pilots.push(payload);
    savePilots(state.Pilots);
  },
  CLONE_PILOT(state: AppState, payload: { pilot: Pilot; quirk: boolean }) {
    let pilotData = Pilot.Serialize(payload.pilot);
    let newPilot = Pilot.Deserialize(pilotData);
    newPilot.RenewID()
    newPilot.Name += " (CLONE)";
    newPilot.Callsign += "*";
    if (payload.quirk) newPilot.RollQuirk()
    for (const mech of newPilot.Mechs) {
      mech.RenewID();
    }
    state.Pilots.push(newPilot);
    savePilots(state.Pilots);
  },
  DELETE_PILOT(state: AppState, payload: Pilot) {
    const pilotIndex = state.Pilots.findIndex(x => x.ID === payload.ID);
    if (pilotIndex > -1) {
      state.Pilots.splice(pilotIndex, 1);
    } else {
      throw console.error("Pilot not loaded!");
    }
    savePilots(state.Pilots);
  },
  // DELETE_CONFIG(state: AppState, payload: any) {
  //   const pilotIndex = state.Pilots.findIndex(
  //     x => x.ID === state.activePilotID
  //   );
  //   if (pilotIndex > -1) {
  //     state.Pilots[pilotIndex].Configs.splice(payload, 1);
  //   } else {
  //     throw console.error("Pilot not loaded!");
  //   }
  // },
  SET_PRINT_OPTIONS(state: AppState, payload: object) {
    state.printOptions = payload;
  }
};

const actions = {
  loadPilots(context: AppContext) {
    context.commit("LOAD_PILOTS");
  },
  loadPilot(context: AppContext, pilotId: string) {
    context.commit("SET_PILOT", pilotId);
  },
  updatePilot(context: AppContext, payload: Pilot) {
    context.commit("UPDATE_PILOT", payload);
  },
  editPilot(context: AppContext, payload: any) {
    console.error("TODO");
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
  // splicePilot(context: AppContext, payload: any) {
  //   context.commit("SPLICE_PILOT", payload);
  // },
  // splicePilotConfig(context: AppContext, payload: any) {
  //   context.commit("SPLICE_PILOT_CONFIG", payload);
  // },
  clonePilot(context: AppContext, payload: Pilot) {
    context.commit("CLONE_PILOT", payload);
  },
  addPilot(context: AppContext, payload: Pilot) {
    context.commit("ADD_PILOT", payload);
  },
  // addConfigToPilot(context: AppContext, payload: any) {
  //   payload.pilot_id = context.state.activePilotID;
  //   const pilot = context.state.Pilots.find(
  //     p => p.ID === context.state.activePilotID
  //   );
  //   if (!pilot) {
  //     throw new Error("pilot not found!");
  //   }
  //   context.commit("UPDATE_PILOT", {
  //     attr: `configs[${pilot.Configs.length}]`,
  //     val: payload
  //   });
  // },
  // updatePilotConfig(context: AppContext, payload: any) {
  //   context.commit("UPDATE_PILOT_CONFIG", payload);
  // },
  // importPilot(context: AppContext, payload: any) {
  //   payload.id = uid.generate();
  //   for (const mech of payload.mechs) {
  //     mech.id = uid.generate();
  //   }
  //   context.commit("ADD_PILOT", new Pilot(payload));
  // },
  deletePilot(context: AppContext, payload: Pilot) {
    context.commit("DELETE_PILOT", payload);
  },
  // deleteConfigFromPilot(context: AppContext, payload: any) {
  //   context.commit("DELETE_CONFIG", payload);
  // },
  // loadConfig(context: AppContext, configID: string) {
  //   context.commit("SET_CONFIG", configID);
  // },
  // editConfig(context: AppContext, payload: any) {
  //   context.dispatch("updatePilotConfig", payload, { root: true });
  // },
  // spliceConfig(context: AppContext, payload: any) {
  //   context.dispatch("splicePilotConfig", payload, { root: true });
  // },
  // cloneConfig(context: AppContext, payload: any) {
  //   payload.ID = uid.generate();
  //   payload.name += " (Copy)";
  //   context.dispatch("addConfigToPilot", payload, { root: true });
  // },
  // addConfig(context: AppContext, payload: any) {
  //   const newConfig = new Mech(payload.frame_id, payload.pilot);
  //   // const newConfig = {
  //   //   id: uid.generate(),
  //   //   pilot_id: payload.pilot_id,
  //   //   name: payload.name,
  //   //   frame_id: payload.frame_id,
  //   //   Loadouts: []
  //   // };
  //   context.dispatch("addConfigToPilot", newConfig, { root: true });
  // },
  // importConfig(context: AppContext, payload: Mech) {
  //   payload.RenewID();
  //   context.dispatch("addConfigToPilot", payload, { root: true });
  // },
  // deleteConfig(context: AppContext, payload: any) {
  //   const cIndex = context.getters.getConfigIndex(payload);
  //   context.dispatch("deleteConfigFromPilot", cIndex, { root: true });
  // },
  setPrintOptions(context: AppContext, options: object) {
    context.commit("SET_PRINT_OPTIONS", options);
  }
};

const getters = {
  getPilot: (state: AppState) => {
    return state.ActivePilot || {};
  },
  getAllPilots: (state: AppState) => {
    return state.Pilots || [];
  },
  // getConfigLoadouts: (state: AppState, getters: any) => (configId: string) => {
  //   return (
  //     getters.getPilot.Configs.find((c: Mech) => c.ID === configId).Loadouts ||
  //     {}
  //   );
  // },
  // getConfig: (state: AppState, getters: any) => {
  //   return (
  //     getters.getPilot.Configs.find(
  //       (c: Mech) => c.ID === state.activeConfigID
  //     ) || {}
  //   );
  // },
  // getConfigIndex: (state: AppState, getters: any) => (id: string) => {
  //   return getters.getPilot.Configs.findIndex((c: Mech) => c.ID === id);
  // },
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
  getters
};
