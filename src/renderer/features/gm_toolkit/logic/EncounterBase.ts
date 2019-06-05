import newId from './newId';
import NPC from './NPC';

export type EncounterBaseNPC = {
  id: string;
  npc: NPC;
  name: string;
  count: number;
};

export default class EncounterBase {
  id: string = newId();
  name: string;
  notes: string = '';
  npcs: EncounterBaseNPC[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getDifficulty(playerCount: number): number {

    let diffCoefficient = 0;
    for (const _npc of this.npcs) {
      const { npc } = _npc;
      if (npc.hasTemplate('ultra')) {
        diffCoefficient += 4/playerCount;
      } else if (npc.hasTemplate('elite')) {
        diffCoefficient += 1/playerCount;
      } else if (npc.hasTemplate('grunt')) {
        diffCoefficient += 0.25/playerCount;
      } else {
        diffCoefficient += 0.8/playerCount;
      }
    }

    return diffCoefficient
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes,
      npcs: this.npcs.map(npc => ({
        name: npc.name,
        count: npc.count,
        npcID: npc.npc.id,
      })),
    };
  }
}
