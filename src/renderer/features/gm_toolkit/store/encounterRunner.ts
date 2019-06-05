import NPC from '../logic/NPC';
import ActiveEncounter from '../logic/ActiveEncounter';
import _ from 'lodash';
import npcDesigner from './npcDesigner';
import EncounterBase from '../logic/EncounterBase';

const storedActiveEncounters = localStorage.getItem('activeEncounters');

export default {
  namespaced: true,
  state: {
    activeEncounters: storedActiveEncounters
      ? JSON.parse(storedActiveEncounters).map(
          (s: any) => new ActiveEncounter(s),
        )
      : [],
  },
  mutations: {
    add(state: any, enc: ActiveEncounter) {
      state.activeEncounters.push(enc);
    },
    delete(state: any, id: string) {
      _.remove(state.activeEncounters, { id });
    },
    edit(state: any, newEncounter: ActiveEncounter) {
      const target = state.activeEncounters.find(
        (enc: ActiveEncounter) => enc.id === newEncounter.id,
      );
      if (!target) throw new Error('encounter does not exist');
      else Object.assign(target, newEncounter);
    },
  },
  actions: {
    runEncounter({ state, commit }: any, baseEnc: EncounterBase) {
      const activeEnc = new ActiveEncounter(baseEnc);
      commit('add', activeEnc);
      return activeEnc;
    },
  },
};
