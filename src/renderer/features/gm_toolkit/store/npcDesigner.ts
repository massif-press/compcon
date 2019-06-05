import NPC from '../logic/NPC';
import _ from 'lodash';

const storedNPCs = localStorage.getItem('npcs');

export default {
  namespaced: true,
  state: {
    npcs: storedNPCs ? JSON.parse(storedNPCs).map(NPC.deserialize) : [],
  },
  mutations: {
    delete(state: any, id: string) {
      _.remove(state.npcs, { id });
    },
    add(state: any, npc: NPC) {
      state.npcs.push(npc);
    },
    edit(state: any, newNpc: NPC) {
      const target = state.npcs.find((npc: NPC) => npc.id === newNpc.id);
      if (!target) throw new Error('npc does not exist');
      else Object.assign(target, newNpc);
    },
  },
};
