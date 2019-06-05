import NPC from '../logic/NPC';
import EncounterBase from '../logic/EncounterBase';
import _ from 'lodash';
import npcDesigner from './npcDesigner';
import newId from '../logic/newId';

const storedEncounters = localStorage.getItem('encounters');

export default {
  namespaced: true,
  state: {
    encounters: storedEncounters
      ? JSON.parse(storedEncounters).map(
          (obj: ReturnType<EncounterBase['serialize']>) => {
            const enc = new EncounterBase(obj.name);
            enc.notes = obj.notes;
            enc.id = obj.id;
            enc.npcs = obj.npcs.map(encNPC => ({
              id: newId(),
              name: encNPC.name,
              count: encNPC.count,
              npc: npcDesigner.state.npcs.find(
                (n: NPC) => n.id === encNPC.npcID,
              ),
            }));
            return enc;
          },
        )
      : [],
  },
  mutations: {
    add(state: any, enc: EncounterBase) {
      state.encounters.push(enc);
    },
    delete(state: any, id: string) {
      _.remove(state.encounters, { id });
    },
    edit(state: any, newEncounter: EncounterBase) {
      const target = state.encounters.find(
        (enc: EncounterBase) => enc.id === newEncounter.id,
      );
      if (!target) throw new Error('encounter does not exist');
      else Object.assign(target, newEncounter);
    },
  },
};
