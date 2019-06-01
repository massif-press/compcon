import _ from "lodash";
import Vue from "vue";
import io from "../../_shared/data_io";
import { AppContext, AppState, Pilot } from "@/class";

const moduleState = {
  Pilots: [],
  ActivePilot: {},
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
  SAVE_DATA(state: AppState) {
    if (state.Pilots.length)
      _.debounce(savePilots, 300)(state.Pilots);
  },
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
    savePilots(state.Pilots)
  },
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
  SET_PRINT_OPTIONS(state: AppState, payload: object) {
    state.printOptions = payload;
  }
};

const actions = {
  saveData(context: AppContext) {
    context.commit("SAVE_DATA");
  },
  loadPilots(context: AppContext) {
    context.commit("LOAD_PILOTS");
  },
  loadPilot(context: AppContext, pilotId: string) {
    context.commit("SET_PILOT", pilotId);
  },
  updatePilot(context: AppContext, payload: Pilot) {
    context.commit("UPDATE_PILOT", payload);
  },
  clonePilot(context: AppContext, payload: Pilot) {
    context.commit("CLONE_PILOT", payload);
  },
  addPilot(context: AppContext, payload: Pilot) {
    context.commit("ADD_PILOT", payload);
  },
  deletePilot(context: AppContext, payload: Pilot) {
    context.commit("DELETE_PILOT", payload);
  },
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
