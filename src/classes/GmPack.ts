import { Npc, Encounter, Mission } from '@/class';
import { INpcData, IEncounterData, IMissionData } from '@/interface';

export interface IGmPackData {
  name: string
  description?: string
  missions: IMissionData[]
  encounters: IEncounterData[]
  npcs: INpcData[]
}

export class GmPack {
  private _name: string
  private _description: string
  private _missions: Mission[]
  private _encounters: Encounter[]
  private _npcs: Npc[]

  constructor(name: string, description: string, missions: Mission[], encounters: Encounter[], npcs: Npc[]) {
    this._name = name
    this._description = description
    this._missions = missions
    this._encounters = encounters
    this._npcs = npcs
  }

  public static Serialize(gmPack: GmPack): IGmPackData {
    const missionData = gmPack._missions.map((mission) => Mission.Serialize(mission))
    const encounterData = gmPack._encounters.map((encounter) => Encounter.Serialize(encounter))
    const npcData = gmPack._npcs.map((npc) => Npc.Serialize(npc))

    return {
      name: gmPack._name,
      description: gmPack._description,
      missions: missionData,
      encounters: encounterData,
      npcs: npcData
    }
  }
}
